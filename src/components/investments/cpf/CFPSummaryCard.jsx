import {
  IndianRupee,
  WalletCards,
  TrendingUp,
  UserRound,
  Building2,
} from "lucide-react";

import {
  formatCurrency,
} from "../../../utils/cpf/cpfHelpers";


function SummaryItem({
  label,
  value,
  icon,
  type = "default",
}) {
  const styles = {
    own: {
      wrapper:
        "border-blue-900/60 bg-blue-950/30",
      icon:
        "bg-blue-900/50 text-blue-300",
      label:
        "text-blue-300",
      value:
        "text-blue-100",
    },

    nvs: {
      wrapper:
        "border-violet-900/60 bg-violet-950/30",
      icon:
        "bg-violet-900/50 text-violet-300",
      label:
        "text-violet-300",
      value:
        "text-violet-100",
    },

    total: {
      wrapper:
        "border-emerald-800/60 bg-emerald-950/30",
      icon:
        "bg-emerald-900/50 text-emerald-300",
      label:
        "text-emerald-300",
      value:
        "text-emerald-100",
    },

    default: {
      wrapper:
        "border-slate-700 bg-slate-800/70",
      icon:
        "bg-slate-700 text-slate-300",
      label:
        "text-slate-400",
      value:
        "text-slate-100",
    },
  };

  const currentStyle =
    styles[type] || styles.default;

  return (
    <div
      className={`
        min-w-0
        rounded-xl
        border
        px-3
        py-3
        ${currentStyle.wrapper}
      `}
    >
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        {/* Icon */}
        <div
          className={`
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${currentStyle.icon}
          `}
        >
          {icon}
        </div>

        {/* Label */}
        <p
          className={`
            truncate
            text-[10px]
            font-semibold
            uppercase
            tracking-wide
            ${currentStyle.label}
          `}
        >
          {label}
        </p>
      </div>

      {/* Value */}
      <p
        className={`
          mt-2
          truncate
          text-base
          font-bold
          leading-tight
          ${currentStyle.value}
          sm:text-lg
        `}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}


export default function CFPSummaryCard({
  ownClosingBalance = 0,
  nvsClosingBalance = 0,
  totalClosingBalance = 0,
  financialYear,
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        shadow-lg
        shadow-slate-900/10
      "
    >

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          border-b
          border-slate-700
          p-4
          sm:p-5
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >

          {/* Title */}
          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-slate-800
                text-slate-200
              "
            >
              <WalletCards size={19} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-base
                  font-bold
                  text-white
                  sm:text-lg
                "
              >
                CPF Summary
              </h2>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-slate-400
                "
              >
                Financial Year {financialYear}
              </p>
            </div>
          </div>


          {/* Rupee Icon */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-800
              text-slate-400
            "
          >
            <IndianRupee size={17} />
          </div>

        </div>
      </div>


      {/* =====================================================
          SUMMARY FIELDS
      ====================================================== */}
      <div
        className="
          grid
          grid-cols-2
          gap-2.5
          p-3.5
          sm:grid-cols-3
          sm:gap-3
          sm:p-4
        "
      >

        {/* Own CPF */}
        <SummaryItem
          label="Own CPF"
          value={ownClosingBalance}
          type="own"
          icon={
            <UserRound size={14} />
          }
        />


        {/* NVS CPF */}
        <SummaryItem
          label="NVS CPF"
          value={nvsClosingBalance}
          type="nvs"
          icon={
            <Building2 size={14} />
          }
        />


        {/* Total */}
        <div
          className="
            col-span-2
            sm:col-span-1
          "
        >
          <SummaryItem
            label="Total Closing Balance"
            value={totalClosingBalance}
            type="total"
            icon={
              <TrendingUp size={14} />
            }
          />
        </div>

      </div>


      {/* =====================================================
          BOTTOM STRIP
      ====================================================== */}
      <div
        className="
          flex
          items-center
          gap-2
          border-t
          border-slate-700
          bg-slate-950/30
          px-4
          py-3
          text-[10px]
          text-slate-500
          sm:px-5
          sm:text-xs
        "
      >
        <TrendingUp
          size={14}
          className="
            shrink-0
            text-emerald-400
          "
        />

        <span>
          Combined CPF balance for FY{" "}
          {financialYear}
        </span>
      </div>

    </section>
  );
}