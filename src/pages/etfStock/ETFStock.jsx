
import {
  useNavigate,
} from "react-router-dom";

import {
  Plus,
  ArrowLeft
} from "lucide-react";


import {
  useETFStock,
} from "../../context/ETFStockContext";

import ETFStockSummaryCard from "../../components/etfStock/ETFStockSummaryCard";
import ETFStockCard from "../../components/etfStock/ETFStockCard";


export default function ETFStock() {

  const navigate =
    useNavigate();

  const {
    holdings,
    summary,
    loading,
  } = useETFStock();


  /* =======================================================
     SORT HOLDINGS
  ======================================================= */

  const sortedHoldings = [
    ...(holdings || []),
  ].sort(
    (a, b) =>
      String(
        a.name ||
        a.symbol ||
        ""
      ).localeCompare(
        String(
          b.name ||
          b.symbol ||
          ""
        )
      )
  );


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
          px-4
        "
      >
        <div
          className="
            text-sm
            text-slate-400
          "
        >
          Loading ETF / Stock data...
        </div>
      </div>
    );

  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        space-y-6
        py-5
        sm:px-6
        lg:px-8
      "
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          px-3
          py-2
          shadow-lg
        "
      >

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            text-slate-200
            transition-all
            duration-200
            hover:border-slate-600
            hover:bg-slate-700
            active:scale-95
          "
          aria-label="Go back"
        >
          <ArrowLeft size={19} />
        </button>


        {/* TITLE */}
        <div className="min-w-0">

          <h1
            className="
              text-xl
              font-bold
              tracking-tight
              text-white
              sm:text-2xl
            "
          >
            ETF / Stocks
          </h1>

          <p
            className="
              mt-0.5
              text-sm
              text-slate-400
            "
          >
            Track your ETF and Stock investments
          </p>

        </div>

      </div>


      {/* ===================================================
          SUMMARY
      =================================================== */}

      <ETFStockSummaryCard
        summary={summary}
      />


      {/* ===================================================
          HOLDINGS HEADER
      =================================================== */}

      <div className="
          flex
          items-center
          justify-between
          gap-3
        ">
          <div>
            <h2 className="text-base font-bold text-dark">
              Your ETF / Stocks
            </h2>

            <p className="mt-0.5 text-xs font-bold text-slate-900">
              {sortedHoldings.length}{" "}
              {sortedHoldings.length === 1
                ? "holding"
                : "holdings"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/etf-stock/add")
            }
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-xl
              bg-slate-900
              px-3.5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-white
            "
          >
            <Plus size={17} />
            Add
          </button>
        </div>


      {/* ===================================================
          EMPTY STATE
      =================================================== */}

      {sortedHoldings.length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-slate-700
            bg-slate-900
            px-5
            py-10
            text-center
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-slate-300
            "
          >
            No ETF / Stock holdings yet.
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            Add your first transaction to start
            tracking your investments.
          </p>

        </div>

      ) : (

        /* =================================================
           HOLDINGS GRID
        ================================================= */

        <div
          className="
            grid
            grid-cols-1
            gap-4
            lg:grid-cols-2
          "
        >

          {sortedHoldings.map(
            (holding) => (

              <ETFStockCard
                key={
                  holding.id ||
                  holding.symbol
                }
                holding={
                  holding
                }
                onClick={() =>
                  navigate(
                    `/etf-stock/${encodeURIComponent(
                      holding.symbol
                    )}`
                  )
                }
              />

            )
          )}

        </div>

      )}

    </div>
  );
}

