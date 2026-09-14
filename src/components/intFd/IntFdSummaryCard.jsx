
import {
  IndianRupee,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  calculateFdSummary,
} from "../../utils/intFd/intFdCalculations";

import {
  formatCurrency,
  formatPercentage,
} from "../../utils/intFd/intFdFormatters";

function SummaryItem({
  icon: Icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-700/70
        bg-slate-900/80
        px-3
        py-3
      "
    >
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
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${iconClass}
          `}
        >
          <Icon size={14} />
        </div>

        <span
          className="
            truncate
            text-[11px]
            font-medium
            tracking-wide
            text-slate-400
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-2
          truncate
          text-base
          font-bold
          text-white
        "
      >
        {value}
      </p>
    </div>
  );
}

export default function IntFdSummaryCard({
  fds = [],
}) {
  const summary =
    calculateFdSummary(fds);

  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-700
        bg-slate-950
        shadow-xl
      "
    >
      {/* Header */}
      <div
        className="
          border-b
          border-slate-800
          px-4
          py-3.5
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
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-cyan-400
              "
            >
              INT-FD
            </p>

            <h2
              className="
                mt-0.5
                text-lg
                font-bold
                tracking-tight
                text-white
              "
            >
              Fixed Deposit Summary
            </h2>
          </div>

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-500/20
              bg-cyan-500/10
              text-cyan-400
            "
          >
            <Wallet size={18} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div
        className="
          grid
          grid-cols-2
          gap-2.5
          p-3
        "
      >
        <SummaryItem
          icon={IndianRupee}
          label="Total Principal"
          value={formatCurrency(
            summary.totalPrincipal
          )}
          iconClass="
            bg-blue-500/10
            text-blue-400
          "
        />

        <SummaryItem
          icon={TrendingUp}
          label="Total Interest"
          value={formatCurrency(
            summary.totalInterest
          )}
          iconClass="
            bg-emerald-500/10
            text-emerald-400
          "
        />

        <SummaryItem
          icon={TrendingUp}
          label="Till Month"
          value={formatCurrency(
            summary.totalTillMonthInterest
          )}
          iconClass="
            bg-amber-500/10
            text-amber-400
          "
        />

        <SummaryItem
          icon={TrendingUp}
          label="Profit"
          value={formatPercentage(
            summary.profitPercentage
          )}
          iconClass="
            bg-violet-500/10
            text-violet-400
          "
        />
      </div>
    </section>
  );
}

