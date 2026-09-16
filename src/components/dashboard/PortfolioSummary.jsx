
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
  useCPF,
} from "../../context/CPFContext";

import {
  useIntFd,
} from "../../context/IntFdContext";

import {
  useLicPli,
} from "../../context/LicPliContext";

import {
  useETFStock,
} from "../../context/ETFStockContext";

import {
  calculateDashboardTotals,
  formatCurrency,
} from "../../utils/dashboard/dashboardCalculations";


function PortfolioSummary() {

  // ========================================
  // MUTUAL FUNDS
  // ========================================

  const {
    holdings:
      mutualFundHoldings = [],
  } = useMutualFunds();


  // ========================================
  // SGB
  // ========================================

  const {
    summary:
      sgbSummary = {},
  } = useSGB();


  // ========================================
  // BONDS
  // ========================================

  const {
    bonds = [],
  } = useBonds();


  // ========================================
  // CPF
  // ========================================

  const {
    record:
      cpfRecord = null,
  } = useCPF();


  // ========================================
  // INT-FD
  // ========================================

  const {
    fds = [],
  } = useIntFd();


  // ========================================
  // LIC / PLI
  // ========================================

  const {
    policies:
      licPliPolicies = [],
  } = useLicPli();


  // ========================================
  // ETF / STOCK
  // ========================================

  const {
    summary:
      etfStockSummary = {},
  } = useETFStock();


  // ========================================
  // DASHBOARD SUMMARY
  // ========================================

  const summary =
    useMemo(
      () =>
        calculateDashboardTotals(
          mutualFundHoldings,
          sgbSummary,
          bonds,
          cpfRecord,
          fds,
          licPliPolicies,
          etfStockSummary
        ),
      [
        mutualFundHoldings,
        sgbSummary,
        bonds,
        cpfRecord,
        fds,
        licPliPolicies,
        etfStockSummary,
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


    {/* =====================================
          HEADER
      ====================================== */}

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
              text-xm
              font-semibold
              uppercase
              tracking-wider
              text-white
            "
          >
            Invested
          </p>

          <h2
            className="
              mt-1
              text-3xl
              font-extrabold
              tracking-tight
              text-white
            "
          >
            {formatCurrency(
              summary.totalInvested
            )}
          </h2>

        </div>


        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-emerald-500/10
            text-emerald-400
          "
        >

          <IndianRupee
              size={14}
            />

        </div>

      </div>


      {/* =====================================
          SUMMARY GRID
      ====================================== */}

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-2
        "
      >



        {/* ===================================
            PROFIT
        ==================================== */}

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
              text-xM
              font-semibold
              text-white
            "
          >
            Profit
          </p>


          <p
            className={`
              mt-1
              text-base
              text-xl
              font-extrabold
              ${
                summary.totalProfit >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}
          >
            {formatCurrency(
              summary.totalProfit
            )}
          </p>

        </div>


        {/* ===================================
            RETURN
        ==================================== */}

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
              text-xm
              font-semibold
              text-white
            "
          >
            Return
          </p>


          <p
            className={`
              mt-1
              text-base
              font-extrabold
              ${
                summary.totalReturn >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}
          >
            {summary.totalReturn >= 0
              ? "+"
              : ""}

            {summary.totalReturn.toFixed(2)}%
          </p>

        </div>




      </div>


            {/* =====================================
          FOOTER
      ====================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
          mt-3
        "
      >

        <div>

          <p
            className="
              text-xm
              font-semibold
              uppercase
              tracking-wider
              text-white
            "
          >
            Total Portfolio
          </p>

          <h2
            className="
              mt-1
              text-3xl
              font-extrabold
              tracking-tight
              text-amber-400
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
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-emerald-500/10
            text-emerald-400
          "
        >

          <TrendingUp
            size={19}
            strokeWidth={2.2}
          />

        </div>

      </div>


    </section>
  );
}

export default PortfolioSummary;

