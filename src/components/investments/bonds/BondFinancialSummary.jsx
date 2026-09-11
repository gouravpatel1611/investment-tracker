import {
  Banknote,
  CircleDollarSign,
  Wallet,
  Landmark,
  TrendingUp,
  Clock3,
} from "lucide-react";

// ==================================================
// SUMMARY ITEM
// ==================================================

function SummaryItem({
  icon: Icon,
  label,
  value,
  iconClass,
  valueClass,
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
      {/* ICON */}

      <div
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-md
          bg-slate-800
          ${iconClass}
        `}
      >
        <Icon size={12} />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <p
          className="
            truncate
            text-[9px]
            font-medium
            text-slate-500
          "
        >
          {label}
        </p>

        <p
          className={`
            mt-0.5
            truncate
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

function BondFinancialSummary({
  principalAmount = 0,
  principalReceived = 0,
  principalRemaining = 0,

  totalInterest = 0,
  interestReceived = 0,
  interestRemaining = 0,

  formatCurrency,
}) {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-2
      "
    >
      {/* ==========================================
          TOTAL PRINCIPAL
      ========================================== */}

      <SummaryItem
        icon={Wallet}
        label="Total Principal"
        value={formatCurrency(principalAmount)}
        iconClass="text-sky-400"
        valueClass="text-slate-200"
      />

      {/* ==========================================
          TOTAL INTEREST
      ========================================== */}

      <SummaryItem
        icon={CircleDollarSign}
        label="Total Interest"
        value={formatCurrency(totalInterest)}
        iconClass="text-violet-400"
        valueClass="text-slate-200"
      />

      {/* ==========================================
          PRINCIPAL RECEIVED
      ========================================== */}

      <SummaryItem
        icon={Banknote}
        label="Principal Received"
        value={formatCurrency(principalReceived)}
        iconClass="text-emerald-400"
        valueClass="text-emerald-400"
      />

      {/* ==========================================
          INTEREST RECEIVED
      ========================================== */}

      <SummaryItem
        icon={TrendingUp}
        label="Interest Received"
        value={formatCurrency(interestReceived)}
        iconClass="text-emerald-400"
        valueClass="text-emerald-400"
      />

      {/* ==========================================
          PRINCIPAL REMAINING
      ========================================== */}

      <SummaryItem
        icon={Landmark}
        label="Principal Remaining"
        value={formatCurrency(principalRemaining)}
        iconClass="text-amber-400"
        valueClass="text-amber-400"
      />

      {/* ==========================================
          INTEREST REMAINING
      ========================================== */}

      <SummaryItem
        icon={Clock3}
        label="Interest Remaining"
        value={formatCurrency(interestRemaining)}
        iconClass="text-amber-400"
        valueClass="text-amber-400"
      />
    </div>
  );
}

export default BondFinancialSummary;