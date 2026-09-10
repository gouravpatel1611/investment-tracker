// ==================================================
// DATE HELPERS
// ==================================================

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


// ==================================================
// ADD DAYS
// ==================================================

function addDays(date, days) {
  const result = new Date(date);

  result.setDate(
    result.getDate() + days
  );

  result.setHours(0, 0, 0, 0);

  return result;
}


// ==================================================
// DAYS BETWEEN TWO DATES
//
// IMPORTANT:
// Start date + End date
// dono include honge.
//
// 09-Sep → 08-Oct
// = 30 days
//
// 09-Oct → 08-Nov
// = 31 days
// ==================================================

function getDaysBetween(
  startDate,
  endDate
) {
  const start =
    toDate(startDate);

  const end =
    toDate(endDate);

  if (!start || !end) {
    return 0;
  }

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference =
    end.getTime() -
    start.getTime();

  const days =
    Math.floor(
      difference /
        millisecondsPerDay
    );

  /*
    Start aur end dono include.
  */

  return Math.max(
    0,
    days 
  );
}


// ==================================================
// ADD MONTHS
//
// Month-end safe
//
// 31-Jan + 1 month
// → 28-Feb / 29-Feb
// ==================================================

function addMonths(
  date,
  months
) {
  const result =
    new Date(date);

  const originalDay =
    result.getDate();

  /*
    Pehle date 1 karte hain,
    taki month overflow na ho.
  */

  result.setDate(1);

  result.setMonth(
    result.getMonth() + months
  );

  /*
    Target month ka last day.
  */

  const lastDayOfTargetMonth =
    new Date(
      result.getFullYear(),
      result.getMonth() + 1,
      0
    ).getDate();

  result.setDate(
    Math.min(
      originalDay,
      lastDayOfTargetMonth
    )
  );

  result.setHours(0, 0, 0, 0);

  return result;
}


// ==================================================
// PAYMENT FREQUENCY
// ==================================================

function getMonthsPerPayment(
  couponFrequency
) {
  const frequency =
    String(
      couponFrequency || ""
    )
      .toLowerCase()
      .trim();

  switch (frequency) {

    case "monthly":
      return 1;

    case "quarterly":
      return 3;

    case "half-yearly":
    case "half yearly":
    case "halfyearly":
    case "semi-annually":
    case "semi annually":
    case "semiannual":
      return 6;

    case "yearly":
    case "annual":
    case "annually":
      return 12;

    default:
      return 0;
  }
}


// ==================================================
// CALCULATE INTEREST FOR PERIOD
//
// Formula:
//
// Principal × Rate × Days / 36500
//
// Principal = Face Value × Quantity
// Rate      = Coupon Rate
// Days      = Actual calendar days
//
// Result = 2 decimal
// ==================================================

export function calculatePeriodInterest(
  bond,
  startDate,
  endDate
) {
  const faceValue =
    Number(
      bond?.faceValue
    ) || 0;

  const quantity =
    Number(
      bond?.quantity
    ) || 0;

  const couponRate =
    Number(
      bond?.couponRate
    ) || 0;

  const principal =
    faceValue * quantity;

  const days =
    getDaysBetween(
      startDate,
      endDate
    );


  if (
    principal <= 0 ||
    couponRate <= 0 ||
    days <= 0
  ) {
    return 0;
  }


  const interest =
    (
      principal *
      couponRate *
      days
    ) / 36500;


  /*
    Interest ko 2 decimal
    tak round kar rahe hain.
  */

  return Number(
    interest.toFixed(2)
  );
}


// ==================================================
// GET PERIOD DAYS
// ==================================================

export function getInterestPeriodDays(
  startDate,
  endDate
) {
  return getDaysBetween(
    startDate,
    endDate
  );
}


// ==================================================
// INTEREST SCHEDULE
//
// Example:
//
// First payout = 09-Oct-2025
//
// Period 1:
// 09-Sep-2025 → 08-Oct-2025
// = 30 days
//
// Period 2:
// 09-Oct-2025 → 08-Nov-2025
// = 31 days
//
// Period 3:
// 09-Nov-2025 → 08-Dec-2025
// = 30 days
//
// Schedule date = payout date
// ==================================================

export function calculateInterestSchedule(
  bond,
  asOfDate = new Date()
) {
  const purchaseDate =
    toDate(
      bond?.purchaseDate
    );

  const firstPayoutDate =
    toDate(
      bond?.firstPayoutDate
    );

  const maturityDate =
    toDate(
      bond?.maturityDate
    );

  const currentDate =
    toDate(
      asOfDate
    );


  // ------------------------------------------------
  // REQUIRED DATES
  // ------------------------------------------------

  if (
    !purchaseDate ||
    !firstPayoutDate ||
    !maturityDate ||
    !currentDate
  ) {
    return [];
  }


  // ------------------------------------------------
  // INVALID DATE RANGE
  // ------------------------------------------------

  if (
    maturityDate <
    purchaseDate
  ) {
    return [];
  }


  // ------------------------------------------------
  // PAYMENT FREQUENCY
  // ------------------------------------------------

  const monthsPerPayment =
    getMonthsPerPayment(
      bond?.couponFrequency
    );


  if (
    monthsPerPayment <= 0
  ) {
    return [];
  }


  // ------------------------------------------------
  // SCHEDULE ARRAY
  // ------------------------------------------------

  const schedule = [];


  /*
    First payment se ek cycle
    peeche jao.

    Example:

    First payout:
    09-Oct-2025

    Period start:
    09-Sep-2025
  */

  let payoutDate =
    new Date(
      firstPayoutDate
    );


  let periodStart =
    addMonths(
      payoutDate,
      -monthsPerPayment
    );


  // ------------------------------------------------
  // GENERATE SCHEDULE
  // ------------------------------------------------

  while (
    payoutDate <= maturityDate
  ) {

    // ----------------------------------------------
    // ACTUAL PERIOD START
    // ----------------------------------------------

    let actualStart =
      new Date(
        periodStart
      );


    /*
      Agar purchase date period ke
      beech me hai, to interest
      purchase date se start hoga.
    */

    if (
      actualStart <
      purchaseDate
    ) {
      actualStart =
        new Date(
          purchaseDate
        );
    }


    // ----------------------------------------------
    // ACTUAL PERIOD END
    // ----------------------------------------------

    /*
      Payout date ko include karna hai,
      isliye period end payout date
      hi rahega.

      Example:

      09-Sep → 08-Oct
      = 30 days
    */

    let actualEnd =
      new Date(
        payoutDate
      );


    /*
      Maturity ke baad nahi.
    */

    if (
      actualEnd >
      maturityDate
    ) {
      actualEnd =
        new Date(
          maturityDate
        );
    }


    // ----------------------------------------------
    // DAYS
    // ----------------------------------------------

    const days =
      getDaysBetween(
        actualStart,
        actualEnd
      );


    // ----------------------------------------------
    // INTEREST
    // ----------------------------------------------

    const interest =
      calculatePeriodInterest(
        bond,
        actualStart,
        actualEnd
      );


    // ----------------------------------------------
    // VALID PERIOD
    // ----------------------------------------------

    if (
      days > 0 &&
      actualEnd >= purchaseDate
    ) {

      /*
        IMPORTANT:

        Ye sirf calculated status hai.

        Actual Firebase transaction
        aane ke baad isko:

        Received
        Pending
        Partial

        me convert kar sakte hain.

        Abhi existing behaviour
        preserve kiya gaya hai.
      */

      const status =
        payoutDate <= currentDate
          ? "Received"
          : "Pending";


      schedule.push({

        // ----------------------------------------
        // PAYMENT DATE
        // ----------------------------------------

        date:
          new Date(
            payoutDate
          ),


        // ----------------------------------------
        // INTEREST PERIOD START
        // ----------------------------------------

        periodStart:
          new Date(
            actualStart
          ),


        // ----------------------------------------
        // INTEREST PERIOD END
        // ----------------------------------------

        periodEnd:
          new Date(
            actualEnd
          ),


        // ----------------------------------------
        // ACTUAL DAYS
        // ----------------------------------------

        days,


        // ----------------------------------------
        // EXPECTED INTEREST
        // ----------------------------------------

        interest,


        // ----------------------------------------
        // STATUS
        // ----------------------------------------

        status,
      });
    }


    // ----------------------------------------------
    // NEXT PERIOD
    // ----------------------------------------------

    periodStart =
      new Date(
        payoutDate
      );


    payoutDate =
      addMonths(
        payoutDate,
        monthsPerPayment
      );


    // ----------------------------------------------
    // SAFETY LIMIT
    // ----------------------------------------------

    if (
      schedule.length >= 600
    ) {
      break;
    }
  }


  // ------------------------------------------------
  // ASCENDING ORDER
  // ------------------------------------------------

  schedule.sort(
    (a, b) =>
      a.date.getTime() -
      b.date.getTime()
  );


  return schedule;
}


// ==================================================
// TOTAL EXPECTED INTEREST
//
// Schedule ke saare periods ka
// total expected interest.
// ==================================================

export function calculateScheduledInterest(
  bond,
  asOfDate = new Date()
) {
  const schedule =
    calculateInterestSchedule(
      bond,
      asOfDate
    );


  const total =
    schedule.reduce(
      (sum, item) =>
        sum +
        Number(
          item.interest
        ),
      0
    );


  return Number(
    total.toFixed(2)
  );
}


// ==================================================
// RECEIVED INTEREST
//
// IMPORTANT:
//
// Abhi ye payment date ke basis
// par Received calculate karta hai.
//
// Actual Firebase received amount
// add hone ke baad is function ko
// transaction data ke saath update
// karna hoga.
// ==================================================

export function calculateReceivedInterest(
  bond,
  asOfDate = new Date()
) {
  const schedule =
    calculateInterestSchedule(
      bond,
      asOfDate
    );


  const total =
    schedule
      .filter(
        (item) =>
          item.status ===
          "Received"
      )
      .reduce(
        (sum, item) =>
          sum +
          Number(
            item.interest
          ),
        0
      );


  return Number(
    total.toFixed(2)
  );
}


// ==================================================
// PENDING INTEREST
// ==================================================

export function calculatePendingInterest(
  bond,
  asOfDate = new Date()
) {
  const schedule =
    calculateInterestSchedule(
      bond,
      asOfDate
    );


  const total =
    schedule
      .filter(
        (item) =>
          item.status ===
          "Pending"
      )
      .reduce(
        (sum, item) =>
          sum +
          Number(
            item.interest
          ),
        0
      );


  return Number(
    total.toFixed(2)
  );
}


// ==================================================
// NEXT PAYMENT
// ==================================================

export function getNextInterestPayment(
  bond,
  asOfDate = new Date()
) {
  const schedule =
    calculateInterestSchedule(
      bond,
      asOfDate
    );


  return (
    schedule.find(
      (item) =>
        item.status ===
        "Pending"
    ) || null
  );
}


// ==================================================
// LAST RECEIVED PAYMENT
// ==================================================

export function getLastReceivedInterest(
  bond,
  asOfDate = new Date()
) {
  const schedule =
    calculateInterestSchedule(
      bond,
      asOfDate
    );


  const received =
    schedule.filter(
      (item) =>
        item.status ===
        "Received"
    );


  if (
    received.length === 0
  ) {
    return null;
  }


  return received[
    received.length - 1
  ];
}