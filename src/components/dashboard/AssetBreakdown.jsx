
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
  useVortaxa,
} from "../../context/VortaxaContext";

import AssetBreakdownCard
  from "./AssetBreakdownCard";

import {
  assetBreakdownConfig,
} from "./assetBreakdownConfig";

import {
  calculateDashboardTotals,
  formatCurrency,
} from "../../utils/dashboard/dashboardCalculations";


function AssetBreakdown() {

  const navigate =
    useNavigate();


  // ========================================
  // MUTUAL FUNDS
  // ========================================

  const {
    holdings:
      mutualFundHoldings = [],

    loading:
      mutualFundLoading,
  } = useMutualFunds();


  // ========================================
  // SGB
  // ========================================

  const {
    summary:
      sgbSummary = {},

    loading:
      sgbLoading,
  } = useSGB();


  // ========================================
  // BONDS
  // ========================================

  const {
    bonds = [],

    loading:
      bondLoading,
  } = useBonds();


  // ========================================
  // CPF
  // ========================================

  const {
    record:
      cpfRecord = null,

    loading:
      cpfLoading,
  } = useCPF();


  // ========================================
  // INT-FD
  // ========================================

  const {
    fds = [],

    loading:
      fdLoading,
  } = useIntFd();


  // ========================================
  // LIC / PLI
  // ========================================

  const {
    policies:
      licPliPolicies = [],

    loading:
      licPliLoading,
  } = useLicPli();


  // ========================================
  // ETF / STOCK
  // ========================================

  const {
    summary:
      etfStockSummary = {},

    loading:
      etfStockLoading,
  } = useETFStock();


  // ========================================
  // VORTAXA
  // ========================================

  const {
    investorData:
      vortaxaInvestorData = [],

    allInvestorsSummary:
      vortaxaAllSummary = {},
  } = useVortaxa();


  // ========================================
  // NORMAL ASSET CALCULATIONS
  // ========================================

  const calculations =
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


  // ========================================
  // VORTAXA TOTAL WITHDRAWAL
  // ========================================

  const vortaxaTotalWithdrawal =
    Number(
      vortaxaAllSummary?.totalWithdrawn ??
      vortaxaAllSummary?.totalEarnWithdrawn ??
      0
    );


  // ========================================
  // VORTAXA NET WITHDRAWAL
  // ========================================

  const vortaxaNetWithdrawal =
    Number(
      vortaxaAllSummary?.netWithdrawal || 0
    );


  // ========================================
  // VORTAXA HOLDINGS
  // ========================================

  const vortaxaHoldings =
    useMemo(
      () => {

        if (
          !Array.isArray(
            vortaxaInvestorData
          )
        ) {
          return 0;
        }


        return vortaxaInvestorData.length;

      },
      [
        vortaxaInvestorData,
      ]
    );


  // ========================================
  // ASSET CARDS
  // ========================================

  const assets =
    useMemo(
      () => {

        const calculatedAssets =
          calculations.assets.map(
            (calculatedAsset) => {

              const config =
                assetBreakdownConfig.find(
                  (item) =>
                    item.id ===
                    calculatedAsset.id
                );


              return {
                ...config,

                ...calculatedAsset,

                formattedValue:
                  formatCurrency(
                    calculatedAsset.currentValue
                  ),
              };

            }
          );


        // ====================================
        // VORTAXA
        // ====================================

        const vortaxaConfig =
          assetBreakdownConfig.find(
            (item) =>
              item.id === "vortaxa"
          );


        calculatedAssets.push({

          ...vortaxaConfig,

          id:
            "vortaxa",

          name:
            vortaxaConfig?.name ||
            "Vortaxa",


          /*
           * Vortaxa main value
           * = Total Withdrawal
           */

          currentValue:
            vortaxaTotalWithdrawal,

          formattedValue:
            formatCurrency(
              vortaxaTotalWithdrawal
            ),


          profit:
            0,

          returnPercentage:
            0,


          /*
           * Net Withdrawal
           * is shown below main value.
           */

          netWithdrawal:
            vortaxaNetWithdrawal,


          /*
           * Number of Vortaxa investors.
           */

          holdings:
            vortaxaHoldings,

        });


        return calculatedAssets;

      },
      [
        calculations,
        vortaxaTotalWithdrawal,
        vortaxaNetWithdrawal,
        vortaxaHoldings,
      ]
    );


  // ========================================
  // NAVIGATION
  // ========================================

  const handleAssetClick =
    (assetId) => {

      const routes = {

        mutualFunds:
          "/mutual-funds",

        sgb:
          "/sgb",

        bonds:
          "/bonds",

        cpf:
          "/cpf",

        lic:
          "/lic-pli",

        etfStock:
          "/etf-stock",

        fd:
          "/int-fd",

        vortaxa:
          "/vortaxa",

      };


      const route =
        routes[assetId];


      if (!route) {
        return;
      }


      navigate(route);

    };


  // ========================================
  // UI
  // ========================================

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
      "
    >

      {assets.map(
        (asset) => (

          <AssetBreakdownCard
            key={
              asset.id
            }

            asset={
              asset
            }

            isLoading={
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
              ) ||
              (
                asset.id ===
                "lic" &&
                licPliLoading
              ) ||
              (
                asset.id ===
                "etfStock" &&
                etfStockLoading
              ) ||
              (
                asset.id ===
                "fd" &&
                fdLoading
              )
            }

            onClick={() =>
              handleAssetClick(
                asset.id
              )
            }
          />

        )
      )}

    </div>
  );
}


export default AssetBreakdown;

