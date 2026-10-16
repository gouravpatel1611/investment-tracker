/* =========================================================
   VORTAXA CALCULATIONS
   ---------------------------------------------------------
   This file contains calculation logic only.

   Rules:
   - Liquidity is never used for earning calculation.
   - FULE earning = Effective FULE × Daily Rate% × 70%
   - PI FULE earning = Effective PI FULE × Daily Rate% × 3%
   - FULE / PI FULE additions are effective on SAME DAY.
   - Initial FULE / PI FULE are effective on SAME DAY.
   - Rates are global and applicable to all investors.
   - Withdrawal is deducted only from total earned amount.
   - Withdrawal fee = Number of withdrawal transactions × $2.
   - Net Withdrawal = Total Withdrawal - Withdrawal Fee.
   - Withdrawal fee is NOT stored as a transaction.
========================================================= */


/* =========================================================
   BASIC HELPERS
========================================================= */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


function parseDateOnly(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] =
    String(value).split("-").map(Number);

  if (
    !year ||
    !month ||
    !day
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
  if (!(date instanceof Date)) {
    return "";
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getTodayDate() {
  const today = new Date();

  return formatDateOnly(today);
}


/* =========================================================
   EFFECTIVE DATE
========================================================= */

/*
 * FULE / PI FULE is effective
 * on the SAME DAY as the transaction.
 */

export function getEffectiveDate(
  transactionDate
) {
  return transactionDate || "";
}


/* =========================================================
   RATE
========================================================= */

/*
 * Rate is stored as percentage.
 *
 * Example:
 * rate = 0.15
 *
 * Means:
 * 0.15%
 */

function getRatePercent(rate) {
  return toNumber(rate) / 100;
}


/* =========================================================
   DAILY FULE / PI FULE AMOUNTS
========================================================= */


export function getEffectiveFule(investor, date) {
  if (!investor || !date) {
    return 0;
  }

  const targetDate = parseDateOnly(date);

  if (!targetDate) {
    return 0;
  }

  const transactions = Array.isArray(investor?.transactions)
    ? investor.transactions
    : [];

  return transactions.reduce((total, transaction) => {
    if (transaction?.type !== "FULE_ADD" || !transaction?.date) {
      return total;
    }

    const transactionDate = parseDateOnly(
      getEffectiveDate(transaction.date)
    );

    if (!transactionDate || targetDate < transactionDate) {
      return total;
    }

    return total + Math.max(0, toNumber(transaction.amount));
  }, 0);
}



/* =========================================================
   EFFECTIVE PI FULE
========================================================= */

export function getEffectivePiFule(investor, date) {
  if (!investor || !date) {
    return 0;
  }

  const targetDate = parseDateOnly(date);

  if (!targetDate) {
    return 0;
  }

  const transactions = Array.isArray(investor?.transactions)
    ? investor.transactions
    : [];

  let effectivePiFule = 0;

  for (const transaction of transactions) {
    if (transaction?.type !== "PI_FULE_ADD") {
      continue;
    }

    if (!transaction?.date) {
      continue;
    }

    const effectiveDate = getEffectiveDate(transaction.date);

    if (!effectiveDate) {
      continue;
    }

    const transactionDate = parseDateOnly(effectiveDate);

    if (!transactionDate) {
      continue;
    }

    if (targetDate >= transactionDate) {
      effectivePiFule += toNumber(transaction.amount);
    }
  }

  return effectivePiFule;
}



/* =========================================================
   DAILY EARNING
========================================================= */

export function calculateDailyEarning(
  investor,
  rate,
  date
) {

  const dailyRate =
    getRatePercent(rate);


  const fule =
    getEffectiveFule(
      investor,
      date
    );


  const piFule =
    getEffectivePiFule(
      investor,
      date
    );


  /* -----------------------------------------
     APR
  ----------------------------------------- */

  const apr =
    fule *
    dailyRate *
    0.70;


  /* -----------------------------------------
     PI
  ----------------------------------------- */

  const pi =
    piFule *
    dailyRate *
    0.03;


  const total =
    apr + pi;

  return {
    date,
    rate: toNumber(rate),

    fule,
    piFule,

    apr,
    pi,
    total,
  };
}


/* =========================================================
   DATE RANGE
========================================================= */

export function getDateRange(
  startDate,
  endDate = getTodayDate()
) {
  const start =
    parseDateOnly(startDate);

  const end =
    parseDateOnly(endDate);


  if (
    !start ||
    !end ||
    start > end
  ) {
    return [];
  }


  const dates = [];

  const current =
    new Date(start);


  while (
    current <= end
  ) {

    dates.push(
      formatDateOnly(current)
    );

    current.setDate(
      current.getDate() + 1
    );

  }


  return dates;
}


/* =========================================================
   DAILY CALCULATION
========================================================= */


export function calculateInvestorDailyEarnings(
  investor,
  rates = [],
  endDate = getTodayDate()
) {
  if (!investor) {
    return [];
  }

  const transactions = Array.isArray(investor?.transactions)
    ? investor.transactions
    : [];

  // Calculation begins with the first actual FULE / PI FULE addition.
  const investmentDates = transactions
    .filter(
      (transaction) =>
        ["FULE_ADD", "PI_FULE_ADD"].includes(transaction?.type) &&
        transaction?.date &&
        parseDateOnly(transaction.date)
    )
    .map((transaction) => transaction.date)
    .sort();

  // No FULE or PI FULE transaction means no earnings.
  if (investmentDates.length === 0) {
    return [];
  }

  const startDate = investmentDates[0];
  const rateMap = new Map();

  for (const rate of rates) {
    if (!rate?.date) {
      continue;
    }

    rateMap.set(rate.date, toNumber(rate.rate));
  }

  const dates = getDateRange(startDate, endDate);

  return dates.map((date) => {
    const rate = rateMap.get(date) ?? 0;

    return calculateDailyEarning(investor, rate, date);
  });
}


/* =========================================================
   TOTAL WITHDRAWAL
========================================================= */

export function calculateTotalWithdrawn(
  investor
) {

  const transactions =
    Array.isArray(
      investor?.transactions
    )
      ? investor.transactions
      : [];


  return transactions.reduce(
    (
      total,
      transaction
    ) => {

      if (
        transaction?.type !==
        "EARN_WITHDRAW"
      ) {
        return total;
      }


      return (
        total +
        toNumber(
          transaction?.amount
        )
      );

    },
    0
  );
}


/* =========================================================
   WITHDRAWAL TRANSACTION COUNT
========================================================= */

export function calculateWithdrawalTransactionCount(
  investor
) {

  const transactions =
    Array.isArray(
      investor?.transactions
    )
      ? investor.transactions
      : [];


  return transactions.reduce(
    (
      count,
      transaction
    ) => {

      if (
        transaction?.type !==
        "EARN_WITHDRAW"
      ) {
        return count;
      }


      return count + 1;

    },
    0
  );
}


/* =========================================================
   WITHDRAWAL FEE
========================================================= */

/*
 * Fixed withdrawal fee:
 *
 * $2 per withdrawal transaction.
 */

export function calculateWithdrawalFee(
  investor,
  feePerWithdrawal = 2
) {

  const withdrawalCount =
    calculateWithdrawalTransactionCount(
      investor
    );


  return (
    withdrawalCount *
    toNumber(
      feePerWithdrawal
    )
  );
}


/* =========================================================
   NET WITHDRAWAL
========================================================= */

export function calculateNetWithdrawal(
  investor,
  feePerWithdrawal = 2
) {

  const totalWithdrawn =
    calculateTotalWithdrawn(
      investor
    );


  const withdrawalFee =
    calculateWithdrawalFee(
      investor,
      feePerWithdrawal
    );


  return (
    totalWithdrawn -
    withdrawalFee
  );
}


/* =========================================================
   INVESTOR SUMMARY
========================================================= */

export function calculateInvestorSummary(
  investor,
  rates = [],
  endDate = getTodayDate()
) {

  if (!investor) {

    return {
      liquidity: 0,

      fule: 0,
      piFule: 0,

      apr: 0,
      pi: 0,
      totalEarn: 0,

      totalEarnWithdrawn: 0,

      withdrawalFee: 0,

      netWithdrawal: 0,

      availableEarn: 0,

      grossEarn: 0,

      total: 0,
      balance: 0,

      dailyEarnings: [],
    };

  }


  /* -----------------------------------------
     CURRENT INVESTMENT AMOUNTS
  ----------------------------------------- */

  // Keep legacy liquidity for display only.
  // Liquidity never contributes to earnings.
  const liquidity = toNumber(investor?.initial?.liquidity);

  const transactions = Array.isArray(investor?.transactions)
    ? investor.transactions
    : [];

  // Ignore legacy initial FULE / PI FULE values.
  // Only actual addition transactions count.
  const fule = transactions.reduce((total, transaction) => {
    if (transaction?.type !== "FULE_ADD") {
      return total;
    }

    return total + Math.max(0, toNumber(transaction.amount));
  }, 0);

  const piFule = transactions.reduce((total, transaction) => {
    if (transaction?.type !== "PI_FULE_ADD") {
      return total;
    }

    return total + Math.max(0, toNumber(transaction.amount));
  }, 0);


  /* -----------------------------------------
     DAILY EARNINGS
  ----------------------------------------- */

  const dailyEarnings =
    calculateInvestorDailyEarnings(
      investor,
      rates,
      endDate
    );


  /* -----------------------------------------
     APR TOTAL
  ----------------------------------------- */

  const apr =
    dailyEarnings.reduce(
      (
        total,
        day
      ) => {

        return (
          total +
          toNumber(
            day?.apr
          )
        );

      },
      0
    );


  /* -----------------------------------------
     PI TOTAL
  ----------------------------------------- */

  const pi =
    dailyEarnings.reduce(
      (
        total,
        day
      ) => {

        return (
          total +
          toNumber(
            day?.pi
          )
        );

      },
      0
    );


  /* -----------------------------------------
     TOTAL EARN
  ----------------------------------------- */

  const totalEarn =
    apr + pi;


  /* -----------------------------------------
     TOTAL WITHDRAWAL
  ----------------------------------------- */

  const totalEarnWithdrawn =
    calculateTotalWithdrawn(
      investor
    );


  /* -----------------------------------------
     WITHDRAWAL FEE
  ----------------------------------------- */

  const withdrawalFee =
    calculateWithdrawalFee(
      investor
    );


  /* -----------------------------------------
     NET WITHDRAWAL
  ----------------------------------------- */

  const netWithdrawal =
    calculateNetWithdrawal(
      investor
    );


  /* -----------------------------------------
     AVAILABLE EARN
  ----------------------------------------- */

  /*
   * Current logic intentionally unchanged.
   */

  const availableEarn =
    Math.max(
      0,
      totalEarn -
        totalEarnWithdrawn
    );


  return {

    /* Static investment values */

    liquidity,

    fule,
    piFule,


    /* Earnings */

    apr,
    pi,

    totalEarn,

    grossEarn:
      totalEarn,


    /* Withdrawal */

    totalEarnWithdrawn,

    withdrawalFee,

    netWithdrawal,


    /* Remaining earnings */

    availableEarn,


    /* Aliases */

    total:
      totalEarn,

    balance:
      availableEarn,


    /* Daily breakdown */

    dailyEarnings,

  };

}


/* =========================================================
   RATE-WISE CALCULATION
========================================================= */

export function calculateRateSummary(
  date,
  rate,
  investors = []
) {

  let apr = 0;
  let pi = 0;


  for (
    const investor
    of investors
  ) {

    const daily =
      calculateDailyEarning(
        investor,
        rate,
        date
      );


    apr +=
      daily.apr;


    pi +=
      daily.pi;

  }


  return {

    date,

    rate:
      toNumber(rate),

    apr,

    pi,

    total:
      apr + pi,

  };

}


/* =========================================================
   GLOBAL RATE HISTORY SUMMARY
========================================================= */

export function calculateRateHistory(
  rates = [],
  investors = []
) {

  return [...rates]
    .sort(
      (a, b) =>
        String(a?.date || "")
          .localeCompare(
            String(b?.date || "")
          )
    )
    .map(
      (rate) =>
        calculateRateSummary(
          rate?.date,
          rate?.rate,
          investors
        )
    );

}


/* =========================================================
   TOTAL SUMMARY FOR ALL INVESTORS
========================================================= */

export function calculateAllInvestorsSummary(
  investors = [],
  rates = [],
  endDate = getTodayDate()
) {

  const summaries =
    investors.map(
      (investor) => {

        const summary =
          calculateInvestorSummary(
            investor,
            rates,
            endDate
          );


        return {
          investor,
          summary,
        };

      }
    );


  const totalApr =
    summaries.reduce(
      (
        total,
        item
      ) =>
        total +
        toNumber(
          item?.summary?.apr
        ),
      0
    );


  const totalPi =
    summaries.reduce(
      (
        total,
        item
      ) =>
        total +
        toNumber(
          item?.summary?.pi
        ),
      0
    );


  const totalEarn =
    totalApr +
    totalPi;


  /* -----------------------------------------
     TOTAL WITHDRAWAL
  ----------------------------------------- */

  const totalWithdrawn =
    summaries.reduce(
      (
        total,
        item
      ) =>
        total +
        toNumber(
          item?.summary
            ?.totalEarnWithdrawn
        ),
      0
    );


  /* -----------------------------------------
     TOTAL WITHDRAWAL FEE
  ----------------------------------------- */

  const totalWithdrawalFee =
    summaries.reduce(
      (
        total,
        item
      ) =>
        total +
        toNumber(
          item?.summary
            ?.withdrawalFee
        ),
      0
    );


  /* -----------------------------------------
     TOTAL NET WITHDRAWAL
  ----------------------------------------- */

  const totalNetWithdrawal =
    totalWithdrawn -
    totalWithdrawalFee;


  /* -----------------------------------------
     AVAILABLE EARN
  ----------------------------------------- */

  const availableEarn =
    Math.max(
      0,
      totalEarn -
        totalWithdrawn
    );


  return {

    investors:
      summaries,

    apr:
      totalApr,

    pi:
      totalPi,

    totalEarn,

    totalWithdrawn,

    /*
     * New withdrawal fields
     */

    withdrawalFee:
      totalWithdrawalFee,

    netWithdrawal:
      totalNetWithdrawal,

    availableEarn,

    total:
      totalEarn,

    balance:
      availableEarn,

  };

}