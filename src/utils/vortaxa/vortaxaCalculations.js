/* =========================================================
   VORTAXA CALCULATIONS
   ---------------------------------------------------------
   This file contains calculation logic only.

   Rules:
   - Liquidity is never used for earning calculation.
   - FULE earning = Effective FULE × Daily Rate% × 70%
   - PI FULE earning = Effective PI FULE × Daily Rate% × 3%
   - FULE / PI FULE additions become effective after 2 days.
   - Initial FULE / PI FULE also become effective after 2 days.
   - Rates are global and applicable to all investors.
   - Withdrawal is deducted only from total earned amount.
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

  return formatDateOnly(date);
}


function getTodayDate() {
  const today = new Date();

  return formatDateOnly(today);
}


/* =========================================================
   EFFECTIVE DATE
========================================================= */

/*
 * Any FULE / PI FULE amount added on a particular date
 * becomes effective exactly 2 days later.
 *
 * Example:
 *
 * Addition       Effective
 * 25 Sep         27 Sep
 */

export function getEffectiveDate(
  transactionDate
) {
  return addDays(
    transactionDate,
    2
  );
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
 *
 * Therefore:
 *
 * amount × (0.15 / 100)
 */

function getRatePercent(rate) {
  return toNumber(rate) / 100;
}


/* =========================================================
   DAILY FULE / PI FULE AMOUNTS
========================================================= */

/*
 * Calculate FULE amount which is effective
 * on a particular date.
 *
 * Initial FULE becomes effective:
 * initial date + 2 days
 *
 * Every FULE_ADD becomes effective:
 * transaction date + 2 days
 */

export function getEffectiveFule(
  investor,
  date
) {
  if (
    !investor ||
    !date
  ) {
    return 0;
  }

  const targetDate =
    parseDateOnly(date);

  if (!targetDate) {
    return 0;
  }


  /* -----------------------------------------
     INITIAL FULE
  ----------------------------------------- */

  const initialFule =
    toNumber(
      investor?.initial?.fule
    );

  const initialDate =
    getEffectiveDate(
      investor?.startDate
    );

  let effectiveFule = 0;


  if (
    initialDate &&
    targetDate >=
      parseDateOnly(initialDate)
  ) {
    effectiveFule +=
      initialFule;
  }


  /* -----------------------------------------
     ADDITIONAL FULE
  ----------------------------------------- */

  const transactions =
    Array.isArray(
      investor?.transactions
    )
      ? investor.transactions
      : [];


  for (
    const transaction
    of transactions
  ) {

    if (
      transaction?.type !==
      "FULE_ADD"
    ) {
      continue;
    }


    const transactionDate =
      transaction?.date;

    if (!transactionDate) {
      continue;
    }


    const effectiveDate =
      getEffectiveDate(
        transactionDate
      );

    if (!effectiveDate) {
      continue;
    }


    if (
      targetDate >=
      parseDateOnly(effectiveDate)
    ) {

      effectiveFule +=
        toNumber(
          transaction?.amount
        );

    }

  }


  return effectiveFule;
}


/*
 * Calculate PI FULE amount which is effective
 * on a particular date.
 */

export function getEffectivePiFule(
  investor,
  date
) {
  if (
    !investor ||
    !date
  ) {
    return 0;
  }

  const targetDate =
    parseDateOnly(date);

  if (!targetDate) {
    return 0;
  }


  /* -----------------------------------------
     INITIAL PI FULE
  ----------------------------------------- */

  const initialPiFule =
    toNumber(
      investor?.initial?.piFule
    );

  const initialDate =
    getEffectiveDate(
      investor?.startDate
    );

  let effectivePiFule = 0;


  if (
    initialDate &&
    targetDate >=
      parseDateOnly(initialDate)
  ) {

    effectivePiFule +=
      initialPiFule;

  }


  /* -----------------------------------------
     ADDITIONAL PI FULE
  ----------------------------------------- */

  const transactions =
    Array.isArray(
      investor?.transactions
    )
      ? investor.transactions
      : [];


  for (
    const transaction
    of transactions
  ) {

    if (
      transaction?.type !==
      "PI_FULE_ADD"
    ) {
      continue;
    }


    const transactionDate =
      transaction?.date;

    if (!transactionDate) {
      continue;
    }


    const effectiveDate =
      getEffectiveDate(
        transactionDate
      );

    if (!effectiveDate) {
      continue;
    }


    if (
      targetDate >=
      parseDateOnly(effectiveDate)
    ) {

      effectivePiFule +=
        toNumber(
          transaction?.amount
        );

    }

  }


  return effectivePiFule;
}


/* =========================================================
   DAILY EARNING
========================================================= */

/*
 * Calculate earning for ONE investor
 * for ONE date.
 */

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


  /*
   * APR
   *
   * FULE × daily rate × 70%
   */

  const apr =
    fule *
    dailyRate *
    0.70;


  /*
   * PI
   *
   * PI FULE × daily rate × 3%
   */

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

/*
 * Calculate every day for one investor.
 *
 * rates:
 *
 * [
 *   {
 *     date: "2026-09-27",
 *     rate: 0.15
 *   }
 * ]
 */

export function calculateInvestorDailyEarnings(
  investor,
  rates = [],
  endDate = getTodayDate()
) {

  if (!investor) {
    return [];
  }


  const rateMap =
    new Map();


  for (
    const rate
    of rates
  ) {

    if (
      !rate?.date
    ) {
      continue;
    }


    rateMap.set(
      rate.date,
      toNumber(
        rate.rate
      )
    );

  }


  /*
   * Daily calculation starts from
   * initial investment date + 2 days.
   */

  const startDate =
    getEffectiveDate(
      investor?.startDate
    );


  if (!startDate) {
    return [];
  }


  const dates =
    getDateRange(
      startDate,
      endDate
    );


  return dates.map(
    (date) => {

      const rate =
        rateMap.get(
          date
        ) ?? 0;


      return calculateDailyEarning(
        investor,
        rate,
        date
      );

    }
  );
}


/* =========================================================
   WITHDRAWAL
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

  const liquidity =
    toNumber(
      investor?.initial?.liquidity
    );


  let fule =
    toNumber(
      investor?.initial?.fule
    );


  let piFule =
    toNumber(
      investor?.initial?.piFule
    );


  const transactions =
    Array.isArray(
      investor?.transactions
    )
      ? investor.transactions
      : [];


  for (
    const transaction
    of transactions
  ) {

    const amount =
      toNumber(
        transaction?.amount
      );


    if (
      transaction?.type ===
      "FULE_ADD"
    ) {

      fule += amount;

    }


    if (
      transaction?.type ===
      "PI_FULE_ADD"
    ) {

      piFule += amount;

    }

  }


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
     WITHDRAWAL
  ----------------------------------------- */

  const totalEarnWithdrawn =
    calculateTotalWithdrawn(
      investor
    );


  /* -----------------------------------------
     AVAILABLE EARN
  ----------------------------------------- */

  const availableEarn =
    Math.max(
      0,
      totalEarn -
        totalEarnWithdrawn
    );


  return {

    /*
     * Static investment values
     */

    liquidity,

    fule,
    piFule,


    /*
     * Earnings
     */

    apr,
    pi,

    totalEarn,

    grossEarn:
      totalEarn,


    /*
     * Withdrawal
     */

    totalEarnWithdrawn,


    /*
     * Remaining earnings
     */

    availableEarn,


    /*
     * Aliases for summary components
     */

    total:
      totalEarn,

    balance:
      availableEarn,


    /*
     * Daily breakdown
     */

    dailyEarnings,

  };

}


/* =========================================================
   RATE-WISE CALCULATION
========================================================= */

/*
 * Used by Rate List.
 *
 * Returns:
 *
 * {
 *   date,
 *   rate,
 *   apr,
 *   pi,
 *   total
 * }
 *
 * across all investors.
 */

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

/*
 * Creates rate-wise calculations for all saved rates.
 *
 * Important:
 * Rates are GLOBAL.
 * Therefore every investor uses the same rate
 * on the same date.
 */

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

    availableEarn,

    total:
      totalEarn,

    balance:
      availableEarn,

  };

}