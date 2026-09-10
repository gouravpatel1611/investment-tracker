function toNumber(value) {
  return Number(value) || 0;
}


// --------------------------------------------------
// Date Helpers
// --------------------------------------------------

function toDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
}


function addMonths(date, months) {
  const result = new Date(date);

  result.setMonth(
    result.getMonth() + months
  );

  return result;
}


// --------------------------------------------------
// Annual Interest
// --------------------------------------------------

export function calculateAnnualInterest(bond) {
  const faceValue =
    toNumber(bond.faceValue);

  const quantity =
    toNumber(bond.quantity);

  const couponRate =
    toNumber(bond.couponRate);

  return (
    faceValue *
    quantity *
    (couponRate / 100)
  );
}


// --------------------------------------------------
// Interest Per Payment
// --------------------------------------------------

export function calculateInterestPerPayment(bond) {
  const annualInterest =
    calculateAnnualInterest(bond);

  const frequency =
    String(bond.couponFrequency || "")
      .toLowerCase()
      .trim();

  switch (frequency) {
    case "monthly":
      return annualInterest / 12;

    case "quarterly":
      return annualInterest / 4;

    case "half-yearly":
    case "half yearly":
    case "semi-annually":
    case "semi annually":
      return annualInterest / 2;

    case "yearly":
    case "annual":
    case "annually":
      return annualInterest;

    default:
      return 0;
  }
}


// --------------------------------------------------
// Payments Per Year
// --------------------------------------------------

export function getPaymentsPerYear(
  couponFrequency
) {
  const frequency =
    String(couponFrequency || "")
      .toLowerCase()
      .trim();

  switch (frequency) {
    case "monthly":
      return 12;

    case "quarterly":
      return 4;

    case "half-yearly":
    case "half yearly":
    case "semi-annually":
    case "semi annually":
      return 2;

    case "yearly":
    case "annual":
    case "annually":
      return 1;

    default:
      return 0;
  }
}


// --------------------------------------------------
// Days Between Dates
// --------------------------------------------------

export function getDaysBetween(
  startDate,
  endDate
) {
  const start = toDate(startDate);
  const end = toDate(endDate);

  if (!start || !end) {
    return 0;
  }

  const difference =
    end.getTime() -
    start.getTime();

  return Math.max(
    0,
    Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    )
  );
}


// --------------------------------------------------
// Purchase Value
// Face Value × Quantity
// --------------------------------------------------

export function calculateBondPurchaseValue(
  bond
) {
  const faceValue =
    toNumber(bond.faceValue);

  const quantity =
    toNumber(bond.quantity);

  return faceValue * quantity;
}


// --------------------------------------------------
// Interest For Bond
//
// Example:
//
// First Payout = 09-Oct-2025
//
// Period 1:
// 09-Sep-2025 → 08-Oct-2025
//
// Period 2:
// 09-Oct-2025 → 08-Nov-2025
//
// Period 3:
// 09-Nov-2025 → 08-Dec-2025
//
// Current incomplete period:
// Start date → Current Date
// --------------------------------------------------

export function calculateExpectedInterest(
  bond,
  asOfDate = new Date()
) {
  const purchaseDate =
    toDate(bond.purchaseDate);

  const firstPayoutDate =
    toDate(bond.firstPayoutDate);

  const maturityDate =
    toDate(bond.maturityDate);

  const currentDate =
    toDate(asOfDate);

  if (
    !purchaseDate ||
    !firstPayoutDate ||
    !currentDate
  ) {
    return 0;
  }

  const annualInterest =
    calculateAnnualInterest(bond);

  if (annualInterest <= 0) {
    return 0;
  }

  /*
    Interest calculation
    purchase date se pehle nahi.
  */

  if (currentDate <= purchaseDate) {
    return 0;
  }

  /*
    Maturity ke baad interest
    maturity date tak hi.
  */

  let calculationEnd =
    currentDate;

  if (
    maturityDate &&
    calculationEnd > maturityDate
  ) {
    calculationEnd = maturityDate;
  }

  /*
    First interest period:

    First Payout - 1 Month

    Example:
    09-Oct-2025
    ↓
    09-Sep-2025
  */

  let periodStart =
    addMonths(
      firstPayoutDate,
      -1
    );

  /*
    Agar purchase date first
    period ke beech me hai,
    to interest purchase date
    se start hoga.
  */

  if (purchaseDate > periodStart) {
    periodStart = purchaseDate;
  }

  /*
    Purchase date future me hai
    to interest nahi.
  */

  if (periodStart >= calculationEnd) {
    return 0;
  }

  const dailyInterest =
    annualInterest / 365;

  let totalInterest = 0;

  while (
    periodStart < calculationEnd
  ) {
    /*
      Monthly period ka end

      09-Sep → 09-Oct

      Actual interest:
      09-Sep → 08-Oct
    */

    const normalPeriodEnd =
      addMonths(
        periodStart,
        1
      );

    let periodEnd =
      normalPeriodEnd;

    /*
      Current month incomplete hai
      to current date tak calculate.
    */

    if (
      periodEnd > calculationEnd
    ) {
      periodEnd = calculationEnd;
    }

    const days =
      getDaysBetween(
        periodStart,
        periodEnd
      );

    totalInterest +=
      dailyInterest * days;

    /*
      Current incomplete period
      complete nahi hua.
    */

    if (
      normalPeriodEnd >
      calculationEnd
    ) {
      break;
    }

    /*
      Next interest period.
    */

    periodStart =
      normalPeriodEnd;
  }

  return totalInterest;
}


// --------------------------------------------------
// Interest Details
// --------------------------------------------------

export function calculateBondInterestDetails(
  bond,
  asOfDate = new Date()
) {
  const purchaseDate =
    toDate(bond.purchaseDate);

  const firstPayoutDate =
    toDate(bond.firstPayoutDate);

  const maturityDate =
    toDate(bond.maturityDate);

  const currentDate =
    toDate(asOfDate);

  if (
    !purchaseDate ||
    !firstPayoutDate ||
    !currentDate
  ) {
    return {
      totalInterest: 0,
      completedInterest: 0,
      currentInterest: 0,
    };
  }

  const annualInterest =
    calculateAnnualInterest(bond);

  if (annualInterest <= 0) {
    return {
      totalInterest: 0,
      completedInterest: 0,
      currentInterest: 0,
    };
  }

  if (currentDate <= purchaseDate) {
    return {
      totalInterest: 0,
      completedInterest: 0,
      currentInterest: 0,
    };
  }

  let calculationEnd =
    currentDate;

  if (
    maturityDate &&
    calculationEnd > maturityDate
  ) {
    calculationEnd = maturityDate;
  }

  let periodStart =
    addMonths(
      firstPayoutDate,
      -1
    );

  if (purchaseDate > periodStart) {
    periodStart = purchaseDate;
  }

  const dailyInterest =
    annualInterest / 365;

  let completedInterest = 0;
  let currentInterest = 0;

  while (
    periodStart < calculationEnd
  ) {
    const normalPeriodEnd =
      addMonths(
        periodStart,
        1
      );

    let periodEnd =
      normalPeriodEnd;

    const isCompletedPeriod =
      normalPeriodEnd <=
      calculationEnd;

    if (!isCompletedPeriod) {
      periodEnd = calculationEnd;
    }

    const days =
      getDaysBetween(
        periodStart,
        periodEnd
      );

    const interest =
      dailyInterest * days;

    if (isCompletedPeriod) {
      completedInterest +=
        interest;
    } else {
      currentInterest +=
        interest;
    }

    if (!isCompletedPeriod) {
      break;
    }

    periodStart =
      normalPeriodEnd;
  }

  return {
    totalInterest:
      completedInterest +
      currentInterest,

    completedInterest,

    currentInterest,
  };
}


// --------------------------------------------------
// Pending Interest
// --------------------------------------------------

export function calculatePendingInterest(
  bond,
  receivedInterest = 0,
  asOfDate = new Date()
) {
  const expectedInterest =
    calculateExpectedInterest(
      bond,
      asOfDate
    );

  const received =
    toNumber(receivedInterest);

  return Math.max(
    0,
    expectedInterest - received
  );
}


// --------------------------------------------------
// Current Value
// --------------------------------------------------

export function calculateBondCurrentValue(
  bond
) {
  /*
    Abhi current value stored nahi hai,
    isliye Face Value × Quantity
    ko principal/current base value
    maana jayega.
  */

  return calculateBondPurchaseValue(
    bond
  );
}


// --------------------------------------------------
// Profit
// --------------------------------------------------

export function calculateBondProfit(
  bond
) {
  /*
    Abhi market/current value
    available nahi hai.

    Isliye principal profit = 0.
    Interest ko profit me mix nahi
    kar rahe hain.
  */

  return 0;
}


// --------------------------------------------------
// Profit Percentage
// --------------------------------------------------

export function calculateBondProfitPercent(
  bond
) {
  return 0;
}