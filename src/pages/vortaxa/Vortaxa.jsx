
import {
  useNavigate,
} from "react-router-dom";

import VortaxaHeader from "../../components/vortaxa/dashboard/VortaxaHeader";

import VortaxaSummaryCard from "../../components/vortaxa/dashboard/VortaxaSummaryCard";

import VortaxaInvestorList from "../../components/vortaxa/dashboard/VortaxaInvestorList";

import {
  useVortaxa,
} from "../../context/VortaxaContext";


function Vortaxa() {

  const navigate =
    useNavigate();


  const {
    investorData,
    allInvestorsSummary,
    loading,
    dataLoading,
  } = useVortaxa();


  /*
   * --------------------------------
   * LOADING
   * --------------------------------
   */

  if (
    loading ||
    dataLoading
  ) {

    return (

      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          text-sm
          font-semibold
          text-slate-400
        "
      >
        Loading Vortaxa...
      </div>

    );

  }


  /*
   * --------------------------------
   * INVESTORS
   * --------------------------------
   *
   * investorData already contains:
   *
   * investor
   * +
   * calculated summary
   *
   * --------------------------------
   */

  const investors =
    investorData || [];


  /*
   * --------------------------------
   * INVESTOR SUMMARIES
   * --------------------------------
   *
   * Keep this object because
   * VortaxaInvestorList supports it.
   *
   * --------------------------------
   */

  const investorSummaries =
    investors.reduce(
      (
        result,
        investor
      ) => {

        result[
          investor.id
        ] =
          investor.summary || {};

        return result;

      },
      {}
    );


  /*
   * --------------------------------
   * TOTAL SUMMARY
   * --------------------------------
   */

  const totalSummary =
    allInvestorsSummary || {};


  return (

    <div
      className="
        mx-auto
        w-full
        max-w-5xl
      "
    >

      <VortaxaHeader
        onBack={() =>
          navigate(-1)
        }
        onAdd={() =>
          navigate("/vortaxa/add")
        }
      />


      <VortaxaSummaryCard
        summary={
          totalSummary
        }
      />


      <VortaxaInvestorList
        investors={
          investors
        }

        investorSummaries={
          investorSummaries
        }

        onInvestorClick={(
          investorId
        ) =>
          navigate(
            `/vortaxa/${investorId}`
          )
        }

        onAdd={() =>
          navigate("/vortaxa/add")
        }

      />

    </div>

  );

}


export default Vortaxa;
