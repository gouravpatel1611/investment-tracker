
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import VortaxaDetailsHeader from "../../components/vortaxa/details/VortaxaDetailsHeader";
import VortaxaDetailsSummary from "../../components/vortaxa/details/VortaxaDetailsSummary";
import VortaxaTransactionPreview from "../../components/vortaxa/transaction/VortaxaTransactionPreview";
import VortaxaRatePreview from "../../components/vortaxa/rate/VortaxaRatePreview";

import {
  useVortaxa,
} from "../../context/VortaxaContext";


function VortaxaDetails() {

  const navigate =
    useNavigate();

  const {
    investorId,
  } = useParams();


  const {
    getInvestor,
    investorData,
    rates,
    loading,
    dataLoading,
  } = useVortaxa();


  /*
   * --------------------------------
   * FIND INVESTOR
   * --------------------------------
   *
   * Route investorId can be either:
   *
   * - internal investor.id
   * - external investor.investorId
   *
   * getInvestor() already handles both.
   *
   * --------------------------------
   */

  const investor =
    getInvestor(investorId);


  /*
   * --------------------------------
   * FIND CALCULATED INVESTOR DATA
   * --------------------------------
   *
   * investorData is an ARRAY:
   *
   * [
   *   {
   *     ...investor,
   *     summary: {...}
   *   }
   * ]
   *
   * --------------------------------
   */

  const investorDataItem =
    investor
      ? investorData?.find(
          (item) =>
            item.id === investor.id
        )
      : null;


  /*
   * --------------------------------
   * SUMMARY
   * --------------------------------
   */

  const summary =
    investorDataItem?.summary || {};


  /*
   * --------------------------------
   * TRANSACTIONS
   * --------------------------------
   */

  const transactions =
    Array.isArray(
      investor?.transactions
    )
      ? investor.transactions
      : [];


  /*
   * --------------------------------
   * GLOBAL DAILY RATES
   * --------------------------------
   *
   * Rates are shared by all investors.
   *
   * --------------------------------
   */

  const dailyRates =
    Array.isArray(rates)
      ? rates
      : [];


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
        "
      >

        <p
          className="
            text-sm
            font-semibold
            text-slate-400
          "
        >
          Loading Vortaxa...
        </p>

      </div>

    );

  }


  /*
   * --------------------------------
   * INVESTOR NOT FOUND
   * --------------------------------
   */

  if (!investor) {

    return (

      <div
        className="
          mx-auto
          w-full
          max-w-5xl
        "
      >

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

          <p
            className="
              text-sm
              font-bold
              text-white
            "
          >
            Investor not found
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            This Vortaxa investment
            could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/vortaxa")
            }
            className="
              mt-4
              rounded-xl
              bg-orange-500
              px-4
              py-2
              text-xs
              font-bold
              text-white
              transition
              hover:bg-orange-400
            "
          >
            Back to Vortaxa
          </button>

        </div>

      </div>

    );

  }


  const investorName =
    investor.investorName ||
    investor.name ||
    "Investor";


  return (

    <div
      className="
        mx-auto
        w-full
        max-w-5xl
      "
    >

      {/* Header */}

      <VortaxaDetailsHeader
        investorName={
          investorName
        }
        startDate={
          investor.startDate
        }
        onBack={() =>
          navigate("/vortaxa")
        }
      />


      {/* Summary */}

      <VortaxaDetailsSummary
        summary={
          summary
        }
      />


      {/* Recent Transactions */}

      <VortaxaTransactionPreview
        transactions={
          transactions
        }
        onViewAll={() =>
          navigate(
            `/vortaxa/${investorId}/transactions`
          )
        }
      />


      {/* Recent Daily Rates */}

      <VortaxaRatePreview
        rates={
          dailyRates
        }
        onViewAll={() =>
          navigate(
            `/vortaxa/${investorId}/rates`
          )
        }
      />

    </div>

  );

}


export default VortaxaDetails;

