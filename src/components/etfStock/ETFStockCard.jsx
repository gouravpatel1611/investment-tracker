
import {
  IndianRupee,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

/* =========================================================
   FORMAT UNITS
========================================================= */

function formatUnits(value = 0) {
  const number = Number(value) || 0;

  return number.toLocaleString("en-IN", {
    maximumFractionDigits: 4,
  });
}

/* =========================================================
   FORMAT PERCENT
========================================================= */

function formatPercent(value = 0) {
  const number = Number(value) || 0;

  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
}

/* =========================================================
   ETF / STOCK CARD
========================================================= */

function ETFStockCard({
  holding = {},
  onClick,
}) {
  const {
    name = "Unknown",
    symbol = "-",
    assetType = "STOCK",
    units = 0,
    investedAmount = 0,
    averageBuyPrice = 0,
    currentPrice = 0,
    currentValue = 0,
    profitLoss = 0,
    returnPercent = 0,
  } = holding;

  const numericProfitLoss =
    Number(profitLoss) || 0;

  const numericReturn =
    Number(returnPercent) || 0;

  const isProfit =
    numericProfitLoss >= 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        text-left
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        p-4
        shadow-sm
        transition
        duration-200
        hover:border-slate-600
        hover:bg-slate-800
        active:scale-[0.99]
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        {/* NAME + SYMBOL */}

        <div className="min-w-0">

          <h3
            className="
              truncate
              text-sm
              font-bold
              text-white
            "
          >
            {name}
          </h3>

          <div
            className="
              mt-1.5
              flex
              items-center
              gap-2
            "
          >
            {/* SYMBOL */}

            <span
              className="
                text-xs
                font-semibold
                text-slate-400
              "
            >
              {symbol}
            </span>

            {/* ASSET TYPE */}

            <span
              className="
                rounded-md
                bg-slate-800
                px-2
                py-0.5
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-slate-300
              "
            >
              {assetType}
            </span>

          </div>

        </div>

        {/* RETURN */}

        <div
          className={`
            flex
            shrink-0
            items-center
            gap-1
            text-xs
            font-bold
            ${
              isProfit
                ? "text-emerald-400"
                : "text-red-400"
            }
          `}
        >
          {isProfit ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}

          {formatPercent(
            numericReturn
          )}
        </div>

      </div>

      {/* =================================================
          CURRENT VALUE
      ================================================= */}

      <div className="mt-5">

        <p
          className="
            text-[11px]
            font-medium
            text-slate-400
          "
        >
          Current Value
        </p>

        <p
          className="
            mt-0.5
            text-xl
            font-extrabold
            tracking-tight
            text-white
          "
        >
          {formatCurrency(
            currentValue
          )}
        </p>

      </div>

      {/* =================================================
          MAIN STATS
      ================================================= */}

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-x-4
          gap-y-3
        "
      >
        {/* UNITS */}

        <div>
          <p
            className="
              text-[11px]
              font-medium
              text-slate-400
            "
          >
            Units
          </p>

          <p
            className="
              mt-0.5
              text-sm
              font-bold
              text-slate-200
            "
          >
            {formatUnits(units)}
          </p>
        </div>

        {/* INVESTED */}

        <div>
          <p
            className="
              text-[11px]
              font-medium
              text-slate-400
            "
          >
            Invested Amount
          </p>

          <p
            className="
              mt-0.5
              text-sm
              font-bold
              text-slate-200
            "
          >
            {formatCurrency(
              investedAmount
            )}
          </p>
        </div>

        {/* AVERAGE BUY PRICE */}

        <div>
          <p
            className="
              text-[11px]
              font-medium
              text-slate-400
            "
          >
            Avg. Buy Price
          </p>

          <p
            className="
              mt-0.5
              text-sm
              font-bold
              text-slate-200
            "
          >
            {formatCurrency(
              averageBuyPrice
            )}
          </p>
        </div>

        {/* CURRENT PRICE */}

        <div>
          <p
            className="
              text-[11px]
              font-medium
              text-slate-400
            "
          >
            Current Price
          </p>

          <p
            className="
              mt-0.5
              text-sm
              font-bold
              text-slate-200
            "
          >
            {formatCurrency(
              currentPrice
            )}
          </p>
        </div>
      </div>

      {/* =================================================
          PROFIT / LOSS
      ================================================= */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          border-t
          border-slate-700
          pt-3
        "
      >
        <div className="flex items-center gap-2">

          {isProfit ? (
            <TrendingUp
              size={15}
              className="text-emerald-400"
            />
          ) : (
            <TrendingDown
              size={15}
              className="text-red-400"
            />
          )}

          <span
            className="
              text-xs
              font-medium
              text-slate-400
            "
          >
            Profit / Loss
          </span>

        </div>

        <span
          className={`
            text-sm
            font-extrabold
            ${
              isProfit
                ? "text-emerald-400"
                : "text-red-400"
            }
          `}
        >
          {isProfit ? "+" : "-"}
          {formatCurrency(
            Math.abs(numericProfitLoss)
          )}
        </span>

      </div>
    </button>
  );
}

export default ETFStockCard;

