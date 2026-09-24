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
  onDelete,
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
            (investor) => {

              const summary =
                investor?.summary ||
                investorSummaries?.[
                  investor.id
                ] ||
                {};


              return (

                <VortaxaInvestorCard
                  key={
                    investor.id
                  }

                  investor={
                    investor
                  }

                  summary={
                    summary
                  }

                  onClick={() =>
                    onInvestorClick(
                      investor.id
                    )
                  }

                  onDelete={
                    onDelete
                  }

                />

              );

            }
          )}

        </div>

      )}

    </div>

  );

}


export default VortaxaInvestorList;