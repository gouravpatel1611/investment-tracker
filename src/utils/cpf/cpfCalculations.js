import {
  getQuarterForMonth,
} from "./cpfHelpers";

/**
 * ==================================================
 * FINANCIAL YEAR MONTHS
 * ==================================================
 *
 * Example:
 * 2026-27
 *
 * Apr 2026 → Mar 2027
 */
export function getFinancialYearMonths(
  financialYear
) {
  const [startYear] = String(
    financialYear
  )
    .split("-")
    .map(Number);

  return Array.from(
    { length: 12 },
    (_, index) => {
      const monthOffset =
        index + 3;

      const date = new Date(
        startYear,
        monthOffset,
        1
      );

      const year =
        date.getFullYear();

      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      return {
        index,

        date: `${year}-${month}-01`,

        month:
          date.getMonth(),

        year,

        quarter:
          getQuarterForMonth(
            date.getMonth()
          ),
      };
    }
  );
}

/**
 * ==================================================
 * CURRENT MONTH INDEX
 * ==================================================
 *
 * Current month FY ke andar kitne months
 * complete/active hain.
 *
 * Apr 2026 → index 0
 * May 2026 → index 1
 * ...
 * Sep 2026 → index 5
 *
 * Current month bhi include hoga.
 *
 * Agar FY future hai:
 * return -1
 *
 * Agar FY past hai:
 * return 11
 */
export function getCurrentFinancialYearMonthIndex(
  financialYear
) {
  const months =
    getFinancialYearMonths(
      financialYear
    );

  const today =
    new Date();

  const currentYear =
    today.getFullYear();

  const currentMonth =
    today.getMonth();

  const currentDateValue =
    currentYear * 12 +
    currentMonth;

  const firstMonth =
    months[0];

  const firstMonthValue =
    firstMonth.year * 12 +
    firstMonth.month;

  const lastMonth =
    months[11];

  const lastMonthValue =
    lastMonth.year * 12 +
    lastMonth.month;

  if (
    currentDateValue <
    firstMonthValue
  ) {
    return -1;
  }

  if (
    currentDateValue >
    lastMonthValue
  ) {
    return 11;
  }

  return (
    currentDateValue -
    firstMonthValue
  );
}

/**
 * ==================================================
 * AVERAGE INTEREST RATE
 * ==================================================
 *
 * Sirf card par display ke liye.
 *
 * Actual calculation mein average rate
 * use nahi hota.
 */
export function calculateAverageInterestRate(
  interestRates = {}
) {
  const rates = [
    Number(
      interestRates.Q1
    ) || 0,

    Number(
      interestRates.Q2
    ) || 0,

    Number(
      interestRates.Q3
    ) || 0,

    Number(
      interestRates.Q4
    ) || 0,
  ];

  return (
    rates.reduce(
      (sum, rate) =>
        sum + rate,
      0
    ) / 4
  );
}

/**
 * ==================================================
 * OPENING BALANCE INTEREST
 * ==================================================
 *
 * Full FY interest:
 *
 * Q1 = Apr-Jun
 * Q2 = Jul-Sep
 * Q3 = Oct-Dec
 * Q4 = Jan-Mar
 *
 * Formula:
 *
 * P × R × T / 1200
 */
export function calculateOpeningBalanceInterest({
  openingBalance = 0,
  interestRates = {},
}) {
  const balance =
    Number(openingBalance) || 0;

  const quarterInterest = {};

  let total = 0;

  [
    "Q1",
    "Q2",
    "Q3",
    "Q4",
  ].forEach((quarter) => {
    const rate =
      Number(
        interestRates[
          quarter
        ]
      ) || 0;

    const interest =
      (balance *
        rate *
        3) /
      1200;

    quarterInterest[
      quarter
    ] = interest;

    total += interest;
  });

  return {
    quarterInterest,

    total,
  };
}

/**
 * ==================================================
 * OPENING BALANCE CURRENT INTEREST
 * ==================================================
 *
 * Sirf current month tak.
 *
 * Example:
 *
 * Apr-Sep = 6 months
 *
 * Har month ke liye us month ka
 * applicable quarterly rate use hoga.
 */
export function calculateCurrentOpeningBalanceInterest({
  openingBalance = 0,
  interestRates = {},
  financialYear,
}) {
  const balance =
    Number(openingBalance) || 0;

  const months =
    getFinancialYearMonths(
      financialYear
    );

  const currentIndex =
    getCurrentFinancialYearMonthIndex(
      financialYear
    );

  if (
    currentIndex < 0
  ) {
    return {
      total: 0,
      monthlyDetails: [],
    };
  }

  let total = 0;

  const monthlyDetails =
    months
      .slice(
        0,
        currentIndex + 1
      )
      .map((month) => {
        const rate =
          Number(
            interestRates[
              month.quarter
            ]
          ) || 0;

        const interest =
          (balance *
            rate) /
          1200;

        total += interest;

        return {
          date: month.date,

          quarter:
            month.quarter,

          rate,

          interest,
        };
      });

  return {
    total,

    monthlyDetails,
  };
}

/**
 * ==================================================
 * OWN CPF - DEPOSIT INTEREST
 * ==================================================
 *
 * CURRENT VALUE / CURRENT PROFIT RULE
 *
 * Monthly deposit 1st date ko hota hai.
 *
 * Har deposit:
 *
 * Deposit month se
 * current month tak interest kamata hai.
 *
 * Interest ke liye:
 *
 * Jis month ka interest calculate ho raha hai,
 * us month ka applicable quarterly rate use hoga.
 *
 * Example:
 *
 * Apr deposit:
 * Apr + May + Jun + Jul + Aug + Sep
 *
 * May deposit:
 * May + Jun + Jul + Aug + Sep
 *
 * Sep deposit:
 * Sep
 */
export function calculateDepositInterest({
  monthlyDeposit = 0,
  interestRates = {},
  financialYear,
}) {
  const deposit =
    Number(monthlyDeposit) || 0;

  const months =
    getFinancialYearMonths(
      financialYear
    );

  const currentIndex =
    getCurrentFinancialYearMonthIndex(
      financialYear
    );

  /**
   * Future FY
   */
  if (
    currentIndex < 0
  ) {
    return {
      monthlyDetails: [],
      totalInterest: 0,
    };
  }

  let totalInterest = 0;

  const monthlyDetails =
    months
      .slice(
        0,
        currentIndex + 1
      )
      .map(
        (
          depositMonth,
          depositIndex
        ) => {
          let depositInterest = 0;

          /**
           * Deposit month se current month tak
           * interest calculate karo.
           */
          for (
            let interestIndex =
              depositIndex;
            interestIndex <=
            currentIndex;
            interestIndex++
          ) {
            const interestMonth =
              months[
                interestIndex
              ];

            const rate =
              Number(
                interestRates[
                  interestMonth.quarter
                ]
              ) || 0;

            const interest =
              (deposit *
                rate) /
              1200;

            depositInterest +=
              interest;
          }

          totalInterest +=
            depositInterest;

          return {
            date:
              depositMonth.date,

            quarter:
              depositMonth.quarter,

            /**
             * Deposit month ka rate
             * information/display ke liye.
             *
             * Actual interest mein
             * har calculation month ka rate
             * use hua hai.
             */
            rate:
              Number(
                interestRates[
                  depositMonth.quarter
                ]
              ) || 0,

            deposit,

            months:
              currentIndex -
              depositIndex +
              1,

            interest:
              depositInterest,
          };
        }
      );

  return {
    monthlyDetails,

    totalInterest,
  };
}

/**
 * ==================================================
 * OWN CPF CALCULATION
 * ==================================================
 *
 * Existing fields preserve kiye gaye hain
 * taaki cards break na hon.
 *
 * New fields:
 *
 * currentInvested
 * currentProfit
 * currentValue
 *
 * Current Profit =
 *
 * Opening Balance Interest
 * +
 * Own Deposit Interest
 *
 * Current Invested =
 *
 * Opening Balance
 * +
 * Current FY deposits
 *
 * Current Value =
 *
 * Current Invested
 * +
 * Current Profit
 */
export function calculateCPF({
  openingBalance = 0,
  monthlyDeposit = 0,
  interestRates = {},
  financialYear,
}) {
  const opening =
    Number(openingBalance) || 0;

  const deposit =
    Number(monthlyDeposit) || 0;

  /**
   * Full FY opening interest
   *
   * Existing calculation preserve.
   */
  const openingInterest =
    calculateOpeningBalanceInterest({
      openingBalance:
        opening,

      interestRates,
    });

  /**
   * Current month tak opening interest.
   */
  const currentOpeningInterest =
    calculateCurrentOpeningBalanceInterest({
      openingBalance:
        opening,

      interestRates,

      financialYear,
    });

  /**
   * Current month tak deposit interest.
   */
  const depositInterest =
    calculateDepositInterest({
      monthlyDeposit:
        deposit,

      interestRates,

      financialYear,
    });

  /**
   * Full annual deposit.
   *
   * Existing field preserve.
   */
  const totalDeposit =
    deposit * 12;

  /**
   * Current FY months.
   */
  const currentIndex =
    getCurrentFinancialYearMonthIndex(
      financialYear
    );

  const currentMonthCount =
    currentIndex >= 0
      ? currentIndex + 1
      : 0;

  /**
   * Current deposits.
   *
   * Example:
   *
   * Apr-Sep = 6 deposits
   */
  const currentDeposit =
    deposit *
    currentMonthCount;

  /**
   * Full FY total interest.
   *
   * Existing field preserve.
   */
  const totalInterest =
    openingInterest.total +
    depositInterest.totalInterest;

  /**
   * Existing full FY closing balance.
   *
   * Isko remove nahi kiya gaya hai
   * taaki existing cards break na hon.
   */
  const closingBalance =
    opening +
    totalDeposit +
    totalInterest;

  /**
   * ==================================================
   * CURRENT VALUE
   * ==================================================
   */

  const currentInvested =
    opening +
    currentDeposit;

  const currentProfit =
    currentOpeningInterest.total +
    depositInterest.totalInterest;

  const currentValue =
    currentInvested +
    currentProfit;

  return {
    /**
     * Existing fields
     */
    openingBalance:
      opening,

    monthlyDeposit:
      deposit,

    totalDeposit,

    interestOnOpeningBalance:
      openingInterest.total,

    openingQuarterInterest:
      openingInterest.quarterInterest,

    interestOnDeposits:
      depositInterest.totalInterest,

    monthlyDetails:
      depositInterest.monthlyDetails,

    totalInterest,

    closingBalance,

    /**
     * ==================================================
     * NEW CURRENT-VALUE FIELDS
     * ==================================================
     */

    currentMonthCount,

    currentDeposit,

    currentInvested,

    currentOpeningInterest:
      currentOpeningInterest.total,

    currentDepositInterest:
      depositInterest.totalInterest,

    currentProfit,

    currentValue,
  };
}

/**
 * ==================================================
 * NVS CPF CALCULATION
 * ==================================================
 *
 * NVS contribution par interest nahi.
 *
 * Basic Pay × 10%
 * = Monthly Contribution
 *
 * Profit:
 *
 * Sirf opening balance ka
 * current month tak interest.
 *
 * NVS deposit interest = 0
 */
export function calculateNVSCPF({
  openingBalance = 0,
  basicPay = 0,
  interestRates = {},
  financialYear,
}) {
  const opening =
    Number(openingBalance) || 0;

  const pay =
    Number(basicPay) || 0;

  /**
   * Monthly NVS contribution
   */
  const monthlyContribution =
    pay * 0.10;

  /**
   * Full FY contribution
   */
  const totalDeposit =
    monthlyContribution * 12;

  /**
   * Full FY opening interest.
   *
   * Existing field preserve.
   */
  const openingInterest =
    calculateOpeningBalanceInterest({
      openingBalance:
        opening,

      interestRates,
    });

  /**
   * Current month tak opening interest.
   */
  const currentOpeningInterest =
    calculateCurrentOpeningBalanceInterest({
      openingBalance:
        opening,

      interestRates,

      financialYear,
    });

  /**
   * NVS deposit par interest ZERO.
   */
  const interestOnDeposits =
    0;

  /**
   * Full FY total interest.
   */
  const totalInterest =
    openingInterest.total;

  /**
   * Existing full FY closing balance.
   */
  const closingBalance =
    opening +
    totalDeposit +
    totalInterest;

  /**
   * Current FY month count.
   */
  const currentIndex =
    getCurrentFinancialYearMonthIndex(
      financialYear
    );

  const currentMonthCount =
    currentIndex >= 0
      ? currentIndex + 1
      : 0;

  /**
   * Current NVS contribution.
   */
  const currentDeposit =
    monthlyContribution *
    currentMonthCount;

  /**
   * ==================================================
   * CURRENT VALUE
   * ==================================================
   *
   * NVS profit mein
   * deposit interest include nahi hai.
   */
  const currentInvested =
    opening +
    currentDeposit;

  const currentProfit =
    currentOpeningInterest.total;

  const currentValue =
    currentInvested +
    currentProfit;

  /**
   * Monthly details
   *
   * Existing structure preserve.
   */
  const months =
    getFinancialYearMonths(
      financialYear
    );

  const monthlyDetails =
    currentIndex >= 0
      ? months
          .slice(
            0,
            currentIndex + 1
          )
          .map(
            (month) => ({
              date:
                month.date,

              quarter:
                month.quarter,

              rate:
                Number(
                  interestRates[
                    month.quarter
                  ]
                ) || 0,

              deposit:
                monthlyContribution,

              months: 0,

              interest: 0,
            })
          )
      : [];

  return {
    /**
     * Existing fields
     */
    openingBalance:
      opening,

    basicPay:
      pay,

    monthlyDeposit:
      monthlyContribution,

    contribution:
      monthlyContribution,

    totalDeposit,

    interestOnOpeningBalance:
      openingInterest.total,

    openingQuarterInterest:
      openingInterest.quarterInterest,

    interestOnDeposits,

    monthlyDetails,

    totalInterest,

    closingBalance,

    /**
     * ==================================================
     * NEW CURRENT-VALUE FIELDS
     * ==================================================
     */

    currentMonthCount,

    currentDeposit,

    currentInvested,

    currentOpeningInterest:
      currentOpeningInterest.total,

    currentDepositInterest:
      0,

    currentProfit,

    currentValue,
  };
}

/**
 * ==================================================
 * CPF SUMMARY
 * ==================================================
 *
 * Summary Firebase mein separately
 * save nahi hoti.
 *
 * Own + NVS calculation se
 * automatically calculate hoti hai.
 *
 * Existing fields preserve:
 *
 * ownClosingBalance
 * nvsClosingBalance
 * totalClosingBalance
 *
 * New fields:
 *
 * ownCurrentValue
 * nvsCurrentValue
 * totalCurrentValue
 *
 * ownProfit
 * nvsProfit
 * totalProfit
 */
export function calculateCPFSummary({
  ownCPF = {},
  nvsCPF = {},
}) {
  /**
   * Existing closing values
   */
  const ownClosing =
    Number(
      ownCPF.closingBalance
    ) || 0;

  const nvsClosing =
    Number(
      nvsCPF.closingBalance
    ) || 0;

  /**
   * New current values
   */
  const ownCurrentValue =
    Number(
      ownCPF.currentValue
    ) || 0;

  const nvsCurrentValue =
    Number(
      nvsCPF.currentValue
    ) || 0;

  /**
   * New profit
   */
  const ownProfit =
    Number(
      ownCPF.currentProfit
    ) || 0;

  const nvsProfit =
    Number(
      nvsCPF.currentProfit
    ) || 0;

  return {
    /**
     * ==================================================
     * OLD FIELDS - PRESERVED
     * ==================================================
     */

    ownClosingBalance:
      ownClosing,

    nvsClosingBalance:
      nvsClosing,

    totalClosingBalance:
      ownClosing +
      nvsClosing,

    /**
     * ==================================================
     * NEW SUMMARY FIELDS
     * ==================================================
     */

    ownCurrentValue,

    nvsCurrentValue,

    totalCurrentValue:
      ownCurrentValue +
      nvsCurrentValue,

    ownProfit,

    nvsProfit,

    totalProfit:
      ownProfit +
      nvsProfit,
  };
}