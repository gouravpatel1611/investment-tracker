import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Hash,
  IndianRupee,
  Save,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import InvestorSelect from "./InvestorSelect";
import SchemeCodeInput from "./SchemeCodeInput";
import FundPreview from "./FundPreview";
import InvestmentSummary from "./InvestmentSummary";

import { investors } from "../../../data/mutualFunds";

import {
  findMutualFundBySchemeCode,
  getHistoricalNav,
} from "../../../services/api/mutualFundApi";

import {
  getTodayDate,
} from "../../../utils/mutualFundUtils";

import {
  addMutualFundTransaction,
} from "../../../services/firebase/mutualFundService";

import {
  useMutualFunds,
} from "../../../context/MutualFundContext";


function MutualFundForm() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /*
   * --------------------------------
   * SELECTED FUND FROM DETAILS PAGE
   * --------------------------------
   *
   * Details page se:
   *
   * navigate("/portfolio/mutual-funds/add", {
   *   state: { fund }
   * })
   *
   * kiya gaya hai.
   */

  const selectedFund =
    location.state?.fund || null;


  /*
   * --------------------------------
   * MUTUAL FUND CONTEXT
   * --------------------------------
   */

  const {
    reload,
  } = useMutualFunds();


  /*
   * --------------------------------
   * INITIAL FUND DATA
   * --------------------------------
   *
   * Holding ke schema ko form ke
   * expected fund schema ke saath
   * normalize kar rahe hain.
   */

  const initialFund =
    selectedFund
      ? {
          ...selectedFund,

          /*
           * API FundPreview generally
           * fund.name use karta hai.
           *
           * Holding me schemeName hai.
           */
          name:
            selectedFund.name ||
            selectedFund.schemeName ||
            "",

          schemeCode:
            selectedFund.schemeCode ||
            "",

          fundHouse:
            selectedFund.fundHouse ||
            selectedFund.amcName ||
            "",

          category:
            selectedFund.category ||
            "",
        }
      : null;


  /*
   * --------------------------------
   * FORM STATES
   * --------------------------------
   */

  const [
    investorId,
    setInvestorId,
  ] = useState(
    selectedFund?.investorId || ""
  );


  const [
    schemeCode,
    setSchemeCode,
  ] = useState(
    selectedFund?.schemeCode || ""
  );


  const [
    purchaseDate,
    setPurchaseDate,
  ] = useState(
    getTodayDate()
  );


  /*
   * USER AMOUNT ENTER KAREGA
   */

  const [
    amount,
    setAmount,
  ] = useState("");


  const [
    folioNumber,
    setFolioNumber,
  ] = useState(
    selectedFund?.folioNumber || ""
  );


  /*
   * FUND AUTOMATICALLY FILLED
   */

  const [
    fund,
    setFund,
  ] = useState(
    initialFund
  );


  const [
    nav,
    setNav,
  ] = useState(null);


  const [
    actualNavDate,
    setActualNavDate,
  ] = useState(null);


  const [
    isPreviousDate,
    setIsPreviousDate,
  ] = useState(false);


  const [
    isSearching,
    setIsSearching,
  ] = useState(false);


  const [
    isNavLoading,
    setIsNavLoading,
  ] = useState(false);


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  const [
    notFound,
    setNotFound,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /*
   * --------------------------------
   * CALCULATE UNITS
   *
   * Amount ÷ NAV = Units
   * --------------------------------
   */

  const calculatedUnits =
    amount &&
    nav !== null &&
    Number(nav) > 0
      ? Number(amount) / Number(nav)
      : 0;


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
   * FETCH NAV
   * --------------------------------
   *
   * Fund already selected hai.
   *
   * Sirf date change hone par
   * historical NAV dobara fetch hoga.
   */

  useEffect(() => {

    let cancelled = false;


    async function loadNav() {

      if (
        !fund ||
        !purchaseDate
      ) {

        setNav(null);
        setActualNavDate(null);
        setIsPreviousDate(false);

        return;
      }


      setIsNavLoading(true);


      try {

        const result =
          await getHistoricalNav(
            fund,
            purchaseDate
          );


        if (cancelled) {
          return;
        }


        setNav(
          result.nav
        );


        setActualNavDate(
          result.actualDate
        );


        setIsPreviousDate(
          result.isPreviousDate
        );

      } catch (error) {

        console.error(
          "NAV fetch error:",
          error
        );


        if (!cancelled) {

          setNav(null);

          setActualNavDate(null);

          setIsPreviousDate(false);

        }

      } finally {

        if (!cancelled) {

          setIsNavLoading(false);

        }

      }

    }


    loadNav();


    return () => {
      cancelled = true;
    };

  }, [
    fund,
    purchaseDate,
  ]);


  /*
   * --------------------------------
   * SCHEME SEARCH
   * --------------------------------
   *
   * Ye fallback ke liye rakha hai.
   *
   * Normally Add button se fund already
   * filled hoga, isliye user ko search
   * karne ki zarurat nahi padegi.
   */

  const handleSchemeSearch =
    async () => {

      const code =
        schemeCode.trim();


      if (!code) {

        setFund(null);
        setNav(null);
        setNotFound(false);

        return;
      }


      setIsSearching(true);
      setNotFound(false);
      setFund(null);
      setNav(null);
      setError("");


      try {

        const result =
          await findMutualFundBySchemeCode(
            code
          );


        if (!result) {

          setNotFound(true);

          return;
        }


        setFund(result);

      } catch (error) {

        console.error(
          "Scheme search error:",
          error
        );


        setError(
          "Unable to search scheme. Please try again."
        );

      } finally {

        setIsSearching(false);

      }

    };


  /*
   * --------------------------------
   * SCHEME CODE CHANGE
   * --------------------------------
   *
   * Auto-filled scheme code ko normally
   * change nahi karna padega.
   *
   * Agar user change karta hai to
   * purana fund clear hoga.
   */

  const handleSchemeCodeChange =
    (value) => {

      setSchemeCode(value);

      setFund(null);

      setNav(null);

      setActualNavDate(null);

      setIsPreviousDate(false);

      setNotFound(false);

      setError("");

    };


  /*
   * --------------------------------
   * SAVE INVESTMENT
   * --------------------------------
   */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      /*
       * Duplicate submission prevent
       */

      if (isSaving) {
        return;
      }


      setError("");


      /*
       * --------------------------------
       * VALIDATION
       * --------------------------------
       */

      if (!investorId) {

        setError(
          "Please select an investor."
        );

        return;
      }


      if (!fund) {

        setError(
          "Please select a valid mutual fund."
        );

        return;
      }


      if (!purchaseDate) {

        setError(
          "Please select purchase date."
        );

        return;
      }


      /*
       * AMOUNT VALIDATION
       */

      if (
        !amount ||
        Number(amount) <= 0
      ) {

        setError(
          "Please enter valid investment amount."
        );

        return;
      }


      /*
       * NAV VALIDATION
       */

      if (nav === null) {

        setError(
          "Purchase NAV is not available."
        );

        return;
      }


      /*
       * CALCULATED UNITS VALIDATION
       */

      if (
        !calculatedUnits ||
        calculatedUnits <= 0
      ) {

        setError(
          "Unable to calculate units."
        );

        return;
      }


      /*
       * FOLIO VALIDATION
       */

      if (!folioNumber.trim()) {

        setError(
          "Please enter folio number."
        );

        return;
      }


      /*
       * --------------------------------
       * SELECT INVESTOR
       * --------------------------------
       */

      const selectedInvestor =
        investors.find(
          (item) =>
            item.id === investorId
        );


      /*
       * --------------------------------
       * CREATE TRANSACTION
       * --------------------------------
       */

      const investment = {

        id:
          typeof crypto !== "undefined" &&
          crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),


        assetType:
          "mutual-fund",


        type:
          "BUY",


        investorId,


        investorName:
          selectedInvestor?.name ||
          selectedFund?.investorName ||
          fund?.investorName ||
          "",


        schemeCode:
          fund.schemeCode ||
          schemeCode,


        fundName:
          fund.name ||
          fund.schemeName ||
          selectedFund?.schemeName ||
          "",


        fundHouse:
          fund.fundHouse ||
          fund.amcName ||
          selectedFund?.fundHouse ||
          "",


        category:
          fund.category ||
          selectedFund?.category ||
          "",


        purchaseDate,


        /*
         * USER ENTERED AMOUNT
         */

        amount:
          Number(amount),


        /*
         * AUTOMATICALLY CALCULATED UNITS
         */

        units:
          calculatedUnits,


        purchaseNav:
          Number(nav),


        navDate:
          actualNavDate,


        folioNumber:
          folioNumber.trim(),


        createdAt:
          new Date().toISOString(),

      };


      /*
       * --------------------------------
       * SAVE TO FIREBASE
       * --------------------------------
       */

      setIsSaving(true);


      try {

        /*
         * 1. Firebase save
         */

        await addMutualFundTransaction(
          investment
        );


        /*
         * 2. Context refresh
         */

        await reload();


        /*
         * 3. Success
         */

        alert(
          "Mutual fund investment added successfully!"
        );


        /*
         * 4. Back to mutual fund list
         */

        navigate(
          "/portfolio/mutual-funds"
        );

      } catch (error) {

        console.error(
          "Save mutual fund investment error:",
          error
        );


        setError(
          "Unable to save investment. Please try again."
        );

      } finally {

        setIsSaving(false);

      }

    };


  return (

    <div
      className="
        mx-auto
        w-full
        max-w-2xl
        pb-6
      "
    >

      {/* --------------------------------
          HEADER
      -------------------------------- */}

      <div
        className="
          mb-5
          flex
          items-center
          gap-3
        "
      >

        <button
          type="button"
          onClick={() =>
            navigate(
              "/portfolio/mutual-funds"
            )
          }
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            text-slate-300
            transition
            hover:bg-slate-700
            hover:text-white
            active:scale-95
          "
        >

          <ArrowLeft size={18} />

        </button>


        <div>

          <p
            className="
              text-xs
              font-bold
              text-purple-400
            "
          >
            MUTUAL FUNDS
          </p>


          <h1
            className="
              mt-0.5
              text-xl
              font-extrabold
              tracking-tight
              text-slate-900
            "
          >
            Add investment
          </h1>

        </div>

      </div>


      {/* --------------------------------
          FORM
      -------------------------------- */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >


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
            shadow-sm
          "
        >

          <InvestorSelect
            investors={investors}
            value={investorId}
            onChange={setInvestorId}
          />

        </div>


        {/* --------------------------------
            SCHEME CODE
        -------------------------------- */}

        <div
          className="
            rounded-2xl
            border
            border-slate-700
            bg-slate-800
            p-4
            shadow-sm
          "
        >

          <SchemeCodeInput
            value={schemeCode}
            onChange={
              handleSchemeCodeChange
            }
            onSearch={
              handleSchemeSearch
            }
            loading={isSearching}
            fund={fund}
            notFound={notFound}
          />

        </div>


        {/* --------------------------------
            FUND PREVIEW
        -------------------------------- */}

        {fund && (

          <FundPreview
            fund={fund}
            purchaseDate={
              purchaseDate
            }
            nav={nav}
            actualNavDate={
              actualNavDate
            }
            isPreviousDate={
              isPreviousDate
            }
          />

        )}


        {/* --------------------------------
            PURCHASE DETAILS
        -------------------------------- */}

        <div
          className="
            rounded-2xl
            border
            border-slate-700
            bg-slate-800
            p-4
            shadow-sm
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
              Purchase details
            </p>


            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Enter the transaction details below.
            </p>

          </div>


          <div className="space-y-4">


            {/* --------------------------------
                PURCHASE DATE
            -------------------------------- */}

            <div>

              <label
                htmlFor="purchaseDate"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-slate-200
                "
              >
                Purchase Date
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
                  id="purchaseDateDisplay"
                  type="text"
                  value={
                    formatDateForDisplay(
                      purchaseDate
                    )
                  }
                  readOnly
                  onClick={() => {

                    document
                      .getElementById(
                        "hiddenPurchaseDate"
                      )
                      ?.showPicker?.();

                  }}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/70
                    pl-10
                    pr-3
                    text-sm
                    font-semibold
                    text-slate-100
                    outline-none
                    transition
                    placeholder:text-slate-500
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-500/20
                  "
                />


                <input
                  id="hiddenPurchaseDate"
                  type="date"
                  value={
                    purchaseDate
                  }
                  onChange={(event) =>
                    setPurchaseDate(
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

            </div>


            {/* --------------------------------
                INVESTMENT AMOUNT
            -------------------------------- */}

            <div>

              <label
                htmlFor="investmentAmount"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-slate-200
                "
              >
                Investment Amount
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
                  id="investmentAmount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  placeholder="Enter investment amount"
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


            {/* --------------------------------
                CALCULATED UNITS
            -------------------------------- */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                "
              >

                <label
                  htmlFor="units"
                  className="
                    text-sm
                    font-bold
                    text-slate-200
                  "
                >
                  Units
                </label>


                {amount &&
                  nav !== null &&
                  Number(nav) > 0 && (

                    <span
                      className="
                        text-[11px]
                        font-bold
                        text-purple-400
                      "
                    >
                      Auto calculated
                    </span>

                  )}

              </div>


              <div className="relative">

                <Hash
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
                  id="units"
                  type="text"
                  value={
                    calculatedUnits > 0
                      ? calculatedUnits.toFixed(4)
                      : ""
                  }
                  readOnly
                  placeholder={
                    nav !== null
                      ? "Enter amount"
                      : "Select scheme first"
                  }
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
                    font-bold
                    text-white
                    outline-none
                    placeholder:text-slate-500
                  "
                />

              </div>

            </div>


            {/* --------------------------------
                PURCHASE NAV
            -------------------------------- */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                "
              >

                <label
                  htmlFor="purchaseNav"
                  className="
                    text-sm
                    font-bold
                    text-slate-200
                  "
                >
                  Purchase NAV
                </label>


                {isNavLoading && (

                  <span
                    className="
                      text-[11px]
                      font-bold
                      text-purple-400
                    "
                  >
                    Fetching NAV...
                  </span>

                )}

              </div>


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
                  id="purchaseNav"
                  type="text"
                  value={
                    nav !== null
                      ? nav
                      : ""
                  }
                  readOnly
                  placeholder={
                    fund
                      ? "Fetching NAV..."
                      : "Select scheme first"
                  }
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
                    font-bold
                    text-white
                    outline-none
                    placeholder:text-slate-500
                  "
                />

              </div>

            </div>


            {/* --------------------------------
                FOLIO NUMBER
            -------------------------------- */}

            <div>

              <label
                htmlFor="folioNumber"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-slate-200
                "
              >
                Folio Number
              </label>


              <input
                id="folioNumber"
                type="text"
                value={folioNumber}
                onChange={(event) =>
                  setFolioNumber(
                    event.target.value
                  )
                }
                placeholder="Enter folio number"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-600
                  bg-slate-900
                  px-3
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


        {/* --------------------------------
            SUMMARY
        -------------------------------- */}

        {fund &&
          nav !== null && (

            <InvestmentSummary
              units={
                calculatedUnits
              }
              nav={nav}
            />

          )}


        {/* --------------------------------
            ERROR
        -------------------------------- */}

        {error && (

          <div
            className="
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-3
              text-sm
              font-semibold
              text-red-400
            "
          >
            {error}
          </div>

        )}


        {/* --------------------------------
            SAVE
        -------------------------------- */}

        <div className="pb-6">

          <button
            type="submit"
            disabled={
              !fund ||
              nav === null ||
              isNavLoading ||
              !amount ||
              Number(amount) <= 0 ||
              isSaving
            }
            className="
              flex
              min-h-13
              w-full
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


            {isSaving
              ? "Saving..."
              : "Add Mutual Fund"}

          </button>

        </div>

      </form>

    </div>
  );
}

export default MutualFundForm;