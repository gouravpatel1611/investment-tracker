import {
  ChevronRight,
  Percent,
} from "lucide-react";

import {
  formatDate,
  formatCurrency,
} from "../../../utils/vortaxa/vortaxaFormatters";

import {
  calculateRateSummary,
} from "../../../utils/vortaxa/vortaxaCalculations";


function VortaxaRatePreview({
  rates = [],
  investors = [],
  onViewAll,
}) {
  /* =======================================================
     RECENT 5 RATES
  ======================================================= */

  const recentRates = [
    ...rates,
  ]
    .sort((a, b) => {
      const dateA =
        String(
          a?.date || ""
        );

      const dateB =
        String(
          b?.date || ""
        );

      return dateB.localeCompare(
        dateA
      );
    })
    .slice(0, 5);


  return (
    <div
      className="
        mb-4
        my-4
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-4
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

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
              text-sm
              font-extrabold
              text-white
            "
          >
            Recent Daily Rates
          </p>

          <p
            className="
              mt-0.5
              text-[10px]
              text-slate-500
            "
          >
            Daily profit calculation rates
          </p>
        </div>


        {rates.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="
              flex
              items-center
              gap-0.5
              text-[11px]
              font-bold
              text-orange-300
              transition
              hover:text-orange-200
            "
          >
            View All

            <ChevronRight
              className="
                h-3.5
                w-3.5
              "
            />
          </button>
        )}
      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {recentRates.length === 0 ? (
        <div
          className="
            mt-4
            rounded-xl
            border
            border-dashed
            border-slate-700
            bg-slate-900/40
            px-4
            py-6
            text-center
          "
        >
          <p
            className="
              text-xs
              font-semibold
              text-slate-400
            "
          >
            No daily rates found
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-slate-600
            "
          >
            Daily rate entries will
            appear automatically.
          </p>
        </div>
      ) : (
        /* =================================================
           RATE LIST
        ================================================= */

        <div
          className="
            mt-4
            divide-y
            divide-slate-700/70
          "
        >
          {recentRates.map(
            (rate) => {
              /* ==========================================
                 RATE CALCULATION
              ========================================== */

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
                  rateSummary?.total || 0
                );


              return (
                <div
                  key={rate.id}
                  className="
                    py-3
                    first:pt-0
                    last:pb-0
                  "
                >
                  {/* =====================================
                      TOP ROW
                  ====================================== */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    {/* =================================
                        DATE
                    ================================== */}

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
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-orange-500/15
                          text-orange-300
                        "
                      >
                        <Percent
                          className="
                            h-4
                            w-4
                          "
                        />
                      </div>


                      <div
                        className="
                          min-w-0
                        "
                      >
                        <p
                          className="
                            text-xs
                            font-bold
                            text-slate-200
                          "
                        >
                          {formatDate(
                            rate?.date
                          )}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            text-slate-500
                          "
                        >
                          Daily Rate
                        </p>
                      </div>
                    </div>


                    {/* =================================
                        RATE
                    ================================== */}

                    <div
                      className="
                        shrink-0
                        text-right
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-extrabold
                          text-orange-300
                        "
                      >
                        {Number(
                          rate?.rate || 0
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>


                  {/* =====================================
                      EARNING SUMMARY
                  ====================================== */}

                  <div
                    className="
                      mt-2
                      grid
                      grid-cols-3
                      gap-2
                    "
                  >
                    {/* APR */}

                    <div
                      className="
                        rounded-lg
                        bg-slate-900/60
                        px-2
                        py-1.5
                      "
                    >
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          text-slate-500
                        "
                      >
                        APR $
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-bold
                          text-slate-200
                        "
                      >
                        {formatCurrency(
                          apr,
                          "USD"
                        )}
                      </p>
                    </div>


                    {/* PI */}

                    <div
                      className="
                        rounded-lg
                        bg-slate-900/60
                        px-2
                        py-1.5
                      "
                    >
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          text-slate-500
                        "
                      >
                        PI $
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-bold
                          text-slate-200
                        "
                      >
                        {formatCurrency(
                          pi,
                          "USD"
                        )}
                      </p>
                    </div>


                    {/* TOTAL */}

                    <div
                      className="
                        rounded-lg
                        bg-orange-500/10
                        px-2
                        py-1.5
                      "
                    >
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          text-orange-300/70
                        "
                      >
                        TOTAL $
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-extrabold
                          text-orange-300
                        "
                      >
                        {formatCurrency(
                          total,
                          "USD"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}


      {/* =================================================
          VIEW ALL
      ================================================= */}

      {recentRates.length > 0 && (
        <button
          type="button"
          onClick={onViewAll}
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-1
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            py-2.5
            text-[11px]
            font-bold
            text-slate-300
            transition
            hover:border-slate-600
            hover:bg-slate-700
            hover:text-white
          "
        >
          View All Daily Rates

          <ChevronRight
            className="
              h-3.5
              w-3.5
            "
          />
        </button>
      )}
    </div>
  );
}


export default VortaxaRatePreview;