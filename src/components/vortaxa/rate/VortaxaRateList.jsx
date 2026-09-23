import { useState } from "react";

import {
  Edit3,
  Percent,
  TrendingUp,
  DollarSign,
} from "lucide-react";

import {
  formatDate,
  formatCurrency,
} from "../../../utils/vortaxa/vortaxaFormatters";

import {
  calculateRateSummary,
} from "../../../utils/vortaxa/vortaxaCalculations";


function VortaxaRateList({
  rates = [],
  investors = [],
  onEdit,
}) {

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(10);


  /*
   * ==========================================
   * SORT RATES
   * ==========================================
   */

  const sortedRates =
    [...rates].sort(
      (a, b) =>
        String(
          b?.date || ""
        ).localeCompare(
          String(
            a?.date || ""
          )
        )
    );


  const visibleRates =
    sortedRates.slice(
      0,
      visibleCount
    );


  const hasMore =
    visibleCount <
    sortedRates.length;


  const handleLoadMore =
    () => {

      setVisibleCount(
        (current) =>
          current + 10
      );

    };


  /*
   * ==========================================
   * EMPTY STATE
   * ==========================================
   */

  if (
    sortedRates.length === 0
  ) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-800
          p-6
          text-center
          font-[Calibri]
        "
        style={{
          fontFamily:
            "Calibri, Arial, sans-serif",
        }}
      >

        <Percent
          size={24}
          className="
            mx-auto
            text-slate-500
          "
        />

        <p
          className="
            mt-3
            text-sm
            font-bold
            text-white
          "
        >
          No daily rates found
        </p>

        <p
          className="
            mt-1
            text-xs
            text-slate-500
          "
        >
          Daily rate entries will appear
          automatically.
        </p>

      </div>

    );

  }


  return (

    <div
      className="
        space-y-3
        font-[Calibri]
      "
      style={{
        fontFamily:
          "Calibri, Arial, sans-serif",
      }}
    >

      {visibleRates.map(
        (rate) => {

          /*
           * =====================================
           * DAILY EARNING CALCULATION
           * =====================================
           *
           * Rate is GLOBAL.
           *
           * Therefore the calculation combines
           * ALL investors.
           *
           * The calculation utility handles:
           *
           * FULE effective date
           * +2 days
           *
           * PI FULE effective date
           * +2 days
           *
           * APR:
           * FULE × daily rate% × 70%
           *
           * PI:
           * PI FULE × daily rate% × 3%
           *
           * Total:
           * APR + PI
           * =====================================
           */

          const rateSummary =
            calculateRateSummary(
              rate?.date,
              rate?.rate,
              investors
            );


          const apr =
            Number(
              rateSummary?.apr || 0
            );


          const pi =
            Number(
              rateSummary?.pi || 0
            );


          const total =
            Number(
              rateSummary?.total ||
              apr + pi
            );


          return (

            <div
              key={rate.id}
              className="
                rounded-2xl
                border
                border-slate-700
                bg-slate-800
                p-3
                sm:p-4
              "
            >

              {/* =================================
                  TOP ROW
              ================================= */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                {/* Date */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-700
                      text-orange-400
                    "
                  >

                    <Percent
                      size={18}
                    />

                  </div>


                  <div
                    className="
                      min-w-0
                    "
                  >

                    <p
                      className="
                        truncate
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      {formatDate(
                        rate?.date
                      )}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-500
                      "
                    >
                      Daily Rate
                    </p>

                  </div>

                </div>


                {/* Rate + Edit */}

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      text-right
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-bold
                        text-orange-400
                      "
                    >

                      {Number(
                        rate?.rate || 0
                      ).toFixed(2)}

                      %

                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      onEdit?.(
                        rate
                      )
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-slate-600
                      bg-slate-700
                      text-slate-300
                      transition
                      hover:border-orange-500
                      hover:text-orange-400
                    "
                    title="Edit rate"
                  >

                    <Edit3
                      size={16}
                    />

                  </button>

                </div>

              </div>


              {/* =================================
                  DAY-WISE EARNING
              ================================= */}

              <div
                className="
                  mt-3
                  grid
                  grid-cols-3
                  gap-2
                "
              >

                {/* APR $ */}

                <div
                  className="
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/70
                    px-2.5
                    py-2
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    <TrendingUp
                      className="
                        h-3.5
                        w-3.5
                        text-blue-300
                      "
                    />

                    <p
                      className="
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      APR $
                    </p>

                  </div>


                  <p
                    className="
                      mt-1
                      truncate
                      text-center
                      text-sm
                      font-extrabold
                      text-white
                    "
                  >
                    {formatCurrency(
                      apr
                    )}
                  </p>

                </div>


                {/* PI $ */}

                <div
                  className="
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/70
                    px-2.5
                    py-2
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    <DollarSign
                      className="
                        h-3.5
                        w-3.5
                        text-fuchsia-300
                      "
                    />

                    <p
                      className="
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      PI $
                    </p>

                  </div>


                  <p
                    className="
                      mt-1
                      truncate
                      text-center
                      text-sm
                      font-extrabold
                      text-fuchsia-400
                    "
                  >
                    {formatCurrency(
                      pi
                    )}
                  </p>

                </div>


                {/* Total $ */}

                <div
                  className="
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/70
                    px-2.5
                    py-2
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    <DollarSign
                      className="
                        h-3.5
                        w-3.5
                        text-emerald-300
                      "
                    />

                    <p
                      className="
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      Total $
                    </p>

                  </div>


                  <p
                    className="
                      mt-1
                      truncate
                      text-center
                      text-sm
                      font-extrabold
                      text-emerald-400
                    "
                  >
                    {formatCurrency(
                      total
                    )}
                  </p>

                </div>

              </div>

            </div>

          );

        }
      )}


      {/* =====================================
          LOAD MORE
      ===================================== */}

      {hasMore && (

        <button
          type="button"
          onClick={
            handleLoadMore
          }
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            px-4
            py-3
            text-sm
            font-bold
            text-slate-300
            transition
            hover:border-orange-500
            hover:text-orange-400
          "
        >
          Load More
        </button>

      )}

    </div>

  );

}


export default VortaxaRateList;