
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


import VortaxaRateFilters from "../../components/vortaxa/rate/VortaxaRateFilters";

import VortaxaRateForm from "../../components/vortaxa/rate/VortaxaRateForm";

import VortaxaRateList from "../../components/vortaxa/rate/VortaxaRateList";

import {
  useVortaxa,
} from "../../context/VortaxaContext";


function VortaxaRates() {
  const navigate =
    useNavigate();

  const {
    investorId,
  } = useParams();


  /* =======================================================
     VORTAXA CONTEXT
  ======================================================= */

  const {
    getInvestor,
    rates,
    addRate,
    updateRate,
    loading,
    dataLoading,
  } = useVortaxa();


  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [
    year,
    setYear,
  ] = useState("all");

  const [
    month,
    setMonth,
  ] = useState("all");


  /* =======================================================
     EDIT STATE
  ======================================================= */

  const [
    editingRate,
    setEditingRate,
  ] = useState(null);


  /* =======================================================
     SAVING STATE
  ======================================================= */

  const [
    saving,
    setSaving,
  ] = useState(false);


  /* =======================================================
     FORM REF
     
     Used to smoothly scroll to the rate form
     when Edit button is clicked.
  ======================================================= */

  const formRef =
    useRef(null);


  /* =======================================================
     SCROLL TO FORM WHEN EDIT MODE STARTS
  ======================================================= */

  useEffect(() => {
    if (!editingRate) {
      return;
    }

    /*
     * Wait for React to render the updated edit state
     * before scrolling.
     */

    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [
    editingRate,
  ]);


  /* =======================================================
     INVESTOR
     
     Investor is only used for:
     - page heading
     - back navigation
     
     Rates themselves are GLOBAL.
  ======================================================= */

  const investor =
    getInvestor(
      investorId
    );


  const investorName =
    investor?.investorName ||
    investor?.name ||
    "Investor";


  /* =======================================================
     GLOBAL RATES
     
     Make a copy so the original Context array
     is never mutated accidentally.
  ======================================================= */

  const allRates =
    Array.isArray(rates)
      ? rates
      : [];


  /* =======================================================
     AVAILABLE YEARS
  ======================================================= */

  const years = useMemo(() => {
    const yearSet =
      new Set();

    allRates.forEach(
      (rate) => {
        const date =
          String(
            rate?.date || ""
          );

        if (
          date.length >= 4
        ) {
          yearSet.add(
            date.slice(0, 4)
          );
        }
      }
    );

    return [
      ...yearSet,
    ].sort(
      (a, b) =>
        Number(b) -
        Number(a)
    );
  }, [
    allRates,
  ]);


  /* =======================================================
     FILTER RATES
     
     Global rates:
     Year + Month
  ======================================================= */

  const filteredRates =
    useMemo(() => {
      return [
        ...allRates,
      ]
        .filter(
          (rate) => {
            const date =
              String(
                rate?.date || ""
              );

            /* ---------------------------------------------
               YEAR
            --------------------------------------------- */

            if (
              year !== "all" &&
              date.slice(
                0,
                4
              ) !== year
            ) {
              return false;
            }


            /* ---------------------------------------------
               MONTH
            --------------------------------------------- */

            if (
              month !== "all" &&
              date.slice(
                5,
                7
              ) !== month
            ) {
              return false;
            }


            return true;
          }
        )
        .sort(
          (a, b) => {
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
          }
        );
    }, [
      allRates,
      year,
      month,
    ]);


  /* =======================================================
     SAVE / UPDATE RATE
     
     Global rate:
     - Existing date -> update
     - Missing date -> add
     
     investorId is NOT required.
  ======================================================= */

  const handleSave =
    async (
      formData
    ) => {
      setSaving(true);

      try {
        const existingRate =
          allRates.find(
            (rate) =>
              String(
                rate?.date || ""
              ) ===
              String(
                formData?.date || ""
              )
          );


        /* -----------------------------------------------
           UPDATE EXISTING RATE
        ----------------------------------------------- */

        if (existingRate) {
          await updateRate(
            null,
            existingRate.id,
            {
              rate:
                Number(
                  formData?.rate || 0
                ),
            }
          );

          /*
           * IMPORTANT:
           * Do not close edit mode here.
           *
           * VortaxaRateForm closes edit mode only
           * after explicit "Save Rate".
           *
           * This prevents Previous / Next / Date Picker
           * auto-save from closing edit mode.
           */

          return;
        }


        /* -----------------------------------------------
           ADD RATE
           
           Normally dates are already generated
           automatically by Context.
           
           This is only a safe fallback.
        ----------------------------------------------- */

        await addRate(
          null,
          {
            date:
              formData.date,

            rate:
              Number(
                formData.rate || 0
              ),

            type: "DAILY",
          }
        );

      } finally {
        setSaving(false);
      }
    };


  /* =======================================================
     EDIT RATE
  ======================================================= */

  const handleEdit =
    (rate) => {
      setEditingRate(
        rate
      );
    };


  /* =======================================================
     CANCEL EDIT
  ======================================================= */

  const handleCancel =
    () => {
      setEditingRate(
        null
      );
    };


  /* =======================================================
     LOADING
  ======================================================= */

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
          Loading Daily Rates...
        </p>
      </div>
    );
  }


  /* =======================================================
     INVESTOR NOT FOUND
     
     Rates are global, but this page still expects
     an investorId because it is opened from an
     investor's details page.
  ======================================================= */

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


          <button
            type="button"
            onClick={() =>
              navigate(
                "/vortaxa"
              )
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


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-5xl
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-slate-700
          bg-slate-800
          px-4
          py-3
        "
      >
        {/* Back */}

        <button
          type="button"
          onClick={() =>
            navigate(
              `/vortaxa/${investorId}`
            )
          }
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            text-slate-300
            transition
            hover:border-slate-600
            hover:bg-slate-700
            hover:text-white
          "
          aria-label="Back"
        >
          <ArrowLeft
            className="
              h-4
              w-4
            "
          />
        </button>


        {/* Title */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <h1
            className="
              truncate
              text-base
              font-extrabold
              text-white
            "
          >
            Daily Rates
          </h1>

          <p
            className="
              mt-0.5
              truncate
              text-[11px]
              text-slate-500
            "
          >
            Global rates •{" "}
            {investorName}
          </p>
        </div>


        {/* Count */}

        <div
          className="
            shrink-0
            rounded-lg
            bg-slate-900
            px-2.5
            py-1
            text-[10px]
            font-bold
            text-slate-400
          "
        >
          {filteredRates.length}
        </div>
      </div>


      {/* =================================================
          RATE FORM
          
          Ref is used for smooth scroll when
          Edit button is clicked.
      ================================================== */}

      <div
        ref={formRef}
        className="
          scroll-mt-4
        "
      >
        <VortaxaRateForm
          rates={allRates}
          editingRate={
            editingRate
          }
          onSave={
            handleSave
          }
          onCancel={
            handleCancel
          }
          saving={
            saving
          }
        />
      </div>


      {/* =================================================
          FILTERS
      ================================================== */}

      <VortaxaRateFilters
        year={year}
        month={month}
        years={years}
        onYearChange={
          setYear
        }
        onMonthChange={
          setMonth
        }
      />


      {/* =================================================
          RATE LIST
      ================================================== */}

      <VortaxaRateList
        rates={
          filteredRates
        }
        onEdit={
          handleEdit
        }
      />
    </div>
  );
}


export default VortaxaRates;
