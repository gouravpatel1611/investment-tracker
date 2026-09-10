
import {
  PieChart,
  BriefcaseBusiness,
  WalletCards,
  CircleGauge,
  Bitcoin,
  FileText,
  Gem,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useMutualFunds,
} from "../../context/MutualFundContext";

import {
  getSGBPortfolio,
} from "../../services/sgb/sgbPortfolioService";


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}


// ==========================================
// NUMBER HELPER
// ==========================================

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}


// ==========================================
// ROUND
// ==========================================

function round(value) {
  return Number(
    toNumber(value).toFixed(2)
  );
}


// ==========================================
// CALCULATE SGB INTEREST
// ==========================================
//
// Same logic as SGB Portfolio Service
//
// Purchase Rate + ₹50
// 2.5% yearly
// 6 monthly payment
//
// Only completed 6-month periods are counted.
// ==========================================

function calculateSGBInterest(
  purchaseValue,
  issueDate,
  units
) {

  const amount =
    toNumber(purchaseValue);

  const gram =
    toNumber(units);


  if (
    !amount ||
    !gram ||
    !issueDate
  ) {
    return 0;
  }


  // ----------------------------------------
  // Purchase Rate
  // ----------------------------------------

  const purchaseRate =
    amount / gram;


  // ----------------------------------------
  // Interest calculation rate
  // Purchase Rate + ₹50
  // ----------------------------------------

  const interestRate =
    purchaseRate + 50;


  // ----------------------------------------
  // Interest Base
  // ----------------------------------------

  const interestBase =
    interestRate * gram;


  // ----------------------------------------
  // Issue Date
  // ----------------------------------------

  const startDate =
    new Date(
      `${issueDate}T00:00:00`
    );


  const today =
    new Date();


  if (
    Number.isNaN(
      startDate.getTime()
    )
  ) {
    return 0;
  }


  // ----------------------------------------
  // Investment date future hai
  // ----------------------------------------

  if (
    today <= startDate
  ) {
    return 0;
  }


  // ----------------------------------------
  // Calculate 6-month periods
  // ----------------------------------------

  let halfYearPeriods =
    (
      today.getFullYear() -
      startDate.getFullYear()
    ) * 2 +
    (
      today.getMonth() -
      startDate.getMonth()
    ) / 6;


  halfYearPeriods =
    Math.floor(
      halfYearPeriods
    );


  // ----------------------------------------
  // Exact anniversary check
  // ----------------------------------------

  const anniversary =
    new Date(startDate);


  anniversary.setMonth(
    anniversary.getMonth() +
    halfYearPeriods * 6
  );


  if (
    anniversary > today
  ) {

    halfYearPeriods -= 1;

  }


  if (
    halfYearPeriods <= 0
  ) {
    return 0;
  }


  // ----------------------------------------
  // 6 Month Interest
  // ----------------------------------------

  const halfYearInterest =
    interestBase *
    0.025 /
    2;


  // ----------------------------------------
  // Total Interest
  // ----------------------------------------

  return round(
    halfYearInterest *
    halfYearPeriods
  );
}


// ==========================================
// CALCULATE ONE SGB HOLDING
// ==========================================

function calculateSGBHolding(
  transaction
) {

  const units =
    toNumber(
      transaction.units
    );


  const purchaseRate =
    toNumber(
      transaction.purchaseRate
    );


  const purchaseValue =
    toNumber(
      transaction.purchaseValue
    );


  const currentRate =
    toNumber(
      transaction.currentRate
    );


  // ----------------------------------------
  // Current Market Value
  // ----------------------------------------

  const currentValue =
    units *
    currentRate;


  // ----------------------------------------
  // Interest
  // ----------------------------------------

  const interest =
    calculateSGBInterest(
      purchaseValue,
      transaction.issueDate,
      units
    );


  // ----------------------------------------
  // Profit without Interest
  // ----------------------------------------

  const profit =
    currentValue -
    purchaseValue;


  // ----------------------------------------
  // Total Gain
  // ----------------------------------------

  const gain =
    profit +
    interest;


  // ----------------------------------------
  // Current Value + Interest
  // ----------------------------------------

  const currentValueWithInterest =
    currentValue +
    interest;


  // ----------------------------------------
  // Total Gain %
  // ----------------------------------------

  const totalGainPercent =
    purchaseValue > 0
      ? (
          gain /
          purchaseValue
        ) * 100
      : 0;


  return {

    units:
      round(units),

    purchaseRate:
      round(purchaseRate),

    purchaseValue:
      round(purchaseValue),

    currentRate:
      round(currentRate),

    currentValue:
      round(currentValue),

    interest:
      round(interest),

    currentValueWithInterest:
      round(
        currentValueWithInterest
      ),

    profit:
      round(profit),

    gain:
      round(gain),

    totalGainPercent:
      round(
        totalGainPercent
      ),

  };
}


// ==========================================
// ASSET BREAKDOWN
// ==========================================

function AssetBreakdown({
  onAssetClick,
}) {

  const navigate =
    useNavigate();


  // ========================================
  // MUTUAL FUNDS
  // ========================================

  const {
    holdings:
      mutualFundHoldings,
    loading:
      mutualFundLoading,
  } = useMutualFunds();


  // ========================================
  // SGB STATE
  // ========================================

  const [
    sgbData,
    setSgbData,
  ] = useState({

    holdings: [],

    summary: {

      seriesCount: 0,

      units: 0,

      purchaseRate: 0,

      purchaseValue: 0,

      currentRate: 0,

      currentValue: 0,

      interest: 0,

      profit: 0,

      gain: 0,

      currentValueWithInterest: 0,

      totalGainPercent: 0,

    },

  });


  const [
    sgbLoading,
    setSgbLoading,
  ] = useState(true);


  // ========================================
  // MUTUAL FUND SUMMARY
  // ========================================

  const mutualFundSummary =
    useMemo(() => {

      const value =
        mutualFundHoldings.reduce(
          (
            total,
            fund
          ) =>
            total +
            (
              Number(
                fund.currentValue
              ) || 0
            ),
          0
        );


      return {

        value,

        holdings:
          mutualFundHoldings.length,

      };

    }, [
      mutualFundHoldings,
    ]);


  // ========================================
  // LOAD SGB PORTFOLIO
  // ========================================

  useEffect(() => {

    let isMounted = true;


    const loadSGB =
      async () => {

        try {

          setSgbLoading(
            true
          );


          const data =
            await getSGBPortfolio();


          if (
            !isMounted
          ) {
            return;
          }


          // ==================================
          // Recalculate using complete logic
          // ==================================

          const calculatedHoldings =
            (
              data?.holdings ||
              []
            ).map(
              (holding) => {

                return calculateSGBHolding(
                  holding
                );

              }
            );


          // ==================================
          // Summary calculation
          // ==================================

          const totalUnits =
            calculatedHoldings.reduce(
              (
                total,
                item
              ) =>
                total +
                toNumber(
                  item.units
                ),
              0
            );


          const totalPurchaseValue =
            calculatedHoldings.reduce(
              (
                total,
                item
              ) =>
                total +
                toNumber(
                  item.purchaseValue
                ),
              0
            );


          const totalCurrentValue =
            calculatedHoldings.reduce(
              (
                total,
                item
              ) =>
                total +
                toNumber(
                  item.currentValue
                ),
              0
            );


          const totalInterest =
            calculatedHoldings.reduce(
              (
                total,
                item
              ) =>
                total +
                toNumber(
                  item.interest
                ),
              0
            );


          const totalProfit =
            calculatedHoldings.reduce(
              (
                total,
                item
              ) =>
                total +
                toNumber(
                  item.profit
                ),
              0
            );


          const totalGain =
            calculatedHoldings.reduce(
              (
                total,
                item
              ) =>
                total +
                toNumber(
                  item.gain
                ),
              0
            );


          const currentValueWithInterest =
            totalCurrentValue +
            totalInterest;


          const totalGainPercent =
            totalPurchaseValue > 0
              ? (
                  totalGain /
                  totalPurchaseValue
                ) * 100
              : 0;


          const purchaseRate =
            totalUnits > 0
              ? totalPurchaseValue /
                totalUnits
              : 0;


          const currentRate =
            totalUnits > 0
              ? totalCurrentValue /
                totalUnits
              : 0;


          setSgbData({

            holdings:
              data?.holdings ||
              [],

            summary: {

              seriesCount:
                calculatedHoldings.length,

              units:
                round(
                  totalUnits
                ),

              purchaseRate:
                round(
                  purchaseRate
                ),

              purchaseValue:
                round(
                  totalPurchaseValue
                ),

              currentRate:
                round(
                  currentRate
                ),

              currentValue:
                round(
                  totalCurrentValue
                ),

              interest:
                round(
                  totalInterest
                ),

              profit:
                round(
                  totalProfit
                ),

              gain:
                round(
                  totalGain
                ),

              currentValueWithInterest:
                round(
                  currentValueWithInterest
                ),

              totalGainPercent:
                round(
                  totalGainPercent
                ),

            },

          });

        } catch (error) {

          console.error(
            "Dashboard SGB Error:",
            error
          );


          if (
            isMounted
          ) {

            setSgbData({

              holdings: [],

              summary: {

                seriesCount: 0,

                units: 0,

                purchaseRate: 0,

                purchaseValue: 0,

                currentRate: 0,

                currentValue: 0,

                interest: 0,

                profit: 0,

                gain: 0,

                currentValueWithInterest: 0,

                totalGainPercent: 0,

              },

            });

          }

        } finally {

          if (
            isMounted
          ) {

            setSgbLoading(
              false
            );

          }

        }

      };


    loadSGB();


    return () => {

      isMounted = false;

    };

  }, []);


  // ========================================
  // ASSETS
  // ========================================

  const assets = [

    // --------------------------------------
    // MUTUAL FUNDS
    // --------------------------------------

    {

      id:
        "mutualFunds",

      name:
        "MUTUAL FUNDS",

      type:
        "Equity & Hybrid",

      icon:
        PieChart,

      iconClass:
        "bg-purple-500/15 text-purple-300",

      value:
        mutualFundSummary.value,

      holdings:
        mutualFundSummary.holdings,

    },


    // --------------------------------------
    // CPF
    // --------------------------------------

    {

      id:
        "cpf",

      name:
        "CPF",

      type:
        "Provident Fund",

      icon:
        BriefcaseBusiness,

      iconClass:
        "bg-cyan-500/15 text-cyan-300",

      value:
        0,

      holdings:
        0,

    },


    // --------------------------------------
    // FD
    // --------------------------------------

    {

      id:
        "fd",

      name:
        "INT-FD",

      type:
        "Fixed Deposit",

      icon:
        WalletCards,

      iconClass:
        "bg-amber-500/15 text-amber-300",

      value:
        0,

      holdings:
        0,

    },


    // --------------------------------------
    // APY NPS
    // --------------------------------------

    {

      id:
        "apyNps",

      name:
        "APY-NPS",

      type:
        "PENSION",

      icon:
        CircleGauge,

      iconClass:
        "bg-pink-500/15 text-pink-300",

      value:
        0,

      holdings:
        0,

    },


    // --------------------------------------
    // CRYPTO
    // --------------------------------------

    {

      id:
        "crypto",

      name:
        "CRYPTO",

      type:
        "Digital Assets",

      icon:
        Bitcoin,

      iconClass:
        "bg-violet-500/15 text-violet-300",

      value:
        0,

      holdings:
        0,

    },


    // --------------------------------------
    // BONDS
    // --------------------------------------

    {

      id:
        "bonds",

      name:
        "BONDS",

      type:
        "Fixed Income",

      icon:
        FileText,

      iconClass:
        "bg-blue-500/15 text-blue-300",

      value:
        0,

      holdings:
        0,

    },


    // --------------------------------------
    // SGB
    // --------------------------------------

    {

      id:
        "sgb",

      name:
        "SGB",

      type:
        "Sovereign Gold Bond",

      icon:
        Gem,

      iconClass:
        "bg-yellow-500/15 text-yellow-300",

      // IMPORTANT:
      // Dashboard par Current Value
      // + Interest dikhega

      value:
        sgbData.summary
          .currentValueWithInterest,

      holdings:
        sgbData.summary
          .seriesCount,

    },


    // --------------------------------------
    // LIC
    // --------------------------------------

    {

      id:
        "lic",

      name:
        "LIC-PLI",

      type:
        "Life & Postal Insurance",

      icon:
        ShieldCheck,

      iconClass:
        "bg-emerald-500/15 text-emerald-300",

      value:
        0,

      holdings:
        0,

    },


    // --------------------------------------
    // ETF STOCK
    // --------------------------------------

    {

      id:
        "etfStock",

      name:
        "ETF-STOCK",

      type:
        "ETF & Stock",

      icon:
        TrendingUp,

      iconClass:
        "bg-sky-500/15 text-sky-300",

      value:
        0,

      holdings:
        0,

    },

  ];


  // ==========================================
  // CARD CLICK
  // ==========================================

  const handleCardClick =
    (asset) => {

      // --------------------------------------
      // MUTUAL FUNDS
      // --------------------------------------

      if (
        asset.id ===
        "mutualFunds"
      ) {

        navigate(
          "/mutual-funds"
        );

        return;
      }


      // --------------------------------------
      // SGB
      // --------------------------------------

      if (
        asset.id ===
        "sgb"
      ) {

        navigate(
          "/sgb"
        );

        return;
      }



      // --------------------------------------
      // BONDS
      // --------------------------------------

      if (
        asset.id ===
        "bonds"
      ) {

        navigate(
          "/bonds"
        );

        return;
      }


      // --------------------------------------
      // OTHER ASSETS
      // --------------------------------------

      if (
        onAssetClick
      ) {

        onAssetClick(
          asset
        );

        return;
      }


      console.log(
        "Open asset:",
        asset.id
      );

    };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div
      className="
        grid
        grid-cols-1
        gap-2.5
      "
    >

      {assets.map(
        (asset) => {

          const Icon =
            asset.icon;


          // ==================================
          // LOADING
          // ==================================

          const isLoading =
            (
              asset.id ===
              "mutualFunds" &&
              mutualFundLoading
            ) ||
            (
              asset.id ===
              "sgb" &&
              sgbLoading
            );


          return (

            <button
              key={
                asset.id
              }

              type="button"

              onClick={() =>
                handleCardClick(
                  asset
                )
              }

              className="
                group
                w-full
                rounded-2xl
                border
                border-slate-700/80
                bg-slate-800
                p-3
                text-left
                shadow-sm
                transition-all
                duration-200

                hover:border-slate-600
                hover:bg-slate-750
                hover:shadow-md

                active:scale-[0.99]

                focus:outline-none
                focus:ring-2
                focus:ring-slate-500/40
              "
            >

              {/* =============================
                  TOP
              ============================== */}

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >

                {/* LEFT */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >

                  {/* ICON */}

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/5
                      ${asset.iconClass}
                    `}
                  >

                    <Icon
                      size={18}
                      strokeWidth={2}
                    />

                  </div>


                  {/* NAME + TYPE */}

                  <div
                    className="
                      min-w-0
                    "
                  >

                    <h3
                      className="
                        truncate
                        text-sm
                        font-extrabold
                        tracking-tight
                        text-slate-50
                      "
                    >

                      {
                        asset.name
                      }

                    </h3>


                    <p
                      className="
                        mt-1
                        truncate
                        text-[11px]
                        font-medium
                        text-slate-400
                      "
                    >

                      {
                        asset.type
                      }

                      {" · "}


                      {isLoading ? (

                        "Loading..."

                      ) : (

                        <>
                          {
                            asset.holdings
                          }{" "}

                          {
                            asset.holdings ===
                            1
                              ? "holding"
                              : "holdings"
                          }
                        </>

                      )}

                    </p>

                  </div>

                </div>


                {/* ARROW */}

                <div
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-slate-500
                    transition-all
                    duration-200

                    group-hover:translate-x-0.5
                    group-hover:text-slate-300
                  "
                >

                  →

                </div>

              </div>


              {/* =============================
                  VALUE
              ============================== */}

              <div
                className="
                  mt-2.5
                "
              >

                <p
                  className="
                    text-sm
                    font-extrabold
                    tracking-tight
                    text-slate-50
                  "
                >

                  {isLoading

                    ? "Loading..."

                    : formatCurrency(
                        asset.value
                      )}

                </p>

              </div>

            </button>

          );

        }
      )}

    </div>

  );

}


export default AssetBreakdown;
