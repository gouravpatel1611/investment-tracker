import { getSGBTransactions } from "../firebase/sgbService";
import { findSGBBySeriesCode } from "../api/sgbService";

// ==========================================================
// HELPERS
// ==========================================================

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const round = (value) => {
  return Number(Number(value).toFixed(2));
};

// ==========================================================
// EMPTY SUMMARY
// ==========================================================

const emptySummary = {
  seriesCount: 0,
  units: 0,
  purchaseRate: 0,
  purchaseValue: 0,
  currentRate: 0,
  currentValue: 0,
  profit: 0,
  interest: 0,
  gain: 0,
  totalGainPercent: 0,
};

// ==========================================================
// INTEREST CALCULATION
// ==========================================================
//
// SGB Interest:
// 2.5% yearly
// Credit every 6 months
//
// IMPORTANT:
// Interest calculation ke liye purchase rate me
// ₹50 per gram add kiya ja raha hai.
//
// Example:
// Purchase Rate = ₹5147
// Interest Rate = ₹5197
//
// Actual Purchase Value change nahi hoti.
// ₹50 sirf interest calculation ke liye add hota hai.
// ==========================================================

const calculateInterest = (
  purchaseValue,
  issueDate,
  units
) => {
  const amount = toNumber(purchaseValue);
  const gram = toNumber(units);

  if (!amount || !gram || !issueDate) {
    return 0;
  }

  // --------------------------------------------------------
  // Original purchase rate
  // --------------------------------------------------------

  const purchaseRate =
    amount / gram;

  // --------------------------------------------------------
  // Interest calculation rate
  // Purchase Rate + ₹50 per gram
  // --------------------------------------------------------

  const interestRate =
    purchaseRate + 50;

  // --------------------------------------------------------
  // Interest calculation base
  // --------------------------------------------------------

  const interestBase =
    interestRate * gram;

  // --------------------------------------------------------
  // Dates
  // --------------------------------------------------------

  const startDate =
    new Date(`${issueDate}T00:00:00`);

  const today =
    new Date();

  if (
    Number.isNaN(startDate.getTime())
  ) {
    return 0;
  }

  if (today <= startDate) {
    return 0;
  }

  // --------------------------------------------------------
  // Complete 6-month periods
  // --------------------------------------------------------

  let halfYearPeriods =
    (today.getFullYear() -
      startDate.getFullYear()) *
      2 +
    (today.getMonth() -
      startDate.getMonth()) /
      6;

  halfYearPeriods =
    Math.floor(halfYearPeriods);

  // --------------------------------------------------------
  // Exact date check
  // --------------------------------------------------------

  const anniversary =
    new Date(startDate);

  anniversary.setMonth(
    anniversary.getMonth() +
      halfYearPeriods * 6
  );

  if (anniversary > today) {
    halfYearPeriods -= 1;
  }

  if (halfYearPeriods <= 0) {
    return 0;
  }

  // --------------------------------------------------------
  // 2.5% yearly
  // 1.25% every 6 months
  // --------------------------------------------------------

  const halfYearInterest =
    interestBase * 0.025 / 2;

  // --------------------------------------------------------
  // Total Interest
  // --------------------------------------------------------

  return round(
    halfYearInterest *
      halfYearPeriods
  );
};

// ==========================================================
// CALCULATE ONE SGB
// ==========================================================

const calculateSGB = (
  transaction,
  apiData
) => {
  // --------------------------------------------------------
  // Firebase values
  // --------------------------------------------------------

  const units =
    toNumber(transaction.units);

  const purchaseRate =
    toNumber(transaction.purchaseRate);

  const purchaseValue =
    toNumber(transaction.purchaseValue);

  // --------------------------------------------------------
  // Current market rate from API
  // --------------------------------------------------------

  const currentRate =
    toNumber(
      apiData?.currentPrice
    );

  // --------------------------------------------------------
  // Current market value
  // --------------------------------------------------------

  const currentValue =
    units * currentRate;

  // --------------------------------------------------------
  // Market profit
  // --------------------------------------------------------

  const profit =
    currentValue -
    purchaseValue;

  // --------------------------------------------------------
  // Interest received
  // --------------------------------------------------------

  const interest =
    calculateInterest(
      purchaseValue,
      transaction.issueDate,
      units
    );

  // --------------------------------------------------------
  // Total gain
  // --------------------------------------------------------

  const gain =
    profit + interest;

  // --------------------------------------------------------
  // Total gain percentage
  // --------------------------------------------------------

  const totalGainPercent =
    purchaseValue > 0
      ? (gain / purchaseValue) * 100
      : 0;

  // --------------------------------------------------------
  // FINAL DATA FOR CARD
  // --------------------------------------------------------

  return {
    id: transaction.id,

    seriesNo:
      transaction.seriesCode || "",

    units:
      round(units),

    purchaseRate:
      round(purchaseRate),

    purchaseValue:
      round(purchaseValue),

    currentRate:
      round(currentRate),

    currentValue:
      round(currentValue),

    profit:
      round(profit),

    interest:
      round(interest),

    gain:
      round(gain),

    totalGainPercent:
      round(totalGainPercent),

    issueDate:
      transaction.issueDate || "",

    maturityDate:
      transaction.maturityDate || "",
  };
};

// ==========================================================
// CALCULATE SUMMARY
// ==========================================================

const calculateSummary = (
  holdings
) => {
  if (
    !holdings ||
    holdings.length === 0
  ) {
    return {
      ...emptySummary,
    };
  }

  // --------------------------------------------------------
  // Units
  // --------------------------------------------------------

  const units =
    holdings.reduce(
      (total, item) =>
        total +
        toNumber(item.units),
      0
    );

  // --------------------------------------------------------
  // Purchase Value
  // --------------------------------------------------------

  const purchaseValue =
    holdings.reduce(
      (total, item) =>
        total +
        toNumber(
          item.purchaseValue
        ),
      0
    );

  // --------------------------------------------------------
  // Current Value
  // --------------------------------------------------------

  const currentValue =
    holdings.reduce(
      (total, item) =>
        total +
        toNumber(
          item.currentValue
        ),
      0
    );

  // --------------------------------------------------------
  // Profit
  // --------------------------------------------------------

  const profit =
    holdings.reduce(
      (total, item) =>
        total +
        toNumber(item.profit),
      0
    );

  // --------------------------------------------------------
  // Interest
  // --------------------------------------------------------

  const interest =
    holdings.reduce(
      (total, item) =>
        total +
        toNumber(item.interest),
      0
    );

  // --------------------------------------------------------
  // Total Gain
  // --------------------------------------------------------

  const gain =
    holdings.reduce(
      (total, item) =>
        total +
        toNumber(item.gain),
      0
    );

  // --------------------------------------------------------
  // Average Purchase Rate
  // --------------------------------------------------------

  const purchaseRate =
    units > 0
      ? purchaseValue / units
      : 0;

  // --------------------------------------------------------
  // Average Current Rate
  // --------------------------------------------------------

  const currentRate =
    units > 0
      ? currentValue / units
      : 0;

  // --------------------------------------------------------
  // Total Gain %
  // --------------------------------------------------------

  const totalGainPercent =
    purchaseValue > 0
      ? (gain / purchaseValue) * 100
      : 0;

  // --------------------------------------------------------
  // FINAL SUMMARY
  // --------------------------------------------------------

  return {
    seriesCount:
      holdings.length,

    units:
      round(units),

    purchaseRate:
      round(purchaseRate),

    purchaseValue:
      round(purchaseValue),

    currentRate:
      round(currentRate),

    currentValue:
      round(currentValue),

    profit:
      round(profit),

    interest:
      round(interest),

    gain:
      round(gain),

    totalGainPercent:
      round(totalGainPercent),
  };
};

// ==========================================================
// MAIN FUNCTION
// ==========================================================

export const getSGBPortfolio = async () => {
  // --------------------------------------------------------
  // Get transactions from Firebase
  // --------------------------------------------------------

  const transactions =
    await getSGBTransactions();

  // --------------------------------------------------------
  // No data
  // --------------------------------------------------------

  if (
    !transactions ||
    transactions.length === 0
  ) {
    return {
      holdings: [],
      summary: {
        ...emptySummary,
      },
    };
  }

  // --------------------------------------------------------
  // Calculate every SGB
  // --------------------------------------------------------

  const holdings = [];

  for (
    const transaction of transactions
  ) {
    try {
      // Get current market data
      const apiData =
        await findSGBBySeriesCode(
          transaction.seriesCode
        );

      // Calculate final data
      const calculatedSGB =
        calculateSGB(
          transaction,
          apiData
        );

      holdings.push(
        calculatedSGB
      );

    } catch (error) {
      console.error(
        `Failed to fetch SGB: ${transaction.seriesCode}`,
        error
      );

      // API fail hone par bhi holding show hogi
      const calculatedSGB =
        calculateSGB(
          transaction,
          null
        );

      holdings.push(
        calculatedSGB
      );
    }
  }

  // --------------------------------------------------------
  // Summary
  // --------------------------------------------------------

  const summary =
    calculateSummary(
      holdings
    );

  // --------------------------------------------------------
  // Final result
  // --------------------------------------------------------

  return {
    holdings,
    summary,
  };
};

// ==========================================================
// EXPORT HELPERS
// ==========================================================

export {
  calculateSGB,
  calculateSummary,
  calculateInterest,
};