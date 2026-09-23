
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  Save,
  X,
} from "lucide-react";

import {
  getTodayDate,
} from "../../../utils/mutualFundUtils";

import {
  formatCurrency,
} from "../../../utils/vortaxa/vortaxaFormatters";


/* =========================================================
   DATE FORMAT
   YYYY-MM-DD
   → DD MMM YYYY
   Example: 2026-09-23 → 23 Sep 2026
========================================================= */

function formatDisplayDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}


function VortaxaTransactionForm({
  onSave,
  onCancel,
  availableEarn = 0,
  saving = false,
  editingTransaction = null,
}) {
  const isEditMode =
    Boolean(editingTransaction);


  /* =========================================================
     DATE INPUT REF
  ========================================================= */

  const dateInputRef =
    useRef(null);


  /* =========================================================
     FORM
  ========================================================= */

  const [form, setForm] =
    useState({
      type: "FULE_ADD",
      date: getTodayDate(),
      amount: "",
    });


  const [error, setError] =
    useState("");


  /* =========================================================
     LOAD EDIT DATA
  ========================================================= */

  useEffect(() => {

    if (!editingTransaction) {

      setForm({
        type: "FULE_ADD",
        date: getTodayDate(),
        amount: "",
      });

      setError("");

      return;
    }


    setForm({
      type:
        editingTransaction.type ||
        "FULE_ADD",

      date:
        editingTransaction.date ||
        getTodayDate(),

      amount:
        editingTransaction.amount ??
        "",
    });

    setError("");

  }, [editingTransaction]);


  /* =========================================================
     CHANGE
  ========================================================= */

  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;


    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));


    setError("");
  }


  /* =========================================================
     OPEN DATE PICKER
  ========================================================= */

  function openDatePicker() {

    if (!dateInputRef.current) {
      return;
    }


    /* Modern browsers */

    if (
      typeof dateInputRef.current
        .showPicker === "function"
    ) {

      dateInputRef.current.showPicker();

      return;
    }


    /* Fallback */

    dateInputRef.current.focus();
  }


  /* =========================================================
     SUBMIT
  ========================================================= */

  function handleSubmit(event) {

    event.preventDefault();

    setError("");


    /* =======================================================
       DATE
    ======================================================= */

    if (!form.date) {

      setError(
        "Please select transaction date."
      );

      return;
    }


    /* =======================================================
       AMOUNT
    ======================================================= */

    const amount =
      Number(form.amount);


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      setError(
        "Please enter a valid amount."
      );

      return;
    }


    /* =======================================================
       EARN WITHDRAWAL VALIDATION
    ======================================================= */

    if (
      form.type ===
        "EARN_WITHDRAW" &&
      !isEditMode &&
      amount >
        Number(
          availableEarn || 0
        )
    ) {

      setError(
        `Available EARN is ${formatCurrency(
          availableEarn
        )}.`
      );

      return;
    }


    /* =======================================================
       SAVE
    ======================================================= */

    onSave({

      ...(editingTransaction || {}),

      type:
        form.type,

      date:
        form.date,

      amount,
    });
  }


  /* =========================================================
     DISPLAY DATE
  ========================================================= */

  const displayDate =
    formatDisplayDate(
      form.date
    );


  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-4
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-base
              font-semibold
              text-white
            "
          >
            {isEditMode
              ? "Edit Transaction"
              : "Add Transaction"}
          </h2>


          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            {isEditMode
              ? "Update transaction details"
              : "Add a new Vortaxa transaction"}
          </p>

        </div>


        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
            "
          >
            <X size={17} />
          </button>
        )}

      </div>


      {/* =====================================================
          TYPE
      ===================================================== */}

      <div className="mb-4">

        <label
          className="
            mb-1.5
            block
            text-xs
            font-medium
            text-slate-300
          "
        >
          Transaction Type
        </label>


        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          disabled={isEditMode}
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-950
            px-3
            py-2.5
            text-sm
            text-white
            outline-none
            focus:border-yellow-400
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          <option value="FULE_ADD">
            FULE Added
          </option>

          <option value="PI_FULE_ADD">
            PI FULE Added
          </option>

          <option value="EARN_WITHDRAW">
            EARN Withdrawal
          </option>

        </select>

      </div>


      {/* =====================================================
          DATE
      ===================================================== */}

      <div className="mb-4">

        <label
          className="
            mb-1.5
            block
            text-xs
            font-medium
            text-slate-300
          "
        >
          Date
        </label>


        <div className="relative">

          {/* Visible formatted date */}

          <button
            type="button"
            onClick={openDatePicker}
            disabled={saving}
            className="
              flex
              h-[42px]
              w-full
              items-center
              rounded-xl
              border
              border-slate-700
              bg-slate-950
              px-3
              text-left
              text-sm
              text-white
              outline-none
              transition
              hover:border-slate-600
              focus:border-yellow-400
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            <CalendarDays
              size={16}
              className="
                mr-3
                shrink-0
                text-slate-500
              "
            />


            <span
              className={
                displayDate
                  ? "text-white"
                  : "text-slate-600"
              }
            >
              {displayDate ||
                "Select date"}
            </span>

          </button>


          {/* =================================================
              REAL DATE INPUT
              Hidden but used for native calendar picker
          ================================================= */}

          <input
            ref={dateInputRef}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            max={getTodayDate()}
            tabIndex={-1}
            aria-hidden="true"
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

      </div>


      {/* =====================================================
          AMOUNT
      ===================================================== */}

      <div className="mb-4">

        <label
          className="
            mb-1.5
            block
            text-xs
            font-medium
            text-slate-300
          "
        >
          Amount
        </label>


        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="Enter amount"
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-950
            px-3
            py-2.5
            text-sm
            text-white
            outline-none
            placeholder:text-slate-600
            focus:border-yellow-400
          "
        />

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="
            mb-4
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-3
            py-2
            text-xs
            text-red-400
          "
        >
          {error}
        </div>
      )}


      {/* =====================================================
          SAVE
      ===================================================== */}

      <button
        type="submit"
        disabled={saving}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-yellow-400
          px-4
          py-2.5
          text-sm
          font-semibold
          text-slate-950
          transition
          hover:bg-yellow-300
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >

        <Save size={16} />

        {saving
          ? "Saving..."
          : isEditMode
            ? "Update Transaction"
            : "Save Transaction"}

      </button>

    </form>
  );
}

export default VortaxaTransactionForm;

