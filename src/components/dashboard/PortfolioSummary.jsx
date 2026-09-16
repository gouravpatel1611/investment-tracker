import {
  useMemo,
} from "react";

import {
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import {
  useMutualFunds,
} from "../../context/MutualFundContext";

import {
  useSGB,
} from "../../context/SGBContext";

import {
  useBonds,
} from "../../context/BondContext";

import {
  calculateDashboardTotals,
  formatCurrency,
} from "../../utils/dashboard/dashboardCalculations";


function PortfolioSummary() {

  const {
    holdings:
      mutualFundHoldings = [],
  } = useMutualFunds();


  const {
    summary:
      sgbSummary = {},
  } = useSGB();


  const {
    bonds = [],
  } = useBonds();


  const summary =
    useMemo(
      () =>
        calculateDashboardTotals(
          mutualFundHoldings,
          sgbSummary,
          bonds
        ),
      [
        mutualFundHoldings,
        sgbSummary,
        bonds,
      ]
    );


  return (
    <section
      className="
        rounded-2xl
        border border-slate-700/80
        bg-slate-900
        p-4
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <div>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Total portfolio
          </p>

          <h2
            className="
              mt-1
              text-2xl
              font-extrabold
              tracking-tight
              text-white
            "
          >
            {formatCurrency(
              summary.totalCurrentValue
            )}
          </h2>

        </div>


        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-emerald-500/10
            text-emerald-400
          "
        >
          <TrendingUp
            size={18}
          />
        </div>

      </div>


      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-2
        "
      >

        {/* INVESTED */}

        <div
          className="
            rounded-xl
            border border-slate-700/70
            bg-slate-800/70
            p-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-1.5
              text-xs
              font-medium
              text-slate-400
            "
          >
            <IndianRupee
              size={13}
            />

            Invested

          </div>


          <p
            className="
              mt-1
              text-sm
              font-bold
              text-slate-100
            "
          >
            {formatCurrency(
              summary.totalInvested
            )}
          </p>

        </div>


        {/* PROFIT */}

        <div
          className="
            rounded-xl
            border border-slate-700/70
            bg-slate-800/70
            p-3
          "
        >

          <p
            className="
              text-xs
              font-medium
              text-slate-400
            "
          >
            Profit
          </p>


          <p
            className="
              mt-1
              text-sm
              font-bold
              text-emerald-400
            "
          >
            {formatCurrency(
              summary.totalProfit
            )}
          </p>

        </div>


        {/* RETURN */}

        <div
          className="
            rounded-xl
            border border-slate-700/70
            bg-slate-800/70
            p-3
          "
        >

          <p
            className="
              text-xs
              font-medium
              text-slate-400
            "
          >
            Return
          </p>


          <p
            className="
              mt-1
              text-sm
              font-bold
              text-emerald-400
            "
          >
            {summary.totalReturn.toFixed(2)}%
          </p>

        </div>


        {/* XIRR */}

        <div
          className="
            rounded-xl
            border border-slate-700/70
            bg-slate-800/70
            p-3
          "
        >

          <p
            className="
              text-xs
              font-medium
              text-slate-400
            "
          >
            XIRR
          </p>


          <p
            className="
              mt-1
              text-sm
              font-bold
              text-slate-300
            "
          >
            —
          </p>

        </div>

      </div>

    </section>
  );
}

export default PortfolioSummary;