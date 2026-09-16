import {
  CalendarDays,
  IndianRupee,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLicPli,
} from "../../context/LicPliContext";

import {
  calculateTotalPaid,
} from "../../utils/licPli/licPliCalculations";

import { useNavigate } from "react-router-dom";

/* =================================================
   INITIAL FORM
   ================================================= */

function getInitialForm(policy) {
  if (policy) {
    return {
      type: policy.type || "lic",

      policyNo:
        policy.policyNo || "",

      schemeName:
        policy.schemeName || "",

      premiumAmount:
        policy.premiumAmount || "",

      installmentPaid:
        policy.installmentPaid || "",

      gstAmountPaid:
        policy.gstAmountPaid || "",

      premiumDate:
        policy.premiumDate || "",

      maturityDate:
        policy.maturityDate || "",
    };
  }

  return {
    type: "lic",

    policyNo: "",

    schemeName: "",

    premiumAmount: "",

    installmentPaid: "",

    gstAmountPaid: "",

    premiumDate: "",

    maturityDate: "",
  };
}


/* =================================================
   MAIN FORM
   ================================================= */

export default function LicPliForm({
  editingPolicy,
  onClose,
}) {
  const {
    addPolicy,
    updatePolicy,
  } = useLicPli();

  const [form, setForm] = useState(
    getInitialForm(editingPolicy)
  );

  useEffect(() => {
    setForm(
      getInitialForm(editingPolicy)
    );
  }, [editingPolicy]);


  /* =================================================
     TOTAL PAID
     Premium × Installments + GST
     ================================================= */

  const totalPaid = calculateTotalPaid(
    form.premiumAmount,
    form.installmentPaid,
    form.gstAmountPaid
  );


  /* =================================================
     HANDLE CHANGE
     ================================================= */

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  /* =================================================
     SUBMIT
     ================================================= */

    function handleSubmit(event) {
      event.preventDefault();

      if (
        !form.policyNo.trim() ||
        !form.schemeName.trim()
      ) {
        return;
      }

      const policyData = {
        ...form,
        totalPaid: totalPaid,
      };

      if (editingPolicy) {
        updatePolicy(
          editingPolicy.id,
          policyData
        );
      } else {
        addPolicy(policyData);
      }

      onClose();
    }

    const navigate = useNavigate();


  return (
    <div className="pb-5">

      {/* =================================================
         MAIN FORM CARD
         ================================================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          via-slate-900
          to-slate-950
          shadow-2xl
        "
      >

        {/* =================================================
           TOP COLOR GLOW
           ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            -right-12
            -top-12
            h-32
            w-32
            rounded-full
            bg-indigo-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-16
            top-24
            h-28
            w-28
            rounded-full
            bg-cyan-500/5
            blur-3xl
          "
        />


        <div className="relative p-4">

          {/* =================================================
             HEADER
             ================================================= */}

          <div
            className="
              mb-4
              flex
              items-center
              justify-between
              gap-3
              border-b
              border-slate-800
              pb-3
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-2.5
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-indigo-500/20
                  bg-indigo-500/10
                  text-indigo-400
                "
              >
                <ShieldCheck size={18} />
              </div>


              <div className="min-w-0">

                <h2
                  className="
                    truncate
                    text-[15px]
                    font-bold
                    text-white
                  "
                >
                  {editingPolicy
                    ? "Edit Policy"
                    : "Add Policy"}
                </h2>


                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-white
                  "
                >
                  {editingPolicy
                    ? "Update policy details"
                    : "Enter your policy details"}
                </p>

              </div>

            </div>


            {/* =================================================
               CLOSE BUTTON
               ================================================= */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-700
                bg-slate-800/80
                text-white
                transition
                hover:bg-slate-700
                hover:text-white
                active:scale-95
              "
            >
              <X size={16} />
            </button>

          </div>


          {/* =================================================
             FORM
             ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-3"
          >

            {/* =================================================
               TYPE
               ================================================= */}

            <Field label="Type">

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputClass}
              >

                <option value="lic">
                  LIC
                </option>

                <option value="pli">
                  PLI
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </Field>


            {/* =================================================
               POLICY NUMBER
               ================================================= */}

            <Field label="Policy No.">

              <input
                type="text"
                name="policyNo"
                value={form.policyNo}
                onChange={handleChange}
                placeholder="Enter policy number"
                className={inputClass}
              />

            </Field>


            {/* =================================================
               SCHEME NAME
               ================================================= */}

            <Field label="Scheme Name">

              <input
                type="text"
                name="schemeName"
                value={form.schemeName}
                onChange={handleChange}
                placeholder="Enter scheme name"
                className={inputClass}
              />

            </Field>


            {/* =================================================
               PREMIUM + INSTALLMENTS
               ================================================= */}

            <div
              className="
                grid
                grid-cols-2
                gap-2.5
              "
            >

              {/* Premium Amount */}

              <Field label="Premium Amount">

                <div className="relative">

                  <IndianRupee
                    size={14}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-indigo-400
                    "
                  />

                  <input
                    type="number"
                    name="premiumAmount"
                    value={form.premiumAmount}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />

                </div>

              </Field>


              {/* Installment Paid */}

              <Field label="Installment Paid">

                <input
                  type="number"
                  name="installmentPaid"
                  value={form.installmentPaid}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className={inputClass}
                />

              </Field>

            </div>


            {/* =================================================
               GST AMOUNT PAID
               ================================================= */}

            <Field label="GST Amount Paid">

              <div className="relative">

                <IndianRupee
                  size={14}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-indigo-400
                  "
                />

                <input
                  type="number"
                  name="gstAmountPaid"
                  value={form.gstAmountPaid}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className={`${inputClass} pl-8`}
                />

              </div>

            </Field>


            {/* =================================================
               TOTAL PAID
               ================================================= */}

            <div
              className="
                relative
                overflow-hidden
                rounded-xl
                border
                border-emerald-500/20
                bg-gradient-to-r
                from-emerald-500/10
                via-emerald-500/5
                to-transparent
                px-3
                py-2.5
              "
            >

              <div
                className="
                  absolute
                  right-0
                  top-0
                  h-full
                  w-20
                  bg-emerald-500/5
                  blur-xl
                "
              />


              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <div>

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-emerald-400/70
                    "
                  >
                    Total Paid
                  </p>


                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-white
                    "
                  >
                    Premium × Installments + GST
                  </p>

                </div>


                <p
                  className="
                    text-lg
                    font-bold
                    tracking-tight
                    text-emerald-400
                  "
                >
                  ₹
                  {totalPaid.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

            </div>


            {/* =================================================
               DATES SECTION
               ================================================= */}

            <div
              className="
                rounded-xl
                border
                border-slate-800
                bg-slate-950/60
                p-3
              "
            >

              {/* Section Header */}

              <div
                className="
                  mb-2.5
                  flex
                  items-center
                  gap-2
                "
              >

                <CalendarDays
                  size={14}
                  className="text-cyan-400"
                />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                  "
                >
                  Policy Dates
                </p>

              </div>


              <div
                className="
                  grid
                  grid-cols-2
                  gap-2.5
                "
              >

                {/* Premium Date */}

                <DatePickerField
                  label="Premium Date"
                  value={form.premiumDate}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      premiumDate: value,
                    }))
                  }
                />


                {/* Maturity Date */}

                <DatePickerField
                  label="Maturity Date"
                  value={form.maturityDate}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      maturityDate: value,
                    }))
                  }
                />

              </div>

            </div>


            {/* =================================================
               SAVE BUTTON
               ================================================= */}

            <button
              type="submit"
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-indigo-400/20
                bg-gradient-to-r
                from-indigo-500
                to-violet-500
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-indigo-500/20
                transition
                hover:brightness-110
                active:scale-[0.98]
              "
            >

              <Save size={17} />

              {editingPolicy
                ? "Update Policy"
                : "Save Policy"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}


/* =================================================
   DATE PICKER FIELD
   ================================================= */

function DatePickerField({
  label,
  value,
  onChange,
}) {
  const inputRef = useRef(null);


  /*
    Convert:
    2026-09-14

    to:

    14/Sep/2026
  */

  function formatDisplayDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(
      `${dateValue}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )
      .format(date)
      .replace(/ /g, "/");
  }


  /*
    Open browser native date picker
  */

  function openDatePicker(event) {
    event.preventDefault();

    const input = inputRef.current;

    if (!input) {
      return;
    }


    /*
      Chrome / Edge / modern browsers
    */

    if (
      typeof input.showPicker === "function"
    ) {
      try {
        input.showPicker();
        return;
      } catch (error) {
        // Fallback below
      }
    }


    /*
      Fallback
    */

    input.focus();

    input.click();
  }


  return (
    <Field label={label}>

      <div
        className="
          relative
          cursor-pointer
        "
        onMouseDown={openDatePicker}
      >

        {/* =================================================
           FORMATTED DATE DISPLAY
           ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-between
            rounded-xl
            bg-slate-950
            px-3
            text-sm
            text-white
          "
        >

          <span>

            {value ? (
              formatDisplayDate(value)
            ) : (
              <span className="text-white">
                Select date
              </span>
            )}

          </span>


          {/* Calendar Icon */}

          <CalendarDays
            size={15}
            className="text-white"
          />

        </div>


        {/* =================================================
           ACTUAL NATIVE DATE INPUT
           ================================================= */}

        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="
            relative
            z-0
            h-10
            w-full
            cursor-pointer
            rounded-xl
            border
            border-slate-700
            bg-slate-950
            px-3
            text-sm
            text-transparent
            outline-none
            focus:border-indigo-500/60
            focus:ring-1
            focus:ring-indigo-500/20
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
            [&::-webkit-calendar-picker-indicator]:opacity-0
          "
        />

      </div>

    </Field>
  );
}


/* =================================================
   FIELD
   ================================================= */

function Field({
  label,
  children,
}) {
  return (
    <label className="block">

      <span
        className="
          mb-1.5
          block
          text-[9px]
          font-bold
          uppercase
          tracking-wider
          text-white
        "
      >
        {label}
      </span>

      {children}

    </label>
  );
}


/* =================================================
   INPUT STYLE
   ================================================= */

const inputClass = `
  h-10
  w-full
  rounded-xl
  border
  border-slate-700
  bg-slate-950
  px-3
  text-sm
  text-white
  outline-none
  transition
  placeholder:text-white
  focus:border-indigo-500/60
  focus:bg-slate-900
  focus:ring-1
  focus:ring-indigo-500/20
`;