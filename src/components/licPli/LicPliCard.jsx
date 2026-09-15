
import {
  CalendarDays,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
  getTypeLabel,
} from "../../utils/licPli/licPliFormatters";


/* =================================================
   TYPE STYLES
================================================= */

const typeStyles = {
  lic: {
    badge:
      "border-blue-400/30 bg-blue-500/15 text-blue-300",

    accent:
      "bg-blue-500",

    accentText:
      "text-blue-400",

    iconBg:
      "bg-blue-500/10",

    iconBorder:
      "border-blue-500/20",

    iconText:
      "text-blue-400",
  },

  pli: {
    badge:
      "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",

    accent:
      "bg-emerald-500",

    accentText:
      "text-emerald-400",

    iconBg:
      "bg-emerald-500/10",

    iconBorder:
      "border-emerald-500/20",

    iconText:
      "text-emerald-400",
  },

  other: {
    badge:
      "border-violet-400/30 bg-violet-500/15 text-violet-300",

    accent:
      "bg-violet-500",

    accentText:
      "text-violet-400",

    iconBg:
      "bg-violet-500/10",

    iconBorder:
      "border-violet-500/20",

    iconText:
      "text-violet-400",
  },
};


/* =================================================
   MAIN CARD
================================================= */

export default function LicPliCard({
  policy,
  onEdit,
  onDelete,
}) {
  const style =
    typeStyles[policy?.type] ||
    typeStyles.other;

  return (
    <article
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-700/70
        bg-slate-950
        shadow-xl
        shadow-black/30
      "
    >

      {/* =================================================
          TOP COLOR ACCENT
      ================================================= */}

      <div
        className={`
          absolute
          left-0
          top-0
          h-1
          w-full
          ${style.accent}
        `}
      />

      <div className="relative p-4">

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >

          {/* Left */}
          <div className="min-w-0">

            <div
              className="
                mb-2
                flex
                items-center
                gap-2
              "
            >

              {/* Type Badge */}
              <span
                className={`
                  rounded-lg
                  border
                  px-2.5
                  py-1
                  text-[10px]
                  font-extrabold
                  tracking-wide
                  ${style.badge}
                `}
              >
                {getTypeLabel(
                  policy?.type
                )}
              </span>

              {/* Policy Number */}
              <span
                className="
                  truncate
                  text-[10px]
                  font-semibold
                  text-white
                "
              >
                #{policy?.policyNo || "-"}
              </span>

            </div>


            {/* Scheme Name */}
            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <div
                className={`
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  ${style.iconBg}
                  ${style.iconBorder}
                  ${style.iconText}
                `}
              >
                <ShieldCheck size={15} />
              </div>

              <h3
                className="
                  min-w-0
                  truncate
                  text-[15px]
                  font-extrabold
                  tracking-tight
                  text-white
                "
              >
                {policy?.schemeName || "-"}
              </h3>

            </div>

          </div>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              gap-1.5
            "
          >

            {/* Edit */}
            <button
              type="button"
              onClick={() =>
                onEdit(policy)
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-slate-600
                bg-slate-800
                text-white
                transition
                hover:bg-slate-700
                active:scale-95
              "
              title="Edit"
            >
              <Pencil size={14} />
            </button>


            {/* Delete */}
            <button
              type="button"
              onClick={() =>
                onDelete(policy)
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-red-500/20
                bg-red-500/10
                text-red-400
                transition
                hover:border-red-500/30
                hover:bg-red-500/20
                hover:text-red-300
                active:scale-95
              "
              title="Delete"
            >
              <Trash2 size={14} />
            </button>

          </div>

        </div>


        {/* =================================================
            FINANCIAL DETAILS
        ================================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-3
            gap-2
          "
        >

          <Info
            label="Premium"
            value={formatCurrency(
              policy?.premiumAmount
            )}
          />

          <Info
            label="Installments"
            value={
              policy?.installmentPaid || 0
            }
          />

          <Info
            label="Total Paid"
            value={formatCurrency(
              policy?.totalPaid
            )}
            highlight
          />

        </div>


        {/* =================================================
            DATES
        ================================================= */}

        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-3
            border-t
            border-slate-700/70
            pt-3
          "
        >

          <DateInfo
            label="Premium Date"
            date={policy?.premiumDate}
            accent={style.accentText}
          />

          <DateInfo
            label="Maturity Date"
            date={policy?.maturityDate}
            accent={style.accentText}
          />

        </div>

      </div>
    </article>
  );
}


/* =================================================
   INFO BOX
================================================= */

function Info({
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-700/70
        bg-slate-900
        px-2.5
        py-2.5
        shadow-inner
        shadow-black/20
      "
    >

      <p
        className="
          text-[9px]
          font-semibold
          uppercase
          tracking-wider
          text-slate-300
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1
          truncate
          text-xs
          font-extrabold
          ${
            highlight
              ? "text-emerald-400"
              : "text-white"
          }
        `}
      >
        {value}
      </p>

    </div>
  );
}


/* =================================================
   DATE INFO
================================================= */

function DateInfo({
  label,
  date,
  accent,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2.5
      "
    >

      {/* Calendar Icon */}
      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-slate-700
          bg-slate-800
          ${accent}
        `}
      >
        <CalendarDays size={14} />
      </div>


      {/* Date */}
      <div className="min-w-0">

        <p
          className="
            text-[9px]
            font-semibold
            text-slate-300
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[11px]
            font-bold
            text-white
          "
        >
          {formatDate(date)}
        </p>

      </div>

    </div>
  );
}

