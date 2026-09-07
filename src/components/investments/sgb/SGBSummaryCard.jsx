
import {
  Coins,
  IndianRupee,
  TrendingUp,
  Percent,
  Gem,
} from "lucide-react";


// ==========================================
// FORMAT CURRENCY
// ==========================================

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};


// ==========================================
// FORMAT UNITS
// ==========================================

const formatUnits = (value) => {
  return Number(value || 0).toFixed(2);
};


// ==========================================
// STAT COMPONENT
// ==========================================

const Stat = ({
  icon: Icon,
  label,
  value,
  valueClass = "text-gray-200",
}) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

      <div className="mb-1 flex items-center gap-2">

        <Icon
          size={14}
          className="text-gray-500"
        />

        <p className="text-[11px] text-gray-500">
          {label}
        </p>

      </div>

      <p
        className={`text-sm font-semibold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
};


// ==========================================
// SGB SUMMARY CARD
// ==========================================

const SGBSummaryCard = ({
  summary,
}) => {

  // ========================================
  // GAIN STATUS
  // ========================================

  const isGain =
    Number(summary?.gain || 0) >= 0;


  // ========================================
  // CURRENT VALUE WITH INTEREST
  // ========================================

  const currentValueWithInterest =
    Number(summary?.currentValue || 0) +
    Number(summary?.interest || 0);


  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">


      {/* =====================================
          HEADER
      ====================================== */}

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

          {summary?.seriesCount || 0} Series

        </div>

      </div>


      {/* =====================================
          PURCHASE + CURRENT VALUE
      ====================================== */}

      <div className="grid grid-cols-2 gap-3">


        {/* ===================================
            PURCHASE VALUE
        ==================================== */}

        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-3">

          <p className="mb-1 text-[11px] text-gray-500">
            Purchase Value
          </p>

          <p className="text-lg font-bold text-gray-200">

            {formatCurrency(
              summary?.purchaseValue
            )}

          </p>

        </div>


        {/* ===================================
            CURRENT VALUE WITH INTEREST
        ==================================== */}

        <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-3">

          <p className="mb-1 text-[11px] text-gray-500">
            Current Value with Interest
          </p>

          <p className="text-lg font-bold text-yellow-400">

            {formatCurrency(
              currentValueWithInterest
            )}

          </p>

        </div>

      </div>


      {/* =====================================
          TOTAL GAIN
      ====================================== */}

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

              {formatCurrency(
                summary?.gain
              )}

            </p>

          </div>


          {/* TOTAL GAIN PERCENTAGE */}

          <div
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              isGain
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >

            {isGain ? "+" : ""}

            {Number(
              summary?.totalGainPercent || 0
            ).toFixed(2)}

            %

          </div>

        </div>

      </div>


      {/* =====================================
          STATS
      ====================================== */}

      <div className="mt-3 grid grid-cols-2 gap-2">


        {/* GRAM / UNITS */}

        <Stat
          icon={Coins}
          label="Gram / Units"
          value={`${formatUnits(
            summary?.units
          )} g`}
        />


        {/* PURCHASE RATE */}

        <Stat
          icon={IndianRupee}
          label="Purchase Rate"
          value={formatCurrency(
            summary?.purchaseRate
          )}
        />


        {/* CURRENT RATE */}

        <Stat
          icon={IndianRupee}
          label="Current Rate"
          value={formatCurrency(
            summary?.currentRate
          )}
          valueClass="text-yellow-400"
        />


        {/* INTEREST */}

        <Stat
          icon={IndianRupee}
          label="Interest Received"
          value={formatCurrency(
            summary?.interest
          )}
          valueClass="text-blue-300"
        />


        {/* PROFIT */}

        <Stat
          icon={TrendingUp}
          label="Profit"
          value={formatCurrency(
            summary?.profit
          )}
          valueClass={
            Number(
              summary?.profit || 0
            ) >= 0
              ? "text-emerald-400"
              : "text-red-400"
          }
        />


        {/* TOTAL GAIN % */}

        <Stat
          icon={Percent}
          label="Total Gain %"
          value={`${Number(
            summary?.totalGainPercent || 0
          ).toFixed(2)}%`}
          valueClass={
            isGain
              ? "text-emerald-400"
              : "text-red-400"
          }
        />

      </div>

    </div>
  );
};


export default SGBSummaryCard;


