import {
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  Plus,
} from "lucide-react";

import {
  calculateInterestSchedule,
  calculateYearlyInterestSchedule,
  calculatePrincipalSummary,
} from "../../../utils/bondInterestSchedule";

import BondYearGroup
  from "./BondYearGroup";

// ==================================================
// CURRENCY
// ==================================================

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value) || 0
  );
}

// ==================================================
// DATE
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
// TRANSACTION CARD
// ==================================================

function BondTransactionCard({
  bond,
}) {
  // ==================================================
  // PAYMENT SCHEDULE
  // ==================================================

  const paymentSchedule =
    calculateInterestSchedule(
      bond
    );

  // ==================================================
  // YEARLY
  // ==================================================

  const yearlySchedule =
    calculateYearlyInterestSchedule(
      bond
    );

  // ==================================================
  // PRINCIPAL SUMMARY
  // ==================================================

  const principalSummary =
    calculatePrincipalSummary(
      bond
    );

  // ==================================================
  // INTEREST SUMMARY
  // ==================================================

  const receivedInterest =
    paymentSchedule
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
      );

  const remainingInterest =
    paymentSchedule
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
      );

  const totalInterest =
    paymentSchedule.reduce(
      (sum, payment) =>
        sum +
        Number(
          payment.interest || 0
        ),
      0
    );

  const receivedPayments =
    paymentSchedule.filter(
      (payment) =>
        payment.status ===
        "Paid"
    ).length;

  const remainingPayments =
    paymentSchedule.filter(
      (payment) =>
        payment.status !==
        "Paid"
    ).length;

  const principalAmount =
    Number(
      bond.faceValue || 0
    ) *
    Number(
      bond.quantity || 0
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

          <div className="min-w-0">
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
              {bond.couponFrequency ||
                "-"}
              {" • "}
              {Number(
                bond.couponRate || 0
              ).toFixed(2)}
              %
            </p>
          </div>
        </div>

        {/* ADD */}

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
          <Plus size={17} />
        </button>
      </div>

      {/* ==================================================
          INTEREST SUMMARY
      ================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-3
          p-4
          sm:grid-cols-3
          sm:px-5
        "
      >
        {/* RECEIVED */}

        <SummaryBox
          label="Interest Received"
          value={formatCurrency(
            receivedInterest
          )}
          valueClass="text-emerald-400"
        />

        {/* REMAINING */}

        <SummaryBox
          label="Remaining Interest"
          value={formatCurrency(
            remainingInterest
          )}
          valueClass="text-amber-400"
        />

        {/* RECEIVED PAYMENTS */}

        <SummaryBox
          label="Received Payments"
          value={receivedPayments}
          valueClass="text-emerald-400"
        />

        {/* REMAINING PAYMENTS */}

        <SummaryBox
          label="Remaining Payments"
          value={remainingPayments}
          valueClass="text-amber-400"
        />

        {/* TOTAL */}

        <SummaryBox
          label="Total Interest"
          value={formatCurrency(
            totalInterest
          )}
          valueClass="text-slate-200"
        />

        {/* ORIGINAL PRINCIPAL */}

        <SummaryBox
          label="Original Principal"
          value={formatCurrency(
            principalAmount
          )}
          valueClass="text-slate-200"
        />
      </div>

      {/* ==================================================
          PRINCIPAL REPAYMENT SUMMARY
      ================================================== */}

      {principalSummary.repayments
        .length > 0 && (
        <div
          className="
            mx-4
            mb-4
            overflow-hidden
            rounded-xl
            border
            border-slate-800
            bg-slate-950
            sm:mx-5
          "
        >
          {/* HEADER */}

          <div
            className="
              border-b
              border-slate-800
              px-4
              py-3
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <CheckCircle2
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
                    Principal Repayments
                  </h3>
                </div>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-slate-600
                  "
                >
                  Principal paid during
                  bond period
                </p>
              </div>

              <div className="text-right">
                <p
                  className="
                    text-[10px]
                    text-slate-600
                  "
                >
                  Remaining
                </p>

                <p
                  className="
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {formatCurrency(
                    principalSummary.remainingPrincipal
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* LIST */}

          <div
            className="
              divide-y
              divide-slate-800
            "
          >
            {principalSummary.repayments.map(
              (
                repayment,
                index
              ) => (
                <div
                  key={`${repayment.date.getTime()}-${index}`}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-4
                    py-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        font-semibold
                        text-slate-300
                      "
                    >
                      {formatDate(
                        repayment.date
                      )}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        text-slate-600
                      "
                    >
                      Principal payment #
                      {index + 1}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className="
                        text-sm
                        font-bold
                        text-emerald-400
                      "
                    >
                      {formatCurrency(
                        repayment.amount
                      )}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        text-slate-600
                      "
                    >
                      Balance{" "}
                      {formatCurrency(
                        repayment.remainingPrincipal
                      )}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* TOTAL */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-slate-800
              bg-slate-900
              px-4
              py-3
            "
          >
            <span
              className="
                text-[11px]
                font-medium
                text-slate-500
              "
            >
              Total Principal Paid
            </span>

            <span
              className="
                text-sm
                font-bold
                text-white
              "
            >
              {formatCurrency(
                principalSummary.totalPrincipalPaid
              )}
            </span>
          </div>
        </div>
      )}

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
        {/* HEADER */}

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
            {yearlySchedule.length}{" "}
            {yearlySchedule.length ===
            1
              ? "Year"
              : "Years"}
          </span>
        </div>

        {/* EMPTY */}

        {yearlySchedule.length ===
        0 ? (
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
            <p
              className="
                text-xs
                font-semibold
                text-slate-400
              "
            >
              No interest schedule
              available
            </p>

            <p
              className="
                mt-1
                text-[11px]
                leading-5
                text-slate-600
              "
            >
              Please check the first
              payout date, maturity
              date and coupon frequency.
            </p>
          </div>
        ) : (
          <div
            className="
              mt-3
              overflow-hidden
              rounded-xl
              border
              border-slate-800
            "
          >
            {yearlySchedule.map(
              (
                yearData,
                index
              ) => (
                <BondYearGroup
                  key={
                    yearData.year
                  }
                  yearData={
                    yearData
                  }
                  defaultOpen={
                    index === 0
                  }
                />
              )
            )}
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
          {/* PURCHASE */}

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

          {/* MATURITY */}

          <div className="text-right">
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

// ==================================================
// SUMMARY BOX
// ==================================================

function SummaryBox({
  label,
  value,
  valueClass,
}) {
  return (
    <div
      className="
        rounded-xl
        bg-slate-800/60
        p-3
      "
    >
      <p
        className="
          text-[10px]
          font-medium
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1
          text-sm
          font-bold
          ${valueClass}
        `}
      >
        {value}
      </p>
    </div>
  );
}

export default BondTransactionCard;