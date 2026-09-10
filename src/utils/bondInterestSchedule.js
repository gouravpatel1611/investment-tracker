// ==================================================
// DATE
// ==================================================

export const toDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(value);
  }

  if (
    typeof value === "object" &&
    typeof value.toDate === "function"
  ) {
    return value.toDate();
  }

  if (typeof value === "string") {
    const parts =
      value.split("-");

    if (parts.length === 3) {
      return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );
    }
  }

  const date = new Date(value);

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
};

// ==================================================
// ADD MONTHS
// ==================================================

export const addMonths = (
  date,
  months
) => {
  const result =
    new Date(date);

  const originalDay =
    result.getDate();

  result.setDate(1);

  result.setMonth(
    result.getMonth() + months
  );

  const lastDay =
    new Date(
      result.getFullYear(),
      result.getMonth() + 1,
      0
    ).getDate();

  result.setDate(
    Math.min(
      originalDay,
      lastDay
    )
  );

  return result;
};

// ==================================================
// DAYS BETWEEN
//
// 25 Sep -> 25 Oct = 30
// 25 Apr -> 30 Apr = 5
// ==================================================

export const getDaysBetween = (
  start,
  end
) => {
  const startDate =
    toDate(start);

  const endDate =
    toDate(end);

  if (!startDate || !endDate) {
    return 0;
  }

  const startUTC =
    Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

  const endUTC =
    Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

  return Math.max(
    0,
    Math.round(
      (endUTC - startUTC) /
        86400000
    )
  );
};

// ==================================================
// LEAP YEAR
// ==================================================

export const isLeapYear = (
  year
) => {
  return (
    year % 4 === 0 &&
    (
      year % 100 !== 0 ||
      year % 400 === 0
    )
  );
};

// ==================================================
// DAYS IN YEAR
// ==================================================

export const getDaysInYear = (
  year
) => {
  return isLeapYear(year)
    ? 366
    : 365;
};

// ==================================================
// FREQUENCY
// ==================================================

export const getMonthsPerPayment = (
  frequency
) => {
  switch (frequency) {
    case "monthly":
      return 1;

    case "quarterly":
      return 3;

    case "half-yearly":
      return 6;

    case "annual":
      return 12;

    default:
      return 12;
  }
};

// ==================================================
// NORMALIZE REPAYMENTS
// ==================================================

export const normalizeRepayments = (
  repayments = []
) => {
  return repayments
    .filter(
      (item) =>
        item &&
        item.date &&
        Number(item.amount) > 0
    )
    .map((item) => ({
      date: toDate(item.date),
      amount: Number(item.amount),
    }))
    .filter(
      (item) => item.date
    )
    .sort(
      (a, b) =>
        a.date.getTime() -
        b.date.getTime()
    );
};

// ==================================================
// PRINCIPAL AT A DATE
// ==================================================

export const getOutstandingPrincipalAt = (
  originalPrincipal,
  repayments,
  date
) => {
  const targetDate =
    toDate(date);

  if (!targetDate) {
    return Number(
      originalPrincipal
    );
  }

  let remaining =
    Number(originalPrincipal);

  for (
    const repayment of repayments
  ) {
    /*
      Repayment on this exact date is
      considered paid at the start of
      that date for future interest.
    */

    if (
      repayment.date.getTime() <=
      targetDate.getTime()
    ) {
      remaining -=
        repayment.amount;

      if (remaining <= 0) {
        return 0;
      }
    }
  }

  return Math.max(
    0,
    remaining
  );
};

// ==================================================
// SPLIT BY YEAR
// ==================================================

const splitByYear = (
  start,
  end,
  principal
) => {
  const parts = [];

  let cursor =
    toDate(start);

  const finalEnd =
    toDate(end);

  while (
    cursor &&
    finalEnd &&
    cursor < finalEnd
  ) {
    const year =
      cursor.getFullYear();

    const nextYear =
      new Date(
        year + 1,
        0,
        1
      );

    const segmentEnd =
      nextYear < finalEnd
        ? nextYear
        : finalEnd;

    const days =
      getDaysBetween(
        cursor,
        segmentEnd
      );

    if (days > 0) {
      parts.push({
        start: new Date(cursor),
        end: new Date(
          segmentEnd
        ),
        year,
        days,
        daysInYear:
          getDaysInYear(year),
        principal,
      });
    }

    cursor =
      segmentEnd;
  }

  return parts;
};

// ==================================================
// SEGMENT INTEREST
// ==================================================

const calculateSegmentInterest = ({
  principal,
  couponRate,
  days,
  daysInYear,
}) => {
  return (
    principal *
    couponRate *
    days /
    (daysInYear * 100)
  );
};

// ==================================================
// PERIOD
// ==================================================

const calculatePeriod = ({
  periodStart,
  periodEnd,
  originalPrincipal,
  couponRate,
  repayments,
}) => {
  const start =
    toDate(periodStart);

  const end =
    toDate(periodEnd);

  if (
    !start ||
    !end ||
    start >= end
  ) {
    return null;
  }

  /*
    First split at principal repayment
    dates.
  */

  const splitPoints = [
    start,
  ];

  for (
    const repayment of repayments
  ) {
    if (
      repayment.date > start &&
      repayment.date < end
    ) {
      splitPoints.push(
        new Date(
          repayment.date
        )
      );
    }
  }

  splitPoints.push(end);

  splitPoints.sort(
    (a, b) =>
      a.getTime() -
      b.getTime()
  );

  const segments = [];

  let totalInterest = 0;
  let totalDays = 0;

  for (
    let i = 0;
    i < splitPoints.length - 1;
    i++
  ) {
    const segmentStart =
      splitPoints[i];

    const segmentEnd =
      splitPoints[i + 1];

    /*
      Principal applicable at beginning
      of this segment.
    */

    const principal =
      getOutstandingPrincipalAt(
        originalPrincipal,
        repayments,
        segmentStart
      );

    /*
      Split again by calendar year.
    */

    const yearParts =
      splitByYear(
        segmentStart,
        segmentEnd,
        principal
      );

    for (
      const part of yearParts
    ) {
      const interest =
        calculateSegmentInterest({
          principal:
            part.principal,
          couponRate,
          days: part.days,
          daysInYear:
            part.daysInYear,
        });

      totalInterest +=
        interest;

      totalDays +=
        part.days;

      segments.push({
        ...part,
        interest,
      });
    }
  }

  return {
    periodStart: start,
    periodEnd: end,

    days: totalDays,

    interest: Number(
      totalInterest.toFixed(2)
    ),

    segments,

    principalAtStart:
      getOutstandingPrincipalAt(
        originalPrincipal,
        repayments,
        start
      ),

    principalAtEnd:
      getOutstandingPrincipalAt(
        originalPrincipal,
        repayments,
        end
      ),
  };
};

// ==================================================
// PAYMENT DATES
// ==================================================

const buildPaymentDates = ({
  firstPayoutDate,
  maturityDate,
  frequency,
}) => {
  const firstPayout =
    toDate(firstPayoutDate);

  const maturity =
    toDate(maturityDate);

  if (
    !firstPayout ||
    !maturity
  ) {
    return [];
  }

  /*
    At maturity:
    one single payment.
  */

  if (
    frequency ===
    "at-maturity"
  ) {
    return [
      {
        date: maturity,
        isMaturityPayment:
          true,
      },
    ];
  }

  const months =
    getMonthsPerPayment(
      frequency
    );

  const payments = [];

  let current =
    new Date(firstPayout);

  while (
    current < maturity
  ) {
    payments.push({
      date: new Date(
        current
      ),
      isMaturityPayment:
        false,
    });

    current =
      addMonths(
        current,
        months
      );
  }

  /*
    Add final maturity payment if
    maturity is not already a payout.
  */

  const last =
    payments[
      payments.length - 1
    ];

  if (
    !last ||
    getDaysBetween(
      last.date,
      maturity
    ) !== 0
  ) {
    payments.push({
      date: maturity,
      isMaturityPayment:
        true,
    });
  } else {
    last.isMaturityPayment =
      true;
  }

  return payments;
};

// ==================================================
// MAIN SCHEDULE
// ==================================================

export const calculateInterestSchedule = ({
  faceValue,
  quantity,
  couponRate,
  couponFrequency,
  firstPayoutDate,
  maturityDate,
  principalRepayments = [],
}) => {
  const originalPrincipal =
    Number(faceValue || 0) *
    Number(quantity || 0);

  const rate =
    Number(couponRate || 0);

  if (
    originalPrincipal <= 0 ||
    rate < 0 ||
    !firstPayoutDate ||
    !maturityDate
  ) {
    return [];
  }

  const repayments =
    normalizeRepayments(
      principalRepayments
    );

  const paymentDates =
    buildPaymentDates({
      firstPayoutDate,
      maturityDate,
      frequency:
        couponFrequency,
    });

  if (
    paymentDates.length === 0
  ) {
    return [];
  }

  /*
    IMPORTANT:

    Purchase date is intentionally
    NOT used here.

    First payout is the anchor.
  */

  let previousDate;

  if (
    couponFrequency ===
    "at-maturity"
  ) {
    previousDate =
      toDate(
        firstPayoutDate
      );
  } else {
    previousDate =
      addMonths(
        toDate(
          firstPayoutDate
        ),
        -getMonthsPerPayment(
          couponFrequency
        )
      );
  }

  const schedule = [];

  for (
    const payment of paymentDates
  ) {
    const periodEnd =
      toDate(payment.date);

    const period =
      calculatePeriod({
        periodStart:
          previousDate,

        periodEnd,

        originalPrincipal,

        couponRate: rate,

        repayments,
      });

    if (period) {
      schedule.push({
        ...period,

        date: periodEnd,

        isMaturityPayment:
          payment.isMaturityPayment,

        status: "Pending",
      });
    }

    previousDate =
      periodEnd;
  }

  return schedule;
};

// ==================================================
// PAYMENT STATUS
// ==================================================

export const getPaymentStatus = (
  payment,
  asOfDate = new Date()
) => {
  const currentDate =
    toDate(asOfDate);

  const start =
    toDate(
      payment.periodStart
    );

  const end =
    toDate(
      payment.periodEnd
    );

  if (
    !currentDate ||
    !start ||
    !end
  ) {
    return "Pending";
  }

  if (
    end <= currentDate
  ) {
    return "Paid";
  }

  if (
    start < currentDate &&
    currentDate < end
  ) {
    return "Running";
  }

  return "Pending";
};

// ==================================================
// SCHEDULE + STATUS
// ==================================================

export const calculateScheduleWithStatus = ({
  asOfDate = new Date(),
  ...bond
}) => {
  return calculateInterestSchedule(
    bond
  ).map((payment) => ({
    ...payment,

    status:
      getPaymentStatus(
        payment,
        asOfDate
      ),
  }));
};

// ==================================================
// YEARLY SCHEDULE
// ==================================================

export const calculateYearlyInterestSchedule = ({
  asOfDate = new Date(),
  ...bond
}) => {
  const schedule =
    calculateScheduleWithStatus({
      ...bond,
      asOfDate,
    });

  const grouped = {};

  for (
    const payment of schedule
  ) {
    const year =
      payment.date.getFullYear();

    if (!grouped[year]) {
      grouped[year] = {
        year,

        payments: [],

        totalInterest: 0,

        receivedInterest: 0,

        remainingInterest: 0,

        status: "Pending",
      };
    }

    grouped[year].payments.push(
      payment
    );

    grouped[
      year
    ].totalInterest +=
      Number(
        payment.interest || 0
      );

    if (
      payment.status ===
      "Paid"
    ) {
      grouped[
        year
      ].receivedInterest +=
        Number(
          payment.interest || 0
        );
    } else {
      grouped[
        year
      ].remainingInterest +=
        Number(
          payment.interest || 0
        );
    }
  }

  return Object.values(
    grouped
  )
    .map((yearGroup) => {
      const payments =
        yearGroup.payments;

      const allPaid =
        payments.length > 0 &&
        payments.every(
          (item) =>
            item.status ===
            "Paid"
        );

      const hasRunning =
        payments.some(
          (item) =>
            item.status ===
            "Running"
        );

      const hasPaid =
        payments.some(
          (item) =>
            item.status ===
            "Paid"
        );

      let status =
        "Pending";

      if (allPaid) {
        status = "Paid";
      } else if (
        hasRunning ||
        hasPaid
      ) {
        status = "Running";
      }

      return {
        ...yearGroup,

        totalInterest:
          Number(
            yearGroup.totalInterest.toFixed(
              2
            )
          ),

        receivedInterest:
          Number(
            yearGroup.receivedInterest.toFixed(
              2
            )
          ),

        remainingInterest:
          Number(
            yearGroup.remainingInterest.toFixed(
              2
            )
          ),

        status,
      };
    })
    .sort(
      (a, b) =>
        a.year - b.year
    );
};

// ==================================================
// TOTAL INTEREST
// ==================================================

export const calculateScheduledInterest = (
  bond
) => {
  return Number(
    calculateInterestSchedule(
      bond
    )
      .reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.interest || 0
          ),
        0
      )
      .toFixed(2)
  );
};

// ==================================================
// RECEIVED INTEREST
// ==================================================

export const calculateReceivedInterest = (
  bond,
  asOfDate = new Date()
) => {
  return Number(
    calculateScheduleWithStatus({
      ...bond,
      asOfDate,
    })
      .filter(
        (payment) =>
          payment.status ===
          "Paid"
      )
      .reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.interest || 0
          ),
        0
      )
      .toFixed(2)
  );
};

// ==================================================
// PENDING INTEREST
// ==================================================

export const calculatePendingInterest = (
  bond,
  asOfDate = new Date()
) => {
  return Number(
    calculateScheduleWithStatus({
      ...bond,
      asOfDate,
    })
      .filter(
        (payment) =>
          payment.status !==
          "Paid"
      )
      .reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.interest || 0
          ),
        0
      )
      .toFixed(2)
  );
};

// ==================================================
// PRINCIPAL SUMMARY
// ==================================================

export const calculatePrincipalSummary = (
  bond
) => {
  const originalPrincipal =
    Number(
      bond.faceValue || 0
    ) *
    Number(
      bond.quantity || 0
    );

  const repayments =
    normalizeRepayments(
      bond.principalRepayments
    );

  let remaining =
    originalPrincipal;

  const repaymentDetails =
    repayments.map(
      (repayment) => {
        const paid =
          Math.min(
            repayment.amount,
            remaining
          );

        remaining -= paid;

        return {
          date: repayment.date,

          amount: Number(
            paid.toFixed(2)
          ),

          remainingPrincipal:
            Number(
              Math.max(
                0,
                remaining
              ).toFixed(2)
            ),
        };
      }
    );

  const totalPaid =
    originalPrincipal -
    remaining;

  return {
    originalPrincipal:
      Number(
        originalPrincipal.toFixed(
          2
        )
      ),

    totalPrincipalPaid:
      Number(
        totalPaid.toFixed(2)
      ),

    remainingPrincipal:
      Number(
        remaining.toFixed(2)
      ),

    repayments:
      repaymentDetails,
  };
};

// ==================================================
// NEXT PAYMENT
// ==================================================

export const getNextInterestPayment = (
  bond,
  asOfDate = new Date()
) => {
  const schedule =
    calculateScheduleWithStatus({
      ...bond,
      asOfDate,
    });

  return (
    schedule.find(
      (payment) =>
        payment.status !==
        "Paid"
    ) || null
  );
};

// ==================================================
// LAST RECEIVED
// ==================================================

export const getLastReceivedInterest = (
  bond,
  asOfDate = new Date()
) => {
  const schedule =
    calculateScheduleWithStatus({
      ...bond,
      asOfDate,
    });

  const paid =
    schedule.filter(
      (payment) =>
        payment.status ===
        "Paid"
    );

  return paid.length
    ? paid[paid.length - 1]
    : null;
};