
import {
  Layers3,
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
   FORMAT PERCENT
========================================================= */

function formatPercent(value = 0) {
  const number = Number(value) || 0;

  return `${number >= 0 ? "+" : ""}${number.toFixed(2)}%`;
}

/* =========================================================
   SUMMARY CARD
========================================================= */

export default function ETFStockSummaryCard({
  summary = {},
}) {
  const {
    totalInvested = 0,

    /* =====================================================
       CONTEXT SE VALUE AAYEGI
    ===================================================== */
    totalCurrentValue = 0,

    totalProfitLoss = 0,

    totalReturnPercent = 0,

    totalHoldings = 0,
  } = summary;

  const numericProfitLoss =
    Number(totalProfitLoss) || 0;

  const numericReturn =
    Number(totalReturnPercent) || 0;

  const numericCurrentValue =
    Number(totalCurrentValue) || 0;

  const isProfit =
    numericProfitLoss >= 0;

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        shadow-lg
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
          gap-4
          border-b
          border-slate-700
          px-5
          py-5
        "
      >

        <div className="min-w-0">

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
              text-slate-400
            "
          >
            Portfolio Summary
          </p>

          <p
            className="
              mt-1.5
              text-base
              font-semibold
              tracking-tight
              text-white
            "
          >
            ETF & Stock Investments
          </p>

        </div>


        {/* HOLDINGS */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2.5
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            px-3.5
            py-2.5
          "
        >

          <Layers3
            size={17}
            className="text-slate-400"
          />

          <div>

            <p
              className="
                text-[11px]
                font-medium
                text-slate-400
              "
            >
              Holdings
            </p>

            <p
              className="
                mt-0.5
                text-base
                font-bold
                leading-none
                text-white
              "
            >
              {totalHoldings}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          INVESTMENT VALUES
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

        {/* TOTAL INVESTED */}

        <div
          className="
            px-5
            py-5
          "
        >

          <p
            className="
              text-xs
              font-medium
              text-slate-400
            "
          >
            Total Invested
          </p>

          <p
            className="
              mt-1.5
              text-lg
              font-extrabold
              tracking-tight
              text-white
              sm:text-xl
            "
          >
            {formatCurrency(totalInvested)}
          </p>

        </div>


        {/* CURRENT VALUE */}

        <div
          className="
            px-5
            py-5
          "
        >

          <p
            className="
              text-xs
              font-medium
              text-slate-400
            "
          >
            Current Value
          </p>

          <p
            className="
              mt-1.5
              text-lg
              font-extrabold
              tracking-tight
              text-white
              sm:text-xl
            "
          >
            {formatCurrency(
              numericCurrentValue
            )}
          </p>

        </div>

      </div>


      {/* =================================================
          PROFIT / LOSS + RETURN
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-5
          px-5
          py-5
        "
      >

        {/* PROFIT / LOSS */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${
                isProfit
                  ? "bg-emerald-500/10"
                  : "bg-red-500/10"
              }
            `}
          >

            {isProfit ? (
              <TrendingUp
                size={19}
                className="text-emerald-400"
              />
            ) : (
              <TrendingDown
                size={19}
                className="text-red-400"
              />
            )}

          </div>


          <div className="min-w-0">

            <p
              className="
                text-xs
                font-medium
                text-slate-400
              "
            >
              Total Profit / Loss
            </p>

            <p
              className={`
                mt-1
                text-base
                font-extrabold
                tracking-tight
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
            </p>

          </div>

        </div>


        {/* RETURN */}

        <div
          className="
            shrink-0
            rounded-xl
            bg-slate-800
            px-4
            py-2.5
            text-right
          "
        >

          <p
            className="
              text-[11px]
              font-medium
              text-slate-400
            "
          >
            Return
          </p>

          <p
            className={`
              mt-0.5
              text-base
              font-extrabold
              ${
                isProfit
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}
          >
            {formatPercent(
              numericReturn
            )}
          </p>

        </div>

      </div>

    </div>
  );
}
