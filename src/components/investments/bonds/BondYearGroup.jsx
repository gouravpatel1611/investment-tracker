import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Circle,
} from "lucide-react";

import {
  useState,
} from "react";

import BondInterestPayment
  from "./BondInterestPayment";

// ==================================================
// CURRENCY
// ==================================================

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value) || 0
  );
}

// ==================================================
// STATUS ICON
// ==================================================

function StatusIcon({
  status,
}) {
  if (status === "Paid") {
    return (
      <CheckCircle2
        size={14}
        className="text-emerald-400"
      />
    );
  }

  if (status === "Running") {
    return (
      <Clock3
        size={14}
        className="text-amber-400"
      />
    );
  }

  return (
    <Circle
      size={14}
      className="text-slate-600"
    />
  );
}

// ==================================================
// COMPONENT
// ==================================================

function BondYearGroup({
  yearData,
  defaultOpen = false,
}) {
  const [
    open,
    setOpen,
  ] = useState(
    defaultOpen
  );

  return (
    <div
      className="
        border-b
        border-slate-800
        last:border-b-0
      "
    >
      {/* =========================================
          YEAR HEADER
      ========================================= */}

      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="
          flex
          w-full
          items-center
          justify-between
          gap-3
          px-3
          py-3.5
          text-left
          transition
          hover:bg-slate-800/40
          sm:px-4
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          <div
            className={`
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-xs
              font-bold
              ${
                yearData.status ===
                "Paid"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : yearData.status ===
                    "Running"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-slate-800 text-slate-400"
              }
            `}
          >
            {String(
              yearData.year
            ).slice(-2)}
          </div>

          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <p
                className="
                  text-sm
                  font-bold
                  text-slate-200
                "
              >
                {yearData.year}
              </p>

              <span
                className="
                  text-[10px]
                  text-slate-600
                "
              >
                {yearData.payments.length}{" "}
                {yearData.payments.length ===
                1
                  ? "payment"
                  : "payments"}
              </span>
            </div>

            <p
              className="
                mt-0.5
                text-[10px]
                text-slate-500
              "
            >
              Received{" "}
              {formatCurrency(
                yearData.receivedInterest
              )}
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-3
          "
        >
          <div className="text-right">
            <p
              className="
                text-[10px]
                text-slate-600
              "
            >
              Remaining
            </p>

            <p
              className="
                text-xs
                font-semibold
                text-amber-400
              "
            >
              {formatCurrency(
                yearData.remainingInterest
              )}
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-1
            "
          >
            <StatusIcon
              status={
                yearData.status
              }
            />

            <span
              className={`
                hidden
                text-[10px]
                font-medium
                sm:block
                ${
                  yearData.status ===
                  "Paid"
                    ? "text-emerald-400"
                    : yearData.status ===
                      "Running"
                    ? "text-amber-400"
                    : "text-slate-500"
                }
              `}
            >
              {yearData.status}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`
              text-slate-500
              transition-transform
              ${
                open
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </div>
      </button>

      {/* =========================================
          PAYMENTS
      ========================================= */}

      {open && (
        <div
          className="
            border-t
            border-slate-800
          "
        >
          {yearData.payments.map(
            (
              payment,
              index
            ) => (
              <BondInterestPayment
                key={`${yearData.year}-${index}`}
                payment={
                  payment
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default BondYearGroup;