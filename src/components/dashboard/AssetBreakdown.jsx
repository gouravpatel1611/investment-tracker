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


function AssetBreakdown({ onAssetClick }) {

  const navigate = useNavigate();

  const {
    holdings: mutualFundHoldings,
    loading: mutualFundLoading,
  } = useMutualFunds();


  /* --------------------------------
     MUTUAL FUND SUMMARY
  -------------------------------- */

  const mutualFundSummary = useMemo(() => {

    const value =
      mutualFundHoldings.reduce(
        (total, fund) =>
          total +
          (Number(
            fund.currentValue
          ) || 0),
        0
      );

    return {
      value,
      holdings:
        mutualFundHoldings.length,
    };

  }, [mutualFundHoldings]);


  /* --------------------------------
     ASSETS
  -------------------------------- */

  const assets = [
    {
      id: "mutualFunds",
      name: "MUTUAL FUNDS",
      type: "Equity & Hybrid",
      icon: PieChart,
      iconClass:
        "bg-purple-500/15 text-purple-300",

      value:
        mutualFundSummary.value,

      holdings:
        mutualFundSummary.holdings,
    },

    {
      id: "cpf",
      name: "CPF",
      type: "Provident Fund",
      icon: BriefcaseBusiness,
      iconClass:
        "bg-cyan-500/15 text-cyan-300",
      value: 0,
      holdings: 0,
    },

    {
      id: "fd",
      name: "INT-FD",
      type: "Fixed Deposit",
      icon: WalletCards,
      iconClass:
        "bg-amber-500/15 text-amber-300",
      value: 0,
      holdings: 0,
    },

    {
      id: "apyNps",
      name: "APY-NPS",
      type: "PENSION",
      icon: CircleGauge,
      iconClass:
        "bg-pink-500/15 text-pink-300",
      value: 0,
      holdings: 0,
    },

    {
      id: "crypto",
      name: "CRYPTO",
      type: "Digital Assets",
      icon: Bitcoin,
      iconClass:
        "bg-violet-500/15 text-violet-300",
      value: 0,
      holdings: 0,
    },

    {
      id: "bonds",
      name: "BONDS",
      type: "Fixed Income",
      icon: FileText,
      iconClass:
        "bg-blue-500/15 text-blue-300",
      value: 0,
      holdings: 0,
    },

    {
      id: "sgb",
      name: "SGB",
      type: "Sovereign Gold Bond",
      icon: Gem,
      iconClass:
        "bg-yellow-500/15 text-yellow-300",
      value: 0,
      holdings: 0,
    },

    {
      id: "lic",
      name: "LIC-PLI",
      type: "Life & Postal Insurance",
      icon: ShieldCheck,
      iconClass:
        "bg-emerald-500/15 text-emerald-300",
      value: 0,
      holdings: 0,
    },

    {
      id: "etfStock",
      name: "ETF-STOCK",
      type: "ETF & Stock",
      icon: TrendingUp,
      iconClass:
        "bg-sky-500/15 text-sky-300",
      value: 0,
      holdings: 0,
    },
  ];


  /* --------------------------------
     CARD CLICK
  -------------------------------- */

const handleCardClick = (asset) => {

  /* MUTUAL FUNDS */
  if (asset.id === "mutualFunds") {
    navigate("/mutual-funds");
    return;
  }

  /* SGB */
  if (asset.id === "sgb") {
    navigate("/sgb");
    return;
  }

  /* OTHER ASSETS */
  if (onAssetClick) {
    onAssetClick(asset);
    return;
  }

  console.log("Open asset:", asset.id);
};


  return (
    <div
      className="
        grid
        grid-cols-1
        gap-2.5
      "
    >

      {assets.map((asset) => {

        const Icon = asset.icon;

        return (
          <button
            key={asset.id}
            type="button"
            onClick={() =>
              handleCardClick(asset)
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

            {/* TOP */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >

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

                <div className="min-w-0">

                  <h3
                    className="
                      truncate
                      text-sm
                      font-extrabold
                      tracking-tight
                      text-slate-50
                    "
                  >
                    {asset.name}
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
                    {asset.type} ·{" "}

                    {asset.id ===
                    "mutualFunds" &&
                    mutualFundLoading
                      ? "Loading..."
                      : (
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


            {/* VALUE */}

            <div className="mt-2.5">

              <p
                className="
                  text-sm
                  font-extrabold
                  tracking-tight
                  text-slate-50
                "
              >

                {asset.id ===
                "mutualFunds" &&
                mutualFundLoading
                  ? "Loading..."
                  : formatCurrency(
                      asset.value
                    )}

              </p>

            </div>

          </button>
        );

      })}

    </div>
  );
}


export default AssetBreakdown;