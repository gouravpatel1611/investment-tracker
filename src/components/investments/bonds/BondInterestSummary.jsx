import {
  Banknote,
  CalendarCheck2,
  CalendarClock,
  Percent,
  Wallet,
  Hash,
  Layers,
} from "lucide-react";

import BondFinancialSummary from "./BondFinancialSummary";
// ==================================================
// SUMMARY ITEM
// ==================================================

function SummaryItem({
  icon: Icon,
  label,
  value,
  valueClass = "text-slate-200",
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-2
        rounded-lg
        border
        border-slate-800
        bg-slate-900/50
        px-2.5
        py-2
      "
    >
      {/* SMALL ICON */}

      <div
        className="
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-md
          bg-slate-800
          text-slate-400
        "
      >
        <Icon size={12} />
      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">
        <p
          className="
            whitespace-nowrap
            text-[10px]
            font-medium
            text-slate-500
          "
        >
          {label}
        </p>

        <p
          className={`
            mt-0.5
            whitespace-nowrap
            text-xs
            font-bold
            leading-none
            sm:text-sm
            ${valueClass}
          `}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ==================================================
// MAIN COMPONENT
// ==================================================

function BondInterestSummary({
  receivedInterest = 0,
  remainingInterest = 0,
  receivedPayments = 0,
  remainingPayments = 0,
  totalInterest = 0,
  principalAmount = 0,
  formatCurrency,
}) {
  const received = Number(receivedInterest) || 0;
  const remaining = Number(remainingInterest) || 0;
  const total = Number(totalInterest) || 0;
  const principal = Number(principalAmount) || 0;
  const paidPayments = Number(receivedPayments) || 0;
  const pendingPayments = Number(remainingPayments) || 0;

  return (
    <div
      className="
        border-t
        border-slate-800
        px-4
        py-3
        sm:px-5
      "
    >
        {/* HEADER */}

        <div className="mb-2.5">
            <h3
                className="
                text-xs
                font-bold
                text-slate-200
                "
            >
                Bond details
            </h3>

        </div>

      {/* SUMMARY */}

      <div
        className="
          grid
          grid-cols-2
          gap-2
          sm:grid-cols-3
        "
      >
        <SummaryItem
            icon={Hash}
            label="ISIN Number"
            value={ "-"}
            valueClass="text-slate-200"
        />

            <SummaryItem
            icon={Layers}
            label="Quantity"
            value={ 0}
            valueClass="text-slate-200"
        />
      </div>
        {/* HEADER */}

        <div className="mb-2.5 mt-3">
            <h3
                className="
                text-xs
                font-bold
                text-slate-200
                "
            >
                Interest Summary
            </h3>

            <p
                className="
                mt-0.5
                text-[9px]
                text-slate-600
                "
            >
                Bond interest details
            </p>
        </div>

      {/* SUMMARY */}
        <BondFinancialSummary
            principalAmount={principal}
            principalReceived={principal - principalRemaining}
            principalRemaining={principalRemaining}
            totalInterest={total}
            interestReceived={received}
            interestRemaining={remaining}
            formatCurrency={formatCurrency}
        />


    </div>
  );
}

export default BondInterestSummary;