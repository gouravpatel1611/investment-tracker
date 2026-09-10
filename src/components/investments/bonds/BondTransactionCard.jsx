import {
  ArrowDownToLine,
  CalendarDays,
  Clock3,
  IndianRupee,
  Plus,
} from "lucide-react";



import {
  calculateInterestSchedule,
} from "../../../utils/bondInterestSchedule";


// ==================================================
// CURRENCY FORMAT
// ==================================================

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(
    Number(value) || 0
  );
}


// ==================================================
// DATE FORMAT
// ==================================================

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


// ==================================================
// BOND TRANSACTION CARD
// ==================================================

function BondTransactionCard({
  bond,
}) {



  const paymentSchedule =
    calculateInterestSchedule(
      bond
    );


  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        shadow-sm
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-800
          px-4
          py-4
          sm:px-5
        "
      >

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          {/* Icon */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-500/10
              text-emerald-400
            "
          >
            <IndianRupee
              size={19}
            />
          </div>


          {/* Title */}

          <div
            className="
              min-w-0
            "
          >

            <p
              className="
                text-sm
                font-bold
                text-slate-100
              "
            >
              Interest Transactions
            </p>


            <p
              className="
                mt-0.5
                truncate
                text-[11px]
                text-slate-500
              "
            >
              {bond.couponFrequency || "-"}
              {" • "}
              {Number(
                bond.couponRate || 0
              ).toFixed(2)}
              %
            </p>

          </div>

        </div>


        {/* Add Transaction */}

        <button
          type="button"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-800
            text-slate-300
            transition
            hover:bg-slate-700
            active:scale-95
          "
          aria-label="Add interest transaction"
        >
          <Plus
            size={17}
          />
        </button>

      </div>


      {/* ==================================================
          INTEREST SUMMARY
      ================================================== */}


      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:px-5">

        {/* Interest Received */}

        <div className="rounded-xl bg-slate-800/60 p-3">

          <p className="text-[10px] font-medium text-slate-500">
            Interest Received
          </p>

          <p className="mt-1 text-sm font-bold text-emerald-400">
            {formatCurrency(
              paymentSchedule
                .filter(
                  (payment) =>
                    payment.status === "Received"
                )
                .reduce(
                  (sum, payment) =>
                    sum + Number(payment.interest || 0),
                  0
                )
            )}
          </p>

        </div>


        {/* Remaining Interest */}

        <div className="rounded-xl bg-slate-800/60 p-3">

          <p className="text-[10px] font-medium text-slate-500">
            Remaining Interest
          </p>

          <p className="mt-1 text-sm font-bold text-amber-400">
            {formatCurrency(
              paymentSchedule
                .filter(
                  (payment) =>
                    payment.status === "Pending"
                )
                .reduce(
                  (sum, payment) =>
                    sum + Number(payment.interest || 0),
                  0
                )
            )}
          </p>

        </div>


        {/* Received Payments */}

        <div className="rounded-xl bg-slate-800/60 p-3">

          <p className="text-[10px] font-medium text-slate-500">
            Received Payments
          </p>

          <p className="mt-1 text-sm font-bold text-emerald-400">
            {
              paymentSchedule.filter(
                (payment) =>
                  payment.status === "Received"
              ).length
            }
          </p>

        </div>


        {/* Remaining Payments */}

        <div className="rounded-xl bg-slate-800/60 p-3">

          <p className="text-[10px] font-medium text-slate-500">
            Remaining Payments
          </p>

          <p className="mt-1 text-sm font-bold text-amber-400">
            {
              paymentSchedule.filter(
                (payment) =>
                  payment.status === "Pending"
              ).length
            }
          </p>

        </div>


        {/* Total Interest */}

        <div className="rounded-xl bg-slate-800/60 p-3">

          <p className="text-[10px] font-medium text-slate-500">
            Total Interest
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {formatCurrency(
              paymentSchedule.reduce(
                (sum, payment) =>
                  sum + Number(payment.interest || 0),
                0
              )
            )}
          </p>

        </div>


        {/* Principal Amount */}

        <div className="rounded-xl bg-slate-800/60 p-3">

          <p className="text-[10px] font-medium text-slate-500">
            Principal Amount
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {formatCurrency(
              Number(bond.faceValue || 0) *
              Number(bond.quantity || 0)
            )}
          </p>

        </div>

      </div>




      {/* ==================================================
          INTEREST SCHEDULE
      ================================================== */}

      <div
        className="
          border-t
          border-slate-800
          px-4
          py-4
          sm:px-5
        "
      >

        {/* Section Header */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <ArrowDownToLine
              size={15}
              className="
                text-emerald-400
              "
            />


            <h3
              className="
                text-sm
                font-bold
                text-slate-200
              "
            >
              Interest Schedule
            </h3>

          </div>


          <span
            className="
              text-[11px]
              font-medium
              text-slate-500
            "
          >
            {paymentSchedule.length}{" "}
            {paymentSchedule.length === 1
              ? "Payment"
              : "Payments"}
          </span>

        </div>


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {paymentSchedule.length === 0 ? (

          <div
            className="
              mt-3
              rounded-xl
              border
              border-dashed
              border-slate-700
              bg-slate-800/20
              p-5
              text-center
            "
          >

            <Clock3
              size={20}
              className="
                mx-auto
                text-slate-600
              "
            />


            <p
              className="
                mt-2
                text-xs
                font-semibold
                text-slate-400
              "
            >
              No interest schedule available
            </p>


            <p
              className="
                mt-1
                text-[11px]
                leading-5
                text-slate-600
              "
            >
              Please check the payout date,
              maturity date and coupon
              frequency.
            </p>

          </div>

        ) : (

          /* ==================================================
             TABLE
          ================================================== */

          <div
            className="
              mt-3
              overflow-hidden
              rounded-xl
              border
              border-slate-800
            "
          >

            {/* Table Header */}

            <div
              className="
                grid
                grid-cols-[1.3fr_1fr_0.9fr]
                border-b
                border-slate-800
                bg-slate-800/60
                px-3
                py-2.5
              "
            >

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Date
              </p>


              <p
                className="
                  text-right
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Interest
              </p>


              <p
                className="
                  text-right
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                Status
              </p>

            </div>


            {/* Table Body */}

            <div
              className="
                divide-y
                divide-slate-800
              "
            >

              {paymentSchedule.map(
                (
                  payment,
                  index
                ) => {

                  return (
                    <div
                      key={`
                        ${
                          payment.date instanceof Date
                            ? payment.date.getTime()
                            : new Date(
                                payment.date
                              ).getTime()
                        }-${index}
                      `}
                      className="
                        grid
                        grid-cols-[1.3fr_1fr_0.9fr]
                        items-center
                        px-3
                        py-3
                      "
                    >

                      {/* Date */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                        "
                      >

                        <CalendarDays
                          size={13}
                          className="
                            shrink-0
                            text-slate-500
                          "
                        />


                        <span
                          className="
                            truncate
                            text-xs
                            font-semibold
                            text-slate-300
                          "
                        >
                          {formatDate(
                            payment.date
                          )}
                        </span>

                      </div>


                      {/* Interest */}

                      <p
                        className="
                          text-right
                          text-xs
                          font-bold
                          text-slate-200
                        "
                      >
                        {formatCurrency(
                          payment.interest
                        )}
                      </p>


                      {/* Status */}

                      <div
                        className="
                          flex
                          justify-end
                        "
                      >

                        {payment.status ===
                        "Received" ? (

                          <span
                            className="
                              rounded-full
                              bg-emerald-500/10
                              px-2
                              py-1
                              text-[10px]
                              font-semibold
                              text-emerald-400
                            "
                          >
                            Received
                          </span>

                        ) : (

                          <span
                            className="
                              rounded-full
                              bg-amber-500/10
                              px-2
                              py-1
                              text-[10px]
                              font-semibold
                              text-amber-400
                            "
                          >
                            Pending
                          </span>

                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        )}

      </div>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <div
        className="
          border-t
          border-slate-800
          px-4
          py-3
          sm:px-5
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >

          {/* Purchase Date */}

          <div>

            <p
              className="
                text-[10px]
                text-slate-500
              "
            >
              Purchase Date
            </p>


            <p
              className="
                mt-0.5
                text-xs
                font-medium
                text-slate-300
              "
            >
              {formatDate(
                bond.purchaseDate
              )}
            </p>

          </div>


          {/* Maturity Date */}

          <div
            className="
              text-right
            "
          >

            <p
              className="
                text-[10px]
                text-slate-500
              "
            >
              Maturity Date
            </p>


            <p
              className="
                mt-0.5
                flex
                items-center
                justify-end
                gap-1
                text-xs
                font-medium
                text-slate-300
              "
            >

              <CalendarDays
                size={12}
              />

              {formatDate(
                bond.maturityDate
              )}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


export default BondTransactionCard;