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

import {
  addVortaxaInvestor,
  getVortaxaInvestors,
  updateVortaxaInvestor,
  deleteVortaxaInvestor,

  addVortaxaTransaction,
  getVortaxaTransactions,
  updateVortaxaTransaction,
  deleteVortaxaTransaction,

  addVortaxaRate,
  getVortaxaRates,
  updateVortaxaRate,
} from "../services/firebase/vortaxaService";

import {
  useAuth,
} from "./AuthContext";


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
      /*
       * Liquidity Firebase mein save rahegi,
       * lekin earnings calculation mein
       * use nahi hogi.
       */

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
   SORT RATES
========================================================= */

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


/* =========================================================
   EARLIEST INVESTMENT DATE
========================================================= */

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


/* =========================================================
   ADD ONE DAY
========================================================= */

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


/* =========================================================
   GET MISSING RATE DATES
========================================================= */

function getMissingRateDates(
  investors,
  rates
) {
  const startDate =
    getEarliestInvestmentDate(
      investors
    );

  if (!startDate) {
    return [];
  }

  const today =
    getTodayDate();

  if (startDate > today) {
    return [];
  }

  const existingDates =
    new Set(
      rates.map(
        (rate) =>
          rate?.date
      )
    );

  const missingDates = [];

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
      missingDates.push(
        currentDate
      );
    }

    currentDate =
      addOneDay(
        currentDate
      );
  }

  return missingDates;
}


/* =========================================================
   LOAD FIREBASE DATA
========================================================= */

async function loadFirebaseData() {

  /*
   * ---------------------------------------------
   * LOAD INVESTORS
   * ---------------------------------------------
   */

  const firebaseInvestors =
    await getVortaxaInvestors();


  /*
   * ---------------------------------------------
   * LOAD EACH INVESTOR TRANSACTIONS
   * ---------------------------------------------
   */

  const investorsWithTransactions =
    await Promise.all(

      firebaseInvestors.map(
        async (investor) => {

          const transactions =
            await getVortaxaTransactions(
              investor.id
            );

          return normalizeInvestor({

            ...investor,

            transactions:
              Array.isArray(
                transactions
              )
                ? transactions
                : [],

          });

        }
      )

    );


  /*
   * ---------------------------------------------
   * LOAD GLOBAL RATES
   * ---------------------------------------------
   */

  let rates =
    (
      await getVortaxaRates()
    ).map(
      normalizeRate
    );


  /*
   * ---------------------------------------------
   * BACKFILL MISSING RATE DATES
   *
   * Earliest investment date
   * se aaj tak.
   *
   * Missing date = rate 0
   *
   * Existing rate kabhi overwrite nahi hogi.
   * ---------------------------------------------
   */

  const missingRateDates =
    getMissingRateDates(
      investorsWithTransactions,
      rates
    );


  if (
    missingRateDates.length > 0
  ) {

    const newRates =
      await Promise.all(

        missingRateDates.map(
          async (date) => {

            return addVortaxaRate({

              date,

              rate: 0,

              type: "DAILY",

            });

          }
        )

      );


    rates = [

      ...rates,

      ...newRates.map(
        normalizeRate
      ),

    ];

  }


  /*
   * ---------------------------------------------
   * RETURN FINAL DATA
   * ---------------------------------------------
   */

  return {

    investors:
      investorsWithTransactions,

    rates:
      sortRates(
        rates
      ),

  };
}


/* =========================================================
   PROVIDER
========================================================= */

export function VortaxaProvider({
  children,
}) {

  /*
   * =======================================================
   * AUTH STATE
   *
   * IMPORTANT:
   * Firebase Auth ko restore hone ka wait karna hai.
   * =======================================================
   */

  const {
    user,
    loading: authLoading,
  } = useAuth();


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
     REFRESH FIREBASE DATA
  ======================================================= */

  async function refreshFirebaseData() {

    /*
     * User available nahi hai to Firebase call
     * mat karo.
     */

    if (!user) {

      const emptyData = {
        investors: [],
        rates: [],
      };

      setData(
        emptyData
      );

      return emptyData;
    }


    const firebaseData =
      await loadFirebaseData();


    setData(
      firebaseData
    );


    return firebaseData;
  }


  /* =======================================================
     INITIAL LOAD
     
     IMPORTANT:
     Auth loading complete hone ke baad hi
     Firebase data load hoga.
  ======================================================= */

  useEffect(() => {

    let mounted = true;


    async function initialize() {

      /*
       * Auth abhi Firebase se user restore kar raha hai.
       *
       * Is stage par kuch bhi load nahi karna.
       */

      if (authLoading) {
        return;
      }


      /*
       * User logged out hai.
       *
       * Vortaxa data clear kar do.
       */

      if (!user) {

        if (mounted) {

          setData({
            investors: [],
            rates: [],
          });

          setLoading(
            false
          );

        }

        return;
      }


      /*
       * User available hai.
       *
       * Ab Firebase data load karna safe hai.
       */

      try {

        if (mounted) {

          setLoading(
            true
          );

        }


        const firebaseData =
          await loadFirebaseData();


        if (mounted) {

          setData(
            firebaseData
          );

        }

      } catch (error) {

        console.error(
          "Vortaxa Firebase initialization error:",
          error
        );

      } finally {

        if (mounted) {

          setLoading(
            false
          );

        }

      }

    }


    initialize();


    return () => {

      mounted = false;

    };

  }, [
    user,
    authLoading,
  ]);


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


    const newInvestor =
      normalizeInvestor({

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

        transactions: [],

      });


    const savedInvestor =
      await addVortaxaInvestor({

        investorId:
          newInvestor.investorId,

        investorName:
          newInvestor.investorName,

        startDate:
          newInvestor.startDate,

        initial:
          newInvestor.initial,

      });


    await addVortaxaTransaction(

      savedInvestor.id,

      normalizeTransaction({

        investorId:
          savedInvestor.id,

        type:
          "INITIAL",

        date:
          newInvestor.startDate,

        amount:
          toNumber(
            liquidity
          ) +
          toNumber(
            fule
          ) +
          toNumber(
            piFule
          ),

      })

    );


    await refreshFirebaseData();


    return savedInvestor;
  }


  /* =======================================================
     UPDATE INVESTOR
  ======================================================= */

  async function updateInvestor(
    investorId,
    updates
  ) {

    const investor =
      getInvestor(
        investorId
      );


    if (!investor) {

      throw new Error(
        "Investor not found."
      );

    }


    const updatedInvestor =
      normalizeInvestor({

        ...investor,

        ...updates,

        id:
          investor.id,

        initial: {

          ...investor.initial,

          ...(updates?.initial || {}),

        },

      });


    await updateVortaxaInvestor(

      investor.id,

      {

        investorId:
          updatedInvestor.investorId,

        investorName:
          updatedInvestor.investorName,

        startDate:
          updatedInvestor.startDate,

        initial:
          updatedInvestor.initial,

      }

    );


    await refreshFirebaseData();


    return getInvestor(
      investor.id
    );
  }


  /* =======================================================
     DELETE INVESTOR
  ======================================================= */

  async function deleteInvestor(
    investorId
  ) {

    const investor =
      getInvestor(
        investorId
      );


    if (!investor) {

      throw new Error(
        "Investor not found."
      );

    }


    await deleteVortaxaInvestor(
      investor.id
    );


    await refreshFirebaseData();
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

        investorId:
          targetInvestor.id,

      });


    const savedTransaction =
      await addVortaxaTransaction(

        targetInvestor.id,

        newTransaction

      );


    await refreshFirebaseData();


    return savedTransaction;
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
      toNumber(
        amount
      );


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
      toNumber(
        amount
      );


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
      toNumber(
        amount
      );


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


    const summary =
      calculateInvestorSummary(
        investor,
        data.rates
      );


    /*
     * Withdrawal fee available earning
     * se deduct nahi hoti.
     */

    if (
      value >
      summary.availableEarn
    ) {

      throw new Error(

        `Withdrawal cannot exceed available earnings of ${summary.availableEarn.toFixed(2)}.`

      );

    }


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

    const investor =
      getInvestor(
        investorId
      );


    if (!investor) {

      throw new Error(
        "Investor not found."
      );

    }


    const targetTransaction =
      investor.transactions.find(
        (transaction) =>
          transaction.id ===
          transactionId
      );


    if (!targetTransaction) {

      throw new Error(
        "Transaction not found."
      );

    }


    if (
      targetTransaction.type ===
      "INITIAL"
    ) {

      throw new Error(
        "Initial transaction cannot be edited."
      );

    }


    const updatedTransaction =
      normalizeTransaction({

        ...targetTransaction,

        ...updates,

        id:
          targetTransaction.id,

        investorId:
          investor.id,

      });


    const savedTransaction =
      await updateVortaxaTransaction(

        investor.id,

        targetTransaction.id,

        updatedTransaction

      );


    await refreshFirebaseData();


    return savedTransaction;
  }


  /* =======================================================
     DELETE TRANSACTION
  ======================================================= */

  async function deleteTransaction(
    investorId,
    transactionId
  ) {

    const investor =
      getInvestor(
        investorId
      );


    if (!investor) {

      throw new Error(
        "Investor not found."
      );

    }


    const targetTransaction =
      investor.transactions.find(
        (transaction) =>
          transaction.id ===
          transactionId
      );


    if (!targetTransaction) {

      throw new Error(
        "Transaction not found."
      );

    }


    if (
      targetTransaction.type ===
      "INITIAL"
    ) {

      throw new Error(
        "Initial transaction cannot be deleted."
      );

    }


    await deleteVortaxaTransaction(

      investor.id,

      targetTransaction.id

    );


    await refreshFirebaseData();
  }


  /* =======================================================
     UPDATE ALL TRANSACTIONS
  ======================================================= */

  async function updateInvestorTransactions(
    investorId,
    transactions
  ) {

    const investor =
      getInvestor(
        investorId
      );


    if (!investor) {

      throw new Error(
        "Investor not found."
      );

    }


    if (
      !Array.isArray(
        transactions
      )
    ) {

      throw new Error(
        "Transactions must be an array."
      );

    }


    for (
      const transaction
      of transactions
    ) {

      const normalized =
        normalizeTransaction({

          ...transaction,

          investorId:
            investor.id,

        });


      if (
        normalized.type ===
        "INITIAL"
      ) {

        continue;

      }


      const existing =
        investor.transactions.find(
          (item) =>
            item.id ===
            normalized.id
        );


      if (existing) {

        await updateVortaxaTransaction(

          investor.id,

          existing.id,

          normalized

        );

      } else {

        await addVortaxaTransaction(

          investor.id,

          normalized

        );

      }

    }


    await refreshFirebaseData();
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

        type:
          "DAILY",

      });


    const savedRate =
      await addVortaxaRate(
        newRate
      );


    await refreshFirebaseData();


    return savedRate;
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


    const updatedRate =
      normalizeRate({

        ...targetRate,

        ...updates,

        id:
          targetRate.id,

        date:
          targetRate.date,

        createdAt:
          targetRate.createdAt,

      });


    const savedRate =
      await updateVortaxaRate(

        targetRate.id,

        {

          date:
            targetRate.date,

          rate:
            updatedRate.rate,

          type:
            "DAILY",

        }

      );


    await refreshFirebaseData();


    return savedRate;
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
     RELOAD DATA
  ======================================================= */

  async function reloadData() {

    setDataLoading(
      true
    );


    try {

      return await refreshFirebaseData();

    } finally {

      setDataLoading(
        false
      );

    }

  }


  /* =======================================================
     INVESTOR DATA
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

    data,

    investors:
      data.investors,

    rates:
      data.rates,

    investorData,

    allInvestorsSummary,

    loading,

    dataLoading,


    getInvestor,

    getInvestorData,

    addInvestor,

    updateInvestor,

    deleteInvestor,


    addTransaction,

    addFule,

    addPiFule,

    addEarnWithdrawal,

    updateTransaction,

    deleteTransaction,

    updateInvestorTransactions,


    addRate,

    updateRate,

    getRates,


    reloadData,

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