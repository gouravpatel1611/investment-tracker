function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatUnits(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function MutualFundSummaryCard({ data }) {
  const profitLoss = Number(data.profitLoss) || 0;
  const returnPercent = Number(data.returnPercent) || 0;

  const isProfit = profitLoss >= 0;

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border border-zinc-700
        bg-gradient-to-br
        from-zinc-900
        via-neutral-900
        to-black
        p-4
        shadow-lg
        shadow-black/40
      "
    >

      {/* SUBTLE GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-white/[0.025]
          blur-3xl
        "
      />

      <div className="relative">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-3">

          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-zinc-400
              "
            >
              Mutual Funds
            </p>

            <h2 className="mt-0.5 text-base font-extrabold text-white">
              Portfolio Summary
            </h2>
          </div>

          {/* RETURN */}
          <div
            className={`
              rounded-full
              border
              px-2.5
              py-1
              text-xs
              font-bold
              ${
                isProfit
                  ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                  : "border-red-400/25 bg-red-400/10 text-red-300"
              }
            `}
          >
            {isProfit ? "+" : ""}
            {returnPercent.toFixed(2)}%
          </div>

        </div>

        {/* CURRENT VALUE */}
        <div className="mt-4">

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-zinc-400
            "
          >
            Current Value
          </p>

          <p
            className="
              mt-0.5
              text-2xl
              font-black
              tracking-tight
              text-white
            "
          >
            {formatCurrency(data.currentValue)}
          </p>

        </div>

        {/* MAIN STATS */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">

          {/* INVESTED */}
          <div
            className="
              rounded-xl
              border
              border-zinc-700/80
              bg-white/[0.045]
              px-3
              py-2.5
            "
          >
            <p className="text-[10px] font-medium text-zinc-400">
              Invested
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-sm
                font-bold
                text-zinc-100
              "
            >
              {formatCurrency(data.invested)}
            </p>
          </div>

          {/* PROFIT / LOSS */}
          <div
            className={`
              rounded-xl
              border
              px-3
              py-2.5
              ${
                isProfit
                  ? "border-emerald-400/20 bg-emerald-400/[0.07]"
                  : "border-red-400/20 bg-red-400/[0.07]"
              }
            `}
          >
            <p className="text-[10px] font-medium text-zinc-400">
              Profit / Loss
            </p>

            <p
              className={`
                mt-0.5
                truncate
                text-sm
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
          </div>

        </div>

        {/* BOTTOM STATS */}
        <div
          className="
            mt-2.5
            flex
            items-center
            justify-between
            border-t
            border-zinc-700/70
            pt-2.5
          "
        >

          {/* TOTAL UNITS */}
          <div>
            <p className="text-[10px] font-medium text-zinc-400">
              Total Units
            </p>

            <p
              className="
                mt-0.5
                text-xs
                font-bold
                text-zinc-100
              "
            >
              {formatUnits(data.units)}
            </p>
          </div>

          {/* HOLDINGS */}
          <div className="text-right">

            <p className="text-[10px] font-medium text-zinc-400">
              Holdings
            </p>

            <p
              className="
                mt-0.5
                text-xs
                font-bold
                text-zinc-100
              "
            >
              {data.holdings}{" "}
              {data.holdings === 1
                ? "Fund"
                : "Funds"}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default MutualFundSummaryCard;