
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
  return `₹${Math.round(
    Number(value || 0)
  ).toLocaleString("en-IN")}`;
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
  valueClass = "text-white",
}) => {
  return (
    <div
      className="
        rounded-xl
        border border-gray-800
        bg-gray-950/60
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
          size={13}
          className="text-white"
        />

        <p
          className="
            truncate
            text-[10px]
            font-medium
            uppercase
            tracking-wide
            text-white
          "
        >
          {label}
        </p>

      </div>


      <p
        className={`
          mt-1
          truncate
          text-sm
          font-bold
          ${valueClass}
        `}
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

  const isGain =
    Number(summary?.gain || 0) >= 0;


  // ========================================
  // CURRENT VALUE WITH INTEREST
  // ========================================

  const currentValueWithInterest =
    Number(summary?.currentValue || 0) +
    Number(summary?.interest || 0);


  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border border-gray-800
        bg-gray-900
        p-4
      "
    >

      {/* =====================================
          HEADER
      ====================================== */}

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
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
              bg-yellow-500/10
              text-yellow-400
            "
          >
            <Gem size={19} />
          </div>


          <div className="min-w-0">

            <h2
              className="
                truncate
                text-sm
                font-bold
                text-white
              "
            >
              SGB Portfolio
            </h2>

            <p
              className="
                text-[10px]
                text-white
              "
            >
              Investment Summary
            </p>

          </div>

        </div>


        <div
          className="
            shrink-0
            rounded-full
            border border-gray-800
            bg-gray-950
            px-2.5
            py-1
            text-[10px]
            font-semibold
            text-white
          "
        >
          {summary?.seriesCount || 0} Series
        </div>

      </div>


      {/* =====================================
          PRIMARY VALUES
      ====================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-2
        "
      >

        {/* UNIT */}

        <Stat
          icon={Coins}
          label="Unit"
          value={`${formatUnits(
            summary?.units
          )} g`}
        />


        {/* PURCHASE RATE */}

        <Stat
          icon={IndianRupee}
          label="Avg Price"
          value={formatCurrency(
            summary?.purchaseRate
          )}
        />


        {/* INVESTED */}

        <Stat
          icon={IndianRupee}
          label="Invested"
          value={formatCurrency(
            summary?.purchaseValue
          )}
        />


        {/* GAIN */}

                <Stat
          icon={TrendingUp}
          label="GAIN"
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
        



        {/* CURRENT VALUE */}

        <Stat
          icon={IndianRupee}
          label="Curr Value"
          value={formatCurrency(
            summary?.currentValue
          )}
          valueClass="text-yellow-400"
        />


        {/* INTEREST RECEIVED */}

        <Stat
          icon={IndianRupee}
          label="Int Received"
          value={formatCurrency(
            summary?.interest
          )}
          valueClass="text-emerald-400"
        />


        {/* GAIN % */}

        <Stat
          icon={Percent}
          label="Gain %"
          value={`${
            isGain ? "+" : ""
          }${Number(
            summary?.totalGainPercent || 0
          ).toFixed(2)}%`}
          valueClass={
            isGain
              ? "text-emerald-400"
              : "text-red-400"
          }
        />


        {/* TOTAL PROFIT */}




        <Stat
          icon={TrendingUp}
          label="TOTAL PROFIT"
          value={formatCurrency(
            summary?.gain
          )}
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

