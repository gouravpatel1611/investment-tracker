import {
  ArrowDownToLine,
  CalendarDays,
  IndianRupee,
  Plus,
} from "lucide-react";

import {
  calculateYearlyInterestSchedule,
  calculatePrincipalSummary,
} from "../../../utils/bondInterestSchedule";

import BondYearGroup
  from "./BondYearGroup";

import BondPrincipalRepaymentSummary from "./BondPrincipalRepaymentSummary";
import BondFinancialSummary from "./BondFinancialSummary";

import {
  calculateBondFinancialSummary,
} from "../../../utils/bondCalculations";

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


 const financialSummary =
  calculateBondFinancialSummary(bond);


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
          mb-3
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

      <div className="m-3">
        <BondFinancialSummary
          {...financialSummary}
          formatCurrency={formatCurrency}
      />
      </div>

     

      {/* ==================================================
          PRINCIPAL REPAYMENT SUMMARY
      ================================================== */}
      <div className="mt-3 mb-3"></div>
      <BondPrincipalRepaymentSummary
        principalSummary={principalSummary}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

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
                    false
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


export default BondTransactionCard;