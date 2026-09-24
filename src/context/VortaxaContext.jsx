import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  calculateInvestorSummary,
  calculateAllInvestorsSummary,
} from "../utils/vortaxa/vortaxaCalculations";


/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY =
  "investmentTracker_vortaxa";


/* =========================================================
   CONTEXT
========================================================= */

const VortaxaContext =
  createContext(null);


/* =========================================================
   BASIC HELPERS
========================================================= */

function generateId(
  prefix = "vortaxa"
) {
  return (
    prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 9)
  );
}


function toNumber(value) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


function getTodayDate() {
  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getCreatedAt() {
  return new Date().toISOString();
}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function readStorage() {
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


    return {

      investors:
        Array.isArray(
          parsed?.investors
        )
          ? parsed.investors
          : [],

      rates:
        Array.isArray(
          parsed?.rates
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


function writeStorage(data) {
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

    throw new Error(
      "Unable to save Vortaxa data."
    );

  }
}


/* =========================================================
   NORMALIZE TRANSACTION
========================================================= */

function normalizeTransaction(
  transaction
) {

  return {

    id:
      transaction?.id ||
      generateId("txn"),

    investorId:
      transaction?.investorId ||
      "",

    type:
      transaction?.type ||
      "INITIAL",

    date:
      transaction?.date ||
      getTodayDate(),

    amount:
      toNumber(
        transaction?.amount
      ),

    createdAt:
      transaction?.createdAt ||
      getCreatedAt(),

  };

}


/* =========================================================
   NORMALIZE RATE
========================================================= */

function normalizeRate(
  rate
) {

  return {

    id:
      rate?.id ||
      generateId("rate"),

    date:
      rate?.date ||
      getTodayDate(),

    rate:
      toNumber(
        rate?.rate
      ),

    type:
      rate?.type ||
      "DAILY",

    createdAt:
      rate?.createdAt ||
      getCreatedAt(),

  };

}


/* =========================================================
   NORMALIZE INVESTOR
========================================================= */

function normalizeInvestor(
  investor
) {

  const initial =
    investor?.initial || {};


  return {

    id:
      investor?.id ||
      generateId("investor"),

    investorId:
      investor?.investorId ||
      "",

    investorName:
      investor?.investorName ||
      investor?.name ||
      "",

    startDate:
      investor?.startDate ||
      getTodayDate(),

    initial: {

      liquidity:
        toNumber(
          initial?.liquidity ??
          investor?.liquidity
        ),

      fule:
        toNumber(
          initial?.fule ??
          investor?.fule
        ),

      piFule:
        toNumber(
          initial?.piFule ??
          investor?.piFule
        ),

    },

    transactions:
      Array.isArray(
        investor?.transactions
      )
        ? investor.transactions.map(
            normalizeTransaction
          )
        : [],

    createdAt:
      investor?.createdAt ||
      getCreatedAt(),

  };

}


/* =========================================================
   NORMALIZE DATA
========================================================= */

function normalizeData(
  data
) {

  const investors =
    Array.isArray(
      data?.investors
    )
      ? data.investors.map(
          normalizeInvestor
        )
      : [];


  const rates =
    Array.isArray(
      data?.rates
    )
      ? data.rates.map(
          normalizeRate
        )
      : [];


  return {
    investors,
    rates,
  };

}


/* =========================================================
   RATE HELPERS
========================================================= */

/*
 * Rates are GLOBAL.
 *
 * Same rate is used by every investor.
 */

function sortRates(
  rates
) {

  return [...rates].sort(
    (a, b) =>
      String(a?.date || "")
        .localeCompare(
          String(b?.date || "")
        )
  );

}


/*
 * Get earliest investment date.
 */

function getEarliestInvestmentDate(
  investors
) {

  const dates =
    investors
      .map(
        (investor) =>
          investor?.startDate
      )
      .filter(Boolean)
      .sort();


  return dates[0] || null;

}


/*
 * Rate history now starts from:
 *
 * Earliest investment date itself.
 *
 * FULE / PI FULE calculations are
 * effective on the SAME DAY.
 */

function getRateStartDate(
  investors
) {

  const earliest =
    getEarliestInvestmentDate(
      investors
    );


  if (!earliest) {
    return null;
  }


  return earliest;

}


/*
 * Add one day.
 */

function addOneDay(
  dateString
) {

  const [
    year,
    month,
    day,
  ] =
    dateString
      .split("-")
      .map(Number);


  const date =
    new Date(
      year,
      month - 1,
      day
    );


  date.setDate(
    date.getDate() + 1
  );


  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1
    ).padStart(2, "0"),
    String(
      date.getDate()
    ).padStart(2, "0"),
  ].join("-");

}


/*
 * Create missing rate dates.
 *
 * Existing rates are NEVER overwritten.
 */

function ensureMissingRateHistory(
  investors,
  rates
) {

  const startDate =
    getRateStartDate(
      investors
    );


  if (!startDate) {
    return rates;
  }


  const today =
    getTodayDate();


  if (startDate > today) {
    return rates;
  }


  const existingDates =
    new Set(
      rates.map(
        (rate) =>
          rate?.date
      )
    );


  const result =
    [...rates];


  let currentDate =
    startDate;


  while (
    currentDate <= today
  ) {

    if (
      !existingDates.has(
        currentDate
      )
    ) {

      result.push(
        normalizeRate({

          id:
            generateId("rate"),

          date:
            currentDate,

          rate:
            0,

          type:
            "DAILY",

        })
      );

    }


    currentDate =
      addOneDay(
        currentDate
      );

  }


  return sortRates(
    result
  );

}


/* =========================================================
   PROVIDER
========================================================= */

export function VortaxaProvider({
  children,
}) {

  const [
    data,
    setData,
  ] = useState({
    investors: [],
    rates: [],
  });


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    dataLoading,
    setDataLoading,
  ] = useState(false);


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    try {

      const stored =
        readStorage();


      const normalized =
        normalizeData(
          stored
        );


      const rates =
        ensureMissingRateHistory(
          normalized.investors,
          normalized.rates
        );


      const finalData = {

        investors:
          normalized.investors,

        rates,

      };


      setData(
        finalData
      );


      /*
       * Save normalized/backfilled data.
       */

      writeStorage(
        finalData
      );

    } catch (error) {

      console.error(
        "Vortaxa initialization error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }, []);


  /* =======================================================
     STORAGE EVENT
  ======================================================= */

  useEffect(() => {

    function handleStorageChange(
      event
    ) {

      if (
        event.key !==
        STORAGE_KEY
      ) {
        return;
      }


      const stored =
        readStorage();


      const normalized =
        normalizeData(
          stored
        );


      const rates =
        ensureMissingRateHistory(
          normalized.investors,
          normalized.rates
        );


      setData({

        investors:
          normalized.investors,

        rates,

      });

    }


    window.addEventListener(
      "storage",
      handleStorageChange
    );


    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, []);


  /* =======================================================
     SAVE DATA
  ======================================================= */

  function saveData(
    nextData
  ) {

    const normalized =
      normalizeData(
        nextData
      );


    const rates =
      ensureMissingRateHistory(
        normalized.investors,
        normalized.rates
      );


    const finalData = {

      investors:
        normalized.investors,

      rates,

    };


    writeStorage(
      finalData
    );


    setData(
      finalData
    );


    return finalData;

  }


  /* =======================================================
     GET INVESTOR
  ======================================================= */

  function getInvestor(
    investorId
  ) {

    return (
      data.investors.find(
        (investor) =>
          investor.id ===
            investorId ||
          investor.investorId ===
            investorId
      ) ||
      null
    );

  }


  /* =======================================================
     GET INVESTOR DATA
  ======================================================= */

  function getInvestorData(
    investorId
  ) {

    const investor =
      getInvestor(
        investorId
      );


    if (!investor) {
      return null;
    }


    const summary =
      calculateInvestorSummary(
        investor,
        data.rates
      );


    return {

      investor,

      summary,

      rates:
        data.rates,

    };

  }


  /* =======================================================
     ADD INVESTOR
  ======================================================= */

  async function addInvestor(
    payload
  ) {

    const {

      investorId,
      investorName,
      startDate,

      liquidity = 0,
      fule = 0,
      piFule = 0,

    } = payload || {};


    if (!investorId) {

      throw new Error(
        "Investor is required."
      );

    }


    /*
     * Prevent duplicate Vortaxa investment
     * for same investor.
     */

    const alreadyExists =
      data.investors.some(
        (investor) =>
          investor.investorId ===
          investorId
      );


    if (alreadyExists) {

      throw new Error(
        "Vortaxa investment already exists for this investor."
      );

    }


    const newInvestorId =
      generateId(
        "investor"
      );


    const initialTransaction =
      normalizeTransaction({

        id:
          generateId("txn"),

        investorId:
          newInvestorId,

        type:
          "INITIAL",

        date:
          startDate ||
          getTodayDate(),

        /*
         * Initial transaction is kept
         * only for history.
         *
         * Actual FULE / PI FULE /
         * Liquidity values are stored
         * separately in initial.
         */

        amount:
          toNumber(liquidity) +
          toNumber(fule) +
          toNumber(piFule),

      });


    const newInvestor =
      normalizeInvestor({

        id:
          newInvestorId,

        investorId,

        investorName:
          investorName || "",

        startDate:
          startDate ||
          getTodayDate(),

        initial: {

          liquidity:
            toNumber(
              liquidity
            ),

          fule:
            toNumber(
              fule
            ),

          piFule:
            toNumber(
              piFule
            ),

        },

        transactions: [
          initialTransaction,
        ],

      });


    saveData({

      investors: [
        ...data.investors,
        newInvestor,
      ],

      rates:
        data.rates,

    });


    return newInvestor;

  }


  /* =======================================================
     UPDATE INVESTOR
  ======================================================= */

  async function updateInvestor(
    investorId,
    updates
  ) {

    const investors =
      data.investors.map(
        (investor) => {

          if (
            investor.id !==
            investorId
          ) {
            return investor;
          }


          return normalizeInvestor({

            ...investor,

            ...updates,

            initial: {

              ...investor.initial,

              ...(updates?.initial || {}),

            },

          });

        }
      );


    saveData({

      investors,

      rates:
        data.rates,

    });


    return getInvestor(
      investorId
    );

  }


  /* =======================================================
     DELETE INVESTOR
  ======================================================= */

  async function deleteInvestor(
    investorId
  ) {

    const investors =
      data.investors.filter(
        (investor) =>
          investor.id !==
          investorId
      );


    saveData({

      investors,

      rates:
        data.rates,

    });

  }


  /* =======================================================
     ADD TRANSACTION
  ======================================================= */

  async function addTransaction(
    transaction
  ) {

    const targetInvestor =
      getInvestor(
        transaction?.investorId
      );


    if (!targetInvestor) {

      throw new Error(
        "Investor not found."
      );

    }


    const newTransaction =
      normalizeTransaction({

        ...transaction,

        id:
          generateId("txn"),

        createdAt:
          getCreatedAt(),

      });


    const investors =
      data.investors.map(
        (investor) => {

          if (
            investor.id !==
            targetInvestor.id
          ) {
            return investor;
          }


          return {

            ...investor,

            transactions: [

              ...investor.transactions,

              newTransaction,

            ],

          };

        }
      );


    saveData({

      investors,

      /*
       * IMPORTANT:
       * Adding a transaction does NOT
       * regenerate or overwrite rates.
       */

      rates:
        data.rates,

    });


    return newTransaction;

  }


  /* =======================================================
     ADD FULE
  ======================================================= */

  async function addFule(
    investorId,
    amount,
    date = getTodayDate()
  ) {

    const value =
      toNumber(amount);


    if (value <= 0) {

      throw new Error(
        "FULE amount must be greater than zero."
      );

    }


    return addTransaction({

      investorId,

      type:
        "FULE_ADD",

      date,

      amount:
        value,

    });

  }


  /* =======================================================
     ADD PI FULE
  ======================================================= */

  async function addPiFule(
    investorId,
    amount,
    date = getTodayDate()
  ) {

    const value =
      toNumber(amount);


    if (value <= 0) {

      throw new Error(
        "PI FULE amount must be greater than zero."
      );

    }


    return addTransaction({

      investorId,

      type:
        "PI_FULE_ADD",

      date,

      amount:
        value,

    });

  }


  /* =======================================================
     ADD EARN WITHDRAWAL
  ======================================================= */

  async function addEarnWithdrawal(
    investorId,
    amount,
    date = getTodayDate()
  ) {

    const value =
      toNumber(amount);


    if (value <= 0) {

      throw new Error(
        "Withdrawal amount must be greater than zero."
      );

    }


    const investor =
      getInvestor(
        investorId
      );


    if (!investor) {

      throw new Error(
        "Investor not found."
      );

    }


    /*
     * Calculate current available earnings.
     *
     * IMPORTANT:
     * Withdrawal fee is NOT deducted here.
     *
     * Existing withdrawal validation remains
     * unchanged as requested.
     */

    const summary =
      calculateInvestorSummary(
        investor,
        data.rates
      );


    if (
      value >
      summary.availableEarn
    ) {

      throw new Error(
        `Withdrawal cannot exceed available earnings of ${summary.availableEarn.toFixed(2)}.`
      );

    }


    /*
     * Only actual withdrawal is saved.
     *
     * $2 fee is NOT saved as a transaction.
     */

    return addTransaction({

      investorId,

      type:
        "EARN_WITHDRAW",

      date,

      amount:
        value,

    });

  }


  /* =======================================================
     UPDATE TRANSACTION
  ======================================================= */

  async function updateTransaction(
    investorId,
    transactionId,
    updates
  ) {

    const investors =
      data.investors.map(
        (investor) => {

          if (
            investor.id !==
            investorId
          ) {
            return investor;
          }


          const transactions =
            investor.transactions.map(
              (transaction) => {

                if (
                  transaction.id !==
                  transactionId
                ) {
                  return transaction;
                }


                return normalizeTransaction({

                  ...transaction,

                  ...updates,

                  id:
                    transaction.id,

                  investorId:
                    investor.investorId,

                });

              }
            );


          return {

            ...investor,

            transactions,

          };

        }
      );


    saveData({

      investors,

      rates:
        data.rates,

    });


    return getInvestor(
      investorId
    );

  }


  /* =======================================================
     DELETE TRANSACTION
  ======================================================= */

  async function deleteTransaction(
    investorId,
    transactionId
  ) {

    const investors =
      data.investors.map(
        (investor) => {

          if (
            investor.id !==
            investorId
          ) {
            return investor;
          }


          return {

            ...investor,

            transactions:
              investor.transactions.filter(
                (transaction) =>
                  transaction.id !==
                  transactionId
              ),

          };

        }
      );


    saveData({

      investors,

      rates:
        data.rates,

    });

  }


  /* =======================================================
     UPDATE ALL TRANSACTIONS
  ======================================================= */

  async function updateInvestorTransactions(
    investorId,
    transactions
  ) {

    const investors =
      data.investors.map(
        (investor) => {

          if (
            investor.id !==
            investorId
          ) {
            return investor;
          }


          return {

            ...investor,

            transactions:
              Array.isArray(
                transactions
              )
                ? transactions.map(
                    normalizeTransaction
                  )
                : [],

          };

        }
      );


    saveData({

      investors,

      rates:
        data.rates,

    });

  }


  /* =======================================================
     ADD RATE
  ======================================================= */

  async function addRate(
    rateData
  ) {

    const date =
      rateData?.date;


    if (!date) {

      throw new Error(
        "Rate date is required."
      );

    }


    /*
     * Rate dates are unique.
     */

    const alreadyExists =
      data.rates.some(
        (rate) =>
          rate.date ===
          date
      );


    if (alreadyExists) {

      throw new Error(
        "A rate already exists for this date. Use edit instead."
      );

    }


    const newRate =
      normalizeRate({

        ...rateData,

        id:
          generateId("rate"),

        type:
          "DAILY",

      });


    saveData({

      investors:
        data.investors,

      rates: [
        ...data.rates,
        newRate,
      ],

    });


    return newRate;

  }


  /* =======================================================
     UPDATE RATE
  ======================================================= */

  async function updateRate(
    rateId,
    updates
  ) {

    const targetRate =
      data.rates.find(
        (rate) =>
          rate.id ===
          rateId
      );


    if (!targetRate) {

      throw new Error(
        "Rate not found."
      );

    }


    /*
     * Date should not be changed
     * accidentally during edit.
     *
     * The rate date remains the
     * same record date.
     */

    const rates =
      data.rates.map(
        (rate) => {

          if (
            rate.id !==
            rateId
          ) {
            return rate;
          }


          return normalizeRate({

            ...rate,

            ...updates,

            id:
              rate.id,

            date:
              rate.date,

            createdAt:
              rate.createdAt,

          });

        }
      );


    saveData({

      investors:
        data.investors,

      rates,

    });


    return rates.find(
      (rate) =>
        rate.id ===
        rateId
    );

  }


  /* =======================================================
     GET RATES
  ======================================================= */

  function getRates() {

    return sortRates(
      data.rates
    );

  }


  /* =======================================================
     REFRESH / BACKFILL
  ======================================================= */

  function reloadData() {

    setDataLoading(
      true
    );


    try {

      const stored =
        readStorage();


      const normalized =
        normalizeData(
          stored
        );


      const rates =
        ensureMissingRateHistory(
          normalized.investors,
          normalized.rates
        );


      const finalData = {

        investors:
          normalized.investors,

        rates,

      };


      writeStorage(
        finalData
      );


      setData(
        finalData
      );


      return finalData;

    } finally {

      setDataLoading(
        false
      );

    }

  }


  /* =======================================================
     CLEAR ALL DATA
  ======================================================= */

  function clearAllVortaxaData() {

    const emptyData = {

      investors: [],

      rates: [],

    };


    writeStorage(
      emptyData
    );


    setData(
      emptyData
    );

  }


  /* =======================================================
     INVESTOR DATA WITH CALCULATIONS
  ======================================================= */

  const investorData =
    useMemo(() => {

      return data.investors.map(
        (investor) => {

          const summary =
            calculateInvestorSummary(
              investor,
              data.rates
            );


          return {

            ...investor,

            summary,

          };

        }
      );

    }, [
      data.investors,
      data.rates,
    ]);


  /* =======================================================
     ALL INVESTORS SUMMARY
  ======================================================= */

  const allInvestorsSummary =
    useMemo(() => {

      return calculateAllInvestorsSummary(
        data.investors,
        data.rates
      );

    }, [
      data.investors,
      data.rates,
    ]);


  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {

    /*
     * State
     */

    data,

    investors:
      data.investors,

    rates:
      data.rates,

    investorData,

    allInvestorsSummary,

    loading,

    dataLoading,


    /*
     * Investor
     */

    getInvestor,

    getInvestorData,

    addInvestor,

    updateInvestor,

    deleteInvestor,


    /*
     * Transactions
     */

    addTransaction,

    addFule,

    addPiFule,

    addEarnWithdrawal,

    updateTransaction,

    deleteTransaction,

    updateInvestorTransactions,


    /*
     * Rates
     */

    addRate,

    updateRate,

    getRates,


    /*
     * Storage
     */

    saveData,

    reloadData,

    clearAllVortaxaData,

  };


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
      "useVortaxa must be used inside VortaxaProvider."
    );

  }


  return context;

}


export default VortaxaContext;