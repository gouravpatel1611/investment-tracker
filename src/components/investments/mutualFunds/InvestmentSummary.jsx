import {
  Calculator,
  IndianRupee,
} from "lucide-react";

function InvestmentSummary({
  units,
  nav,
}) {
  const numericUnits = Number(units) || 0;
  const numericNav = Number(nav) || 0;

  const amount =
    numericUnits * numericNav;

    
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        shadow-sm
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-slate-700
          p-4
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
            bg-emerald-500/15
            text-emerald-300
          "
        >
          <Calculator
            size={17}
          />
        </div>

        <div>
          <p
            className="
              text-sm
              font-extrabold
              text-white
            "
          >
            Investment summary
          </p>

          <p
            className="
              mt-0.5
              text-[11px]
              text-slate-400
            "
          >
            Estimated purchase value
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div
        className="
          grid
          grid-cols-2
          gap-3
          p-4
        "
      >

        {/* UNITS */}
        <div
          className="
            rounded-xl
            border
            border-slate-700
            bg-slate-900/70
            p-3
          "
        >
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            Units
          </p>

          <p
            className="
              mt-1
              text-sm
              font-extrabold
              text-slate-100
            "
          >
            {numericUnits
              ? numericUnits.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 4,
                  }
                )
              : "0"}
          </p>
        </div>

        {/* NAV */}
        <div
          className="
            rounded-xl
            border
            border-slate-700
            bg-slate-900/70
            p-3
          "
        >
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            NAV
          </p>

          <p
            className="
              mt-1
              text-sm
              font-extrabold
              text-slate-100
            "
          >
            ₹
            {numericNav
              ? numericNav.toFixed(4)
              : "0.0000"}
          </p>
        </div>

      </div>

      {/* TOTAL */}
      <div
        className="
          mx-4
          mb-4
          rounded-xl
          border
          border-emerald-500/20
          bg-emerald-500/10
          p-4
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
                font-bold
                uppercase
                tracking-wide
                text-emerald-400
              "
            >
              Investment amount
            </p>

            <p
              className="
                mt-1
                text-xl
                font-black
                tracking-tight
                text-white
              "
            >
              ₹
              {amount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          </div>

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-emerald-500/15
              text-emerald-300
            "
          >
            <IndianRupee
              size={19}
            />
          </div>

        </div>
      </div>

    </div>
  );
}

export default InvestmentSummary;