import {
  calculateScheduledInterest,
  calculateReceivedInterest,
  calculatePendingInterest,
  calculatePrincipalSummary,
} from "./bondInterestSchedule";

/* =========================================================
   DATE ONLY
========================================================= */

function toDateOnly(value) {
  if (!value) return null;

  let date;

  if (value instanceof Date) {
    date = new Date(value);
  } else if (
    value &&
    typeof value.toDate === "function"
  ) {
    date = value.toDate();
  } else if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [year, month, day] = value.split("-");

    date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
}


/* =========================================================
   INDIVIDUAL BOND SUMMARY
========================================================= */

export function calculateBondFinancialSummary(
  bond,
  asOfDate = new Date()
) {
  if (!bond) {
    return {
      totalPrincipal: 0,
      totalInterest: 0,
      principalReceived: 0,
      interestReceived: 0,
      principalRemaining: 0,
      interestRemaining: 0,
    };
  }


  /* --------------------------------
     TOTAL PRINCIPAL

     Firestore:
     faceValue × quantity
  -------------------------------- */

  const faceValue =
    Number(bond.faceValue) || 0;

  const quantity =
    Number(bond.quantity) || 0;

  const totalPrincipal =
    faceValue * quantity;


  /* --------------------------------
     INTEREST
  -------------------------------- */

  const totalInterest =
    Number(
      calculateScheduledInterest(bond)
    ) || 0;

  const interestReceived =
    Number(
      calculateReceivedInterest(
        bond,
        asOfDate
      )
    ) || 0;

  const interestRemaining =
    Number(
      calculatePendingInterest(
        bond,
        asOfDate
      )
    ) || 0;


  /* --------------------------------
     PRINCIPAL REPAYMENTS
  -------------------------------- */

  const principalSummary =
    calculatePrincipalSummary(bond);

  const repayments =
    principalSummary?.repayments || [];


  const currentDate =
    toDateOnly(asOfDate) ||
    toDateOnly(new Date());


  let principalReceived = 0;


  repayments.forEach((repayment) => {

    const repaymentDate =
      toDateOnly(repayment.date);

    if (!repaymentDate) return;


    /*
      Aaj ki repayment bhi received
      maani jayegi.
    */

    if (repaymentDate <= currentDate) {

      principalReceived +=
        Number(repayment.amount) || 0;

    }

  });


  /* --------------------------------
     PROTECTION
  -------------------------------- */

  principalReceived =
    Math.min(
      totalPrincipal,
      principalReceived
    );


  const principalRemaining =
    Math.max(
      0,
      totalPrincipal -
        principalReceived
    );


  /* --------------------------------
     RESULT
  -------------------------------- */

  return {

    principalAmount: 
      Number(
        totalPrincipal.toFixed(2)
      ),

    totalInterest:
      Number(
        totalInterest.toFixed(2)
      ),

    principalReceived:
      Number(
        principalReceived.toFixed(2)
      ),

    interestReceived:
      Number(
        interestReceived.toFixed(2)
      ),

    principalRemaining:
      Number(
        principalRemaining.toFixed(2)
      ),

    interestRemaining:
      Number(
        interestRemaining.toFixed(2)
      ),

  };
}


/* =========================================================
   ALL BONDS SUMMARY
========================================================= */

export function calculateTotalBondFinancialSummary(
  bonds = [],
  asOfDate = new Date()
) {

  if (
    !Array.isArray(bonds) ||
    bonds.length === 0
  ) {

    return {
      totalPrincipal: 0,
      totalInterest: 0,
      principalReceived: 0,
      interestReceived: 0,
      principalRemaining: 0,
      interestRemaining: 0,
    };

  }


  const total =
    bonds.reduce(
      (result, bond) => {

        const summary =
          calculateBondFinancialSummary(
            bond,
            asOfDate
          );


        result.totalPrincipal +=
          summary.totalPrincipal;

        result.totalInterest +=
          summary.totalInterest;

        result.principalReceived +=
          summary.principalReceived;

        result.interestReceived +=
          summary.interestReceived;

        result.principalRemaining +=
          summary.principalRemaining;

        result.interestRemaining +=
          summary.interestRemaining;


        return result;

      },
      {
        totalPrincipal: 0,
        totalInterest: 0,
        principalReceived: 0,
        interestReceived: 0,
        principalRemaining: 0,
        interestRemaining: 0,
      }
    );


  return {

    totalPrincipal:
      Number(
        total.totalPrincipal.toFixed(2)
      ),

    totalInterest:
      Number(
        total.totalInterest.toFixed(2)
      ),

    principalReceived:
      Number(
        total.principalReceived.toFixed(2)
      ),

    interestReceived:
      Number(
        total.interestReceived.toFixed(2)
      ),

    principalRemaining:
      Number(
        total.principalRemaining.toFixed(2)
      ),

    interestRemaining:
      Number(
        total.interestRemaining.toFixed(2)
      ),

  };
}