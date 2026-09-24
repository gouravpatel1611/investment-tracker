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
  Trash2,
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
  onDelete,
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
    apr = 0,
    pi = 0,
  } = summary;


  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (event) => {

    /*
     * Delete button par click karne par
     * card ka onClick trigger nahi hoga.
     */
    event.stopPropagation();

    if (!onDelete) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${investorName}?\n\nThis will permanently delete this investor and all associated transactions.`
      );

    if (!confirmed) {
      return;
    }

    onDelete(investor);
  };


  return (
    <div
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

        {/* =========================
            INVESTOR CLICK AREA
        ========================= */}

        <button
          type="button"
          onClick={onClick}
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-2.5
            text-left
          "
        >

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

        </button>


        {/* =========================
            ACTIONS
        ========================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1
          "
        >

          {/* DELETE */}

          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-red-500/10
                hover:text-red-400
              "
              title="Delete investor"
            >
              <Trash2
                className="h-4 w-4"
              />
            </button>
          )}


          {/* OPEN */}

          <button
            type="button"
            onClick={onClick}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-slate-700
              hover:text-white
            "
            title="Open investor"
          >
            <ChevronRight
              className="
                h-5
                w-5
              "
            />
          </button>

        </div>

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

    </div>
  );
}


export default VortaxaInvestorCard;