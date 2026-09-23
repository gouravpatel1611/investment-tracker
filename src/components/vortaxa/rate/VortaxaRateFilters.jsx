
import {
  CalendarDays,
} from "lucide-react";


function VortaxaRateFilters({
  year = "all",
  month = "all",
  years = [],
  onYearChange,
  onMonthChange,
}) {
  return (
    <div
      className="
        mb-4
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-3
      "
    >
      <div
        className="
          mb-2.5
          flex
          items-center
          gap-2
        "
      >
        <CalendarDays
          className="
            h-4
            w-4
            text-orange-300
          "
        />

        <p
          className="
            text-xs
            font-bold
            text-slate-300
          "
        >
          Filter Daily Rates
        </p>
      </div>


      <div
        className="
          grid
          grid-cols-2
          gap-2
        "
      >
        {/* =================================================
            YEAR
        ================================================== */}

        <div>
          <label
            className="
              mb-1
              block
              text-[10px]
              font-semibold
              text-slate-500
            "
          >
            Year
          </label>

          <select
            value={year}
            onChange={(event) =>
              onYearChange?.(
                event.target.value
              )
            }
            className="
              h-10
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              px-3
              text-xs
              font-semibold
              text-white
              outline-none
              focus:border-orange-500/60
            "
          >
            <option value="all">
              All Years
            </option>

            {years.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>
        </div>


        {/* =================================================
            MONTH
        ================================================== */}

        <div>
          <label
            className="
              mb-1
              block
              text-[10px]
              font-semibold
              text-slate-500
            "
          >
            Month
          </label>

          <select
            value={month}
            onChange={(event) =>
              onMonthChange?.(
                event.target.value
              )
            }
            className="
              h-10
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              px-3
              text-xs
              font-semibold
              text-white
              outline-none
              focus:border-orange-500/60
            "
          >
            <option value="all">
              All Months
            </option>

            <option value="01">
              January
            </option>

            <option value="02">
              February
            </option>

            <option value="03">
              March
            </option>

            <option value="04">
              April
            </option>

            <option value="05">
              May
            </option>

            <option value="06">
              June
            </option>

            <option value="07">
              July
            </option>

            <option value="08">
              August
            </option>

            <option value="09">
              September
            </option>

            <option value="10">
              October
            </option>

            <option value="11">
              November
            </option>

            <option value="12">
              December
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}


export default VortaxaRateFilters;

