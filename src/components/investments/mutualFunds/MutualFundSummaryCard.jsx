function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function MutualFundSummaryCard({ data }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-700/80
        bg-slate-800
        p-4
        shadow-sm
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400">
            MUTUAL FUNDS
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-white">
            Equity & Hybrid
          </h2>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-purple-500/15
            text-purple-300
          "
        >
          MF
        </div>
      </div>

      {/* CURRENT VALUE */}
      <div className="mt-5">
        <p className="text-xs text-slate-400">
          Current Value
        </p>

        <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">
          {formatCurrency(data.currentValue)}
        </p>
      </div>

      {/* STATS */}
      <div className="mt-5 grid grid-cols-3 gap-3">

        <div>
          <p className="text-[11px] text-slate-500">
            Invested
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {formatCurrency(data.invested)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-500">
            Profit / Loss
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              data.profitLoss >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {data.profitLoss >= 0 ? "+" : ""}
            {formatCurrency(data.profitLoss)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-slate-500">
            Holdings
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {data.holdings}
          </p>
        </div>

      </div>
    </div>
  );
}

export default MutualFundSummaryCard;