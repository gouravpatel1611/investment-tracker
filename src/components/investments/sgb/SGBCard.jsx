import {
  CalendarDays,
  Coins,
  IndianRupee,
  TrendingUp,
  Wallet,
  Percent,
} from "lucide-react";

const formatCurrency = (value) => {
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const formatUnits = (value) => {
  return Number(value).toFixed(2);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SGBCard = ({ sgb }) => {
  const isGain = sgb.gain >= 0;

  return (
    <div className="group rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-all duration-200 hover:border-yellow-500/20">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">

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

        {/* Total Gain % */}
        <div
          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            isGain
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          <Percent size={11} />

          {isGain ? "+" : ""}
          {sgb.totalGainPercent.toFixed(2)}%
        </div>

      </div>

      {/* Current Value */}
      <div className="mt-4 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-3">

        <p className="text-[11px] text-gray-500">
          Current Value
        </p>

        <div className="mt-1 flex items-end justify-between gap-2">

          <p className="text-2xl font-bold text-yellow-400">
            {formatCurrency(sgb.currentValue)}
          </p>

          {/* Total Gain */}
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              isGain
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            <TrendingUp size={13} />

            {isGain ? "+" : ""}
            {formatCurrency(sgb.gain)}
          </div>

        </div>
      </div>

      {/* Purchase Value + Profit */}
      <div className="mt-3 grid grid-cols-2 gap-2">

        {/* Purchase Value */}
        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <div className="flex items-center gap-2">
            <Wallet size={14} className="text-gray-500" />

            <p className="text-[11px] text-gray-500">
              Purchase Value
            </p>
          </div>

          <p className="mt-1 text-sm font-semibold text-gray-200">
            {formatCurrency(sgb.purchaseValue)}
          </p>

        </div>

        {/* Profit */}
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
            {sgb.profit >= 0 ? "+" : ""}
            {formatCurrency(sgb.profit)}
          </p>

        </div>
      </div>

      {/* Units + Purchase Rate */}
      <div className="mt-2 grid grid-cols-2 gap-2">

        {/* Units */}
        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <div className="flex items-center gap-2">
            <Coins size={14} className="text-gray-500" />

            <p className="text-[11px] text-gray-500">
              Units
            </p>
          </div>

          <p className="mt-1 text-sm font-semibold text-gray-200">
            {formatUnits(sgb.units)} g
          </p>

        </div>

        {/* Purchase Rate */}
        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <div className="flex items-center gap-2">
            <IndianRupee size={14} className="text-gray-500" />

            <p className="text-[11px] text-gray-500">
              Purchase Rate
            </p>
          </div>

          <p className="mt-1 text-sm font-semibold text-gray-200">
            {formatCurrency(sgb.purchaseRate)}
          </p>

        </div>
      </div>

      {/* Interest + Total Gain */}
      <div className="mt-2 grid grid-cols-2 gap-2">

        {/* Interest */}
        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <p className="text-[11px] text-gray-500">
            Interest Received
          </p>

          <p className="mt-1 text-sm font-semibold text-blue-300">
            {formatCurrency(sgb.interest)}
          </p>

        </div>

        {/* Total Gain */}
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
            {formatCurrency(sgb.gain)}
          </p>

        </div>
      </div>

      {/* Dates */}
      <div className="mt-2 grid grid-cols-2 gap-2">

        {/* Purchase Date */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-950/60 px-3 py-2.5">

          <CalendarDays
            size={14}
            className="shrink-0 text-gray-500"
          />

          <div>
            <p className="text-[10px] text-gray-500">
              Purchase Date
            </p>

            <p className="text-xs font-medium text-gray-400">
              {formatDate(sgb.purchaseDate)}
            </p>
          </div>

        </div>

        {/* Maturity Date */}
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
              {formatDate(sgb.maturityDate)}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SGBCard;