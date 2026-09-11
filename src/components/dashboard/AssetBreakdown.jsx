import {
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useMutualFunds,
} from "../../context/MutualFundContext";

import {
  useBonds,
} from "../../context/BondContext";

import {
  useDashboardSGB,
} from "../../hooks/dashboard/useDashboardSGB";

import {
  formatCurrency,
  calculateMutualFundSummary,
} from "../../utils/dashboard/assetBreakdownCalculations";

import {
  calculateTotalBondFinancialSummary,
} from "../../utils/bondCalculations";

import {
  assetBreakdownConfig,
} from "./assetBreakdownConfig";


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
  // BONDS
  // ========================================

  const {
    bonds,
    loading:
      bondLoading,

  } = useBonds();


  // ========================================
  // SGB
  // ========================================

  const {
    sgbData,
    sgbLoading,

  } = useDashboardSGB();


  // ========================================
  // MUTUAL FUND SUMMARY
  // ========================================

  const mutualFundSummary =
    useMemo(
      () =>
        calculateMutualFundSummary(
          mutualFundHoldings
        ),
      [
        mutualFundHoldings,
      ]
    );


  // ========================================
  // BOND SUMMARY
  // ========================================

  const bondSummary =
    useMemo(
      () =>
        calculateTotalBondFinancialSummary(
          bonds || []
        ),
      [
        bonds,
      ]
    );


  // ========================================
  // BOND CURRENT VALUE
  // ========================================
  //
  // Value =
  // Principal Received
  // +
  // Interest Received
  //
  // ========================================

  const bondValue =
    bondSummary.totalPrincipal +
    bondSummary.interestReceived;


  // ========================================
  // PREPARE ASSETS
  // ========================================

  const assets =
    useMemo(() => {

      return assetBreakdownConfig.map(
        (asset) => {

          // ----------------------------------
          // MUTUAL FUNDS
          // ----------------------------------

          if (
            asset.id ===
            "mutualFunds"
          ) {

            return {

              ...asset,

              value:
                mutualFundSummary.value,

              holdings:
                mutualFundSummary.holdings,

            };

          }


          // ----------------------------------
          // SGB
          // ----------------------------------

          if (
            asset.id ===
            "sgb"
          ) {

            return {

              ...asset,

              value:
                sgbData.summary
                  .currentValueWithInterest,

              holdings:
                sgbData.summary
                  .seriesCount,

            };

          }


          // ----------------------------------
          // BONDS
          // ----------------------------------

          if (
            asset.id ===
            "bonds"
          ) {

            return {

              ...asset,

              value:
                bondValue,

              holdings:
                bonds?.length || 0,

            };

          }


          // ----------------------------------
          // OTHER ASSETS
          // ----------------------------------

          return asset;

        }
      );

    }, [
      mutualFundSummary,
      sgbData,
      bondValue,
      bonds,
    ]);


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
            ) ||
            (
              asset.id ===
              "bonds" &&
              bondLoading
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