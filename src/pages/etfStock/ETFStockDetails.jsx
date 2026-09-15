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

import ETFStockTransactionForm from "../../components/etfStock/ETFStockTransactionForm";


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
  } = useETFStock();

  const [
    showTransactionForm,
    setShowTransactionForm,
  ] = useState(false);


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
     CLOSE FORM AFTER SAVE
  ======================================================= */

  function handleTransactionSaved() {
    setShowTransactionForm(false);
  }


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
            navigate("/etf-stock")
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
        bg-slate-950
        px-4
        py-5
        sm:px-6
        lg:px-8
      "
    >

      {/* ===================================================
          TOP BAR
      =================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <button
          type="button"
          onClick={() =>
            navigate("/etf-stock")
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
            py-2.5
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


        <button
          type="button"
          onClick={() =>
            setShowTransactionForm(
              (value) => !value
            )
          }
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-slate-100
            px-3.5
            py-2.5
            text-sm
            font-semibold
            text-slate-900
            transition
            hover:bg-white
          "
        >

          {showTransactionForm ? (
            <>
              <X
                size={17}
              />

              Close
            </>
          ) : (
            <>
              <Plus
                size={17}
              />

              Add Transaction
            </>
          )}

        </button>

      </div>


      {/* ===================================================
          ASSET HEADER
      =================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-5
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          {/* ASSET */}

          <div
            className="
              min-w-0
            "
          >

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  tracking-wide
                  text-slate-400
                "
              >
                {holding.symbol}
              </p>


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
                  text-slate-300
                "
              >
                {holding.assetType ||
                  "STOCK"}
              </span>

            </div>


            <h1
              className="
                mt-1.5
                text-xl
                font-bold
                leading-tight
                text-white
                sm:text-2xl
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
                text-[11px]
                font-medium
                text-slate-500
              "
            >
              Current Price
            </p>


            <p
              className="
                mt-1
                text-lg
                font-extrabold
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
                  mt-1
                  text-[10px]
                  text-slate-500
                "
              >
                Updating...
              </p>
            )}

          </div>

        </div>

      </div>


      {/* ===================================================
          TRANSACTION FORM
      =================================================== */}

      {showTransactionForm && (
        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-4
            sm:p-5
          "
        >

          <div
            className="
              mb-5
            "
          >

            <h2
              className="
                text-base
                font-semibold
                text-white
              "
            >
              Add Transaction
            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Add BUY or SELL transaction for{" "}

              <span
                className="
                  font-semibold
                  text-slate-300
                "
              >
                {holding.symbol}
              </span>

            </p>

          </div>


          <ETFStockTransactionForm
            defaultSymbol={cleanSymbol}
            onSaved={handleTransactionSaved}
          />

        </div>
      )}


      {/* ===================================================
          HOLDING SUMMARY
      =================================================== */}

      <div>

        <h2
          className="
            mb-3
            text-base
            font-semibold
            text-white
          "
        >
          Holding Summary
        </h2>


        <div
          className="
            grid
            grid-cols-2
            gap-3
            lg:grid-cols-4
          "
        >

          {/* UNITS */}

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
            "
          >

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
                mt-2
                text-lg
                font-bold
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
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
            "
          >

            <p
              className="
                text-[11px]
                font-medium
                text-slate-500
              "
            >
              Invested
            </p>


            <p
              className="
                mt-2
                text-lg
                font-bold
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
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
            "
          >

            <p
              className="
                text-[11px]
                font-medium
                text-slate-500
              "
            >
              Current Value
            </p>


            <p
              className="
                mt-2
                text-lg
                font-bold
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
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
                gap-2
              "
            >

              <div>

                <p
                  className="
                    text-[11px]
                    font-medium
                    text-slate-500
                  "
                >
                  Profit / Loss
                </p>


                <p
                  className={`
                    mt-2
                    text-lg
                    font-bold
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


              {isProfit ? (
                <TrendingUp
                  size={17}
                  className="
                    mt-1
                    text-emerald-400
                  "
                />
              ) : (
                <TrendingDown
                  size={17}
                  className="
                    mt-1
                    text-red-400
                  "
                />
              )}

            </div>


            <p
              className={`
                mt-0.5
                text-xs
                font-semibold
                ${
                  isProfit
                    ? "text-emerald-500"
                    : "text-red-500"
                }
              `}
            >
              {formatPercent(
                returnPercent
              )}
            </p>

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
                font-semibold
                text-white
              "
            >
              Transactions
            </h2>


            <p
              className="
                mt-0.5
                text-xs
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