
import {
  ChevronRight,
  CircleDollarSign,
  TrendingUp,
  Wallet,
  BarChart3,
  PiggyBank,
  ArrowDownToLine,
  Percent,
  DollarSign,
} from "lucide-react";

import {
  formatCurrency,
} from "../../../utils/vortaxa/vortaxaFormatters";


function MetricCard({
  icon: Icon,
  label,
  value,
  iconClass,
  valueClass,
}) {
  return (
    <div
      className="
        min-w-0
        rounded-xl
        border
        border-slate-700
        bg-slate-900/70
        px-2.5
        py-2.5
      "
    >
      <div className="flex items-center gap-1.5">

        <Icon
          className={`h-3.5 w-3.5 shrink-0 ${iconClass}`}
        />

        <p
          className="
            truncate
            text-xs
            font-bold
            text-white
          "
        >
          {label}
        </p>

      </div>


      <p
        className={`
          mt-1.5
          truncate
          text-center
          text-sm
          font-extrabold
          leading-tight
          sm:text-base
          ${valueClass}
        `}
      >
        {value}
      </p>

    </div>
  );
}


function VortaxaInvestorCard({
  investor,
  summary = {},
  onClick,
}) {

  const investorName =
    investor?.investorName ||
    investor?.name ||
    "Investor";


  const {
    liquidity = 0,
    fule = 0,
    piFule = 0,
    grossEarn = 0,
    totalEarnWithdrawn = 0,
    availableEarn = 0,

    // Future fields
    apr = 0,
    pi = 0,

  } = summary;


  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-3
        text-left
        font-[Calibri]
        transition
        hover:border-slate-600
        hover:bg-slate-750
        sm:p-4
      "
      style={{
        fontFamily: "Calibri, Arial, sans-serif",
      }}
    >

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex items-center justify-between gap-3">

        <div className="flex min-w-0 items-center gap-2.5">

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-orange-500/15
            "
          >
            <CircleDollarSign
              className="
                h-5
                w-5
                text-orange-300
              "
            />
          </div>


          <div className="min-w-0">

            <p
              className="
                truncate
                text-base
                font-extrabold
                text-white
              "
            >
              {investorName}
            </p>


            <p
              className="
                mt-0.5
                text-xs
                font-medium
                text-white
              "
            >
              Vortaxa Investment
            </p>

          </div>

        </div>


        <ChevronRight
          className="
            h-5
            w-5
            shrink-0
            text-slate-500
            transition
            group-hover:text-white
          "
        />

      </div>


      {/* =========================
          EIGHT SUMMARY FIELDS
      ========================= */}
      <div
        className="
          mt-3
          grid
          grid-cols-2
          gap-2
          sm:grid-cols-4
        "
      >

        {/* Liquidity */}
        <MetricCard
          icon={Wallet}
          label="Liquidity"
          value={formatCurrency(liquidity)}
          iconClass="text-cyan-300"
          valueClass="text-cyan-400"
        />


        {/* EARN */}
        <MetricCard
          icon={TrendingUp}
          label="$ EARN"
          value={formatCurrency(grossEarn)}
          iconClass="text-emerald-300"
          valueClass="text-emerald-400"
        />


        {/* FULE */}
        <MetricCard
          icon={BarChart3}
          label="FULE"
          value={formatCurrency(fule)}
          iconClass="text-violet-300"
          valueClass="text-violet-400"
        />


        {/* Withdrawn */}
        <MetricCard
          icon={ArrowDownToLine}
          label="$ Withdrawn"
          value={formatCurrency(totalEarnWithdrawn)}
          iconClass="text-rose-300"
          valueClass="text-rose-400"
        />


        {/* PI FULE */}
        <MetricCard
          icon={PiggyBank}
          label="PI FULE"
          value={formatCurrency(piFule)}
          iconClass="text-amber-300"
          valueClass="text-amber-400"
        />


        {/* Balance */}
        <MetricCard
          icon={TrendingUp}
          label="$ BLANCE"
          value={formatCurrency(availableEarn)}
          iconClass="text-orange-300"
          valueClass="text-orange-400"
        />


        {/* APR $ */}
        <MetricCard
          icon={Percent}
          label="APR $"
          value={formatCurrency(apr)}
          iconClass="text-blue-300"
          valueClass="text-blue-400"
        />


        {/* PI $ */}
        <MetricCard
          icon={DollarSign}
          label="PI $"
          value={formatCurrency(pi)}
          iconClass="text-fuchsia-300"
          valueClass="text-fuchsia-400"
        />

      </div>

    </button>
  );
}


export default VortaxaInvestorCard;

