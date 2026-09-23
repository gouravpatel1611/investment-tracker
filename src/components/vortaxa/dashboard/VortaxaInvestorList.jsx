import VortaxaInvestorCard from "./VortaxaInvestorCard";

import VortaxaEmptyState from "../common/VortaxaEmptyState";

import {
  formatNumber,
} from "../../../utils/vortaxa/vortaxaFormatters";


function VortaxaInvestorList({
  investors = [],
  investorSummaries = {},
  onInvestorClick,
  onAdd,
}) {

  return (

    <div>

      {/* =================================
          SECTION HEADER
      ================================= */}

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
        "
      >

        <h2
          className="
            text-sm
            font-bold
            text-white
          "
        >
          Investors
        </h2>


        <span
          className="
            text-xs
            font-medium
            text-slate-500
          "
        >
          {formatNumber(
            investors.length
          )} total
        </span>

      </div>


      {/* =================================
          EMPTY
      ================================= */}

      {investors.length === 0 ? (

        <VortaxaEmptyState
          onAdd={onAdd}
        />

      ) : (

        <div
          className="
            space-y-3
          "
        >

          {investors.map(
            (investor) => (

              <VortaxaInvestorCard
                key={investor.id}
                investor={investor}
                summary={
                  investorSummaries?.[
                    investor.id
                  ] || {}
                }
                onClick={() =>
                  onInvestorClick(
                    investor.id
                  )
                }
              />

            )
          )}

        </div>

      )}

    </div>

  );

}


export default VortaxaInvestorList;