import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Landmark,
  Wallet,
} from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function BondSummaryCard({ data }) {
  const {
    invested = 0,
    currentValue = 0,
    profit = 0,
    returnPercent = 0,
    holdings = 0,
  } = data || {};

  const isProfit = Number(profit) >= 0;

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

      {/* --------------------------------
          TOP
      -------------------------------- */}

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

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-400
            "
          >
            <Landmark size={20} />
          </div>

          <div>

            <p className="text-xs text-slate-400">
              Bond Portfolio
            </p>

            <p className="mt-0.5 text-sm font-bold text-slate-100">
              {holdings}{" "}
              {holdings === 1
                ? "Bond"
                : "Bonds"}
            </p>

          </div>

        </div>

        <Wallet
          size={19}
          className="text-slate-500"
        />

      </div>


      {/* --------------------------------
          CURRENT VALUE
      -------------------------------- */}

      <div className="px-4 pt-5 sm:px-5">

        <p className="text-xs font-medium text-slate-400">
          Current Value
        </p>

        <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
          {formatCurrency(currentValue)}
        </p>

      </div>


      {/* --------------------------------
          STATS
      -------------------------------- */}

      <div
        className="
          grid
          grid-cols-2
          gap-3
          p-4
          sm:grid-cols-4
          sm:px-5
          sm:pb-5
        "
      >

        {/* INVESTED */}

        <div
          className="
            rounded-xl
            bg-slate-800/60
            p-3
          "
        >

          <p className="text-[11px] font-medium text-slate-500">
            Invested
          </p>

          <p className="mt-1 text-sm font-bold text-slate-200">
            {formatCurrency(invested)}
          </p>

        </div>


        {/* PROFIT */}

        <div
          className="
            rounded-xl
            bg-slate-800/60
            p-3
          "
        >

          <p className="text-[11px] font-medium text-slate-500">
            Profit
          </p>

          <div className="mt-1 flex items-center gap-1">

            {isProfit ? (
              <TrendingUp
                size={14}
                className="text-emerald-400"
              />
            ) : (
              <TrendingDown
                size={14}
                className="text-red-400"
              />
            )}

            <p
              className={`
                text-sm
                font-bold
                ${
                  isProfit
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              `}
            >
              {isProfit ? "+" : ""}
              {formatCurrency(profit)}
            </p>

          </div>

        </div>


        {/* RETURN */}

        <div
          className="
            rounded-xl
            bg-slate-800/60
            p-3
          "
        >

          <p className="text-[11px] font-medium text-slate-500">
            Return
          </p>

          <p
            className={`
              mt-1
              text-sm
              font-bold
              ${
                isProfit
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}
          >
            {isProfit ? "+" : ""}
            {formatPercent(returnPercent)}
          </p>

        </div>


        {/* HOLDINGS */}

        <div
          className="
            rounded-xl
            bg-slate-800/60
            p-3
          "
        >

          <p className="text-[11px] font-medium text-slate-500">
            Holdings
          </p>

          <p className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-200">
            <IndianRupee
              size={13}
              className="text-slate-500"
            />

            {holdings}
          </p>

        </div>

      </div>

    </div>
  );
}

export default BondSummaryCard;