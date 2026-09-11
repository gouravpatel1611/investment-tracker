import {
  CalendarDays,
  Landmark,
  Percent,
  Hash,
  Coins,
  Pencil,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";



import { useBonds } from "../../../context/BondContext";
import BondFinancialSummary from "./BondFinancialSummary";

import {
  calculateBondFinancialSummary,
} from "../../../utils/bondCalculations";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(
    Number(value) || 0
  );
}

function formatPercent(value) {
  return `${Number(
    value || 0
  ).toFixed(2)}%`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
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

function BondCard({
  bond,
}) {
  const navigate =
    useNavigate();

  const {
    deleteBond,
  } = useBonds();


   const financialSummary =
    calculateBondFinancialSummary(bond);


  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (
    e
  ) => {
    e.stopPropagation();

    navigate(
      "/bonds/add",
      {
        state: {
          bond,
        },
      }
    );
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (
    e
  ) => {
    e.stopPropagation();

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${bond.bondName || "this bond"}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBond(
        bond.id
      );

      alert(
        "Bond deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete bond error:",
        error
      );

      alert(
        "Bond delete nahi ho paya. Please try again."
      );
    }
  };

  /* =========================================================
     OPEN DETAILS
  ========================================================= */

  const handleOpen = () => {
    navigate(
      `/bonds/${bond.id}`
    );
  };

  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        text-left
        shadow-sm
        transition
        hover:border-slate-600
      "
    >

      <div className="p-4 sm:p-5">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-3">

          <button
            type="button"
            onClick={
              handleOpen
            }
            className="
              flex
              min-w-0
              flex-1
              items-start
              gap-3
              text-left
            "
          >

            <div className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-400
            ">
              <Landmark
                size={20}
              />
            </div>

            <div className="min-w-0">

              <h3 className="
                truncate
                text-sm
                font-bold
                text-slate-100
                sm:text-base
              ">
                {bond.bondName ||
                  "Unnamed Bond"}
              </h3>

              {bond.isin && (
                <p className="mt-0.5 truncate text-[10px] text-slate-500">
                  {bond.isin}
                </p>
              )}

            </div>

          </button>

          {/* ACTIONS */}

          <div className="flex shrink-0 gap-1.5">

            <button
              type="button"
              onClick={
                handleEdit
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                text-slate-300
                transition
                hover:border-blue-500/40
                hover:bg-blue-500/10
                hover:text-blue-400
              "
              aria-label="Edit Bond"
              title="Edit Bond"
            >
              <Pencil
                size={15}
              />
            </button>

            <button
              type="button"
              onClick={
                handleDelete
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                text-slate-300
                transition
                hover:border-red-500/40
                hover:bg-red-500/10
                hover:text-red-400
              "
              aria-label="Delete Bond"
              title="Delete Bond"
            >
              <Trash2
                size={15}
              />
            </button>

          </div>

        </div>

        {/* TAGS */}

        <div className="mt-3 flex flex-wrap gap-2">

          {bond.couponRate !==
            undefined && (
            <span className="
              inline-flex
              items-center
              gap-1
              rounded-full
              bg-emerald-500/10
              px-2.5
              py-1
              text-[11px]
              font-semibold
              text-emerald-400
            ">

              <Percent
                size={11}
              />

              {formatPercent(
                bond.couponRate
              )}

            </span>
          )}

          {bond.couponFrequency && (
            <span className="
              rounded-full
              bg-slate-800
              px-2.5
              py-1
              text-[11px]
              font-medium
              capitalize
              text-slate-300
            ">
              {bond.couponFrequency}
            </span>
          )}

        </div>

        {/* PROFIT */}

        <button
          type="button"
          onClick={
            handleOpen
          }
          className="mt-4 w-full text-left"
        >


            <BondFinancialSummary
                {...financialSummary}
                formatCurrency={formatCurrency}
            />


          {/* DETAILS */}

          <div className="mt-4 border-t border-slate-800 pt-4">

            <p className="mb-2 text-xs font-bold text-slate-300">
              Bond Details
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

              <DetailItem
                icon={Hash}
                label="ISIN"
                value={
                  bond.isin
                }
              />

              <DetailItem
                icon={Coins}
                label="Quantity"
                value={
                  bond.quantity
                }
              />

              <DetailItem
                icon={
                  CalendarDays
                }
                label="Purchase Date"
                value={formatDate(
                  bond.purchaseDate
                )}
              />

              <DetailItem
                icon={
                  CalendarDays
                }
                label="Maturity Date"
                value={formatDate(
                  bond.maturityDate
                )}
              />

            </div>

          </div>

        </button>

      </div>

    </div>
  );
}

export default BondCard;