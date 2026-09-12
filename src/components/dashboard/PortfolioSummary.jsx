import {
  IndianRupee,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useMutualFunds,
} from "../../context/MutualFundContext";

import {
  useBonds,
} from "../../context/BondContext";

import {
  getSGBPortfolio,
} from "../../services/sgb/sgbPortfolioService";

import {
  calculateTotalBondFinancialSummary,
} from "../../utils/bondCalculations";


function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}


function PortfolioSummary() {

  /* --------------------------------
     MUTUAL FUNDS
  -------------------------------- */

  const {
    holdings: mutualFundHoldings,
    loading: mutualFundLoading,
  } = useMutualFunds();


  /* --------------------------------
     BONDS
  -------------------------------- */

  const {
    bonds,
    loading: bondLoading,
  } = useBonds();


  /* --------------------------------
     SGB
  -------------------------------- */

  const [
    sgbPortfolio,
    setSgbPortfolio,
  ] = useState({
    holdings: [],
    summary: {
      seriesCount: 0,
      units: 0,
      purchaseValue: 0,
      currentValue: 0,
      interest: 0,
      profit: 0,
      gain: 0,
      totalGainPercent: 0,
    },
  });


  const [
    sgbLoading,
    setSgbLoading,
  ] = useState(true);


  useEffect(() => {

    let mounted = true;


    const loadSGB = async () => {

      try {

        setSgbLoading(true);

        const data =
          await getSGBPortfolio();


        if (mounted) {
          setSgbPortfolio(
            data || {
              holdings: [],
              summary: {},
            }
          );
        }

      } catch (error) {

        console.error(
          "Failed to load SGB portfolio:",
          error
        );

      } finally {

        if (mounted) {
          setSgbLoading(false);
        }

      }

    };


    loadSGB();


    return () => {
      mounted = false;
    };

  }, []);


  /* --------------------------------
     ASSET BREAKDOWN VALUES
  -------------------------------- */

  const assetSummary = useMemo(() => {

    /* ==============================
       MUTUAL FUNDS
    ============================== */

    const mutualFundInvested =
      mutualFundHoldings.reduce(
        (total, fund) =>
          total +
          (Number(
            fund.investedAmount
          ) || 0),
        0
      );


    const mutualFundCurrentValue =
      mutualFundHoldings.reduce(
        (total, fund) =>
          total +
          (Number(
            fund.currentValue
          ) || 0),
        0
      );


    const mutualFundProfit =
      mutualFundCurrentValue -
      mutualFundInvested;


    /* ==============================
       SGB
    ============================== */

    const sgbSummary =
      sgbPortfolio?.summary || {};


    const sgbInvested =
      Number(
        sgbSummary.purchaseValue
      ) || 0;


    const sgbCurrentValue =
      Number(
        sgbSummary.currentValue
      ) || 0;


    const sgbInterest =
      Number(
        sgbSummary.interest
      ) || 0;


    // Final SGB value
    const sgbValueWithInterest =
      sgbCurrentValue +
      sgbInterest;


    const sgbProfit =
      Number(
        sgbSummary.profit
      ) || 0;


    const sgbGain =
      Number(
        sgbSummary.gain
      ) || 0;


    /* ==============================
       BONDS
    ============================== */

    const bondSummary =
      calculateTotalBondFinancialSummary(
        bonds || []
      );


    // --------------------------------
    // Bond Invested
    // --------------------------------
    //
    // Actual purchase amount
    //
    const bondsInvested = bondSummary.totalPrincipal


    // --------------------------------
    // Bond Current Value
    // --------------------------------
    //
    // Total Principal
    // + Interest Received
    //
    const bondsValue =
      (
        Number(
          bondSummary.totalPrincipal
        ) || 0
      ) +
      (
        Number(
          bondSummary.interestReceived
        ) || 0
      );


    // --------------------------------
    // Bond Profit / Loss
    // --------------------------------

    const bondsProfit =
      bondsValue -
      bondsInvested;


    /* ==============================
       OTHER ASSETS
       ==============================

       Currently AssetBreakdown
       has these as 0.

       Later actual data can be
       added here.
    ============================== */

    const cpfValue = 0;

    const fdValue = 0;

    const apyNpsValue = 0;

    const cryptoValue = 0;

    const licValue = 0;

    const etfStockValue = 0;


    /* ==============================
       TOTAL INVESTED
    ============================== */

    const totalInvested =
      mutualFundInvested +
      sgbInvested +
      bondsInvested;


    /* ==============================
       TOTAL CURRENT VALUE
    ============================== */

    const totalCurrentValue =
      mutualFundCurrentValue +
      sgbValueWithInterest +
      bondsValue +
      cpfValue +
      fdValue +
      apyNpsValue +
      cryptoValue +
      licValue +
      etfStockValue;


    /* ==============================
       TOTAL PROFIT / LOSS
    ============================== */

    const totalProfitLoss =
      mutualFundProfit +
      sgbGain +
      bondsProfit;


    /* ==============================
       TOTAL RETURN
    ============================== */

    const totalReturnPercent =
      totalInvested > 0
        ? (
            totalProfitLoss /
            totalInvested
          ) * 100
        : 0;


    return {

      totalInvested,

      totalCurrentValue,

      totalProfitLoss,

      totalReturnPercent,

      /* Individual assets */

      mutualFundCurrentValue,

      sgbValueWithInterest,

      bondsValue,

      bondsInvested,

      bondsProfit,

      cpfValue,

      fdValue,

      apyNpsValue,

      cryptoValue,

      licValue,

      etfStockValue,

    };

  }, [
    mutualFundHoldings,
    sgbPortfolio,
    bonds,
  ]);


  const isProfit =
    assetSummary.totalProfitLoss >= 0;


  /* --------------------------------
     LOADING
  -------------------------------- */

  if (
    mutualFundLoading ||
    sgbLoading ||
    bondLoading
  ) {

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

          <div
            className="
              h-4
              w-36
              rounded
              bg-slate-700
            "
          />

          <div
            className="
              mt-3
              h-10
              w-52
              rounded
              bg-slate-700
            "
          />

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


  /* --------------------------------
     UI
  -------------------------------- */

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
              assetSummary.totalCurrentValue
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
            assetSummary.totalInvested
          )}
        />


        {/* PROFIT / LOSS */}

        <Stat
          label="Total P/L"
          value={`${
            isProfit ? "+" : ""
          }${formatCurrency(
            assetSummary.totalProfitLoss
          )}`}
          positive={isProfit}
          negative={!isProfit}
        />


        {/* RETURN */}

        <Stat
          label="Return"
          value={`${
            isProfit ? "+" : ""
          }${assetSummary.totalReturnPercent.toFixed(
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


/* --------------------------------
   STAT COMPONENT
-------------------------------- */

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