import {
  CalendarDays,
  Landmark,
  Percent,
  Hash,
  Coins,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  calculateBondProfit,
} from "../../../utils/bondCalculations";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-800/60 p-3">
      <div className="flex items-center gap-1.5">
        <Icon
          size={13}
          className="text-slate-500"
        />

        <p className="text-[10px] font-medium text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-1.5 truncate text-xs font-bold text-slate-200 sm:text-sm">
        {value || "-"}
      </p>
    </div>
  );
}

function BondCard({ bond }) {
  const navigate = useNavigate();

  const profit =
    calculateBondProfit(bond);


  const isProfit = profit >= 0;

  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/bonds/${bond.id}`
        )
      }
      className="w-full rounded-2xl border border-slate-700 bg-slate-900 text-left shadow-sm transition hover:border-slate-600 active:scale-[0.99]"
    >
      <div className="p-4 sm:p-5">

        {/* HEADER */}

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Landmark size={20} />
          </div>

            <h3 className="truncate text-sm font-bold text-slate-100 sm:text-base">
              {bond.bondName ||
                "Unnamed Bond"}
            </h3>

        </div>

        {/* TAGS */}

        <div className="mt-3 flex flex-wrap gap-2">
          {bond.couponRate !==
            undefined && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
              <Percent size={11} />

              {formatPercent(
                bond.couponRate
              )}
            </span>
          )}

          {bond.couponFrequency && (
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium capitalize text-slate-300">
              {bond.couponFrequency}
            </span>
          )}
        </div>

        {/* PROFIT */}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-800/60 p-3">
            <p className="text-[10px] font-medium text-slate-500">
              Interst Recived 
            </p>

            <p
              className={`mt-1 text-base font-extrabold sm:text-lg ${
                isProfit
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {isProfit ? "+" : ""}
              {formatCurrency(profit)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-3">
            <p className="text-[10px] font-medium text-slate-500">
              Principal
            </p>

            <p className="mt-1 text-base font-extrabold text-slate-100 sm:text-lg">
              {formatCurrency(
                bond.purchaseValue
              )}
            </p>
          </div>
        </div>

        {/* BOND DETAILS */}

        <div className="mt-4 border-t border-slate-800 pt-4">
          <p className="mb-2 text-xs font-bold text-slate-300">
            Bond Details
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

            <DetailItem
              icon={Hash}
              label="ISIN"
              value={bond.isin}
            />

            <DetailItem
              icon={Coins}
              label="Quantity"
              value={bond.quantity}
            />



            <DetailItem
              icon={CalendarDays}
              label="Purchase Date"
              value={formatDate(
                bond.purchaseDate
              )}
            />

            <DetailItem
              icon={CalendarDays}
              label="Maturity Date"
              value={formatDate(
                bond.maturityDate
              )}
            />


          </div>
        </div>

      </div>
    </button>
  );
}

export default BondCard;