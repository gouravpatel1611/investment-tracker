
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  Percent,
  Save,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useIntFd,
} from "../../context/IntFdContext";

/* =========================================================
   TODAY
========================================================= */

function getToday() {
  const date =
    new Date();

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

/* =========================================================
   ADD ONE YEAR - ONE DAY

   Example:

   01 Apr 2026
        ↓
   31 Mar 2027
========================================================= */

function addOneYear(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date =
    new Date(
      `${dateValue}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  date.setFullYear(
    date.getFullYear() + 1
  );

  date.setDate(
    date.getDate() - 1
  );

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

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  step,
}) {
  return (
    <div>
      <label
        className="
          mb-2
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-slate-300
        "
      >
        <Icon size={15} />

        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-slate-700
          bg-slate-900
          px-4
          text-sm
          font-medium
          text-white
          outline-none
          transition
          placeholder:text-slate-600
          focus:border-slate-500
          focus:ring-2
          focus:ring-slate-700
        "
      />
    </div>
  );
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(value) {
  if (!value) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] = value.split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* =========================================================
   DATE PICKER
========================================================= */

function DatePickerField({
  label,
  value,
  onChange,
}) {
  const inputRef =
    useRef(null);

  function openPicker() {
    if (!inputRef.current) {
      return;
    }

    if (
      typeof inputRef.current.showPicker ===
      "function"
    ) {
      inputRef.current.showPicker();
    } else {
      inputRef.current.focus();
    }
  }

  return (
    <div>
      <label
        className="
          mb-2
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-slate-300
        "
      >
        <CalendarDays size={15} />

        {label}
      </label>

      <div className="relative">

        <div
          className="
            flex
            h-12
            w-full
            items-center
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            px-4
            text-sm
            font-medium
            text-white
          "
        >
          {formatDate(value)}
        </div>

        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          onClick={openPicker}
          className="
            absolute
            inset-0
            h-full
            w-full
            cursor-pointer
            opacity-0
          "
        />

      </div>
    </div>
  );
}

/* =========================================================
   FORM
========================================================= */

export default function IntFdForm({
  fdId = null,
}) {

  const {
    fds,
    addFd,
    updateFd,
  } = useIntFd();

  /* =======================================================
     EXISTING FD
  ======================================================= */

  const existingFd =
    fdId
      ? fds.find(
          (fd) =>
            fd.id === fdId
        )
      : null;

  const isEdit =
    Boolean(existingFd);

  /* =======================================================
     SAVING STATE
  ======================================================= */

  const [
    saving,
    setSaving,
  ] = useState(false);

  /* =======================================================
     FORM
  ======================================================= */

  const [
    form,
    setForm,
  ] = useState({
    fundName: "",
    principal: "",
    interestRate: "",
    openingDate:
      getToday(),
    closingDate:
      addOneYear(
        getToday()
      ),
  });

  /* =======================================================
     LOAD EXISTING FD FOR EDIT
  ======================================================= */

  useEffect(() => {

    if (!existingFd) {
      return;
    }

    setForm({
      fundName:
        existingFd.fundName ||
        "",

      principal:
        existingFd.principal ??
        "",

      interestRate:
        existingFd.interestRate ??
        "",

      openingDate:
        existingFd.openingDate ||
        "",

      closingDate:
        existingFd.closingDate ||
        "",
    });

  }, [
    existingFd,
  ]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  function updateField(
    field,
    value
  ) {
    setForm(
      (prev) => ({
        ...prev,
        [field]: value,
      })
    );
  }

  /* =======================================================
     OPENING DATE CHANGE
  ======================================================= */

  function handleOpeningDateChange(
    value
  ) {
    setForm(
      (prev) => ({
        ...prev,

        openingDate:
          value,

        closingDate:
          addOneYear(value),
      })
    );
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    /* -----------------------------------------------
       FUND NAME
    ----------------------------------------------- */

    if (
      !form.fundName.trim()
    ) {
      alert(
        "Please enter fund name."
      );

      return;
    }

    /* -----------------------------------------------
       PRINCIPAL
    ----------------------------------------------- */

    if (
      !form.principal ||
      Number(form.principal) <= 0
    ) {
      alert(
        "Please enter a valid principal."
      );

      return;
    }

    /* -----------------------------------------------
       INTEREST RATE
    ----------------------------------------------- */

    if (
      !form.interestRate ||
      Number(form.interestRate) <= 0
    ) {
      alert(
        "Please enter a valid interest rate."
      );

      return;
    }

    /* -----------------------------------------------
       OPENING DATE
    ----------------------------------------------- */

    if (!form.openingDate) {
      alert(
        "Please select opening date."
      );

      return;
    }

    /* -----------------------------------------------
       CLOSING DATE
    ----------------------------------------------- */

    if (!form.closingDate) {
      alert(
        "Please select closing date."
      );

      return;
    }

    /* -----------------------------------------------
       DATE VALIDATION
    ----------------------------------------------- */

    if (
      new Date(
        `${form.closingDate}T00:00:00`
      ) <=
      new Date(
        `${form.openingDate}T00:00:00`
      )
    ) {
      alert(
        "Closing date must be after opening date."
      );

      return;
    }

    /* =================================================
       DATA TO FIREBASE
    ================================================= */

    const data = {
      fundName:
        form.fundName.trim(),

      principal:
        Number(
          form.principal
        ),

      interestRate:
        Number(
          form.interestRate
        ),

      openingDate:
        form.openingDate,

      closingDate:
        form.closingDate,
    };

    /* =================================================
       SAVE
    ================================================= */

    try {

      setSaving(true);

      /* -----------------------------------------------
         EDIT
      ----------------------------------------------- */

      if (isEdit) {

        await updateFd(
          existingFd.id,
          data
        );

      }

      /* -----------------------------------------------
         ADD
      ----------------------------------------------- */

      else {

        await addFd(
          data
        );

      }

      /* -----------------------------------------------
         SUCCESS
      ----------------------------------------------- */

      window.location.href =
        "/int-fd";

    } catch (error) {

      console.error(
        "Failed to save INT-FD:",
        error
      );

      alert(
        error?.message ||
          "Failed to save Fixed Deposit."
      );

      setSaving(false);
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-white
        pb-10
        pt-5
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-xl
        "
      >

        {/* =================================================
            TOP
        ================================================= */}

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
          "
        >

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/int-fd")
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
              bg-slate-900
              text-slate-300
              transition
              hover:bg-slate-800
            "
          >
            <ArrowLeft
              size={18}
            />
          </button>

          <div>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-slate-500
              "
            >
              INT-FD
            </p>

            <h1
              className="
                text-xl
                font-bold
                text-slate-950
              "
            >
              {isEdit
                ? "Edit Fixed Deposit"
                : "Add Fixed Deposit"}
            </h1>

          </div>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-700
            bg-slate-950
            shadow-xl
          "
        >

          <div
            className="
              space-y-5
              p-5
            "
          >

            {/* Fund Name */}

            <InputField
              label="Fund Name"
              icon={CalendarDays}
              value={
                form.fundName
              }
              onChange={(
                event
              ) =>
                updateField(
                  "fundName",
                  event.target.value
                )
              }
              placeholder="e.g. SBI FD"
            />

            {/* Principal */}

            <InputField
              label="Principal"
              icon={IndianRupee}
              type="number"
              value={
                form.principal
              }
              onChange={(
                event
              ) =>
                updateField(
                  "principal",
                  event.target.value
                )
              }
              placeholder="Enter principal amount"
              min="0"
              step="1"
            />

            {/* Interest Rate */}

            <InputField
              label="Interest Rate"
              icon={Percent}
              type="number"
              value={
                form.interestRate
              }
              onChange={(
                event
              ) =>
                updateField(
                  "interestRate",
                  event.target.value
                )
              }
              placeholder="e.g. 7.00"
              min="0"
              step="0.01"
            />

            {/* Opening Date */}

            <DatePickerField
              label="Opening Date"
              value={
                form.openingDate
              }
              onChange={
                handleOpeningDateChange
              }
            />

            {/* Closing Date */}

            <DatePickerField
              label="Closing Date"
              value={
                form.closingDate
              }
              onChange={(
                value
              ) =>
                updateField(
                  "closingDate",
                  value
                )
              }
            />

            {/* =================================================
                SUBMIT BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={saving}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-white
                text-sm
                font-bold
                text-slate-950
                transition
                hover:bg-slate-200
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              <Save
                size={18}
              />

              {saving
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                  ? "Update FD"
                  : "Save FD"}

            </button>

          </div>
        </form>
      </div>
    </main>
  );
}

