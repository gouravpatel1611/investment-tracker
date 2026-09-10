import {
  CalendarDays,
  IndianRupee,
  Plus,
  Trash2,
} from "lucide-react";

// ==================================================
// DATE FORMAT
// ==================================================

function formatDisplayDate(value) {
  if (!value) return "";

  const [year, month, day] =
    value.split("-");

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

// ==================================================
// COMPONENT
// ==================================================

function BondPrincipalRepayments({
  repayments,
  setRepayments,
  minDate,
  maxDate,
}) {
  // ==================================================
  // ADD
  // ==================================================

  const addRepayment = () => {
    setRepayments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        date: "",
        amount: "",
      },
    ]);
  };

  // ==================================================
  // UPDATE
  // ==================================================

  const updateRepayment = (
    id,
    field,
    value
  ) => {
    setRepayments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // ==================================================
  // DELETE
  // ==================================================

  const removeRepayment = (id) => {
    setRepayments((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  // ==================================================
  // TOTAL
  // ==================================================

  const totalRepayment =
    repayments.reduce(
      (sum, item) =>
        sum +
        (Number(item.amount) || 0),
      0
    );

  // ==================================================
  // UI
  // ==================================================

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-950
      "
    >
      <div className="p-4">

        {/* =========================================
            HEADER
        ========================================= */}

        <div
          className="
            mb-4
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div>
            <h3
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              Principal Repayments
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
              "
            >
              Add partial principal payments
              made during the bond period.
            </p>
          </div>

          <button
            type="button"
            onClick={addRepayment}
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              border
              border-emerald-500/30
              bg-emerald-500/10
              px-3
              py-2
              text-xs
              font-medium
              text-emerald-400
              transition
              hover:bg-emerald-500/20
              active:scale-95
            "
          >
            <Plus size={15} />
            Add
          </button>
        </div>

        {/* =========================================
            EMPTY
        ========================================= */}

        {repayments.length === 0 && (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-800
              bg-slate-900/50
              px-4
              py-6
              text-center
            "
          >
            <p
              className="
                text-sm
                text-slate-500
              "
            >
              No principal repayment added
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-600
              "
            >
              If the bond has partial
              repayments, add them here.
            </p>
          </div>
        )}

        {/* =========================================
            LIST
        ========================================= */}

        <div className="space-y-3">
          {repayments.map(
            (item, index) => (
              <div
                key={item.id}
                className="
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900
                  p-3
                "
              >
                {/* HEADER */}

                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-xs
                      font-medium
                      text-slate-400
                    "
                  >
                    Repayment #{index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeRepayment(
                        item.id
                      )
                    }
                    className="
                      rounded-lg
                      p-1.5
                      text-slate-500
                      transition
                      hover:bg-red-500/10
                      hover:text-red-400
                    "
                    aria-label="Remove repayment"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* FIELDS */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  {/* DATE */}

                  <div className="space-y-1.5">
                    <label
                      className="
                        block
                        text-xs
                        font-medium
                        text-slate-400
                      "
                    >
                      Repayment Date
                    </label>

                    <div className="relative">
                      <CalendarDays
                        size={16}
                        className="
                          pointer-events-none
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-emerald-400
                        "
                      />

                      <input
                        type="date"
                        value={item.date}
                        min={minDate}
                        max={maxDate}
                        onChange={(e) =>
                          updateRepayment(
                            item.id,
                            "date",
                            e.target.value
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
                          text-sm
                          text-white
                          outline-none
                          transition
                          focus:border-emerald-500
                          focus:ring-2
                          focus:ring-emerald-500/10
                        "
                      />
                    </div>

                    {item.date && (
                      <p
                        className="
                          text-[11px]
                          text-slate-600
                        "
                      >
                        {formatDisplayDate(
                          item.date
                        )}
                      </p>
                    )}
                  </div>

                  {/* AMOUNT */}

                  <div className="space-y-1.5">
                    <label
                      className="
                        block
                        text-xs
                        font-medium
                        text-slate-400
                      "
                    >
                      Principal Paid
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
                        value={item.amount}
                        onChange={(e) =>
                          updateRepayment(
                            item.id,
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
                          transition
                          focus:border-emerald-500
                          focus:ring-2
                          focus:ring-emerald-500/10
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* =========================================
            TOTAL
        ========================================= */}

        {repayments.length > 0 && (
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-slate-800
              bg-slate-900
              px-3.5
              py-3
            "
          >
            <span
              className="
                text-xs
                text-slate-400
              "
            >
              Total Principal Paid
            </span>

            <span
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              ₹
              {totalRepayment.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export default BondPrincipalRepayments;