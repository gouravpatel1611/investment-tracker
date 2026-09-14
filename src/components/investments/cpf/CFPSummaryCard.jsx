import {
  IndianRupee,
  WalletCards,
  UserRound,
  Building2,
  TrendingUp,
} from "lucide-react";

import {
  formatCurrencyRound,
} from "../../../utils/cpf/cpfHelpers";



function SummaryRow({
  label,
  closingBalance,
  totalInterest,
  type = "default",
  icon,
}) {
  const styles = {
    own: {
      wrapper:
        "border-blue-900/60 bg-blue-950/30",
      icon:
        "bg-blue-900/50 text-blue-300",
      label:
        "text-blue-300",
      closing:
        "text-blue-100",
      interest:
        "text-blue-200",
    },

    nvs: {
      wrapper:
        "border-violet-900/60 bg-violet-950/30",
      icon:
        "bg-violet-900/50 text-violet-300",
      label:
        "text-violet-300",
      closing:
        "text-violet-100",
      interest:
        "text-violet-200",
    },

    total: {
      wrapper:
        "border-emerald-800/60 bg-emerald-950/30",
      icon:
        "bg-emerald-900/50 text-emerald-300",
      label:
        "text-emerald-300",
      closing:
        "text-emerald-100",
      interest:
        "text-emerald-200",
    },

    default: {
      wrapper:
        "border-slate-700 bg-slate-800/70",
      icon:
        "bg-slate-700 text-slate-300",
      label:
        "text-slate-400",
      closing:
        "text-slate-100",
      interest:
        "text-slate-200",
    },
  };

  const currentStyle =
    styles[type] || styles.default;

  return (
    <div
      className={`
        grid
        grid-cols-[1.05fr_1fr_1fr]
        items-center
        gap-2
        rounded-xl
        border
        px-2.5
        py-2.5
        sm:px-3
        sm:py-3
        ${currentStyle.wrapper}
      `}
    >
      {/* Name */}
      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
        "
      >
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


      {/* Closing Balance */}
      <div className="min-w-0">
        <p
          className="
            text-[9px]
            font-medium
            text-slate-100
            sm:text-[10px]
          "
        >
          Closing
        </p>

        <p
          className={`
            mt-0.5
            truncate
            text-[12px]
            font-bold
            leading-tight
            sm:text-sm
            ${currentStyle.closing}
          `}
        >
          {formatCurrencyRound(closingBalance)}
        </p>
      </div>


      {/* Total Interest */}
      <div className="min-w-0">
        <p
          className="
            text-[9px]
            font-medium
            text-slate-100
            sm:text-[10px]
          "
        >
          Interest
        </p>

        <p
          className={`
            mt-0.5
            truncate
            text-[12px]
            font-bold
            leading-tight
            sm:text-sm
            ${currentStyle.interest}
          `}
        >
          {formatCurrencyRound(totalInterest)}
        </p>
      </div>
    </div>
  );
}


export default function CFPSummaryCard({
  ownClosingBalance = 0,

  nvsClosingBalance = 0,

  totalClosingBalance = 0,
  ownInterest =0,
  nvsInterest =0,
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
                CPF SUMMARY
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
              text-slate-100
            "
          >
            <IndianRupee size={17} />
          </div>

        </div>
      </div>





      {/* =====================================================
          SUMMARY ROWS
      ====================================================== */}
      <div
        className="
          space-y-2
          p-3.5
          pt-2
          sm:p-4
          sm:pt-2
        "
      >

        {/* Own CPF */}
        <SummaryRow
          label="Own CPF"
          closingBalance={ownClosingBalance}
          totalInterest={ownInterest}
          type="own"
          icon={
            <UserRound size={14} />
          }
        />


        {/* NVS CPF */}
        <SummaryRow
          label="NVS CPF"
          closingBalance={nvsClosingBalance}
          totalInterest={nvsInterest}
          type="nvs"
          icon={
            <Building2 size={14} />
          }
        />


        {/* Total */}
        <SummaryRow
          label="Total"
          closingBalance={totalClosingBalance}
          totalInterest={ownInterest + nvsInterest}
          type="total"
          icon={
            <TrendingUp size={14} />
          }
        />

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
          Combined CPF balance & interest for FY{" "}
          {financialYear}
        </span>
      </div>

    </section>
  );
}
