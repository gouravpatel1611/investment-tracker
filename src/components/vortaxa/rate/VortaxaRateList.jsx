
import {
  useState,
} from "react";

import {
  Edit3,
  Percent,
} from "lucide-react";

import {
  formatDate,
} from "../../../utils/vortaxa/vortaxaFormatters";


function VortaxaRateList({
  rates = [],
  onEdit,
}) {
  const [
    visibleCount,
    setVisibleCount,
  ] = useState(10);

  const sortedRates = [
    ...rates,
  ].sort(
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

  const handleLoadMore = () => {
    setVisibleCount(
      (current) =>
        current + 10
    );
  };

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
        "
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
          Daily rate entries will
          appear automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleRates.map(
        (rate) => (
          <div
            key={rate.id}
            className="
              flex
              items-center
              justify-between
              gap-3
              rounded-2xl
              border
              border-slate-700
              bg-slate-800
              p-4
            "
          >
            {/* Left */}
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
                <Percent size={18} />
              </div>

              <div className="min-w-0">
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

            {/* Right */}
            <div
              className="
                flex
                shrink-0
                items-center
                gap-3
              "
            >
              <div className="text-right">
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
                  onEdit?.(rate)
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
                <Edit3 size={16} />
              </button>
            </div>
          </div>
        )
      )}

      {/* Load More */}
      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            px-4
            py-3
            text-xs
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

