import {
  CalendarDays,
  Trash2,
} from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function MutualFundTransactionCard({
  transaction,
  onDelete,
}) {
  const isBuy = transaction.type === "BUY";

  const handleDelete = (event) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    if (onDelete) {
      onDelete(transaction.id);
    }
  };

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-700/80
        bg-slate-900
        px-3
        py-2.5
        shadow-sm
      "
    >

      {/* TOP ROW */}
      <div className="flex items-center justify-between gap-2">

        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-2">

          {/* TYPE */}
          <span
            className={`
              rounded-md
              px-1.5
              py-0.5
              text-[9px]
              font-extrabold
              uppercase
              tracking-wide
              ${
                isBuy
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-red-400/10 text-red-300"
              }
            `}
          >
            {isBuy ? "Purchase" : "Sell"}
          </span>

          {/* DATE */}
          <div className="flex items-center gap-1.5">

            <CalendarDays
              size={12}
              className="shrink-0 text-slate-400"
            />

            <span
              className="
                text-[11px]
                font-semibold
                text-slate-200
              "
            >
              {formatDate(transaction.date)}
            </span>

          </div>

        </div>

        {/* DELETE */}
        <button
          type="button"
          onClick={handleDelete}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-red-500/10
            hover:text-red-400
            active:scale-95
          "
          aria-label="Delete transaction"
        >
          <Trash2 size={14} />
        </button>

      </div>

      {/* DETAILS */}
      <div
        className="
          mt-2
          grid
          grid-cols-3
          gap-2
          border-t
          border-white/10
          pt-2
        "
      >

        {/* UNITS */}
        <div>

          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-400
            "
          >
            Units
          </p>

          <p
            className="
              mt-0.5
              text-xs
              font-bold
              text-slate-100
            "
          >
            {Number(
              transaction.units || 0
            ).toFixed(2)}
          </p>

        </div>

        {/* NAV */}
        <div>

          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-400
            "
          >
            NAV
          </p>

          <p
            className="
              mt-0.5
              text-xs
              font-bold
              text-slate-100
            "
          >
            ₹
            {Number(
              transaction.nav || 0
            ).toFixed(4)}
          </p>

        </div>

        {/* AMOUNT */}
        <div className="text-right">

          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-400
            "
          >
            Amount
          </p>

          <p
            className="
              mt-0.5
              text-xs
              font-bold
              text-white
            "
          >
            {formatCurrency(
              transaction.amount
            )}
          </p>

        </div>

      </div>

    </div>
  );
}

export default MutualFundTransactionCard;