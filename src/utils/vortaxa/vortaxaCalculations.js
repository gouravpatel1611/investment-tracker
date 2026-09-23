/* =========================================================
   VORTAXA CALCULATIONS
========================================================= */

/* =========================================================
   DATE HELPERS
========================================================= */

/**
 * Convert any supported date value into YYYY-MM-DD.
 */
function toDateString(value) {
  if (!value) return "";

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(
      value.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      value.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (
    value &&
    typeof value.toDate === "function"
  ) {
    return toDateString(value.toDate());
  }

  return "";
}

/**
 * Add days to YYYY-MM-DD.
 */
function addDays(dateString, days) {
  const date = new Date(
    `${dateString}T00:00:00`
  );

  date.setDate(
    date.getDate() + days
  );

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Get all dates between start and end.
 */
function getDateRange(
  startDate,
  endDate
) {
  if (!startDate || !endDate) {
    return [];
  }

  const dates = [];

  let current = startDate;

  while (current <= endDate) {
    dates.push(current);
    current = addDays(
      current,
      1
    );
  }

  return dates;
}

/* =========================================================
   TRANSACTION HELPERS
========================================================= */

/**
 * Get FULE amount that becomes eligible
 * from a FULE_ADD transaction.
 *
 * Example:
 *
 * FULE added 25 Sep
 * Profit starts 27 Sep
 */
function getFuleEffectiveDate(
  transactionDate
) {
  return addDays(
    transactionDate,
    2
  );
}

/**
 * Get all FULE / PI FULE applicable
 * on a particular date.
 */
export function getFuleBalanceForDate(
  transactions = [],
  targetDate
) {
  let fule = 0;
  let piFule = 0;

  const sortedTransactions = [
    ...transactions,
  ].sort((a, b) => {
    const dateA = toDateString(
      a.date
    );
    const dateB = toDateString(
      b.date
    );

    return dateA.localeCompare(
      dateB
    );
  });

  for (const transaction of sortedTransactions) {
    const type = transaction.type;

    const transactionDate =
      toDateString(
        transaction.date
      );

    if (!transactionDate) {
      continue;
    }

    /* =====================================================
       INITIAL
    ===================================================== */

    if (type === "INITIAL") {
      const effectiveDate =
        transactionDate;

      if (
        targetDate >=
        effectiveDate
      ) {
        fule +=
          Number(
            transaction.fule
          ) || 0;

        piFule +=
          Number(
            transaction.piFule
          ) || 0;
      }

      continue;
    }

    /* =====================================================
       FULE ADD
    ===================================================== */

    if (type === "FULE_ADD") {
      const effectiveDate =
        getFuleEffectiveDate(
          transactionDate
        );

      if (
        targetDate >=
        effectiveDate
      ) {
        fule +=
          Number(
            transaction.amount
          ) || 0;
      }

      continue;
    }

    /* =====================================================
       PI FULE ADD
    ===================================================== */

    if (
      type === "PI_FULE_ADD"
    ) {
      const effectiveDate =
        getFuleEffectiveDate(
          transactionDate
        );

      if (
        targetDate >=
        effectiveDate
      ) {
        piFule +=
          Number(
            transaction.amount
          ) || 0;
      }
    }
  }

  return {
    fule,
    piFule,
  };
}

/* =========================================================
   DAILY PROFIT
========================================================= */

/**
 * Calculate profit for one particular day.
 *
 * Formula:
 *
 * FULE Profit
 * = FULE × Rate% × 70%
 *
 * PI FULE Profit
 * = PI FULE × Rate% × 3%
 *
 * Daily Profit
 * = FULE Profit + PI FULE Profit
 */
export function calculateVortaxaDailyProfit(
  fule,
  piFule,
  rate
) {
  const fuleAmount =
    Number(fule) || 0;

  const piFuleAmount =
    Number(piFule) || 0;

  const rateValue =
    Number(rate) || 0;

  const ratePercent =
    rateValue / 100;

  const fuleProfit =
    fuleAmount *
    ratePercent *
    0.70;

  const piFuleProfit =
    piFuleAmount *
    ratePercent *
    0.03;

  const dailyProfit =
    fuleProfit +
    piFuleProfit;

  return {
    fuleProfit,
    piFuleProfit,
    dailyProfit,
  };
}

/* =========================================================
   DAILY RATE MAP
========================================================= */

/**
 * Convert daily rates into:
 *
 * {
 *   "2026-09-22": 0.20,
 *   "2026-09-23": 0.25
 * }
 */
function createRateMap(
  dailyRates = []
) {
  const rateMap = {};

  for (const item of dailyRates) {
    const date = toDateString(
      item.date
    );

    if (!date) continue;

    rateMap[date] =
      Number(item.rate) || 0;
  }

  return rateMap;
}

/* =========================================================
   GET EARN WITHDRAWALS
========================================================= */

/**
 * Get total EARN withdrawals
 * up to a particular date.
 */
export function getEarnWithdrawnUntilDate(
  transactions = [],
  targetDate
) {
  return transactions.reduce(
    (total, transaction) => {
      if (
        transaction.type !==
        "EARN_WITHDRAW"
      ) {
        return total;
      }

      const date =
        toDateString(
          transaction.date
        );

      if (
        date &&
        date <= targetDate
      ) {
        return (
          total +
          (Number(
            transaction.amount
          ) || 0)
        );
      }

      return total;
    },
    0
  );
}

/* =========================================================
   DAILY CALCULATION
========================================================= */

/**
 * Calculate all daily Vortaxa profits.
 *
 * Returns:
 *
 * [
 *   {
 *     date,
 *     rate,
 *     fule,
 *     piFule,
 *     fuleProfit,
 *     piFuleProfit,
 *     dailyProfit,
 *     cumulativeEarn
 *   }
 * ]
 */
export function calculateVortaxaDailyHistory(
  transactions = [],
  dailyRates = [],
  startDate,
  endDate
) {
  if (
    !startDate ||
    !endDate
  ) {
    return [];
  }

  const rateMap =
    createRateMap(
      dailyRates
    );

  const dates =
    getDateRange(
      startDate,
      endDate
    );

  let cumulativeEarn = 0;

  return dates.map(
    (date) => {
      const {
        fule,
        piFule,
      } =
        getFuleBalanceForDate(
          transactions,
          date
        );

      const rate =
        rateMap[date] || 0;

      const {
        fuleProfit,
        piFuleProfit,
        dailyProfit,
      } =
        calculateVortaxaDailyProfit(
          fule,
          piFule,
          rate
        );

      cumulativeEarn +=
        dailyProfit;

      return {
        date,

        rate,

        fule,
        piFule,

        fuleProfit,
        piFuleProfit,

        dailyProfit,

        cumulativeEarn,
      };
    }
  );
}

/* =========================================================
   GROSS EARN
========================================================= */

export function calculateGrossEarn(
  dailyHistory = []
) {
  return dailyHistory.reduce(
    (total, item) => {
      return (
        total +
        (Number(
          item.dailyProfit
        ) || 0)
      );
    },
    0
  );
}

/* =========================================================
   TOTAL EARN WITHDRAWAL
========================================================= */

export function calculateTotalEarnWithdrawn(
  transactions = []
) {
  return transactions.reduce(
    (total, transaction) => {
      if (
        transaction.type !==
        "EARN_WITHDRAW"
      ) {
        return total;
      }

      return (
        total +
        (Number(
          transaction.amount
        ) || 0)
      );
    },
    0
  );
}

/* =========================================================
   AVAILABLE EARN
========================================================= */

export function calculateAvailableEarn(
  grossEarn,
  totalEarnWithdrawn
) {
  const gross =
    Number(grossEarn) || 0;

  const withdrawn =
    Number(
      totalEarnWithdrawn
    ) || 0;

  return Math.max(
    0,
    gross - withdrawn
  );
}

/* =========================================================
   CURRENT FULE / PI FULE
========================================================= */

export function calculateCurrentFule(
  transactions = []
) {
  let fule = 0;
  let piFule = 0;

  for (const transaction of transactions) {
    if (
      transaction.type ===
      "INITIAL"
    ) {
      fule +=
        Number(
          transaction.fule
        ) || 0;

      piFule +=
        Number(
          transaction.piFule
        ) || 0;
    }

    if (
      transaction.type ===
      "FULE_ADD"
    ) {
      fule +=
        Number(
          transaction.amount
        ) || 0;
    }

    if (
      transaction.type ===
      "PI_FULE_ADD"
    ) {
      piFule +=
        Number(
          transaction.amount
        ) || 0;
    }
  }

  return {
    fule,
    piFule,
  };
}

/* =========================================================
   CURRENT LIQUIDITY
========================================================= */

export function calculateCurrentLiquidity(
  transactions = []
) {
  const initialTransaction =
    transactions.find(
      (transaction) =>
        transaction.type ===
        "INITIAL"
    );

  if (!initialTransaction) {
    return 0;
  }

  return (
    Number(
      initialTransaction.liquidity
    ) || 0
  );
}

/* =========================================================
   COMPLETE VORTAXA SUMMARY
========================================================= */

export function calculateVortaxaSummary({
  transactions = [],
  dailyRates = [],
  startDate,
  endDate,
}) {
  const {
    fule,
    piFule,
  } =
    calculateCurrentFule(
      transactions
    );

  const liquidity =
    calculateCurrentLiquidity(
      transactions
    );

  const dailyHistory =
    calculateVortaxaDailyHistory(
      transactions,
      dailyRates,
      startDate,
      endDate
    );

  const grossEarn =
    calculateGrossEarn(
      dailyHistory
    );

  const totalEarnWithdrawn =
    calculateTotalEarnWithdrawn(
      transactions
    );

  const availableEarn =
    calculateAvailableEarn(
      grossEarn,
      totalEarnWithdrawn
    );

  const currentValue =
    liquidity +
    fule +
    piFule +
    availableEarn;

  return {
    liquidity,

    fule,

    piFule,

    grossEarn,

    totalEarnWithdrawn,

    availableEarn,

    currentValue,

    dailyHistory,
  };
}

/* =========================================================
   EARN WITHDRAWAL VALIDATION
========================================================= */

export function canWithdrawEarn(
  withdrawalAmount,
  availableEarn
) {
  const amount =
    Number(
      withdrawalAmount
    ) || 0;

  const available =
    Number(
      availableEarn
    ) || 0;

  if (amount <= 0) {
    return {
      valid: false,
      message:
        "Withdrawal amount must be greater than zero.",
    };
  }

  if (amount > available) {
    return {
      valid: false,
      message:
        "Withdrawal amount cannot be greater than available EARN.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}