import {
  IndianRupee,
} from "lucide-react";

import { useMemo } from "react";

import {
  useMutualFunds,
} from "../../context/MutualFundContext";


function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}


function PortfolioSummary() {

  const {
    holdings,
    loading,
  } = useMutualFunds();


  /* --------------------------------
     MUTUAL FUND SUMMARY
  -------------------------------- */

  const summary = useMemo(() => {

    const invested =
      holdings.reduce(
        (total, fund) =>
          total +
          (Number(
            fund.investedAmount
          ) || 0),
        0
      );


    const currentValue =
      holdings.reduce(
        (total, fund) =>
          total +
          (Number(
            fund.currentValue
          ) || 0),
        0
      );


    const profitLoss =
      currentValue -
      invested;


    const returnPercent =
      invested > 0
        ? (profitLoss / invested) *
          100
        : 0;


    return {
      invested,
      currentValue,
      profitLoss,
      returnPercent,
    };

  }, [holdings]);


  const isProfit =
    summary.profitLoss >= 0;


  /* --------------------------------
     LOADING
  -------------------------------- */

  if (loading) {
    return (
      <section
        className="
          overflow-hidden
          rounded-3xl
          bg-slate-900
          p-5
          text-white
          shadow-xl
          sm:p-7
        "
      >

        <div className="animate-pulse">

          <div className="h-4 w-36 rounded bg-slate-700" />

          <div className="mt-3 h-10 w-52 rounded bg-slate-700" />

          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-4
            "
          >

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-16
                    rounded-2xl
                    bg-white/10
                  "
                />
              )
            )}

          </div>

        </div>

      </section>
    );
  }


  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        bg-slate-900
        p-5
        text-white
        shadow-xl
        sm:p-7
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <p className="text-sm text-slate-300">
            Total portfolio value
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-black
              tracking-tight
              sm:text-4xl
            "
          >
            {formatCurrency(
              summary.currentValue
            )}
          </p>

        </div>


        <div
          className="
            grid
            h-11
            w-11
            place-items-center
            rounded-2xl
            bg-white/10
          "
        >

          <IndianRupee

            size={22}
          />

        </div>

      </div>


      {/* STATS */}

      <div
        className="
          mt-6
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-4
        "
      >

        {/* INVESTED */}

        <Stat
          label="Invested"
          value={formatCurrency(
            summary.invested
          )}
        />


        {/* PROFIT / LOSS */}

        <Stat
          label="Total P/L"
          value={`${
            isProfit ? "+" : ""
          }${formatCurrency(
            summary.profitLoss
          )}`}
          positive={isProfit}
          negative={!isProfit}
        />


        {/* RETURN */}

        <Stat
          label="Return"
          value={`${
            isProfit ? "+" : ""
          }${summary.returnPercent.toFixed(
            2
          )}%`}
          positive={isProfit}
          negative={!isProfit}
        />


        {/* TODAY */}

        <Stat
          label="Today"
          value="—"
        />

      </div>

    </section>
  );
}


function Stat({
  label,
  value,
  positive = false,
  negative = false,
}) {

  return (
    <div
      className="
        rounded-2xl
        bg-white/10
        p-3
      "
    >

      <p
        className="
          text-[11px]
          text-slate-300
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1
          text-sm
          font-black

          ${
            positive
              ? "text-emerald-300"
              : ""
          }

          ${
            negative
              ? "text-red-300"
              : ""
          }

          ${
            !positive && !negative
              ? "text-white"
              : ""
          }
        `}
      >
        {value}
      </p>

    </div>
  );
}


export default PortfolioSummary;