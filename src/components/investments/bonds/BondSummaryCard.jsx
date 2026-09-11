import {
  Banknote,
  CircleDollarSign,
  Wallet,
  Landmark,
  TrendingUp,
  Clock3,
} from "lucide-react";


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}


/* =========================================================
   SUMMARY ITEM
========================================================= */

function SummaryItem({
  icon: Icon,
  label,
  value,
  iconClass = "text-slate-400",
  valueClass = "text-slate-200",
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-2
        rounded-xl
        bg-slate-800/60
        p-3
      "
    >

      {/* ICON */}

      <div
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-md
          bg-slate-700/70
          ${iconClass}
        `}
      >
        <Icon size={12} />
      </div>


      {/* CONTENT */}

      <div className="min-w-0 flex-1">

        <p
          className="
            break-words
            text-[10px]
            font-medium
            uppercase
            leading-tight
            tracking-wide
            text-slate-500
          "
        >
          {label}
        </p>

        <p
          className={`
            mt-1
            truncate
            text-sm
            font-bold
            leading-tight
            ${valueClass}
          `}
        >
          {value}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   COMPONENT
========================================================= */

function BondSummaryCard({
  data,
  summary,
}) {

  /*
    summary preferred hai.

    Agar parent se summary nahi aati,
    to data fallback rahega.
  */

  const financialSummary =
    summary || data || {};


  const {
    totalPrincipal = 0,
    totalInterest = 0,
    principalReceived = 0,
    interestReceived = 0,
    principalRemaining = 0,
    interestRemaining = 0,

    holdings = 0,
  } = financialSummary;


  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        shadow-sm
      "
    >

      {/* =================================================
          TOP
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-800
          px-4
          py-4
          sm:px-5
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-400
            "
          >
            <Landmark size={20} />
          </div>


          <div>

            <p className="text-xs text-slate-400">
              Bond Portfolio
            </p>

            <p className="mt-0.5 text-sm font-bold text-slate-100">
              {holdings}{" "}
              {holdings === 1
                ? "Bond"
                : "Bonds"}
            </p>

          </div>

        </div>


        <Wallet
          size={19}
          className="text-slate-500"
        />

      </div>


      {/* =================================================
          FINANCIAL SUMMARY
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-2
          p-4
          sm:px-5
          sm:pb-5
        "
      >

        {/* TOTAL PRINCIPAL */}

        <SummaryItem
          icon={Wallet}
          label="Total Principal"
          value={formatCurrency(totalPrincipal)}
          iconClass="text-sky-400"
          valueClass="text-slate-200"
        />


        {/* TOTAL INTEREST */}

        <SummaryItem
          icon={CircleDollarSign}
          label="Total Interest"
          value={formatCurrency(totalInterest)}
          iconClass="text-violet-400"
          valueClass="text-slate-200"
        />


        {/* PRINCIPAL RECEIVED */}

        <SummaryItem
          icon={Banknote}
          label="Principal Received"
          value={formatCurrency(principalReceived)}
          iconClass="text-emerald-400"
          valueClass="text-emerald-400"
        />


        {/* INTEREST RECEIVED */}

        <SummaryItem
          icon={TrendingUp}
          label="Interest Received"
          value={formatCurrency(interestReceived)}
          iconClass="text-emerald-400"
          valueClass="text-emerald-400"
        />


        {/* PRINCIPAL REMAINING */}

        <SummaryItem
          icon={Landmark}
          label="Principal Remain"
          value={formatCurrency(principalRemaining)}
          iconClass="text-amber-400"
          valueClass="text-amber-400"
        />


        {/* INTEREST REMAINING */}

        <SummaryItem
          icon={Clock3}
          label="Interest Remain"
          value={formatCurrency(interestRemaining)}
          iconClass="text-amber-400"
          valueClass="text-amber-400"
        />

      </div>

    </div>
  );
}


export default BondSummaryCard;