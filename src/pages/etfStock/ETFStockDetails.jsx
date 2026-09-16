import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useETFStock,
} from "../../context/ETFStockContext";



/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 4,
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
   FORMAT DATE
========================================================= */

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


/* =========================================================
   COMPONENT
========================================================= */

export default function ETFStockDetails() {

  const {
    symbol,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    holdings,
    deleteTransaction,
    loading,
    priceLoading,
    livePrices,
  } = useETFStock();

  console.log(livePrices);


  /* =======================================================
     CLEAN SYMBOL
  ======================================================= */

  const cleanSymbol =
    String(symbol || "")
      .trim()
      .toUpperCase()
      .replace(/\.NS$/, "");


  /* =======================================================
     FIND HOLDING
  ======================================================= */

  const holding =
    (holdings || []).find(
      (item) =>
        String(
          item.symbol || ""
        )
          .trim()
          .toUpperCase()
          .replace(/\.NS$/, "") ===
        cleanSymbol
    );





  /* =======================================================
     DELETE TRANSACTION
  ======================================================= */

  async function handleDelete(
    transaction
  ) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this transaction?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteTransaction(
        transaction.id
      );

    } catch (error) {

      console.error(
        "Failed to delete transaction:",
        error
      );

      window.alert(
        error?.message ||
        "Failed to delete transaction."
      );
    }
  }


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          bg-slate-950
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-400
          "
        >

          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading...

        </div>

      </div>
    );
  }


  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!holding) {

    return (
      <div
        className="
          min-h-screen
          bg-slate-950
          px-4
          py-5
          sm:px-6
          lg:px-8
        "
      >

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            px-3
            py-2
            text-sm
            font-medium
            text-slate-300
            transition
            hover:border-slate-700
            hover:text-white
          "
        >

          <ArrowLeft
            size={17}
          />

          Back

        </button>


        <div
          className="
            mt-8
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
            text-center
          "
        >

          <p
            className="
              text-sm
              font-semibold
              text-white
            "
          >
            Holding not found
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            This ETF / Stock holding may have
            been removed.
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     TRANSACTIONS
  ======================================================= */

  const transactions =
    [
      ...(holding.transactions || []),
    ].sort(
      (a, b) =>
        String(
          b.transactionDate || ""
        ).localeCompare(
          String(
            a.transactionDate || ""
          )
        )
    );


  /* =======================================================
     PROFIT / LOSS
  ======================================================= */

  const profitLoss =
    Number(
      holding.profitLoss
    ) || 0;

  const returnPercent =
    Number(
      holding.returnPercent
    ) || 0;

  const isProfit =
    profitLoss >= 0;


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        space-y-5
        sm:px-6
        lg:px-8
      "
    >



{/* ===================================================
    COMBINED TOP + ASSET CARD
=================================================== */}

<div
  className="
    overflow-hidden
    rounded-2xl
    border
    border-slate-800
    bg-slate-900
    shadow-lg
  "
>

  {/* TOP BAR */}

  <div
    className="
      flex
      items-center
      border-b
      border-slate-800
      px-4
      py-2
      sm:px-5
    "
  >

    <button
      type="button"
      onClick={() =>
        navigate("/etf-stock")
      }
      className="
        group
        flex
        items-center
        gap-1.5
        rounded-lg
        border
        border-slate-800
        bg-slate-950
        px-2.5
        py-1.5
        text-xs
        font-medium
        text-slate-300
        transition
        hover:border-slate-700
        hover:bg-slate-800
        hover:text-white
      "
    >

      <ArrowLeft
        size={15}
        className="
          transition-transform
          group-hover:-translate-x-0.5
        "
      />

      Back

    </button>

  </div>


  {/* ASSET CONTENT */}

  <div
    className="
      px-4
      py-3
      sm:px-5
      sm:py-3.5
    "
  >

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >

      {/* ASSET INFO */}

      <div
        className="
          min-w-0
        "
      >

        {/* SYMBOL + TYPE */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-1.5
          "
        >

          <p
            className="
              text-[11px]
              font-bold
              tracking-[0.1em]
              text-slate-400
            "
          >
            {holding.symbol}
          </p>


          <span
            className="
              rounded
              border
              border-slate-700
              bg-slate-800
              px-1.5
              py-0.5
              text-[9px]
              font-bold
              uppercase
              tracking-wide
              text-slate-300
            "
          >
            {holding.assetType || "STOCK"}
          </span>

        </div>


        {/* NAME */}

        <h1
          className="
            mt-1
            truncate
            text-lg
            font-bold
            leading-tight
            tracking-tight
            text-white
            sm:text-xl
          "
        >
          {holding.name}
        </h1>

      </div>


      {/* CURRENT PRICE */}

      <div
        className="
          shrink-0
          text-right
        "
      >

        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          Current Price
        </p>


        <p
          className="
            mt-0.5
            text-lg
            font-extrabold
            leading-tight
            tracking-tight
            text-white
            sm:text-xl
          "
        >
          {formatCurrency(
            holding.currentPrice
          )}
        </p>


        {priceLoading && (
          <p
            className="
              mt-0.5
              text-[9px]
              leading-none
              text-slate-500
            "
          >
            Updating...
          </p>
        )}

      </div>

    </div>

  </div>

</div>



{/* ===================================================
    HOLDING SUMMARY
=================================================== */}

<div
  className="
    overflow-hidden
    rounded-2xl
    border
    border-slate-800
    bg-slate-900
    shadow-sm
  "
>

  {/* HEADER */}

  <div
    className="
      flex
      items-center
      justify-between
      border-b
      border-slate-800
      px-4
      py-2.5
    "
  >

    <h2
      className="
        text-sm
        font-bold
        tracking-tight
        text-white
      "
    >
      Holding Summary
    </h2>


    {/* TOTAL RETURN */}

    <div
      className={`
        flex
        items-center
        gap-1.5
        rounded-lg
        px-2
        py-1
        ${
          isProfit
            ? "bg-emerald-500/10"
            : "bg-red-500/10"
        }
      `}
    >

      {isProfit ? (
        <TrendingUp
          size={14}
          className="
            text-emerald-400
          "
        />
      ) : (
        <TrendingDown
          size={14}
          className="
            text-red-400
          "
        />
      )}

      <span
        className={`
          text-xs
          font-bold
          ${
            isProfit
              ? "text-emerald-400"
              : "text-red-400"
          }
        `}
      >
        {formatPercent(
          returnPercent
        )}
      </span>

    </div>

  </div>


  {/* METRICS */}

  <div
    className="
      grid
      grid-cols-2
      lg:grid-cols-4
    "
  >

    {/* UNITS */}

    <div
      className="
        border-b
        border-slate-800
        px-4
        py-3
        lg:border-b-0
        lg:border-r
      "
    >

      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
        "
      >
        Units
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
          leading-tight
          text-white
        "
      >
        {formatNumber(
          holding.units
        )}
      </p>

    </div>


    {/* INVESTED */}

    <div
      className="
        border-b
        border-slate-800
        px-4
        py-3
        lg:border-b-0
        lg:border-r
      "
    >

      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
        "
      >
        Invested
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
          leading-tight
          text-white
        "
      >
        {formatCurrency(
          holding.investedAmount
        )}
      </p>

    </div>


    {/* CURRENT VALUE */}

    <div
      className="
        border-b
        border-slate-800
        px-4
        py-3
        lg:border-b-0
        lg:border-r
      "
    >

      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
        "
      >
        Current Value
      </p>

      <p
        className="
          mt-1
          text-lg
          font-bold
          leading-tight
          text-white
        "
      >
        {formatCurrency(
          holding.currentValue
        )}
      </p>

    </div>


    {/* PROFIT / LOSS */}

    <div
      className="
        px-4
        py-3
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        {isProfit ? (
          <TrendingUp
            size={16}
            className="
              shrink-0
              text-emerald-400
            "
          />
        ) : (
          <TrendingDown
            size={16}
            className="
              shrink-0
              text-red-400
            "
          />
        )}


        <div>

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Profit / Loss
          </p>


          <p
            className={`
              mt-1
              text-lg
              font-bold
              leading-tight
              ${
                isProfit
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}
          >
            {isProfit
              ? "+"
              : "-"}
            {formatCurrency(
              Math.abs(
                profitLoss
              )
            )}
          </p>

        </div>

      </div>

    </div>

  </div>

</div>








      {/* ===================================================
          TRANSACTIONS
      =================================================== */}

      <div>

        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
          "
        >

          <div>

            <h2
              className="
                text-base
                font-bold
                text-dark
              "
            >
              Transactions
            </h2>


            <p
              className="
                mt-0.5
                text-xs
                font-bold
                text-slate-500
              "
            >
              {transactions.length}{" "}
              {transactions.length === 1
                ? "transaction"
                : "transactions"}
            </p>

          </div>

        </div>


        {transactions.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-700
              bg-slate-900
              px-5
              py-8
              text-center
            "
          >

            <p
              className="
                text-sm
                font-medium
                text-slate-400
              "
            >
              No transactions found.
            </p>

          </div>

        ) : (

          <div
            className="
              space-y-3
            "
          >

            {transactions.map(
              (transaction) => {

                const isBuy =
                  String(
                    transaction.transactionType ||
                    transaction.type ||
                    "BUY"
                  )
                    .trim()
                    .toUpperCase() ===
                  "BUY";


                const transactionUnits =
                  Number(
                    transaction.units
                  ) || 0;

                const transactionAmount =
                  Number(
                    transaction.amount
                  ) || 0;

                const pricePerUnit =
                  transactionUnits > 0
                    ? transactionAmount /
                      transactionUnits
                    : 0;


                return (
                  <div
                    key={
                      transaction.id
                    }
                    className="
                      rounded-2xl
                      border
                      border-slate-800
                      bg-slate-900
                      p-4
                    "
                  >

                    {/* TRANSACTION HEADER */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

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
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${
                              isBuy
                                ? "bg-emerald-500/10"
                                : "bg-red-500/10"
                            }
                          `}
                        >

                          {isBuy ? (
                            <TrendingUp
                              size={17}
                              className="
                                text-emerald-400
                              "
                            />
                          ) : (
                            <TrendingDown
                              size={17}
                              className="
                                text-red-400
                              "
                            />
                          )}

                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className={`
                              text-sm
                              font-bold
                              ${
                                isBuy
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }
                            `}
                          >
                            {isBuy
                              ? "BUY"
                              : "SELL"}
                          </p>


                          <p
                            className="
                              mt-0.5
                              truncate
                              text-xs
                              text-slate-500
                            "
                          >
                            {transaction.symbol ||
                              holding.symbol}
                          </p>

                        </div>

                      </div>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            transaction
                          )
                        }
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-500
                          transition
                          hover:bg-red-500/10
                          hover:text-red-400
                        "
                        aria-label="Delete transaction"
                        title="Delete transaction"
                      >

                        <Trash2
                          size={15}
                        />

                      </button>

                    </div>


                    {/* TRANSACTION DETAILS */}

                    <div
                      className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-x-4
                        gap-y-3
                        sm:grid-cols-4
                      "
                    >

                      {/* UNITS */}

                      <div>

                        <p
                          className="
                            text-[11px]
                            font-medium
                            text-slate-500
                          "
                        >
                          Units
                        </p>


                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-white
                          "
                        >
                          {formatNumber(
                            transactionUnits
                          )}
                        </p>

                      </div>


                      {/* AMOUNT */}

                      <div>

                        <p
                          className="
                            text-[11px]
                            font-medium
                            text-slate-500
                          "
                        >
                          Amount
                        </p>


                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-white
                          "
                        >
                          {formatCurrency(
                            transactionAmount
                          )}
                        </p>

                      </div>


                      {/* PRICE */}

                      <div>

                        <p
                          className="
                            text-[11px]
                            font-medium
                            text-slate-500
                          "
                        >
                          Price / Unit
                        </p>


                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-white
                          "
                        >
                          {formatCurrency(
                            pricePerUnit
                          )}
                        </p>

                      </div>


                      {/* DATE */}

                      <div>

                        <p
                          className="
                            flex
                            items-center
                            gap-1
                            text-[11px]
                            font-medium
                            text-slate-500
                          "
                        >

                          <CalendarDays
                            size={12}
                          />

                          Date

                        </p>


                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-white
                          "
                        >
                          {formatDate(
                            transaction.transactionDate
                          )}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}