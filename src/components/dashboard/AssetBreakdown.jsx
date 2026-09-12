import {
  useEffect,
  useMemo,
  useState,
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
  getCPFRecord,
} from "../../services/firebase/cpfService";

import {
  calculateCPF,
  calculateNVSCPF,
} from "../../utils/cpf/cpfCalculations";

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
  // CPF
  // ========================================

  const [
    cpfData,
    setCpfData,
  ] = useState(null);


  const [
    cpfLoading,
    setCpfLoading,
  ] = useState(true);


  useEffect(() => {

    let mounted = true;


    const loadCPF = async () => {

      try {

        setCpfLoading(true);

        const data =
          await getCPFRecord();


        if (mounted) {
          setCpfData(data);
        }

      } catch (error) {

        console.error(
          "Failed to load CPF:",
          error
        );

      } finally {

        if (mounted) {
          setCpfLoading(false);
        }

      }

    };


    loadCPF();


    return () => {
      mounted = false;
    };

  }, []);


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


  // ========================================
  // CPF SUMMARY
  // ========================================

  const cpfSummary =
    useMemo(() => {

      if (!cpfData) {

        return {
          ownClosingBalance: 0,
          nvsClosingBalance: 0,
          totalClosingBalance: 0,
        };

      }


      // ------------------------------------
      // OWN CPF
      // ------------------------------------

      const ownCPF =
        calculateCPF({

          openingBalance:
            cpfData.own?.openingBalance || 0,

          monthlyDeposit:
            cpfData.own?.monthlyContribution || 0,

          interestRates:
            cpfData.own?.interestRates || {},

          financialYear:
            cpfData.financialYear,

        });


      // ------------------------------------
      // NVS CPF
      // ------------------------------------

      const nvsCPF =
        calculateNVSCPF({

          openingBalance:
            cpfData.nvs?.openingBalance || 0,

          basicPay:
            cpfData.nvs?.basicPay || 0,

          interestRates:
            cpfData.nvs?.interestRates || {},

          financialYear:
            cpfData.financialYear,

        });


      return {

        ownClosingBalance:
          ownCPF.closingBalance,

        nvsClosingBalance:
          nvsCPF.closingBalance,

        totalClosingBalance:
          ownCPF.closingBalance +
          nvsCPF.closingBalance,

      };

    }, [
      cpfData,
    ]);


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
                sgbData?.summary
                  ?.currentValueWithInterest || 0,

              holdings:
                sgbData?.summary
                  ?.seriesCount || 0,

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
          // CPF
          // ----------------------------------

          if (
            asset.id ===
            "cpf"
          ) {

            return {

              ...asset,

              value:
                cpfSummary.totalClosingBalance,

              holdings:
                2,

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
      cpfSummary,
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
      // CPF
      // --------------------------------------

      if (
        asset.id ===
        "cpf"
      ) {

        navigate(
          "/cpf"
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
            ) ||
            (
              asset.id ===
              "cpf" &&
              cpfLoading
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