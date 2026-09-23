
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY =
  "investmentTracker_vortaxa";

const VortaxaContext =
  createContext(null);


/* =========================================================
   HELPERS
========================================================= */

function generateId(
  prefix = "vortaxa"
) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}


function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


/*
 * Local date.
 *
 * Important:
 * Do not use:
 *
 * new Date().toISOString().slice(0, 10)
 *
 * because ISO uses UTC.
 */
function getTodayDate() {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getCreatedAt() {
  return new Date().toISOString();
}


/* =========================================================
   DATE HELPERS
========================================================= */

function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  const parts =
    String(value).split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day
  );
}


function formatDateOnly(date) {
  if (!date) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function addDays(
  dateString,
  days
) {
  const date =
    parseDateOnly(dateString);

  if (!date) {
    return "";
  }

  date.setDate(
    date.getDate() + days
  );

  return formatDateOnly(
    date
  );
}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function readLocalData() {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return {
        investors: [],
        rates: [],
      };
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return {
        investors: [],
        rates: [],
      };
    }

    return {
      investors:
        Array.isArray(
          parsed.investors
        )
          ? parsed.investors
          : [],

      rates:
        Array.isArray(
          parsed.rates
        )
          ? parsed.rates
          : [],
    };
  } catch (error) {
    console.error(
      "Vortaxa LocalStorage read error:",
      error
    );

    return {
      investors: [],
      rates: [],
    };
  }
}


function writeLocalData(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(
      "Vortaxa LocalStorage write error:",
      error
    );
  }
}


/* =========================================================
   TRANSACTION NORMALIZER
========================================================= */

function normalizeTransaction(
  transaction,
  fallbackInvestorId = ""
) {
  if (!transaction) {
    return null;
  }

  return {
    id:
      transaction.id ||
      generateId(
        "transaction"
      ),

    investorId:
      transaction.investorId ||
      fallbackInvestorId,

    type:
      transaction.type ||
      "TRANSACTION",

    date:
      transaction.date ||
      transaction.transactionDate ||
      getTodayDate(),

    amount: toNumber(
      transaction.amount
    ),

    createdAt:
      transaction.createdAt ||
      getCreatedAt(),
  };
}


/* =========================================================
   GLOBAL RATE NORMALIZER
========================================================= */

function normalizeRate(rate) {
  if (!rate) {
    return null;
  }

  return {
    id:
      rate.id ||
      generateId("rate"),

    date:
      rate.date ||
      rate.rateDate ||
      getTodayDate(),

    rate: toNumber(
      rate.rate
    ),

    type:
      rate.type ||
      "DAILY",

    createdAt:
      rate.createdAt ||
      getCreatedAt(),
  };
}


/* =========================================================
   INVESTOR NORMALIZER
========================================================= */

function normalizeInvestor(
  investor
) {
  if (!investor) {
    return null;
  }

  const internalId =
    investor.id ||
    generateId("investor");

  const externalInvestorId =
    investor.investorId ||
    internalId;

  const initial =
    investor.initial || {};


  const liquidity =
    toNumber(
      initial.liquidity ??
        investor.liquidity
    );


  const fule =
    toNumber(
      initial.fule ??
        investor.fule
    );


  const piFule =
    toNumber(
      initial.piFule ??
        investor.piFule
    );


  /* =======================================================
     TRANSACTIONS
  ======================================================= */

  const transactions =
    Array.isArray(
      investor.transactions
    )
      ? investor.transactions
          .map(
            (transaction) =>
              normalizeTransaction(
                transaction,
                externalInvestorId
              )
          )
          .filter(Boolean)
      : [];


  /* =======================================================
     INITIAL TRANSACTION COMPATIBILITY
  ======================================================= */

  const hasInitialTransaction =
    transactions.some(
      (transaction) =>
        transaction.type ===
        "INITIAL"
    );


  const initialAmount =
    liquidity +
    fule +
    piFule;


  if (
    initialAmount > 0 &&
    !hasInitialTransaction
  ) {
    transactions.unshift({
      id: generateId(
        "transaction"
      ),

      investorId:
        externalInvestorId,

      type: "INITIAL",

      date:
        investor.startDate ||
        investor.transactionDate ||
        getTodayDate(),

      amount:
        initialAmount,

      createdAt:
        investor.createdAt ||
        getCreatedAt(),
    });
  }


  return {
    ...investor,

    id: internalId,

    investorId:
      externalInvestorId,

    investorName:
      investor.investorName ||
      investor.name ||
      "",

    startDate:
      investor.startDate ||
      investor.transactionDate ||
      getTodayDate(),

    initial: {
      liquidity,
      fule,
      piFule,
    },

    transactions,

    /*
     * Rates are GLOBAL.
     *
     * No rates are stored inside
     * individual investors.
     */
    rates: [],
  };
}


/* =========================================================
   LEGACY RATE MIGRATION
========================================================= */

/*
 * Old Vortaxa data may have rates inside
 * individual investors.
 *
 * We move those rates into the global
 * rate collection.
 */
function collectLegacyRates(
  rawInvestors
) {
  const collected = [];

  if (
    !Array.isArray(
      rawInvestors
    )
  ) {
    return collected;
  }

  rawInvestors.forEach(
    (investor) => {
      if (!investor) {
        return;
      }

      const investorRates =
        Array.isArray(
          investor.rates
        )
          ? investor.rates
          : Array.isArray(
              investor.dailyRates
            )
            ? investor.dailyRates
            : [];

      investorRates.forEach(
        (rate) => {
          const normalized =
            normalizeRate(
              rate
            );

          if (
            normalized
          ) {
            collected.push(
              normalized
            );
          }
        }
      );
    }
  );

  return collected;
}


/* =========================================================
   MERGE GLOBAL RATES
========================================================= */

function mergeRates(
  existingRates = [],
  legacyRates = []
) {
  const resultByDate =
    new Map();

  /*
   * Global rates get priority.
   */
  [
    ...existingRates,
    ...legacyRates,
  ].forEach(
    (rate) => {
      const normalized =
        normalizeRate(
          rate
        );

      if (
        !normalized ||
        !normalized.date
      ) {
        return;
      }

      if (
        !resultByDate.has(
          normalized.date
        )
      ) {
        resultByDate.set(
          normalized.date,
          normalized
        );
      }
    }
  );

  return Array.from(
    resultByDate.values()
  ).sort(
    (a, b) =>
      String(a.date).localeCompare(
        String(b.date)
      )
  );
}


/* =========================================================
   FIND EARLIEST INVESTMENT DATE
========================================================= */

function getEarliestInvestmentDate(
  investors
) {
  if (
    !Array.isArray(
      investors
    ) ||
    investors.length === 0
  ) {
    return null;
  }

  let earliestDate =
    null;

  investors.forEach(
    (investor) => {
      if (!investor) {
        return;
      }

      let date =
        investor.startDate ||
        null;

      /*
       * Fallback to INITIAL transaction.
       */
      if (!date) {
        const initialTransaction =
          Array.isArray(
            investor.transactions
          )
            ? investor.transactions.find(
                (transaction) =>
                  transaction.type ===
                  "INITIAL"
              )
            : null;

        date =
          initialTransaction?.date ||
          null;
      }

      const parsed =
        parseDateOnly(
          date
        );

      if (!parsed) {
        return;
      }

      if (
        !earliestDate ||
        parsed < earliestDate
      ) {
        earliestDate =
          parsed;
      }
    }
  );

  if (!earliestDate) {
    return null;
  }

  return formatDateOnly(
    earliestDate
  );
}


/* =========================================================
   RATE HISTORY START
========================================================= */

/*
 * Rate starts two days after the earliest
 * initial investment date.
 *
 * Example:
 *
 * 25 Sep = Initial
 * 26 Sep = No Rate
 * 27 Sep = Rate starts
 */
function getRateStartDate(
  investors
) {
  const earliestDate =
    getEarliestInvestmentDate(
      investors
    );

  if (!earliestDate) {
    return null;
  }

  return addDays(
    earliestDate,
    2
  );
}


/* =========================================================
   ENSURE MISSING RATE HISTORY
========================================================= */

/*
 * This function NEVER overwrites existing rates.
 *
 * It only creates missing daily fields.
 *
 * Example:
 *
 * 27 Sep = 0.15
 * 28 Sep = 0.20
 * 29 Sep = missing
 * 30 Sep = missing
 * 01 Oct = today
 *
 * Result:
 *
 * 27 Sep = 0.15
 * 28 Sep = 0.20
 * 29 Sep = 0
 * 30 Sep = 0
 * 01 Oct = 0
 */
function ensureMissingRateHistory(
  investors,
  existingRates = []
) {
  const rates =
    mergeRates(
      existingRates
    );

  const startDate =
    getRateStartDate(
      investors
    );

  if (!startDate) {
    return rates;
  }

  const today =
    getTodayDate();

  if (
    startDate > today
  ) {
    return rates;
  }

  const ratesByDate =
    new Map();

  /*
   * Preserve every existing rate.
   */
  rates.forEach(
    (rate) => {
      if (
        rate?.date
      ) {
        ratesByDate.set(
          rate.date,
          rate
        );
      }
    }
  );

  /*
   * Fill every missing day.
   */
  let currentDate =
    startDate;

  while (
    currentDate <=
    today
  ) {
    if (
      !ratesByDate.has(
        currentDate
      )
    ) {
      ratesByDate.set(
        currentDate,
        {
          id: generateId(
            "rate"
          ),

          date:
            currentDate,

          rate: 0,

          type:
            "DAILY",

          createdAt:
            getCreatedAt(),
        }
      );
    }

    currentDate =
      addDays(
        currentDate,
        1
      );
  }

  return Array.from(
    ratesByDate.values()
  ).sort(
    (a, b) =>
      String(a.date).localeCompare(
        String(b.date)
      )
  );
}


/* =========================================================
   PREPARE EXISTING DATA
========================================================= */

/*
 * Used only while loading existing data.
 *
 * Responsibilities:
 *
 * 1. Normalize investors
 * 2. Normalize global rates
 * 3. Migrate legacy investor rates
 * 4. Fill missing rate history
 */
function prepareLoadedData(
  rawData
) {
  const rawInvestors =
    Array.isArray(
      rawData?.investors
    )
      ? rawData.investors
      : [];

  const investors =
    rawInvestors
      .map(
        normalizeInvestor
      )
      .filter(Boolean);

  const globalRates =
    Array.isArray(
      rawData?.rates
    )
      ? rawData.rates
          .map(
            normalizeRate
          )
          .filter(Boolean)
      : [];

  const legacyRates =
    collectLegacyRates(
      rawInvestors
    );

  const mergedRates =
    mergeRates(
      globalRates,
      legacyRates
    );

  /*
   * Important:
   *
   * Existing data load should also repair
   * any missed days.
   *
   * This handles days when the app
   * was not opened.
   */
  const rates =
    ensureMissingRateHistory(
      investors,
      mergedRates
    );

  return {
    investors,
    rates,
  };
}


/* =========================================================
   PROVIDER
========================================================= */

export function VortaxaProvider({
  children,
}) {
  const [data, setData] =
    useState({
      investors: [],
      rates: [],
    });

  const [loading, setLoading] =
    useState(true);

  const [dataLoading, setDataLoading] =
    useState(true);


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const loadedData =
      readLocalData();

    const preparedData =
      prepareLoadedData(
        loadedData
      );

    setData(
      preparedData
    );

    /*
     * Save migrated / missing
     * daily-rate records.
     */
    writeLocalData(
      preparedData
    );

    setLoading(false);
    setDataLoading(false);
  }, []);


  /* =======================================================
     STORAGE SYNC
  ======================================================= */

  useEffect(() => {
    function handleStorage(
      event
    ) {
      if (
        event.key !==
        STORAGE_KEY
      ) {
        return;
      }

      const loadedData =
        readLocalData();

      const preparedData =
        prepareLoadedData(
          loadedData
        );

      setData(
        preparedData
      );

      writeLocalData(
        preparedData
      );
    }

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);


  /* =======================================================
     SAVE DATA
  ======================================================= */

  /*
   * IMPORTANT:
   *
   * saveData does NOT generate rates.
   *
   * Rate generation is explicitly called
   * only when required:
   *
   * - initial data load
   * - investor add
   * - investor update
   */
  const saveData =
    useCallback(
      (nextData) => {
        const cleanData = {
          investors:
            Array.isArray(
              nextData?.investors
            )
              ? nextData.investors
              : [],

          rates:
            Array.isArray(
              nextData?.rates
            )
              ? nextData.rates
              : [],
        };

        setData(
          cleanData
        );

        writeLocalData(
          cleanData
        );
      },
      []
    );


  /* =======================================================
     DATA
  ======================================================= */

  const investors =
    data.investors || [];

  const rates =
    data.rates || [];


  /* =======================================================
     GET INVESTOR
  ======================================================= */

  const getInvestor =
    useCallback(
      (investorId) => {
        if (!investorId) {
          return null;
        }

        return (
          investors.find(
            (investor) =>
              investor.id ===
                investorId ||
              investor.investorId ===
                investorId
          ) || null
        );
      },
      [investors]
    );


  /* =======================================================
     GET INVESTOR DATA
  ======================================================= */

  const getInvestorData =
    useCallback(
      (investorId) => {
        const investor =
          getInvestor(
            investorId
          );

        if (!investor) {
          return null;
        }

        return {
          investor,

          transactions:
            Array.isArray(
              investor.transactions
            )
              ? investor.transactions
              : [],

          /*
           * GLOBAL RATES
           */
          rates,

          /*
           * Compatibility alias
           */
          dailyRates:
            rates,
        };
      },
      [
        getInvestor,
        rates,
      ]
    );


  /* =======================================================
     SUMMARY
  ======================================================= */

  const calculateInvestorSummary =
    useCallback(
      (investor) => {
        if (!investor) {
          return {
            liquidity: 0,
            initialFule: 0,
            initialPiFule: 0,
            fuleAdded: 0,
            piFuleAdded: 0,
            currentFule: 0,
            currentPiFule: 0,
            totalInvested: 0,
            totalEarn: 0,
            totalWithdraw: 0,
            availableEarn: 0,
          };
        }

        const initial =
          investor.initial || {};

        const transactions =
          Array.isArray(
            investor.transactions
          )
            ? investor.transactions
            : [];

        const liquidity =
          toNumber(
            initial.liquidity
          );

        const initialFule =
          toNumber(
            initial.fule
          );

        const initialPiFule =
          toNumber(
            initial.piFule
          );

        let fuleAdded = 0;
        let piFuleAdded = 0;
        let totalWithdraw = 0;

        transactions.forEach(
          (transaction) => {
            const amount =
              toNumber(
                transaction.amount
              );

            switch (
              transaction.type
            ) {
              case "FULE_ADD":
                fuleAdded += amount;
                break;

              case "PI_FULE_ADD":
                piFuleAdded += amount;
                break;

              case "EARN_WITHDRAW":
                totalWithdraw += amount;
                break;

              default:
                break;
            }
          }
        );

        const currentFule =
          initialFule +
          fuleAdded;

        const currentPiFule =
          initialPiFule +
          piFuleAdded;

        const totalInvested =
          liquidity +
          currentFule +
          currentPiFule;

        /*
         * Daily earning calculation
         * will be implemented later.
         */
        const totalEarn = 0;

        const availableEarn =
          Math.max(
            0,
            totalEarn -
              totalWithdraw
          );

        return {
          liquidity,

          initialFule,

          initialPiFule,

          fuleAdded,

          piFuleAdded,

          currentFule,

          currentPiFule,

          totalInvested,

          totalEarn,

          totalWithdraw,

          availableEarn,
        };
      },
      []
    );


  const getInvestorSummary =
    useCallback(
      (investorId) => {
        const investor =
          getInvestor(
            investorId
          );

        return calculateInvestorSummary(
          investor
        );
      },
      [
        getInvestor,
        calculateInvestorSummary,
      ]
    );


  /* =======================================================
     ADD INVESTOR
  ======================================================= */

  const addInvestor =
    useCallback(
      (investorData) => {
        const internalId =
          generateId(
            "investor"
          );

        const externalInvestorId =
          investorData?.investorId ||
          internalId;

        const liquidity =
          toNumber(
            investorData?.liquidity
          );

        const fule =
          toNumber(
            investorData?.fule
          );

        const piFule =
          toNumber(
            investorData?.piFule
          );

        const startDate =
          investorData?.startDate ||
          investorData?.transactionDate ||
          getTodayDate();

        const initialAmount =
          liquidity +
          fule +
          piFule;

        const initialTransaction =
          initialAmount > 0
            ? {
                id: generateId(
                  "transaction"
                ),

                investorId:
                  externalInvestorId,

                type: "INITIAL",

                date:
                  startDate,

                amount:
                  initialAmount,

                createdAt:
                  getCreatedAt(),
              }
            : null;

        const investor = {
          ...investorData,

          id: internalId,

          investorId:
            externalInvestorId,

          investorName:
            investorData?.investorName ||
            investorData?.name ||
            "",

          startDate,

          initial: {
            liquidity,
            fule,
            piFule,
          },

          transactions:
            initialTransaction
              ? [
                  initialTransaction,
                ]
              : [],

          rates: [],

          createdAt:
            getCreatedAt(),
        };

        /*
         * Add investor first,
         * then create missing rate history.
         */
        const nextInvestors = [
          ...investors,
          investor,
        ];

        const nextRates =
          ensureMissingRateHistory(
            nextInvestors,
            rates
          );

        saveData({
          investors:
            nextInvestors,

          rates:
            nextRates,
        });

        return investor;
      },
      [
        investors,
        rates,
        saveData,
      ]
    );


  /* =======================================================
     UPDATE INVESTOR
  ======================================================= */

  const updateInvestor =
    useCallback(
      (
        investorId,
        updates
      ) => {
        const existing =
          getInvestor(
            investorId
          );

        if (!existing) {
          return null;
        }

        const updatedInvestor = {
          ...existing,

          ...updates,

          id:
            existing.id,

          investorId:
            existing.investorId,

          initial: {
            ...existing.initial,

            ...(updates.initial ||
              {}),
          },

          rates: [],
        };

        const nextInvestors =
          investors.map(
            (investor) =>
              investor.id ===
              existing.id
                ? updatedInvestor
                : investor
          );

        /*
         * Investor update may change the
         * initial/start date.
         *
         * Therefore ensure all missing
         * historical rate fields now exist.
         */
        const nextRates =
          ensureMissingRateHistory(
            nextInvestors,
            rates
          );

        saveData({
          investors:
            nextInvestors,

          rates:
            nextRates,
        });

        return updatedInvestor;
      },
      [
        investors,
        rates,
        getInvestor,
        saveData,
      ]
    );


  /* =======================================================
     DELETE INVESTOR
  ======================================================= */

  const deleteInvestor =
    useCallback(
      (investorId) => {
        const existing =
          getInvestor(
            investorId
          );

        if (!existing) {
          return false;
        }

        /*
         * IMPORTANT:
         *
         * Global rates remain.
         */
        const nextData = {
          investors:
            investors.filter(
              (investor) =>
                investor.id !==
                existing.id
            ),

          rates,
        };

        saveData(
          nextData
        );

        return true;
      },
      [
        investors,
        rates,
        getInvestor,
        saveData,
      ]
    );


  /* =======================================================
     UPDATE INVESTOR TRANSACTIONS
  ======================================================= */

  const updateInvestorTransactions =
    useCallback(
      (
        investorId,
        updater
      ) => {
        const investor =
          getInvestor(
            investorId
          );

        if (!investor) {
          return null;
        }

        const currentTransactions =
          Array.isArray(
            investor.transactions
          )
            ? investor.transactions
            : [];

        const nextTransactions =
          updater(
            currentTransactions
          );

        const updatedInvestor = {
          ...investor,

          transactions:
            nextTransactions,

          rates: [],
        };

        const nextData = {
          investors:
            investors.map(
              (item) =>
                item.id ===
                investor.id
                  ? updatedInvestor
                  : item
            ),

          rates,
        };

        /*
         * Transaction changes do NOT
         * regenerate rate history.
         */
        saveData(
          nextData
        );

        return updatedInvestor;
      },
      [
        investors,
        rates,
        getInvestor,
        saveData,
      ]
    );


  /* =======================================================
     ADD GENERIC TRANSACTION
  ======================================================= */

  const addTransaction =
    useCallback(
      (
        investorId,
        transaction
      ) => {
        const investor =
          getInvestor(
            investorId
          );

        if (!investor) {
          throw new Error(
            "Investor not found"
          );
        }

        const normalized =
          normalizeTransaction(
            {
              ...transaction,

              investorId:
                investor.investorId,
            },
            investor.investorId
          );

        if (!normalized) {
          throw new Error(
            "Invalid transaction"
          );
        }

        updateInvestorTransactions(
          investor.id,
          (
            currentTransactions
          ) => [
            ...currentTransactions,
            normalized,
          ]
        );

        return normalized;
      },
      [
        getInvestor,
        updateInvestorTransactions,
      ]
    );


  /* =======================================================
     FULE ADD
  ======================================================= */

  const addFule =
    useCallback(
      (
        investorId,
        transaction
      ) => {
        return addTransaction(
          investorId,
          {
            ...transaction,

            type:
              "FULE_ADD",
          }
        );
      },
      [addTransaction]
    );


  /* =======================================================
     PI FULE ADD
  ======================================================= */

  const addPiFule =
    useCallback(
      (
        investorId,
        transaction
      ) => {
        return addTransaction(
          investorId,
          {
            ...transaction,

            type:
              "PI_FULE_ADD",
          }
        );
      },
      [addTransaction]
    );


  /* =======================================================
     EARN WITHDRAW
  ======================================================= */

  const addEarnWithdrawal =
    useCallback(
      (
        investorId,
        transaction
      ) => {
        const summary =
          getInvestorSummary(
            investorId
          );

        const amount =
          toNumber(
            transaction?.amount
          );

        if (amount <= 0) {
          throw new Error(
            "Withdrawal amount must be greater than zero."
          );
        }

        if (
          amount >
          Number(
            summary?.availableEarn ||
              0
          )
        ) {
          throw new Error(
            "Withdrawal amount exceeds available EARN."
          );
        }

        return addTransaction(
          investorId,
          {
            ...transaction,

            type:
              "EARN_WITHDRAW",
          }
        );
      },
      [
        getInvestorSummary,
        addTransaction,
      ]
    );


  /* =======================================================
     DELETE TRANSACTION
  ======================================================= */

  const deleteTransaction =
    useCallback(
      (
        investorId,
        transactionId
      ) => {
        const investor =
          getInvestor(
            investorId
          );

        if (!investor) {
          return false;
        }

        const transaction =
          investor.transactions?.find(
            (item) =>
              item.id ===
              transactionId
          );

        if (!transaction) {
          return false;
        }

        /*
         * INITIAL delete =
         * complete investor delete.
         */
        if (
          transaction.type ===
          "INITIAL"
        ) {
          return deleteInvestor(
            investor.id
          );
        }

        updateInvestorTransactions(
          investor.id,
          (
            currentTransactions
          ) =>
            currentTransactions.filter(
              (item) =>
                item.id !==
                transactionId
            )
        );

        return true;
      },
      [
        getInvestor,
        deleteInvestor,
        updateInvestorTransactions,
      ]
    );


  /* =======================================================
     UPDATE TRANSACTION
  ======================================================= */

  const updateTransaction =
    useCallback(
      (
        investorId,
        transactionId,
        updates
      ) => {
        const investor =
          getInvestor(
            investorId
          );

        if (!investor) {
          return null;
        }

        const existingTransaction =
          investor.transactions?.find(
            (transaction) =>
              transaction.id ===
              transactionId
          );

        if (
          !existingTransaction
        ) {
          return null;
        }

        let updatedTransaction =
          null;


        /* =================================================
           INITIAL TRANSACTION
        ================================================= */

        if (
          existingTransaction.type ===
          "INITIAL"
        ) {
          const newAmount =
            toNumber(
              updates?.amount ??
                existingTransaction.amount
            );

          const newDate =
            updates?.date ||
            existingTransaction.date;

          updatedTransaction = {
            ...existingTransaction,

            id:
              existingTransaction.id,

            investorId:
              existingTransaction.investorId ||
              investor.investorId,

            type:
              "INITIAL",

            date:
              newDate,

            amount:
              newAmount,
          };

          /*
           * Existing INITIAL behavior preserved.
           *
           * We do not guess the distribution
           * between Liquidity / FULE / PI FULE.
           */
          const updatedInvestor = {
            ...investor,

            transactions:
              investor.transactions.map(
                (transaction) =>
                  transaction.id ===
                  transactionId
                    ? updatedTransaction
                    : transaction
              ),

            rates: [],
          };

          const nextData = {
            investors:
              investors.map(
                (item) =>
                  item.id ===
                  investor.id
                    ? updatedInvestor
                    : item
              ),

            rates,
          };

          saveData(
            nextData
          );

          return updatedTransaction;
        }


        /* =================================================
           NORMAL TRANSACTION
        ================================================= */

        updatedTransaction = {
          ...existingTransaction,

          ...updates,

          id:
            existingTransaction.id,

          investorId:
            existingTransaction.investorId ||
            investor.investorId,

          type:
            existingTransaction.type,

          amount:
            toNumber(
              updates?.amount ??
                existingTransaction.amount
            ),

          date:
            updates?.date ||
            existingTransaction.date,
        };

        updateInvestorTransactions(
          investor.id,
          (
            currentTransactions
          ) =>
            currentTransactions.map(
              (transaction) =>
                transaction.id ===
                transactionId
                  ? updatedTransaction
                  : transaction
            )
        );

        return updatedTransaction;
      },
      [
        investors,
        rates,
        getInvestor,
        updateInvestorTransactions,
        saveData,
      ]
    );


  /* =======================================================
     GLOBAL RATES
  ======================================================= */


  /* =======================================================
     ADD RATE
  ======================================================= */

  const addRate =
    useCallback(
      (
        investorId,
        rateData
      ) => {
        /*
         * investorId intentionally ignored.
         *
         * Rates are global.
         */

        const input =
          rateData || {};

        const normalized =
          normalizeRate(
            input
          );

        if (!normalized) {
          throw new Error(
            "Invalid rate"
          );
        }

        if (!normalized.date) {
          throw new Error(
            "Rate date is required"
          );
        }

        const existing =
          rates.find(
            (rate) =>
              rate.date ===
              normalized.date
          );

        /*
         * Never create duplicate date.
         */
        if (existing) {
          return existing;
        }

        const nextRates =
          mergeRates(
            [
              ...rates,
              normalized,
            ]
          );

        /*
         * Adding/editing a rate does NOT
         * generate any other dates.
         */
        saveData({
          investors,

          rates:
            nextRates,
        });

        return normalized;
      },
      [
        investors,
        rates,
        saveData,
      ]
    );


  /* =======================================================
     UPDATE RATE
  ======================================================= */

  const updateRate =
    useCallback(
      (
        investorId,
        rateId,
        updates
      ) => {
        /*
         * investorId intentionally ignored.
         */

        const existing =
          rates.find(
            (rate) =>
              rate.id ===
              rateId
          );

        if (!existing) {
          return null;
        }

        /*
         * Date represents the daily field.
         * Therefore date cannot be changed.
         */
        const updatedRate = {
          ...existing,

          id:
            existing.id,

          date:
            existing.date,

          type:
            existing.type ||
            "DAILY",

          rate:
            toNumber(
              updates?.rate ??
                existing.rate
            ),
        };

        const nextRates =
          rates.map(
            (rate) =>
              rate.id ===
              rateId
                ? updatedRate
                : rate
          );

        saveData({
          investors,

          rates:
            nextRates,
        });

        return updatedRate;
      },
      [
        investors,
        rates,
        saveData,
      ]
    );


  /* =======================================================
     GET GLOBAL RATES
  ======================================================= */

  const getRates =
    useCallback(
      () => {
        return rates;
      },
      [rates]
    );


  /* =======================================================
     INVESTOR DATA MAP
  ======================================================= */

  const investorData =
    useMemo(() => {
      const result = {};

      investors.forEach(
        (investor) => {
          const summary =
            calculateInvestorSummary(
              investor
            );

          const investorDataItem = {
            investor,

            transactions:
              Array.isArray(
                investor.transactions
              )
                ? investor.transactions
                : [],

            /*
             * GLOBAL RATES
             */
            rates,

            dailyRates:
              rates,

            summary,
          };

          /*
           * Internal ID
           */
          result[
            investor.id
          ] =
            investorDataItem;

          /*
           * External ID
           */
          if (
            investor.investorId
          ) {
            result[
              investor.investorId
            ] =
              investorDataItem;
          }
        }
      );

      return result;
    }, [
      investors,
      rates,
      calculateInvestorSummary,
    ]);


  /* =======================================================
     CLEAR ALL
  ======================================================= */

  const clearAllVortaxaData =
    useCallback(
      () => {
        const emptyData = {
          investors: [],
          rates: [],
        };

        saveData(
          emptyData
        );
      },
      [saveData]
    );


  /* =======================================================
     RELOAD
  ======================================================= */

  const reloadData =
    useCallback(
      () => {
        setDataLoading(
          true
        );

        const loadedData =
          readLocalData();

        const preparedData =
          prepareLoadedData(
            loadedData
          );

        setData(
          preparedData
        );

        writeLocalData(
          preparedData
        );

        setDataLoading(
          false
        );
      },
      []
    );


  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({
        /* State */
        data,

        loading,

        dataLoading,

        /* Investors */
        investors,

        getInvestor,

        getInvestorData,

        addInvestor,

        updateInvestor,

        deleteInvestor,

        /* Summary */
        getInvestorSummary,

        /* Data */
        investorData,

        /* Transactions */
        addTransaction,

        addFule,

        addPiFule,

        addEarnWithdrawal,

        deleteTransaction,

        updateTransaction,

        /* Global Rates */
        rates,

        getRates,

        addRate,

        updateRate,

        /* Utilities */
        clearAllVortaxaData,

        reloadData,
      }),
      [
        data,

        loading,

        dataLoading,

        investors,

        getInvestor,

        getInvestorData,

        addInvestor,

        updateInvestor,

        deleteInvestor,

        getInvestorSummary,

        investorData,

        addTransaction,

        addFule,

        addPiFule,

        addEarnWithdrawal,

        deleteTransaction,

        updateTransaction,

        rates,

        getRates,

        addRate,

        updateRate,

        clearAllVortaxaData,

        reloadData,
      ]
    );


  return (
    <VortaxaContext.Provider
      value={value}
    >
      {children}
    </VortaxaContext.Provider>
  );
}


/* =========================================================
   HOOK
========================================================= */

export function useVortaxa() {
  const context =
    useContext(
      VortaxaContext
    );

  if (!context) {
    throw new Error(
      "useVortaxa must be used inside VortaxaProvider"
    );
  }

  return context;
}


export default VortaxaContext;

