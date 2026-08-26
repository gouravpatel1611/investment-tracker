import {
  TrendingUp,
  TrendingDown,
  UserRound,
  FileText,
  Hash,
} from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function MutualFundCard({ fund }) {
  const isProfit = fund.profitLoss >= 0;

  return (
    <div
      className="
        relative overflow-hidden
        rounded-2xl
        border border-slate-700/60
        bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800
        p-4
        shadow-lg shadow-slate-950/20
      "
    >

      {/* TOP ACCENT */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          isProfit ? "bg-emerald-500" : "bg-red-500"
        }`}
      />

      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-white">
              {fund.schemeName}
            </h3>
          </div>

          <p className="mt-1 truncate text-[11px] text-slate-400">
            {fund.amcName} • {fund.category}
          </p>

        </div>

        {/* RETURN */}
        <div
          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            isProfit
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isProfit ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}

          {isProfit ? "+" : ""}
          {fund.returnPercent.toFixed(2)}%
        </div>

      </div>

      {/* CURRENT VALUE */}
      <div className="mt-3">

        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Current Value
        </p>

        <div className="mt-0.5 flex items-end justify-between gap-3">

          <p className="text-2xl font-extrabold tracking-tight text-white">
            {formatCurrency(fund.currentValue)}
          </p>

          <div
            className={`text-right text-xs font-bold ${
              isProfit
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {isProfit ? "+" : ""}
            {formatCurrency(fund.profitLoss)}
          </div>

        </div>

        <p className="mt-0.5 text-[10px] text-slate-500">
          Profit / Loss
        </p>

      </div>

      {/* INVESTMENT DETAILS */}
      <div className="mt-3 grid grid-cols-3 gap-2">

        <div className="rounded-xl bg-white/[0.04] px-2.5 py-2">
          <p className="text-[10px] text-slate-500">
            Invested
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-slate-200">
            {formatCurrency(fund.investedAmount)}
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.04] px-2.5 py-2">
          <p className="text-[10px] text-slate-500">
            Units
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-slate-200">
            {fund.units.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.04] px-2.5 py-2">
          <p className="text-[10px] text-slate-500">
            NAV
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-slate-200">
            ₹{fund.nav.toFixed(2)}
          </p>
        </div>

      </div>

      {/* META INFORMATION */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-700/60 pt-3">

        {/* SCHEME CODE */}
        <div className="flex items-center gap-1.5">
          <Hash size={12} className="text-slate-500" />

          <span className="text-[10px] text-slate-500">
            Scheme
          </span>

          <span className="text-[10px] font-semibold text-slate-300">
            {fund.schemeCode}
          </span>
        </div>

        {/* INVESTOR */}
        <div className="flex items-center gap-1.5">
          <UserRound size={12} className="text-slate-500" />

          <span className="text-[10px] font-semibold text-slate-300">
            {fund.investorName}
          </span>
        </div>

        {/* FOLIO */}
        <div className="flex items-center gap-1.5">
          <FileText size={12} className="text-slate-500" />

          <span className="text-[10px] text-slate-500">
            Folio
          </span>

          <span className="text-[10px] font-semibold text-slate-300">
            {fund.folioNumber}
          </span>
        </div>

      </div>

    </div>
  );
}

export default MutualFundCard;