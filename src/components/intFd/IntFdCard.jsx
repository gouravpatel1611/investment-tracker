
import {
  CalendarDays,
  IndianRupee,
  Pencil,
  Percent,
  Trash2,
  TrendingUp,
} from "lucide-react";

import {
  calculateFdDetails,
} from "../../utils/intFd/intFdCalculations";

import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from "../../utils/intFd/intFdFormatters";

function DetailItem({
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
        border-slate-800
        bg-slate-900/70
        px-3
        py-2.5
      "
    >
      <div
        className="
          flex
          items-center
          gap-1.5
        "
      >
        <Icon
          size={14}
          className={iconClass}
        />

        <span
          className="
            text-[11px]
            font-medium
            text-white
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-1
          truncate
          text-sm
          font-semibold
          text-white
        "
      >
        {value}
      </p>
    </div>
  );
}

export default function IntFdCard({
  fd,
  onEdit,
  onDelete,
}) {
  const details =
    calculateFdDetails(fd);

  function handleDelete() {
    const confirmed =
      window.confirm(
        `Delete "${fd.fundName}" FD?`
      );

    if (confirmed) {
      onDelete(fd.id);
    }
  }

  return (
    <article
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-700/70
        bg-slate-950
        shadow-lg
        shadow-black/20
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
          border-b
          border-slate-800
          px-4
          py-3
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-cyan-400
            "
          >
            Fixed Deposit
          </p>

          <h3
            className="
              mt-0.5
              truncate
              text-lg
              font-bold
              text-white
            "
          >
            {fd.fundName ||
              "Unnamed FD"}
          </h3>
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
          "
        >
          <button
            type="button"
            onClick={() => onEdit(fd)}
            aria-label="Edit FD"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
              border
              border-blue-500/20
              bg-blue-500/10
              text-blue-400
              transition
              hover:bg-blue-500/20
              hover:text-blue-300
              active:scale-95
            "
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete FD"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              text-red-400
              transition
              hover:bg-red-500/20
              hover:text-red-300
              active:scale-95
            "
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Principal */}
      <div
        className="
          px-4
          pb-2.5
          pt-3
        "
      >
        <p
          className="
            text-[11px]
            font-medium
            text-white
          "
        >
          Principal
        </p>

        <p
          className="
            mt-0.5
            text-xl
            font-bold
            tracking-tight
            text-white
          "
        >
          {formatCurrency(
            fd.principal
          )}
        </p>
      </div>

      {/* Key Stats */}
      <div
        className="
          grid
          grid-cols-2
          gap-2.5
          px-4
          pb-3
        "
      >
        <DetailItem
          icon={Percent}
          label="Interest Rate"
          value={formatPercentage(
            fd.interestRate
          )}
          iconClass="
            text-violet-400
          "
        />

        <DetailItem
          icon={TrendingUp}
          label="Total Interest"
          value={formatCurrency(
            details.totalInterest
          )}
          iconClass="
            text-emerald-400
          "
        />

        <DetailItem
          icon={IndianRupee}
          label="Till Month Interest"
          value={formatCurrency(
            details.tillMonthInterest
          )}
          iconClass="
            text-amber-400
          "
        />

        <DetailItem
          icon={CalendarDays}
          label="Duration"
          value={`${details.durationMonths} ${
            details.durationMonths === 1
              ? "Month"
              : "Months"
          }`}
          iconClass="
            text-cyan-400
          "
        />
      </div>

      {/* Compact Dates */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-slate-800
          bg-slate-900/40
          px-4
          py-2.5
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-wider
              text-white
            "
          >
            Opening
          </p>

          <p
            className="
              truncate
              text-xs
              font-semibold
              text-white
            "
          >
            {formatDate(
              fd.openingDate
            )}
          </p>
        </div>

        <div
          className="
            h-px
            flex-1
            bg-gradient-to-r
            from-cyan-500/40
            via-slate-700
            to-violet-500/40
          "
        />

        <div className="min-w-0 text-right">
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-wider
              text-white
            "
          >
            Closing
          </p>

          <p
            className="
              truncate
              text-xs
              font-semibold
              text-white
            "
          >
            {formatDate(
              fd.closingDate
            )}
          </p>
        </div>
      </div>
    </article>
  );
}
