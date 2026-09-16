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

const assets = [
  {
    id: "mutualFunds",
    name: "Mutual Funds",
    type: "Equity & Hybrid",
    icon: PieChart,
    iconClass: "bg-purple-500/15 text-purple-300",
    route: "/mutual-funds/add",
  },
  {
    id: "fd",
    name: "INT-FD",
    type: "Fixed Deposit",
    icon: WalletCards,
    iconClass: "bg-amber-500/15 text-amber-300",
    route: "/int-fd/add",
  },
  {
    id: "bonds",
    name: "Bonds",
    type: "Fixed Income",
    icon: FileText,
    iconClass: "bg-blue-500/15 text-blue-300",
    route: "/bonds/add",
  },
  {
    id: "sgb",
    name: "SGB",
    type: "Sovereign Gold Bond",
    icon: Gem,
    iconClass: "bg-yellow-500/15 text-yellow-300",
    route: "/sgb/add",
  },
  {
    id: "lic",
    name: "LIC-PLI-OTHER",
    type: "Life & Postal Insurance",
    icon: ShieldCheck,
    iconClass: "bg-emerald-500/15 text-emerald-300",
    route: "/lic-pli/add",
  },
  {
    id: "etfStock",
    name: "ETF-STOCK",
    type: "ETF & Stock",
    icon: TrendingUp,
    iconClass: "bg-sky-500/15 text-sky-300",
    route: "/etf-stock/add",
  },
];

function AssetSelector({ onClose }) {
  const navigate = useNavigate();

  const handleAssetClick = (asset) => {
    // Pehle modal close
    if (onClose) {
      onClose();
    }

    // Phir route
    navigate(asset.route);
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {assets.map((asset) => {
        const Icon = asset.icon;

        return (
          <button
            key={asset.id}
            type="button"
            onClick={() => handleAssetClick(asset)}
            className="
              group
              flex
              min-h-[64px]
              w-full
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-700/80
              bg-slate-800
              p-3
              text-left
              transition-all
              duration-200
              hover:border-slate-600
              hover:bg-slate-750
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-purple-500/30
            "
          >
            {/* ICON */}
            <div
              className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${asset.iconClass}
              `}
            >
              <Icon
                size={19}
                strokeWidth={2}
              />
            </div>

            {/* NAME */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-100">
                {asset.name}
              </p>

              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {asset.type}
              </p>
            </div>

            {/* ARROW */}
            <span
              className="
                shrink-0
                text-lg
                text-slate-600
                transition-all
                duration-200
                group-hover:translate-x-1
                group-hover:text-slate-300
              "
            >
              →
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default AssetSelector;