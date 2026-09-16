
import {
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
   FORMAT PRICE — 2 DECIMAL
========================================================= */

function formatPrice(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
        overflow-hidden
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        p-4
        text-left
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
              text-base
              font-bold
              tracking-tight
              text-white
            "
          >
            {name}
          </h3>

          <div
            className="
              mt-1
              flex
              items-center
              gap-2
            "
          >

            {/* SYMBOL */}

            <span
              className="
                text-sm
                font-semibold
                text-white
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
                py-1
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-white
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
            gap-1.5
            rounded-lg
            px-2.5
            py-1.5
            text-sm
            font-bold
            ${
              isProfit
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }
          `}
        >

          {isProfit ? (
            <TrendingUp size={15} />
          ) : (
            <TrendingDown size={15} />
          )}

          {formatPercent(numericReturn)}

        </div>

      </div>


      {/* =================================================
          FINANCIAL DETAILS
      ================================================= */}

      <div
        className="
          mt-5
          overflow-hidden
          rounded-xl
          border
          border-slate-700
          bg-slate-800/40
        "
      >

        {/* =================================================
            ROW 1 — UNIT / GAIN LOSS
        ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            divide-x
            divide-slate-700
            border-b
            border-slate-700
          "
        >

          {/* UNIT */}

          <div className="px-3.5 py-3">

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-white
              "
            >
              Unit
            </p>

            <p
              className="
                mt-1
                text-base
                font-bold
                text-white
              "
            >
              {formatUnits(units)}
            </p>

          </div>


          {/* GAIN / LOSS */}

          <div className="px-3.5 py-3">

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-white
              "
            >
              Gain / Loss
            </p>

            <div
              className={`
                mt-1
                flex
                items-center
                gap-1.5
                text-base
                font-extrabold
                ${
                  isProfit
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              `}
            >

              {isProfit ? (
                <TrendingUp size={15} />
              ) : (
                <TrendingDown size={15} />
              )}

              {isProfit ? "+" : "-"}
              {formatCurrency(
                Math.abs(numericProfitLoss)
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            ROW 2 — AVG PRICE / CURRENT PRICE
        ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            divide-x
            divide-slate-700
            border-b
            border-slate-700
          "
        >

          {/* AVG PRICE */}

          <div className="px-3.5 py-3">

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-white
              "
            >
              Avg. Price
            </p>

            <p
              className="
                mt-1
                text-base
                font-bold
                tracking-tight
                text-white
              "
            >
              {formatPrice(averageBuyPrice)}
            </p>

          </div>


          {/* CURRENT PRICE */}

          <div className="px-3.5 py-3">

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-white
              "
            >
              Current Price
            </p>

            <p
              className="
                mt-1
                text-base
                font-bold
                tracking-tight
                text-white
              "
            >
              {formatPrice(currentPrice)}
            </p>

          </div>

        </div>


        {/* =================================================
            ROW 3 — COST / CURRENT VALUE
        ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            divide-x
            divide-slate-700
          "
        >

          {/* COST */}

          <div className="px-3.5 py-3">

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-white
              "
            >
              Cost
            </p>

            <p
              className="
                mt-1
                text-base
                font-bold
                tracking-tight
                text-white
              "
            >
              {formatCurrency(investedAmount)}
            </p>

          </div>


          {/* CURRENT VALUE */}

          <div
            className="
              bg-slate-800/70
              px-3.5
              py-3
            "
          >

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-wide
                text-white
              "
            >
              Current Value
            </p>

            <p
              className="
                mt-1
                text-base
                font-extrabold
                tracking-tight
                text-white
              "
            >
              {formatCurrency(currentValue)}
            </p>

          </div>

        </div>

      </div>

    </button>
  );
}

export default ETFStockCard;

