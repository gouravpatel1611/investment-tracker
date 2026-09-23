import {
  CalendarDays,
  Filter,
} from "lucide-react";


function VortaxaTransactionFilters({
  year = "all",
  month = "all",
  type = "all",
  years = [],
  onYearChange,
  onMonthChange,
  onTypeChange,
}) {
  return (
    <div
      className="
        mb-4
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-4
      "
    >

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-2
          sm:grid-cols-3
        "
      >

        {/* ===================================================
            YEAR
        =================================================== */}

        <div className="relative">

          <CalendarDays
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-3.5
              w-3.5
              -translate-y-1/2
              text-slate-500
            "
          />

          <select
            value={year}
            onChange={(e) =>
              onYearChange(e.target.value)
            }
            className="
              h-9
              w-full
              appearance-none
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              pl-9
              pr-2
              text-[11px]
              font-semibold
              text-slate-300
              outline-none
              focus:border-orange-500/60
            "
          >
            <option value="all">
              All Years
            </option>

            {years.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>


        {/* ===================================================
            MONTH
        =================================================== */}

        <div className="relative">

          <CalendarDays
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-3.5
              w-3.5
              -translate-y-1/2
              text-slate-500
            "
          />

          <select
            value={month}
            onChange={(e) =>
              onMonthChange(e.target.value)
            }
            className="
              h-9
              w-full
              appearance-none
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              pl-9
              pr-2
              text-[11px]
              font-semibold
              text-slate-300
              outline-none
              focus:border-orange-500/60
            "
          >
            <option value="all">
              All Months
            </option>

            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>

        </div>


        {/* ===================================================
            TRANSACTION TYPE
        =================================================== */}

        <div
          className="
            relative
            col-span-2
            sm:col-span-1
          "
        >

          <Filter
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-3.5
              w-3.5
              -translate-y-1/2
              text-slate-500
            "
          />

          <select
            value={type}
            onChange={(e) =>
              onTypeChange(e.target.value)
            }
            className="
              h-9
              w-full
              appearance-none
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              pl-9
              pr-2
              text-[11px]
              font-semibold
              text-slate-300
              outline-none
              focus:border-orange-500/60
            "
          >

            <option value="all">
              All Categories
            </option>

            <option value="FULE_ADD">
              FULE Added
            </option>

            <option value="PI_FULE_ADD">
              PI FULE Added
            </option>

            <option value="EARN_WITHDRAW">
              Withdrawal
            </option>

            <option value="INITIAL">
              Initial Investment
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}


export default VortaxaTransactionFilters;