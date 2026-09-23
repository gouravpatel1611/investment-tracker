import {
  useState,
} from "react";

import {
  CalendarDays,
  IndianRupee,
  Save,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import InvestorSelect from "../investments/mutualFunds/InvestorSelect";

import {
  useInvestors,
} from "../../context/InvestorContext";

import {
  useVortaxa,
} from "../../context/VortaxaContext";

import {
  getTodayDate,
} from "../../utils/mutualFundUtils";


function VortaxaInvestmentForm({
  onCancel,
}) {

  const navigate =
    useNavigate();


  /*
   * --------------------------------
   * INVESTOR CONTEXT
   * --------------------------------
   */

  const {
    investors,
    loading: investorsLoading,
  } = useInvestors();


  /*
   * --------------------------------
   * VORTAXA CONTEXT
   * --------------------------------
   */

  const {
    addInvestor,
  } = useVortaxa();


  /*
   * --------------------------------
   * FORM STATE
   * --------------------------------
   */

  const [
    investorId,
    setInvestorId,
  ] = useState("");


  const [
    transactionDate,
    setTransactionDate,
  ] = useState(
    getTodayDate()
  );


  const [
    liquidity,
    setLiquidity,
  ] = useState("");


  const [
    fule,
    setFule,
  ] = useState("");


  const [
    piFule,
    setPiFule,
  ] = useState("");


  /*
   * --------------------------------
   * UI STATE
   * --------------------------------
   */

  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /*
   * --------------------------------
   * FORMAT DATE
   * --------------------------------
   */

  function formatDateForDisplay(
    dateString
  ) {

    if (!dateString) {
      return "";
    }

    const [
      year,
      month,
      day,
    ] = dateString.split("-");

    return `${day}/${month}/${year}`;
  }


  /*
   * --------------------------------
   * SAVE
   * --------------------------------
   */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      /*
       * Clear previous error
       */

      setError("");


      /*
       * --------------------------------
       * BASIC VALIDATION
       * --------------------------------
       */

      if (!investorId) {

        setError(
          "Please select an investor."
        );

        return;
      }


      if (!transactionDate) {

        setError(
          "Please select the transaction date."
        );

        return;
      }


      /*
       * --------------------------------
       * CONVERT VALUES
       * --------------------------------
       */

      const liquidityAmount =
        Number(liquidity || 0);


      const fuleAmount =
        Number(fule || 0);


      const piFuleAmount =
        Number(piFule || 0);


      /*
       * --------------------------------
       * NEGATIVE VALUE VALIDATION
       * --------------------------------
       */

      if (liquidityAmount < 0) {

        setError(
          "Liquidity cannot be negative."
        );

        return;
      }


      if (fuleAmount < 0) {

        setError(
          "FULE cannot be negative."
        );

        return;
      }


      if (piFuleAmount < 0) {

        setError(
          "PI FULE cannot be negative."
        );

        return;
      }


      /*
       * --------------------------------
       * AT LEAST ONE AMOUNT REQUIRED
       * --------------------------------
       *
       * FULE = 0       → allowed
       * PI FULE = 0    → allowed
       * Liquidity = 0  → allowed individually
       *
       * But all three cannot be zero.
       */

      if (
        liquidityAmount === 0 &&
        fuleAmount === 0 &&
        piFuleAmount === 0
      ) {

        setError(
          "Please enter at least one initial amount."
        );

        return;
      }


      /*
       * --------------------------------
       * FIND SELECTED INVESTOR
       * --------------------------------
       */

      const selectedInvestor =
        investors.find(
          (investor) =>
            investor.id === investorId
        );


      if (!selectedInvestor) {

        setError(
          "Selected investor was not found."
        );

        return;
      }


      /*
       * --------------------------------
       * SAVE TO FIREBASE
       * --------------------------------
       */

      try {

        setSaving(true);


        await addInvestor({

          investorId,

          investorName:
            selectedInvestor.name ||
            selectedInvestor.investorName ||
            "",

          startDate:
            transactionDate,

          liquidity:
            liquidityAmount,

          fule:
            fuleAmount,

          piFule:
            piFuleAmount,

        });


        /*
         * --------------------------------
         * SUCCESS
         * --------------------------------
         */

        alert(
          "Vortaxa investment saved successfully."
        );


        /*
         * --------------------------------
         * GO TO VORTAXA
         * --------------------------------
         */

        navigate(
          "/vortaxa"
        );


      } catch (saveError) {

        console.error(
          "Vortaxa save error:",
          saveError
        );


        setError(
          saveError?.message ||
          "Failed to save Vortaxa investment."
        );


      } finally {

        setSaving(false);

      }

    };


  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* --------------------------------
          ERROR
      -------------------------------- */}

      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-4
            py-3
            text-sm
            font-semibold
            text-red-300
          "
        >
          {error}
        </div>

      )}


      {/* --------------------------------
          INVESTOR
      -------------------------------- */}

      <div
        className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-800
          p-4
        "
      >

        <InvestorSelect
          investors={investors}
          value={investorId}
          onChange={(value) => {
            setInvestorId(value);
            setError("");
          }}
          loading={investorsLoading}
        />


        <button
          type="button"
          onClick={() =>
            navigate("/investors")
          }
          className="
            mt-2
            text-sm
            font-semibold
            text-purple-400
            transition
            hover:text-purple-300
          "
        >
          Add / Edit Investor
        </button>

      </div>


      {/* --------------------------------
          INITIAL DETAILS
      -------------------------------- */}

      <div
        className="
          rounded-2xl
          border
          border-slate-700
          bg-slate-800
          p-4
        "
      >

        <div className="mb-4">

          <p
            className="
              text-sm
              font-extrabold
              text-white
            "
          >
            Initial Details
          </p>


          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            Enter the opening date and initial values.
          </p>

        </div>


        <div className="space-y-4">

          {/* --------------------------------
              DATE
          -------------------------------- */}

          <div>

            <label
              htmlFor="vortaxaDate"
              className="
                mb-2
                block
                text-sm
                font-bold
                text-slate-200
              "
            >
              First Transaction Date
            </label>


            <div className="relative">

              <CalendarDays
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-slate-500
                "
              />


              <input
                id="vortaxaDateDisplay"
                type="text"
                value={
                  formatDateForDisplay(
                    transactionDate
                  )
                }
                readOnly
                onClick={() => {

                  document
                    .getElementById(
                      "vortaxaDate"
                    )
                    ?.showPicker?.();

                }}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-900
                  pl-10
                  pr-3
                  text-sm
                  font-semibold
                  text-slate-100
                  outline-none
                  transition
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/20
                "
              />


              <input
                id="vortaxaDate"
                type="date"
                value={
                  transactionDate
                }
                onChange={(event) =>
                  setTransactionDate(
                    event.target.value
                  )
                }
                max={getTodayDate()}
                className="
                  pointer-events-none
                  absolute
                  h-0
                  w-0
                  opacity-0
                "
                tabIndex={-1}
              />

            </div>


            <p
              className="
                mt-2
                text-[11px]
                font-medium
                text-slate-500
              "
            >
              This date will be used as the
              first transaction date.
            </p>

          </div>


          {/* --------------------------------
              INITIAL VALUES
          -------------------------------- */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >

            {/* LIQUIDITY */}

            <div>

              <label
                htmlFor="vortaxaLiquidity"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-slate-200
                "
              >
                LIQUIDITY
              </label>


              <div className="relative">

                <IndianRupee
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />


                <input
                  id="vortaxaLiquidity"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={liquidity}
                  onChange={(event) =>
                    setLiquidity(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-600
                    bg-slate-900
                    pl-10
                    pr-3
                    text-sm
                    font-semibold
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-500/20
                  "
                />

              </div>

            </div>


            {/* FULE */}

            <div>

              <label
                htmlFor="vortaxaFule"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-slate-200
                "
              >
                FULE
              </label>


              <div className="relative">

                <IndianRupee
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />


                <input
                  id="vortaxaFule"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={fule}
                  onChange={(event) =>
                    setFule(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-600
                    bg-slate-900
                    pl-10
                    pr-3
                    text-sm
                    font-semibold
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-500/20
                  "
                />

              </div>

            </div>


            {/* PI FULE */}

            <div>

              <label
                htmlFor="vortaxaPiFule"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-slate-200
                "
              >
                PI FULE
              </label>


              <div className="relative">

                <IndianRupee
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                />


                <input
                  id="vortaxaPiFule"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={piFule}
                  onChange={(event) =>
                    setPiFule(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-600
                    bg-slate-900
                    pl-10
                    pr-3
                    text-sm
                    font-semibold
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-500/20
                  "
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* --------------------------------
          ACTIONS
      -------------------------------- */}

      <div
        className="
          flex
          gap-3
          pb-6
        "
      >

        {/* CANCEL */}

        <button
          type="button"
          onClick={() => {

            if (onCancel) {

              onCancel();

              return;
            }

            navigate("/vortaxa");

          }}
          disabled={saving}
          className="
            flex
            min-h-13
            flex-1
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-slate-700
            bg-slate-800
            px-5
            py-3
            text-sm
            font-extrabold
            text-slate-300
            transition
            hover:border-slate-600
            hover:bg-slate-700
            hover:text-white
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <X size={18} />

          Cancel

        </button>


        {/* SAVE */}

        <button
          type="submit"
          disabled={
            saving ||
            investorsLoading ||
            !investorId ||
            !transactionDate
          }
          className="
            flex
            min-h-13
            flex-1
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-purple-600
            px-5
            py-3
            text-sm
            font-extrabold
            text-white
            shadow-lg
            shadow-purple-600/20
            transition
            hover:bg-purple-500
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:bg-slate-700
            disabled:text-slate-500
            disabled:shadow-none
          "
        >

          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Vortaxa"}

        </button>

      </div>

    </form>

  );
}

export default VortaxaInvestmentForm;