import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

function FundPreview({
  fund,
  purchaseDate,
  nav,
  actualNavDate,
  isPreviousDate,
}) {
  if (!fund) {
    return null;
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-purple-500/20
        bg-slate-800
        shadow-sm
      "
    >
      {/* TOP */}
      <div
        className="
          border-b
          border-slate-700
          bg-purple-500/10
          p-4
        "
      >
        <div className="flex items-start gap-3">

          {/* ICON */}
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-purple-500/15
              text-purple-300
            "
          >
            <IndianRupee
              size={20}
              strokeWidth={2.2}
            />
          </div>

          {/* FUND NAME */}
          <div className="min-w-0 flex-1">

            <p
              className="
                mb-1
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-purple-400
              "
            >
              Selected Fund
            </p>

            <h3
              className="
                text-sm
                font-extrabold
                leading-5
                text-white
              "
            >
              {fund.name}
            </h3>

            {fund.schemeCode && (
              <p
                className="
                  mt-1
                  text-[11px]
                  font-medium
                  text-slate-400
                "
              >
                Scheme Code: {fund.schemeCode}
              </p>
            )}

          </div>

          {/* STATUS */}
          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
              rounded-full
              border
              border-emerald-500/20
              bg-emerald-500/10
              px-2
              py-1
              text-[10px]
              font-bold
              text-emerald-400
            "
          >
            <CheckCircle2 size={12} />
            Found
          </div>

        </div>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-3 p-4">

        {/* PURCHASE DATE */}
        <div
          className="
            rounded-xl
            border
            border-slate-700
            bg-slate-900/70
            p-3
          "
        >
          <div
            className="
              mb-1.5
              flex
              items-center
              gap-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            <CalendarDays size={12} />
            Date
          </div>

          <p
            className="
              text-xs
              font-bold
              text-slate-200
            "
          >
            {purchaseDate || "—"}
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
          <div
            className="
              mb-1.5
              flex
              items-center
              gap-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            <IndianRupee size={12} />
            NAV
          </div>

          <p
            className="
              text-sm
              font-extrabold
              text-white
            "
          >
            {nav !== null
              ? `₹${Number(nav).toFixed(4)}`
              : "Fetching..."}
          </p>
        </div>

      </div>

      {/* HISTORICAL NAV MESSAGE */}
      {actualNavDate && (
        <div
          className="
            mx-4
            mb-4
            flex
            items-start
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-900/60
            px-3
            py-2.5
          "
        >
          {isPreviousDate ? (
            <Clock3
              size={14}
              className="
                mt-0.5
                shrink-0
                text-amber-400
              "
            />
          ) : (
            <CheckCircle2
              size={14}
              className="
                mt-0.5
                shrink-0
                text-emerald-400
              "
            />
          )}

          <div className="min-w-0">

            <p
              className="
                text-[11px]
                font-semibold
                text-slate-300
              "
            >
              NAV date: {actualNavDate}
            </p>

            {isPreviousDate && (
              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-amber-400
                "
              >
                Previous available NAV used
              </p>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default FundPreview;