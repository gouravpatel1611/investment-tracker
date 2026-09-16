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
  // CALCULATIONS
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
  // ASSET CARDS
  // ========================================

  const assets =
    useMemo(
      () => {

        return calculations.assets.map(
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

      },
      [
        calculations,
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