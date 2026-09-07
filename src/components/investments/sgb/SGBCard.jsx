import {
  CalendarDays,
  Coins,
  IndianRupee,
  TrendingUp,
  Wallet,
  Percent,
  Trash2,
} from "lucide-react";

// ==========================================================
// FORMATTERS
// ==========================================================

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatUnits = (value) => {
  return Number(value || 0).toFixed(2);
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// ==========================================================
// SGB CARD
// ==========================================================

const SGBCard = ({
  sgb,
  onDelete,
}) => {
  const isGain =
    Number(sgb.gain || 0) >= 0;

  // ========================================================
  // CURRENT VALUE WITH INTEREST
  // ========================================================

  const currentValueWithInterest =
    Number(sgb.currentValue || 0) +
    Number(sgb.interest || 0);

  return (
    <div className="group rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-yellow-500/20">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-start justify-between gap-3">

        {/* SERIES */}

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
            <Coins size={19} />
          </div>

          <div className="min-w-0">

            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Series No.
            </p>

            <h3 className="truncate text-sm font-semibold text-gray-200">
              {sgb.seriesNo}
            </h3>

          </div>

        </div>

        {/* DELETE BUTTON */}

        <button
          type="button"
          onClick={() =>
            onDelete?.(sgb)
          }
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
          title="Delete SGB"
        >
          <Trash2 size={15} />
        </button>

      </div>

      {/* ================================================== */}
      {/* CURRENT VALUE WITH INTEREST */}
      {/* ================================================== */}

      <div className="mt-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-3">

        <p className="text-[11px] text-gray-500">
          Current Value with Interest
        </p>

        <div className="mt-1 flex items-end justify-between gap-2">

          <p className="text-2xl font-bold text-yellow-400">
            {formatCurrency(
              currentValueWithInterest
            )}
          </p>

          {/* GAIN % */}

          <div
            className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${
              isGain
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            <Percent size={13} />

            {isGain ? "+" : ""}
            {Number(
              sgb.totalGainPercent || 0
            ).toFixed(2)}
            %
          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* PURCHASE VALUE + PROFIT */}
      {/* ================================================== */}

      <div className="mt-3 grid grid-cols-2 gap-2">

        {/* PURCHASE VALUE */}

        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <div className="flex items-center gap-2">

            <Wallet
              size={14}
              className="text-gray-500"
            />

            <p className="text-[11px] text-gray-500">
              Purchase Value
            </p>

          </div>

          <p className="mt-1 text-sm font-semibold text-gray-200">
            {formatCurrency(
              sgb.purchaseValue
            )}
          </p>

        </div>

        {/* PROFIT */}

        <div
          className={`rounded-xl border p-3 ${
            sgb.profit >= 0
              ? "border-emerald-500/10 bg-emerald-500/5"
              : "border-red-500/10 bg-red-500/5"
          }`}
        >

          <p className="text-[11px] text-gray-500">
            Profit
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              sgb.profit >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {sgb.profit >= 0
              ? "+"
              : ""}
            {formatCurrency(
              sgb.profit
            )}
          </p>

        </div>

      </div>

      {/* ================================================== */}
      {/* UNITS + CURRENT RATE */}
      {/* ================================================== */}

      <div className="mt-2 grid grid-cols-2 gap-2">

        {/* UNITS */}

        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <div className="flex items-center gap-2">

            <Coins
              size={14}
              className="text-gray-500"
            />

            <p className="text-[11px] text-gray-500">
              Units
            </p>

          </div>

          <p className="mt-1 text-sm font-semibold text-gray-200">
            {formatUnits(
              sgb.units
            )}{" "}
            g
          </p>

        </div>

        {/* CURRENT RATE */}

        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <div className="flex items-center gap-2">

            <IndianRupee
              size={14}
              className="text-gray-500"
            />

            <p className="text-[11px] text-gray-500">
              Current Rate
            </p>

          </div>

          <p className="mt-1 text-sm font-semibold text-yellow-400">
            {formatCurrency(
              sgb.currentRate
            )}
          </p>

        </div>

      </div>

      {/* ================================================== */}
      {/* INTEREST + TOTAL GAIN */}
      {/* ================================================== */}

      <div className="mt-2 grid grid-cols-2 gap-2">

        {/* INTEREST */}

        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <p className="text-[11px] text-gray-500">
            Interest Received
          </p>

          <p className="mt-1 text-sm font-semibold text-blue-300">
            {formatCurrency(
              sgb.interest
            )}
          </p>

        </div>

        {/* TOTAL GAIN */}

        <div
          className={`rounded-xl border p-3 ${
            isGain
              ? "border-emerald-500/10 bg-emerald-500/5"
              : "border-red-500/10 bg-red-500/5"
          }`}
        >

          <p className="text-[11px] text-gray-500">
            Total Gain
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              isGain
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {isGain ? "+" : ""}
            {formatCurrency(
              sgb.gain
            )}
          </p>

        </div>

      </div>

      {/* ================================================== */}
      {/* DATES */}
      {/* ================================================== */}

      <div className="mt-2 grid grid-cols-2 gap-2">

        {/* ISSUE DATE */}

        <div className="flex items-center gap-2 rounded-xl bg-gray-950/60 px-3 py-2.5">

          <CalendarDays
            size={14}
            className="shrink-0 text-gray-500"
          />

          <div>

            <p className="text-[10px] text-gray-500">
              Issue Date
            </p>

            <p className="text-xs font-medium text-gray-400">
              {formatDate(
                sgb.issueDate
              )}
            </p>

          </div>

        </div>

        {/* MATURITY DATE */}

        <div className="flex items-center gap-2 rounded-xl bg-gray-950/60 px-3 py-2.5">

          <CalendarDays
            size={14}
            className="shrink-0 text-gray-500"
          />

          <div>

            <p className="text-[10px] text-gray-500">
              Maturity Date
            </p>

            <p className="text-xs font-medium text-gray-400">
              {formatDate(
                sgb.maturityDate
              )}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SGBCard;