// ==========================================
// NUMBER HELPER
// ==========================================

export function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


// ==========================================
// ROUND
// ==========================================

export function round(value) {
  return Number(
    toNumber(value).toFixed(2)
  );
}


// ==========================================
// FORMAT CURRENCY
// ==========================================

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(
    toNumber(value)
  );
}


// ==========================================
// CALCULATE SGB INTEREST
// ==========================================

export function calculateSGBInterest(
  purchaseValue,
  issueDate,
  units
) {

  const amount =
    toNumber(purchaseValue);

  const gram =
    toNumber(units);


  if (
    !amount ||
    !gram ||
    !issueDate
  ) {
    return 0;
  }


  const purchaseRate =
    amount / gram;


  const interestRate =
    purchaseRate + 50;


  const interestBase =
    interestRate * gram;


  const startDate =
    new Date(
      `${issueDate}T00:00:00`
    );


  const today =
    new Date();


  if (
    Number.isNaN(
      startDate.getTime()
    )
  ) {
    return 0;
  }


  if (
    today <= startDate
  ) {
    return 0;
  }


  let halfYearPeriods =
    (
      today.getFullYear() -
      startDate.getFullYear()
    ) * 2 +
    (
      today.getMonth() -
      startDate.getMonth()
    ) / 6;


  halfYearPeriods =
    Math.floor(
      halfYearPeriods
    );


  const anniversary =
    new Date(startDate);


  anniversary.setMonth(
    anniversary.getMonth() +
    halfYearPeriods * 6
  );


  if (
    anniversary > today
  ) {
    halfYearPeriods -= 1;
  }


  if (
    halfYearPeriods <= 0
  ) {
    return 0;
  }


  const halfYearInterest =
    interestBase *
    0.025 /
    2;


  return round(
    halfYearInterest *
    halfYearPeriods
  );
}


// ==========================================
// CALCULATE ONE SGB HOLDING
// ==========================================

export function calculateSGBHolding(
  transaction
) {

  const units =
    toNumber(
      transaction?.units
    );


  const purchaseRate =
    toNumber(
      transaction?.purchaseRate
    );


  const purchaseValue =
    toNumber(
      transaction?.purchaseValue
    );


  const currentRate =
    toNumber(
      transaction?.currentRate
    );


  const currentValue =
    units *
    currentRate;


  const interest =
    calculateSGBInterest(
      purchaseValue,
      transaction?.issueDate,
      units
    );


  const profit =
    currentValue -
    purchaseValue;


  const gain =
    profit +
    interest;


  const currentValueWithInterest =
    currentValue +
    interest;


  const totalGainPercent =
    purchaseValue > 0
      ? (
          gain /
          purchaseValue
        ) * 100
      : 0;


  return {

    ...transaction,

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

    interest:
      round(interest),

    currentValueWithInterest:
      round(
        currentValueWithInterest
      ),

    profit:
      round(profit),

    gain:
      round(gain),

    totalGainPercent:
      round(
        totalGainPercent
      ),

  };
}


// ==========================================
// CALCULATE SGB SUMMARY
// ==========================================

export function calculateSGBSummary(
  holdings = []
) {

  const summary =
    holdings.reduce(
      (
        total,
        item
      ) => {

        total.units +=
          toNumber(
            item.units
          );

        total.purchaseValue +=
          toNumber(
            item.purchaseValue
          );

        total.currentValue +=
          toNumber(
            item.currentValue
          );

        total.interest +=
          toNumber(
            item.interest
          );

        total.profit +=
          toNumber(
            item.profit
          );

        total.gain +=
          toNumber(
            item.gain
          );

        return total;

      },
      {
        units: 0,
        purchaseValue: 0,
        currentValue: 0,
        interest: 0,
        profit: 0,
        gain: 0,
      }
    );


  const currentValueWithInterest =
    summary.currentValue +
    summary.interest;


  const purchaseRate =
    summary.units > 0
      ? summary.purchaseValue /
        summary.units
      : 0;


  const currentRate =
    summary.units > 0
      ? summary.currentValue /
        summary.units
      : 0;


  const totalGainPercent =
    summary.purchaseValue > 0
      ? (
          summary.gain /
          summary.purchaseValue
        ) * 100
      : 0;


  return {

    seriesCount:
      holdings.length,

    units:
      round(
        summary.units
      ),

    purchaseRate:
      round(
        purchaseRate
      ),

    purchaseValue:
      round(
        summary.purchaseValue
      ),

    currentRate:
      round(
        currentRate
      ),

    currentValue:
      round(
        summary.currentValue
      ),

    interest:
      round(
        summary.interest
      ),

    profit:
      round(
        summary.profit
      ),

    gain:
      round(
        summary.gain
      ),

    currentValueWithInterest:
      round(
        currentValueWithInterest
      ),

    totalGainPercent:
      round(
        totalGainPercent
      ),

  };
}


// ==========================================
// MUTUAL FUND SUMMARY
// ==========================================

export function calculateMutualFundSummary(
  holdings = []
) {

  const value =
    holdings.reduce(
      (
        total,
        fund
      ) =>
        total +
        toNumber(
          fund?.currentValue
        ),
      0
    );


  return {

    value,

    holdings:
      holdings.length,

  };
}