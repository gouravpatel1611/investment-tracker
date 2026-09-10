import { useRef } from "react";

import {
  CalendarDays,
  ChevronDown,
  IndianRupee,
} from "lucide-react";

// ==================================================
// DATE FORMAT
// ==================================================

export function formatDisplayDate(value) {
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
// INPUT FIELD
// ==================================================

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  prefix,
  suffix,
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="
          block
          text-xs
          font-medium
          text-slate-300
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {prefix && (
          <div
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              z-10
              -translate-y-1/2
              text-slate-500
            "
          >
            {prefix}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          required={required}
          className={`
            h-11
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            px-3
            text-sm
            text-white
            outline-none
            transition
            placeholder:text-slate-600
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-500/10
            ${prefix ? "pl-9" : ""}
            ${suffix ? "pr-14" : ""}
          `}
        />

        {suffix && (
          <span
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-xs
              text-slate-500
            "
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ==================================================
// SELECT FIELD
// ==================================================

export function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="
          block
          text-xs
          font-medium
          text-slate-300
        "
      >
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            h-11
            w-full
            appearance-none
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            px-3
            pr-10
            text-sm
            text-white
            outline-none
            transition
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-500/10
          "
        >
          {options.map((option) => {
            const item =
              typeof option === "string"
                ? {
                    value: option,
                    label: option,
                  }
                : option;

            return (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={16}
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />
      </div>
    </div>
  );
}

// ==================================================
// DATE PICKER
// ==================================================

export function DatePickerField({
  label,
  value,
  onChange,
  required = false,
  min,
  max,
}) {
  const inputRef = useRef(null);

  const openPicker = () => {
    if (!inputRef.current) return;

    if (
      typeof inputRef.current
        .showPicker === "function"
    ) {
      inputRef.current.showPicker();
    } else {
      inputRef.current.focus();
      inputRef.current.click();
    }
  };

  return (
    <div className="space-y-1.5">
      <label
        className="
          block
          text-xs
          font-medium
          text-slate-300
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}
      </label>

      <button
        type="button"
        onClick={openPicker}
        className="
          relative
          flex
          h-11
          w-full
          items-center
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          px-3
          text-left
          outline-none
          transition
          hover:border-slate-600
          focus:border-emerald-500
          focus:ring-2
          focus:ring-emerald-500/10
        "
      >
        <CalendarDays
          size={17}
          className="
            mr-2.5
            shrink-0
            text-emerald-400
          "
        />

        <span
          className={
            value
              ? "text-sm text-white"
              : "text-sm text-slate-600"
          }
        >
          {value
            ? formatDisplayDate(value)
            : "Select date"}
        </span>

        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) =>
            onChange(e.target.value)
          }
          required={required}
          className="
            pointer-events-none
            absolute
            h-0
            w-0
            opacity-0
          "
          tabIndex={-1}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

// ==================================================
// SECTION CARD
// ==================================================

export function SectionCard({
  children,
}) {
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
        {children}
      </div>
    </section>
  );
}

// ==================================================
// OPTIONS
// ==================================================

export const FREQUENCY_OPTIONS = [
  {
    value: "annual",
    label: "Annual",
  },
  {
    value: "half-yearly",
    label: "Half-Yearly",
  },
  {
    value: "quarterly",
    label: "Quarterly",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "at-maturity",
    label: "At Maturity",
  },
];