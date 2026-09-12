import {
  getQuarterForMonth,
} from "./cpfHelpers";

/**
 * Financial Year ke 12 months
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
      const monthOffset = index + 3;

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
 * Average Interest Rate
 *
 * Sirf card par display ke liye.
 *
 * Actual calculation mein
 * average rate use nahi hota.
 */
export function calculateAverageInterestRate(
  interestRates = {}
) {
  const rates = [
    Number(interestRates.Q1) || 0,
    Number(interestRates.Q2) || 0,
    Number(interestRates.Q3) || 0,
    Number(interestRates.Q4) || 0,
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
 * Opening Balance Interest
 *
 * Opening balance poore financial year
 * ke liye quarter-wise interest kamata hai.
 *
 * Q1 = Apr-Jun = 3 months
 * Q2 = Jul-Sep = 3 months
 * Q3 = Oct-Dec = 3 months
 * Q4 = Jan-Mar = 3 months
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
        interestRates[quarter]
      ) || 0;

    const interest =
      (balance * rate * 3) /
      1200;

    quarterInterest[quarter] =
      interest;

    total += interest;
  });

  return {
    quarterInterest,

    total,
  };
}

/**
 * ==================================================
 * OWN CPF - DEPOSIT INTEREST
 * ==================================================
 *
 * FINAL RULE A
 *
 * Deposit jis quarter mein hua,
 * usi quarter ka rate us deposit ke
 * poore remaining period par lagega.
 *
 * Example:
 *
 * 01-Apr → Q1 rate × 12 months
 * 01-May → Q1 rate × 11 months
 * 01-Jun → Q1 rate × 10 months
 *
 * 01-Jul → Q2 rate × 9 months
 * 01-Aug → Q2 rate × 8 months
 * 01-Sep → Q2 rate × 7 months
 *
 * 01-Oct → Q3 rate × 6 months
 * 01-Nov → Q3 rate × 5 months
 * 01-Dec → Q3 rate × 4 months
 *
 * 01-Jan → Q4 rate × 3 months
 * 01-Feb → Q4 rate × 2 months
 * 01-Mar → Q4 rate × 1 month
 *
 * IMPORTANT:
 *
 * May ka deposit Q1 mein hua.
 * Isliye May deposit ke remaining
 * 11 months par Q1 rate hi lagega.
 *
 * Deposit ko Q1/Q2/Q3/Q4 mein split
 * nahi kiya jayega.
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

  let totalInterest = 0;

  const monthlyDetails =
    months.map(
      (month, index) => {
        /**
         * Apr = 12
         * May = 11
         * Jun = 10
         * ...
         * Mar = 1
         */
        const remainingMonths =
          12 - index;

        /**
         * Deposit jis quarter mein hua
         * us quarter ka rate.
         */
        const rate =
          Number(
            interestRates[
              month.quarter
            ]
          ) || 0;

        /**
         * Rule A
         */
        const interest =
          (deposit *
            rate *
            remainingMonths) /
          1200;

        totalInterest += interest;

        return {
          date: month.date,

          quarter:
            month.quarter,

          rate,

          deposit,

          months:
            remainingMonths,

          interest,
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
 * Own CPF:
 *
 * Opening Balance
 * + Annual Contribution
 * + Opening Balance Interest
 * + Deposit Interest
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
   * Opening balance interest
   */
  const openingInterest =
    calculateOpeningBalanceInterest({
      openingBalance: opening,

      interestRates,
    });

  /**
   * Monthly deposit interest
   *
   * Rule A
   */
  const depositInterest =
    calculateDepositInterest({
      monthlyDeposit: deposit,

      interestRates,

      financialYear,
    });

  /**
   * Annual deposit
   */
  const totalDeposit =
    deposit * 12;

  /**
   * Total interest
   */
  const totalInterest =
    openingInterest.total +
    depositInterest.totalInterest;

  /**
   * Closing balance
   */
  const closingBalance =
    opening +
    totalDeposit +
    totalInterest;

  return {
    openingBalance: opening,

    monthlyDeposit: deposit,

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
  };
}

/**
 * ==================================================
 * NVS CPF CALCULATION
 * ==================================================
 *
 * IMPORTANT:
 *
 * NVS contribution par koi interest nahi.
 *
 * Sirf opening balance par
 * quarterly interest lagega.
 *
 * Basic Pay × 10% = Monthly Contribution
 *
 * Monthly Contribution × 12
 * = Annual Contribution
 *
 * Closing:
 *
 * Opening Balance
 * + Annual Contribution
 * + Opening Balance Interest
 *
 * Deposit Interest = 0
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
   * NVS contribution
   *
   * Basic Pay ka 10%
   */
  const monthlyContribution =
    pay * 0.10;

  /**
   * Annual contribution
   */
  const totalDeposit =
    monthlyContribution * 12;

  /**
   * Sirf opening balance par
   * interest calculate hoga.
   */
  const openingInterest =
    calculateOpeningBalanceInterest({
      openingBalance: opening,

      interestRates,
    });

  /**
   * NVS mein contribution/deposit
   * par interest ZERO hai.
   */
  const interestOnDeposits = 0;

  /**
   * Total interest
   */
  const totalInterest =
    openingInterest.total;

  /**
   * Closing balance
   */
  const closingBalance =
    opening +
    totalDeposit +
    totalInterest;

  /**
   * NVS monthlyDetails mein
   * deposit interest ZERO rakha gaya hai.
   *
   * Isse card/table future mein
   * monthly contribution dikha sakta hai,
   * lekin interest 0 rahega.
   */
  const months =
    getFinancialYearMonths(
      financialYear
    );

  const monthlyDetails =
    months.map(
      (month) => ({
        date: month.date,

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
    );

  return {
    openingBalance: opening,

    basicPay: pay,

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
 */
export function calculateCPFSummary({
  ownCPF = {},
  nvsCPF = {},
}) {
  const ownClosing =
    Number(
      ownCPF.closingBalance
    ) || 0;

  const nvsClosing =
    Number(
      nvsCPF.closingBalance
    ) || 0;

  return {
    ownClosingBalance:
      ownClosing,

    nvsClosingBalance:
      nvsClosing,

    totalClosingBalance:
      ownClosing +
      nvsClosing,
  };
}