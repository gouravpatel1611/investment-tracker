
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Percent,
  Save,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  formatDate,
} from "../../../utils/vortaxa/vortaxaFormatters";


/* =========================================================
   DATE HELPERS
========================================================= */

function getTodayDate() {
  const date = new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function parseDate(
  dateString
) {
  if (!dateString) {
    return null;
  }

  const [
    year,
    month,
    day,
  ] = String(
    dateString
  )
    .split("-")
    .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day
  );
}


function formatDateInput(
  date
) {
  if (!date) {
    return "";
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function changeDate(
  dateString,
  days
) {
  const date =
    parseDate(
      dateString
    );

  if (!date) {
    return dateString;
  }

  date.setDate(
    date.getDate() + days
  );

  return formatDateInput(
    date
  );
}


/* =========================================================
   DISPLAY DATE
   Example:
   2026-09-23
   =>
   23 Sep 2026
========================================================= */

function formatDisplayDate(
  dateString
) {
  if (!dateString) {
    return "Select Date";
  }

  const date =
    parseDate(
      dateString
    );

  if (!date) {
    return "Select Date";
  }

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  const month =
    date.toLocaleString(
      "en-US",
      {
        month: "short",
      }
    );

  const year =
    date.getFullYear();

  return `${day} ${month} ${year}`;
}


/* =========================================================
   COMPONENT
========================================================= */

function VortaxaRateForm({
  rates = [],
  editingRate = null,
  onSave,
  onCancel,
  saving = false,
}) {
  const today =
    getTodayDate();


  /* =======================================================
     DATE PICKER REF
  ======================================================= */

  const dateInputRef =
    useRef(null);


  /* =======================================================
     DATE
  ======================================================= */

  const [
    date,
    setDate,
  ] = useState(
    editingRate?.date ||
      today
  );


  /* =======================================================
     RATE
  ======================================================= */

  const [
    rate,
    setRate,
  ] = useState("0");


  /* =======================================================
     ORIGINAL RATE
     
     Used to determine whether user actually changed
     the current rate before pressing Previous / Next.
  ======================================================= */

  const [
    originalRate,
    setOriginalRate,
  ] = useState("0");


  /* =======================================================
     ERROR
  ======================================================= */

  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     FIND RATE FOR SELECTED DATE
  ======================================================= */

  const selectedRate =
    useMemo(() => {
      if (!date) {
        return null;
      }

      return (
        rates.find(
          (item) =>
            String(
              item?.date || ""
            ) === date
        ) || null
      );
    }, [
      rates,
      date,
    ]);


  /* =======================================================
     LOAD RATE WHEN DATE CHANGES
     
     Existing rate:
       load saved value
     
     Missing rate:
       show 0
  ======================================================= */

  useEffect(() => {
    const currentValue =
      selectedRate
        ? String(
            selectedRate.rate ??
              0
          )
        : "0";

    setRate(
      currentValue
    );

    setOriginalRate(
      currentValue
    );

    setError("");
  }, [
    selectedRate,
    date,
  ]);


  /* =======================================================
     EDIT MODE
     
     When opened from the list, jump to that date.
  ======================================================= */

  useEffect(() => {
    if (
      editingRate?.date
    ) {
      setDate(
        editingRate.date
      );
    }
  }, [
    editingRate,
  ]);


  /* =======================================================
     DISPLAY DATE
     
     Stored value:
       2026-09-23
     
     Display:
       23 Sep 2026
  ======================================================= */

  const displayDate =
    formatDisplayDate(
      date
    );


  /* =======================================================
     NEXT / PREVIOUS DATE
  ======================================================= */

  const previousDate =
    date
      ? changeDate(
          date,
          -1
        )
      : "";

  const nextDate =
    date
      ? changeDate(
          date,
          1
        )
      : "";


  const canGoPrevious =
    Boolean(
      previousDate
    );


  const canGoNext =
    Boolean(
      nextDate &&
        nextDate <= today
    );


  /* =======================================================
     VALIDATE CURRENT RATE
  ======================================================= */

  const validateRate =
    () => {
      if (!date) {
        setError(
          "Please select a date."
        );

        return null;
      }

      if (
        date > today
      ) {
        setError(
          "Future dates are not allowed."
        );

        return null;
      }

      if (
        rate === "" ||
        Number.isNaN(
          Number(rate)
        )
      ) {
        setError(
          "Please enter a valid daily rate."
        );

        return null;
      }

      const rateValue =
        Number(rate);

      if (
        rateValue < 0
      ) {
        setError(
          "Rate cannot be negative."
        );

        return null;
      }

      return rateValue;
    };


  /* =======================================================
     SAVE CURRENT RATE
     
     This is also used by Previous / Next.
     
     Important:
     If the user did not change the rate,
     nothing is saved.
  ======================================================= */

  const saveCurrentRate =
    async () => {
      const rateValue =
        validateRate();

      if (
        rateValue === null
      ) {
        return false;
      }


      const originalValue =
        Number(
          originalRate || 0
        );


      /*
       * No change.
       * Don't call Firebase/localStorage.
       */

      if (
        rateValue ===
        originalValue
      ) {
        return true;
      }


      try {
        await onSave({
          ...(selectedRate || {}),
          date,
          rate:
            rateValue,
        });

        /*
         * Current value is now saved.
         */

        setOriginalRate(
          String(
            rateValue
          )
        );

        setRate(
          String(
            rateValue
          )
        );

        return true;

      } catch (error) {
        setError(
          error?.message ||
            "Failed to save daily rate."
        );

        return false;
      }
    };


  /* =======================================================
     CHANGE DATE
     
     First save current rate.
     Then move to the requested date.
  ======================================================= */

  const moveToDate =
    async (
      newDate
    ) => {
      if (
        saving ||
        !newDate
      ) {
        return;
      }

      if (
        newDate > today
      ) {
        return;
      }


      setError("");


      /*
       * Save current rate first.
       */

      const saved =
        await saveCurrentRate();

      if (!saved) {
        return;
      }


      /*
       * Now move to the new date.
       */

      setDate(
        newDate
      );
    };


  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrevious =
    async () => {
      if (
        !canGoPrevious
      ) {
        return;
      }

      await moveToDate(
        previousDate
      );
    };


  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext =
    async () => {
      if (
        !canGoNext
      ) {
        return;
      }

      await moveToDate(
        nextDate
      );
    };


  /* =======================================================
     DATE PICKER
     
     Date picker change also saves the current rate first.
  ======================================================= */

  const handleDateChange =
    async (
      event
    ) => {
      const newDate =
        event.target.value;

      if (!newDate) {
        return;
      }

      if (
        newDate > today
      ) {
        setError(
          "Future dates are not allowed."
        );

        return;
      }

      if (
        newDate === date
      ) {
        return;
      }


      setError("");


      /*
       * Save current date before changing date.
       */

      const saved =
        await saveCurrentRate();

      if (!saved) {
        return;
      }


      setDate(
        newDate
      );
    };


  /* =======================================================
     OPEN DATE PICKER
  ======================================================= */

  const openDatePicker =
    () => {
      if (
        saving
      ) {
        return;
      }

      const input =
        dateInputRef.current;

      if (!input) {
        return;
      }

      /*
       * Modern browsers
       */

      if (
        typeof input.showPicker ===
        "function"
      ) {
        input.showPicker();
        return;
      }

      /*
       * Fallback
       */

      input.focus();

      input.click();
    };


  /* =======================================================
     RATE CHANGE
  ======================================================= */

  const handleRateChange =
    (event) => {
      setRate(
        event.target.value
      );

      setError("");
    };


  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      setError("");

      const rateValue =
        validateRate();

      if (
        rateValue === null
      ) {
        return;
      }


      /*
       * Save even when value is unchanged.
       * This gives the user explicit Save behavior.
       */

      try {
        await onSave({
          ...(selectedRate || {}),
          date,
          rate:
            rateValue,
        });

        setOriginalRate(
          String(
            rateValue
          )
        );

        setRate(
          String(
            rateValue
          )
        );

        /*
         * If opened through Edit button,
         * close edit mode after explicit save.
         */

        if (
          editingRate &&
          onCancel
        ) {
          onCancel();
        }

      } catch (error) {
        setError(
          error?.message ||
            "Failed to save daily rate."
        );
      }
    };


  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel =
    () => {
      if (saving) {
        return;
      }

      if (onCancel) {
        onCancel();
      }
    };


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        mb-4
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-4
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
            Daily Rate
          </p>

          <p
            className="
              mt-0.5
              text-[10px]
              text-slate-500
            "
          >
            Select a date and update its rate
          </p>
        </div>


        {editingRate && (
          <button
            type="button"
            onClick={
              handleCancel
            }
            disabled={saving}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-slate-700
              bg-slate-900
              text-slate-400
              transition
              hover:border-slate-600
              hover:bg-slate-700
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Cancel edit"
          >
            <X
              className="
                h-4
                w-4
              "
            />
          </button>
        )}
      </div>


      <form
        onSubmit={
          handleSubmit
        }
      >
        {/* =================================================
            DATE SELECTOR
        ================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            p-3
          "
        >
          <div
            className="
              mb-2
              flex
              items-center
              justify-between
            "
          >
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Selected Date
            </p>


            {selectedRate && (
              <span
                className="
                  rounded-full
                  bg-orange-500/10
                  px-2
                  py-0.5
                  text-[9px]
                  font-bold
                  text-orange-300
                "
              >
                Saved
              </span>
            )}
          </div>


          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {/* =============================================
                PREVIOUS
            ============================================== */}

            <button
              type="button"
              onClick={
                handlePrevious
              }
              disabled={
                saving ||
                !canGoPrevious
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
                text-slate-400
                transition
                hover:border-slate-600
                hover:bg-slate-700
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Previous day"
            >
              <ChevronLeft
                className="
                  h-5
                  w-5
                "
              />
            </button>


            {/* =============================================
                DATE PICKER
            ============================================== */}

            <div
              className="
                relative
                min-w-0
                flex-1
              "
            >
              {/* Visible formatted date */}

              <button
                type="button"
                onClick={
                  openDatePicker
                }
                disabled={
                  saving
                }
                className="
                  relative
                  flex
                  h-10
                  w-full
                  items-center
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-800
                  px-3
                  pl-10
                  pr-3
                  text-left
                  text-xs
                  font-bold
                  text-white
                  outline-none
                  transition
                  hover:border-slate-600
                  focus:border-orange-500/60
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <CalendarDays
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-orange-300
                  "
                />

                <span>
                  {displayDate}
                </span>
              </button>


              {/* Actual native date picker */}

              <input
                ref={
                  dateInputRef
                }
                type="date"
                value={date}
                max={today}
                onChange={
                  handleDateChange
                }
                disabled={
                  saving
                }
                tabIndex={-1}
                aria-label="Select date"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  h-full
                  w-full
                  opacity-0
                "
              />
            </div>


            {/* =============================================
                NEXT
            ============================================== */}

            <button
              type="button"
              onClick={
                handleNext
              }
              disabled={
                saving ||
                !canGoNext
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
                text-slate-400
                transition
                hover:border-slate-600
                hover:bg-slate-700
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Next day"
            >
              <ChevronRight
                className="
                  h-5
                  w-5
                "
              />
            </button>
          </div>


          {/* Formatted date */}

          <p
            className="
              mt-2
              text-center
              text-[11px]
              font-semibold
              text-slate-400
            "
          >
            {displayDate}
          </p>
        </div>


        {/* =================================================
            RATE INPUT
        ================================================== */}

        <div
          className="
            mt-3
          "
        >
          <label
            className="
              mb-1.5
              block
              text-[10px]
              font-semibold
              text-slate-400
            "
          >
            Daily Rate (%)
          </label>


          <div
            className="
              relative
            "
          >
            <Percent
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-orange-300
              "
            />


            <input
              type="number"
              step="0.01"
              min="0"
              value={rate}
              onChange={
                handleRateChange
              }
              placeholder="0.00"
              disabled={
                saving
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-3
                pl-10
                text-sm
                font-extrabold
                text-orange-300
                outline-none
                placeholder:text-slate-600
                focus:border-orange-500/60
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />
          </div>


          <p
            className="
              mt-1.5
              text-[10px]
              text-slate-500
            "
          >
            Example:
            {" "}
            <span
              className="
                font-semibold
                text-slate-400
              "
            >
              0.15
            </span>
            {" "}
            means 0.15%.
          </p>
        </div>


        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="
              mt-3
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              px-3
              py-2.5
              text-xs
              font-semibold
              text-red-300
            "
          >
            {error}
          </div>
        )}


        {/* =================================================
            SAVE
        ================================================== */}

        <button
          type="submit"
          disabled={
            saving
          }
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-orange-500
            px-4
            py-2.5
            text-xs
            font-extrabold
            text-white
            transition
            hover:bg-orange-400
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Save
            className="
              h-4
              w-4
            "
          />

          {saving
            ? "Saving..."
            : "Save Rate"}
        </button>
      </form>
    </div>
  );
}


export default VortaxaRateForm;
