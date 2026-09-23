
import {
  CircleDollarSign,
  TrendingUp,
  Wallet,
  BarChart3,
  PiggyBank,
  ArrowDownToLine,
} from "lucide-react";

function formatDollar(value = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  iconClass = "text-orange-300",
  valueClass = "text-white",
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />

        <p className="text-sm font-bold text-white">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 truncate text-center text-lg font-extrabold leading-tight sm:text-xl ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function VortaxaDetailsSummary({ summary = {} }) {
  const {
    liquidity = 0,
    fule = 0,
    piFule = 0,
    grossEarn = 0,
    totalEarnWithdrawn = 0,
    availableEarn = 0,
  } = summary;

  return (
    <div
      className="mb-4 rounded-2xl border border-slate-700 bg-slate-800 p-3 font-[Calibri] sm:p-4"
      style={{ fontFamily: "Calibri, Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/15">
          <CircleDollarSign className="h-5 w-5 text-orange-300" />
        </div>

        <div className="min-w-0">
          <p className="text-base font-extrabold text-white">
            Investment Summary
          </p>

          <p className="text-xs font-medium text-white">
            Current Vortaxa position
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">

        {/* Liquidity */}
        <SummaryItem
          icon={Wallet}
          label="Liquidity"
          value={formatDollar(liquidity)}
          iconClass="text-sky-300"
          valueClass="text-sky-400"
        />

        {/* EARN */}
        <SummaryItem
          icon={TrendingUp}
          label="$ EARN"
          value={formatDollar(grossEarn)}
          iconClass="text-emerald-300"
          valueClass="text-emerald-400"
        />

        {/* FULE */}
        <SummaryItem
          icon={BarChart3}
          label="FULE"
          value={formatDollar(fule)}
          iconClass="text-violet-300"
          valueClass="text-violet-400"
        />

        {/* Withdrawn */}
        <SummaryItem
          icon={ArrowDownToLine}
          label="$ Withdrawn"
          value={formatDollar(totalEarnWithdrawn)}
          iconClass="text-rose-300"
          valueClass="text-rose-400"
        />

        {/* PI FULE */}
        <SummaryItem
          icon={PiggyBank}
          label="PI FULE"
          value={formatDollar(piFule)}
          iconClass="text-amber-300"
          valueClass="text-amber-400"
        />

        {/* Balance */}
        <SummaryItem
          icon={TrendingUp}
          label="$ BLANCE"
          value={formatDollar(availableEarn)}
          iconClass="text-cyan-300"
          valueClass="text-cyan-400"
        />

      </div>
    </div>
  );
}

export default VortaxaDetailsSummary;

