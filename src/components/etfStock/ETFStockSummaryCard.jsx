
import {
  IndianRupee,
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
    currentValue = 0,
    totalProfitLoss = 0,
    returnPercent = 0,
    totalHoldings = 0,
  } = summary;


  const numericProfitLoss =
    Number(totalProfitLoss) || 0;

  const numericReturn =
    Number(returnPercent) || 0;

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
        shadow-sm
      "
    >

      {/* =================================================
          TOP SECTION
      ================================================= */}

      <div
        className="
          border-b
          border-slate-700
          px-4
          py-4
          sm:px-5
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <div>

            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Portfolio Summary
            </p>

            <p
              className="
                mt-1
                text-sm
                font-medium
                text-slate-200
              "
            >
              ETF & Stock Investments
            </p>

          </div>


          {/* HOLDINGS */}

          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-slate-800
              px-3
              py-2
            "
          >

            <Layers3
              size={15}
              className="text-slate-400"
            />

            <div>

              <p
                className="
                  text-[10px]
                  font-medium
                  text-slate-500
                "
              >
                Holdings
              </p>

              <p
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                {totalHoldings}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN VALUES
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-px
          bg-slate-700
        "
      >

        {/* TOTAL INVESTED */}

        <div
          className="
            bg-slate-900
            px-4
            py-4
          "
        >

          <p
            className="
              text-[11px]
              font-medium
              text-slate-400
            "
          >
            Total Invested
          </p>

          <p
            className="
              mt-1
              text-base
              font-extrabold
              tracking-tight
              text-white
              sm:text-lg
            "
          >
            {formatCurrency(
              totalInvested
            )}
          </p>

        </div>


        {/* CURRENT VALUE */}

        <div
          className="
            bg-slate-900
            px-4
            py-4
          "
        >

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
              mt-1
              text-base
              font-extrabold
              tracking-tight
              text-white
              sm:text-lg
            "
          >
            {formatCurrency(
              currentValue
            )}
          </p>

        </div>

      </div>


      {/* =================================================
          PROFIT / LOSS
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          px-4
          py-4
          sm:px-5
        "
      >

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >

          <div
            className={`
              flex
              h-9
              w-9
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
                size={17}
                className="text-emerald-400"
              />
            ) : (
              <TrendingDown
                size={17}
                className="text-red-400"
              />
            )}

          </div>


          <div>

            <p
              className="
                text-[11px]
                font-medium
                text-slate-400
              "
            >
              Total Profit / Loss
            </p>

            <p
              className={`
                mt-0.5
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
                Math.abs(
                  numericProfitLoss
                )
              )}
            </p>

          </div>

        </div>


        {/* RETURN */}

        <div
          className="
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
              text-sm
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

