import {
  Coins,
  IndianRupee,
  TrendingUp,
  Percent,
  Gem,
} from "lucide-react";

const formatCurrency = (value) => {
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const formatUnits = (value) => {
  return Number(value).toFixed(2);
};

const Stat = ({
  icon: Icon,
  label,
  value,
  valueClass = "text-gray-200",
}) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">
      <div className="mb-1 flex items-center gap-2">
        <Icon size={14} className="text-gray-500" />

        <p className="text-[11px] text-gray-500">
          {label}
        </p>
      </div>

      <p className={`text-sm font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
};

const SGBSummaryCard = ({ summary }) => {
  const isGain = summary.gain >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">

      {/* Header */}
      <div className="relative mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
            <Gem size={21} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-200">
              SGB Portfolio
            </h2>

            <p className="text-xs text-gray-500">
              Investment Summary
            </p>
          </div>
        </div>

        <div className="rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs font-medium text-gray-400">
          {summary.seriesCount} Series
        </div>
      </div>

      {/* Purchase + Current Value */}
      <div className="grid grid-cols-2 gap-3">

        {/* Purchase Value */}
        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">
          <p className="mb-1 text-[11px] text-gray-500">
            Purchase Value
          </p>

          <p className="text-lg font-bold text-gray-200">
            {formatCurrency(summary.purchaseValue)}
          </p>
        </div>

        {/* Current Value */}
        <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-3">
          <p className="mb-1 text-[11px] text-gray-500">
            Current Value
          </p>

          <p className="text-lg font-bold text-yellow-400">
            {formatCurrency(summary.currentValue)}
          </p>
        </div>
      </div>

      {/* Total Gain */}
      <div
        className={`mt-3 rounded-xl border p-3 ${
          isGain
            ? "border-emerald-500/15 bg-emerald-500/5"
            : "border-red-500/15 bg-red-500/5"
        }`}
      >
        <div className="flex items-center justify-between gap-3">

          <div>
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp
                size={15}
                className={
                  isGain
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              />

              <span className="text-xs text-gray-500">
                Total Gain
              </span>
            </div>

            <p
              className={`text-2xl font-bold ${
                isGain
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {isGain ? "+" : ""}
              {formatCurrency(summary.gain)}
            </p>
          </div>

          {/* Total Gain Percentage ONLY */}
          <div
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              isGain
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isGain ? "+" : ""}
            {summary.totalGainPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-2">

        <Stat
          icon={Coins}
          label="Gram / Units"
          value={`${formatUnits(summary.units)} g`}
        />

        <Stat
          icon={IndianRupee}
          label="Purchase Rate"
          value={formatCurrency(summary.purchaseRate)}
        />

        <Stat
          icon={IndianRupee}
          label="Current Rate"
          value={formatCurrency(summary.currentRate)}
          valueClass="text-yellow-400"
        />

        <Stat
          icon={IndianRupee}
          label="Interest Received"
          value={formatCurrency(summary.interest)}
          valueClass="text-blue-300"
        />

        <Stat
          icon={TrendingUp}
          label="Profit"
          value={formatCurrency(summary.profit)}
          valueClass="text-emerald-400"
        />

        <Stat
          icon={Percent}
          label="Total Gain %"
          value={`${summary.totalGainPercent.toFixed(2)}%`}
          valueClass="text-emerald-400"
        />

      </div>
    </div>
  );
};

export default SGBSummaryCard;