
import {
  IndianRupee,
} from "lucide-react";

import {
  formatCurrency,
} from "../../utils/licPli/licPliFormatters";


export default function LicPliSummaryCard({
  summary,
}) {

  const rows = [
    {
      key: "lic",
      label: "LIC",
    },
    {
      key: "pli",
      label: "PLI",
    },
    {
      key: "other",
      label: "OTHER",
    },
  ];


  // ========================================
  // TOTAL PREMIUM
  // ========================================

  const totalPremium =
    rows.reduce(
      (total, row) =>
        total +
        Number(
          summary?.[row.key]?.premiumAmount || 0
        ),
      0
    );


  // ========================================
  // TOTAL PAID
  // ========================================

  const totalPaid =
    rows.reduce(
      (total, row) =>
        total +
        Number(
          summary?.[row.key]?.paid || 0
        ),
      0
    );


  return (
    <section
      className="
        mb-4
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-xl
      "
    >

      {/* =====================================
          HEADER
      ====================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          border-b
          border-slate-800
          px-4
          py-3
        "
      >

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-indigo-500/15
            text-indigo-400
          "
        >
          <IndianRupee size={17} />
        </div>


        <div>

          <h2
            className="
              text-sm
              font-bold
              text-white
            "
          >
            Policy Summary
          </h2>


        </div>

      </div>


      {/* =====================================
          COLUMN HEADER
      ====================================== */}

      <div
        className="
          grid
          grid-cols-[58px_1fr_72px_1fr]
          items-center
          gap-2
          border-b
          border-slate-800
          bg-slate-950/50
          px-4
          py-2
        "
      >

        <span
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            text-white
          "
        >
          Type
        </span>


        <span
          className="
            text-right
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            text-white
          "
        >
          Premium
        </span>


        <span
          className="
            text-center
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            text-white
          "
        >
          Inst.
        </span>


        <span
          className="
            text-right
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            text-white
          "
        >
          Total Paid
        </span>

      </div>


      {/* =====================================
          ROWS
      ====================================== */}

      <div
        className="
          divide-y
          divide-slate-800
        "
      >

        {rows.map(
          (row) => (

            <div
              key={row.key}
              className="
                grid
                grid-cols-[58px_1fr_72px_1fr]
                items-center
                gap-2
                px-4
                py-2.5
              "
            >

              {/* TYPE */}

              <span
                className="
                  text-xs
                  font-bold
                  text-white
                "
              >
                {row.label}
              </span>


              {/* PREMIUM */}

              <p
                className="
                  text-right
                  text-xs
                  font-semibold
                  text-white
                "
              >
                {formatCurrency(
                  summary?.[row.key]?.premiumAmount
                )}
              </p>


              {/* INSTALLMENTS */}

              <p
                className="
                  text-center
                  text-xs
                  font-semibold
                  text-white
                "
              >
                {summary?.[row.key]?.installmentPaid || 0}
              </p>


              {/* TOTAL PAID */}

              <p
                className="
                  text-right
                  text-xs
                  font-bold
                  text-emerald-400
                "
              >
                {formatCurrency(
                  summary?.[row.key]?.paid
                )}
              </p>

            </div>

          )
        )}


        {/* ===================================
            TOTAL
        ==================================== */}

<div
  className="
    grid
    grid-cols-[58px_1fr_72px_1fr]
    items-center
    gap-3
    border-t
    border-slate-700
    bg-slate-800/40
    px-4
    py-3
  "
>
  {/* TOTAL LABEL */}

  <span
    className="
      text-xs
      font-extrabold
      text-white
    "
  >
    TOTAL
  </span>


  {/* TOTAL PREMIUM */}

  <p
    className="
      text-right
      text-sm
      font-extrabold
      text-white
    "
  >
    {formatCurrency(
      totalPremium
    )}
  </p>


  {/* TOTAL PAID - MERGED LAST 2 COLUMNS */}

  <p
    className="
      col-span-2
      text-center
      text-sm
      font-extrabold
      text-yellow-400
    "
  >
    {formatCurrency(
      totalPaid
    )}
  </p>

</div>

      </div>

    </section>
  );
}

