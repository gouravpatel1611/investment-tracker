
import {
  CalendarDays,
  IndianRupee,
  Plus,
  Trash2,
} from "lucide-react";

/* =========================================================
   DATE FORMAT
   2026-10-25
   ↓
   25/Oct/2026
========================================================= */

function formatDate(value) {
  if (!value) return "";

  const [
    year,
    month,
    day,
  ] = value.split("-");

  if (!year || !month || !day) {
    return "";
  }

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

/* =========================================================
   PRINCIPAL REPAYMENT FORM
========================================================= */

function PrincipalRepaymentForm({
  repayments = [],
  onChange,
  minDate,
  maxDate,
}) {

  /* =======================================================
     ADD REPAYMENT
  ======================================================= */

  const addRepayment = () => {
    onChange([
      ...repayments,
      {
        id: crypto.randomUUID(),
        date: "",
        amount: "",
      },
    ]);
  };

  /* =======================================================
     UPDATE REPAYMENT
  ======================================================= */

  const updateRepayment = (
    id,
    field,
    value
  ) => {
    onChange(
      repayments.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  /* =======================================================
     REMOVE REPAYMENT
  ======================================================= */

  const removeRepayment = (id) => {
    onChange(
      repayments.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  /* =======================================================
     OPEN DATE PICKER
  ======================================================= */

  const openDatePicker = (id) => {
    const input =
      document.getElementById(
        `repayment-date-${id}`
      );

    if (!input) return;

    /*
      showPicker() is supported in modern
      Chrome / Edge browsers.
    */

    if (
      typeof input.showPicker ===
      "function"
    ) {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  return (
    <div className="space-y-3">

      {/* ===================================================
          REPAYMENT LIST
      =================================================== */}

      {repayments.length > 0 && (
        <div className="space-y-2">

          {repayments.map(
            (repayment, index) => (

              <div
                key={
                  repayment.id ||
                  index
                }
                className="
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-900
                  p-3
                "
              >

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="mb-3 flex items-center justify-between">

                  <p className="text-xs font-semibold text-slate-300">
                    Repayment {index + 1}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeRepayment(
                        repayment.id
                      )
                    }
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      text-red-400
                      transition
                      hover:bg-red-500/10
                    "
                    aria-label="Remove repayment"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* =======================================
                      DATE
                  ======================================= */}

                  <div className="space-y-1.5">

                    <label className="block text-xs font-medium text-slate-300">
                      Repayment Date
                    </label>

                    <div className="relative">

                      {/* Calendar icon */}

                      <CalendarDays
                        size={16}
                        className="
                          pointer-events-none
                          absolute
                          left-3
                          top-1/2
                          z-10
                          -translate-y-1/2
                          text-emerald-400
                        "
                      />

                      {/* ===================================
                          VISIBLE DATE

                          DD/MMM/YYYY
                          Example:
                          25/Oct/2026
                      =================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          openDatePicker(
                            repayment.id
                          )
                        }
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-950
                          pl-9
                          pr-3
                          text-left
                          text-sm
                          outline-none
                          transition
                          hover:border-slate-600
                          focus:border-emerald-500
                        "
                      >
                        <span
                          className={
                            repayment.date
                              ? "text-white"
                              : "text-slate-500"
                          }
                        >
                          {repayment.date
                            ? formatDate(
                                repayment.date
                              )
                            : "DD/MMM/YYYY"}
                        </span>
                      </button>

                      {/* ===================================
                          NATIVE DATE PICKER

                          This remains transparent.

                          Clicking the visible button
                          opens this date picker.
                      =================================== */}

                      <input
                        id={`repayment-date-${repayment.id}`}
                        type="date"
                        value={
                          repayment.date ||
                          ""
                        }
                        min={
                          minDate ||
                          undefined
                        }
                        max={
                          maxDate ||
                          undefined
                        }
                        onChange={(e) =>
                          updateRepayment(
                            repayment.id,
                            "date",
                            e.target.value
                          )
                        }
                        className="
                          pointer-events-none
                          absolute
                          left-0
                          top-0
                          h-0
                          w-0
                          opacity-0
                        "
                        tabIndex={-1}
                        aria-hidden="true"
                      />

                    </div>

                    {/* Selected date helper */}

                    {repayment.date && (
                      <p className="text-[10px] text-slate-500">
                        Selected:{" "}
                        {formatDate(
                          repayment.date
                        )}
                      </p>
                    )}

                  </div>

                  {/* =======================================
                      AMOUNT
                  ======================================= */}

                  <div className="space-y-1.5">

                    <label className="block text-xs font-medium text-slate-300">
                      Repayment Amount
                    </label>

                    <div className="relative">

                      <IndianRupee
                        size={14}
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
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          repayment.amount ||
                          ""
                        }
                        onChange={(e) =>
                          updateRepayment(
                            repayment.id,
                            "amount",
                            e.target.value
                          )
                        }
                        placeholder="200000"
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-slate-700
                          bg-slate-950
                          pl-9
                          pr-3
                          text-sm
                          text-white
                          outline-none
                          focus:border-emerald-500
                        "
                      />

                    </div>

                  </div>

                </div>

              </div>

            )
          )}

        </div>
      )}

      {/* ===================================================
          ADD PRINCIPAL REPAYMENT
      =================================================== */}

      <button
        type="button"
        onClick={addRepayment}
        className="
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-dashed
          border-slate-700
          bg-slate-900/60
          text-sm
          font-semibold
          text-emerald-400
          transition
          hover:border-emerald-500/40
          hover:bg-emerald-500/5
        "
      >
        <Plus size={17} />

        Add Principal Repayment
      </button>

    </div>
  );
}

export default PrincipalRepaymentForm;
