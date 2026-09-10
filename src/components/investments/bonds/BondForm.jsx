
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  IndianRupee,
  Save,
  X,
} from "lucide-react";

import { addBond } from "../../../services/firebase/bondService";

/* =================================================
   HELPERS
================================================= */

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value) => {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) return "";

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

/* =================================================
   OPTIONS
================================================= */

const BOND_TYPE_OPTIONS = [
  "Corporate Bond",
  "NCD",
  "Government Bond",
  "State Government Bond",
  "Tax-Free Bond",
  "Floating Rate Bond",
  "Zero Coupon Bond",
  "Other",
];

const FREQUENCY_OPTIONS = [
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

/* =================================================
   INPUT FIELD
================================================= */

function InputField({
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
      <label className="block text-xs font-medium text-slate-300">
        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {prefix && (
          <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500">
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
          className={`h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 ${
            prefix ? "pl-9" : ""
          } ${
            suffix ? "pr-14" : ""
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* =================================================
   SELECT FIELD
================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-11 w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 px-3 pr-10 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
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
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
}

/* =================================================
   DATE PICKER
================================================= */

function DatePickerField({
  label,
  value,
  onChange,
  required = false,
  min,
}) {
  const inputRef = useRef(null);

  const openPicker = () => {
    if (!inputRef.current) return;

    if (
      typeof inputRef.current.showPicker ===
      "function"
    ) {
      inputRef.current.showPicker();
    } else {
      inputRef.current.focus();
      inputRef.current.click();
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">
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
        className="relative flex h-11 w-full items-center rounded-xl border border-slate-700 bg-slate-900 px-3 text-left outline-none transition hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
      >
        <CalendarDays
          size={17}
          className="mr-2.5 shrink-0 text-emerald-400"
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
          onChange={(e) =>
            onChange(e.target.value)
          }
          required={required}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          tabIndex={-1}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

/* =================================================
   SECTION CARD
================================================= */

function SectionCard({
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      <div className="p-4">
        {children}
      </div>
    </section>
  );
}

/* =================================================
   BOND FORM
================================================= */

function BondForm() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    bondName: "",
    isin: "",

    purchaseDate: getToday(),

    quantity: "1",
    faceValue: "",
    purchaseValue: "",

    couponRate: "",
    couponFrequency: "monthly",

    maturityDate: "",
    firstPayoutDate: "",
  });

  /* =================================================
     UPDATE FIELD
  ================================================= */

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  /* =================================================
     SAVE
  ================================================= */

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  /* ---------- Required validation ---------- */

  if (!form.bondName.trim()) {
    setError("Please enter bond name.");
    return;
  }


  if (!form.purchaseDate) {
    setError("Please select purchase date.");
    return;
  }

  if (!form.quantity || Number(form.quantity) <= 0) {
    setError("Please enter valid quantity.");
    return;
  }

  if (!form.faceValue || Number(form.faceValue) <= 0) {
    setError("Please enter valid face value.");
    return;
  }

  if (!form.purchaseValue || Number(form.purchaseValue) <= 0) {
    setError("Please enter valid purchase Value.");
    return;
  }






  /* ---------- Final data ---------- */

  const bondData = {
    ...form,
    couponRate: Number(form.couponRate) || 0,
  };

  try {
    setSaving(true);

    /* ---------- Save to Firebase ---------- */

    const savedBond = await addBond(bondData);

    console.log("Bond saved:", savedBond);

    /* ---------- Success ---------- */

    alert("Bond saved successfully! 🎉");

    // Alert close hone ke baad bonds page
    navigate("/bonds");

  } catch (err) {
    console.error("Failed to save bond:", err);

    setError(
      "Bond save nahi ho paya. Please try again."
    );
  } finally {
    setSaving(false);
  }
};





  /* =================================================
     CANCEL
  ================================================= */

  const handleCancel = () => {
    navigate(-1);
  };

  /* =================================================
     UI
  ================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 pb-24"
    >
      {/* =========================================
          BASIC DETAILS
      ========================================= */}

      <SectionCard>
        <div className="space-y-4">
          <InputField
            label="Bond Name"
            value={form.bondName}
            onChange={(value) =>
              updateField(
                "bondName",
                value
              )
            }
            placeholder="e.g. ABC Finance NCD"
            required
          />


          <InputField
            label="ISIN"
            value={form.isin}
            onChange={(value) =>
              updateField(
                "isin",
                value.toUpperCase()
              )
            }
            placeholder="e.g. INE123A01012"
          />

        </div>
      </SectionCard>

      {/* =========================================
          PURCHASE DETAILS
      ========================================= */}

      <SectionCard
        title="Purchase Details"
        subtitle="Enter your purchase information"
      >
        <div className="space-y-4">
          <DatePickerField
            label="Purchase Date"
            value={form.purchaseDate}
            onChange={(value) =>
              updateField(
                "purchaseDate",
                value
              )
            }
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Quantity"
              value={form.quantity}
              onChange={(value) =>
                updateField(
                  "quantity",
                  value
                )
              }
              type="number"
              placeholder="1"
              required
            />

            <InputField
              label="Face Value"
              value={form.faceValue}
              onChange={(value) =>
                updateField(
                  "faceValue",
                  value
                )
              }
              type="number"
              placeholder="1000"
              prefix={
                <IndianRupee size={14} />
              }
              required
            />
          </div>

          <InputField
            label="Purchase Value"
            value={form.purchaseValue}
            onChange={(value) =>
              updateField(
                "purchaseValue",
                value
              )
            }
            type="number"
            placeholder="980"
            prefix={
              <IndianRupee size={14} />
            }
            required
          />
        </div>
      </SectionCard>

      {/* =========================================
          INTEREST DETAILS
      ========================================= */}

      <SectionCard
        title="Interest Details"
        subtitle="Configure coupon and interest"
      >
        <div className="space-y-4">
          <InputField
            label="Coupon Rate"
            value={form.couponRate}
            onChange={(value) =>
              updateField(
                "couponRate",
                value
              )
            }
            type="number"
            placeholder="8.50"
            suffix="% p.a."
          />

          <SelectField
            label="Coupon Frequency"
            value={
              form.couponFrequency
            }
            onChange={(value) =>
              updateField(
                "couponFrequency",
                value
              )
            }
            options={FREQUENCY_OPTIONS}
          />
        </div>
      </SectionCard>

      {/* =========================================
          ISSUE & MATURITY
      ========================================= */}

      <SectionCard
        title=" Maturity"
        subtitle="Bond lifecycle dates"
      >
        <div className="space-y-4">
          <DatePickerField
            label="Maturity Date"
            value={form.maturityDate}
            onChange={(value) =>
              updateField(
                "maturityDate",
                value
              )
            }
            min={
              form.purchaseDate || undefined
            }
          />
        </div>
        <div className="space-y-4 mt-3">
          <DatePickerField
            label="First Payout Date"
            value={form.firstPayoutDate}
            onChange={(value) =>
              updateField(
                "firstPayoutDate",
                value
              )
            }
            min={
              form.purchaseDate || undefined
            }
          />
        </div>
      </SectionCard>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* =========================================
          ACTION BUTTONS
      ========================================= */}

      <div className="sticky bottom-0 z-40 -mx-3 border-t border-slate-800 bg-slate-950/95 p-3 backdrop-blur-md sm:-mx-5">
        <div className="mx-auto flex max-w-3xl gap-3">
          {/* CANCEL */}

          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
            Cancel
          </button>

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            className="flex h-12 flex-[1.5] items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Bond"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BondForm;

