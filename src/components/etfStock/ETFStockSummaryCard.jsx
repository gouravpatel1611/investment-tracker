
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
          items-center
          justify-between
          gap-3
          border-b
          border-slate-700
          px-4
          py-4
        "
      >

        <div className="min-w-0">

          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-white
            "
          >
            Portfolio Summary
          </p>

          <p
            className="
              mt-1
              truncate
              text-base
              font-bold
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
            gap-2
            rounded-lg
            border
            border-slate-700
            bg-slate-800
            px-2.5
            py-2
          "
        >

          <Layers3
            size={15}
            className="text-white"
          />

          <div>

            <p
              className="
                text-[10px]
                font-medium
                text-white
              "
            >
              Holdings
            </p>

            <p
              className="
                mt-0.5
                text-sm
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
            px-4
            py-3.5
          "
        >

          <p
            className="
              text-[11px]
              font-medium
              text-white
            "
          >
            Total Invested
          </p>

          <p
            className="
              mt-1
              text-lg
              font-extrabold
              tracking-tight
              text-yellow-400
            "
          >
            {formatCurrency(totalInvested)}
          </p>

        </div>


        {/* CURRENT VALUE */}

        <div
          className="
            px-4
            py-3.5
          "
        >

          <p
            className="
              text-[11px]
              font-medium
              text-white
            "
          >
            Current Value
          </p>

          <p
            className="
              mt-1
              text-lg
              font-extrabold
              tracking-tight
              text-white
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
          gap-3
          px-4
          py-3
        "
      >

        {/* PROFIT / LOSS */}

        <div className="min-w-0">

          <p
            className="
              text-[11px]
              font-medium
              text-white
            "
          >
            Total Profit / Loss
          </p>

          <div
            className={`
              mt-0.5
              flex
              items-center
              gap-1.5
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

            {isProfit ? (
              <TrendingUp size={15} />
            ) : (
              <TrendingDown size={15} />
            )}

            <span>
              {isProfit ? "+" : "-"}
              {formatCurrency(
                Math.abs(numericProfitLoss)
              )}
            </span>

          </div>

        </div>


        {/* RETURN */}

        <div
          className="
            shrink-0
            rounded-lg
            border
            border-slate-700
            bg-slate-800
            px-3
            py-1.5
            text-right
          "
        >

          <p
            className="
              text-[10px]
              font-medium
              text-white
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
