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
  }).format(Number(value) || 0);
}

function MutualFundCard({ fund }) {
  const profitLoss = Number(fund.profitLoss) || 0;
  const returnPercent = Number(fund.returnPercent) || 0;

  const isProfit = profitLoss >= 0;

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border border-slate-600/70
        bg-gradient-to-br
        from-slate-950
        via-slate-900
        to-slate-800
        p-4
        shadow-lg
        shadow-black/30
      "
    >

      {/* SIDE ACCENT */}
      <div
        className={`
          absolute
          left-0
          top-0
          h-full
          w-1
          ${
            isProfit
              ? "bg-emerald-400"
              : "bg-red-400"
          }
        `}
      />

      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">

        {/* SCHEME */}
        <div className="min-w-0">

          <h3 className="truncate text-sm font-bold text-white">
            {fund.schemeName}
          </h3>

          <p className="mt-1 truncate text-[11px] font-medium text-slate-300">
            {fund.amcName} • {fund.category}
          </p>

        </div>

        {/* RETURN */}
        <div
          className={`
            flex
            shrink-0
            items-center
            gap-1
            rounded-full
            border
            px-2.5
            py-1
            text-[11px]
            font-bold
            ${
              isProfit
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/25 bg-red-400/10 text-red-300"
            }
          `}
        >
          {isProfit ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}

          {isProfit ? "+" : ""}
          {returnPercent.toFixed(2)}%
        </div>

      </div>

      {/* CURRENT VALUE */}
      <div className="mt-3">

        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-300
          "
        >
          Current Value
        </p>

        <div className="mt-0.5 flex items-end justify-between gap-3">

          {/* CURRENT VALUE */}
          <p
            className="
              truncate
              text-2xl
              font-black
              tracking-tight
              text-white
            "
          >
            {formatCurrency(fund.currentValue)}
          </p>

          {/* PROFIT / LOSS */}
          <div className="shrink-0 text-right">

            <p
              className={`
                text-xs
                font-bold
                ${
                  isProfit
                    ? "text-emerald-300"
                    : "text-red-300"
                }
              `}
            >
              {isProfit ? "+" : ""}
              {formatCurrency(profitLoss)}
            </p>

            <p className="mt-0.5 text-[10px] font-semibold text-slate-300">
              Profit / Loss
            </p>

          </div>

        </div>

      </div>

      {/* DETAILS */}
      <div className="mt-3 grid grid-cols-3 gap-2">

        {/* INVESTED */}
        <div
          className="
            rounded-xl
            border border-white/10
            bg-white/[0.05]
            px-2.5
            py-2
          "
        >
          <p className="text-[10px] font-semibold text-slate-300">
            Invested
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-xs
              font-bold
              text-slate-100
            "
          >
            {formatCurrency(fund.investedAmount)}
          </p>
        </div>

        {/* UNITS */}
        <div
          className="
            rounded-xl
            border border-white/10
            bg-white/[0.05]
            px-2.5
            py-2
          "
        >
          <p className="text-[10px] font-semibold text-slate-300">
            Units
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-xs
              font-bold
              text-slate-100
            "
          >
            {Number(fund.units || 0).toFixed(2)}
          </p>
        </div>

        {/* NAV */}
        <div
          className="
            rounded-xl
            border border-white/10
            bg-white/[0.05]
            px-2.5
            py-2
          "
        >
          <p className="text-[10px] font-semibold text-slate-300">
            NAV
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-xs
              font-bold
              text-slate-100
            "
          >
            ₹{Number(fund.nav || 0).toFixed(2)}
          </p>
        </div>

      </div>

      {/* META */}
      <div
        className="
          mt-3
          flex
          flex-wrap
          items-center
          gap-x-3
          gap-y-2
          border-t
          border-white/10
          pt-3
        "
      >

        {/* SCHEME CODE */}
        <div className="flex items-center gap-1.5">

          <Hash
            size={12}
            className="shrink-0 text-slate-400"
          />

          <span className="text-[10px] font-medium text-slate-300">
            Scheme
          </span>

          <span className="text-[10px] font-bold text-slate-100">
            {fund.schemeCode}
          </span>

        </div>

        {/* INVESTOR */}
        <div className="flex items-center gap-1.5">

          <UserRound
            size={12}
            className="shrink-0 text-slate-400"
          />

          <span className="text-[10px] font-medium text-slate-300">
            Investor
          </span>

          <span className="text-[10px] font-bold text-slate-100">
            {fund.investorName}
          </span>

        </div>

        {/* FOLIO */}
        <div className="flex items-center gap-1.5">

          <FileText
            size={12}
            className="shrink-0 text-slate-400"
          />

          <span className="text-[10px] font-medium text-slate-300">
            Folio
          </span>

          <span className="text-[10px] font-bold text-slate-100">
            {fund.folioNumber}
          </span>

        </div>

      </div>

    </div>
  );
}

export default MutualFundCard;