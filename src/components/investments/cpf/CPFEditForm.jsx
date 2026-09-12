import {
  CalendarDays,
  Percent,
  Save,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getFinancialYearDates,
} from "../../../utils/cpf/cpfHelpers";

function InputField({
  label,
  name,
  value,
  onChange,
  type = "number",
  step = "0.01",
  min = "0",
}) {
  return (
    <label className="block">
      <span
        className="
          mb-1.5
          block
          text-[11px]
          font-semibold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        step={step}
        min={min}
        className="
          w-full
          rounded-xl
          border
          border-slate-700
          bg-slate-800
          px-3.5
          py-3
          text-sm
          font-medium
          text-white
          outline-none
          placeholder:text-slate-600
          transition
          focus:border-slate-500
          focus:bg-slate-750
          focus:ring-2
          focus:ring-slate-700
        "
      />
    </label>
  );
}

function RateField({
  quarter,
  value,
  onChange,
}) {
  const labels = {
    Q1: "Apr – Jun",
    Q2: "Jul – Sep",
    Q3: "Oct – Dec",
    Q4: "Jan – Mar",
  };

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-3.5
      "
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-white">
          {quarter}
        </span>

        <span className="text-[10px] text-slate-500">
          {labels[quarter]}
        </span>
      </div>

      <div className="relative">
        <input
          type="number"
          name={quarter}
          value={value}
          onChange={onChange}
          step="0.01"
          min="0"
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            px-3
            py-3
            pr-9
            text-sm
            font-semibold
            text-white
            outline-none
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-700
          "
          placeholder="0.00"
        />

        <span
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-sm
            font-semibold
            text-slate-500
          "
        >
          %
        </span>
      </div>
    </div>
  );
}

export default function CPFEditForm({
  initialData,
  mode,
  onSave,
  onClose,
  saving = false,
}) {
  const financialYear =
    initialData?.financialYear;

  const dates =
    getFinancialYearDates(
      financialYear
    );

  const [form, setForm] =
    useState({
      financialYear,

      openingBalance:
        initialData?.openingBalance || 0,

      openingDate:
        initialData?.openingDate ||
        dates.startDate,

      closingDate:
        initialData?.closingDate ||
        dates.endDate,

      monthlyContribution:
        initialData?.monthlyContribution ||
        0,

      basicPay:
        initialData?.basicPay || 0,

      interestRates: {
        Q1:
          initialData?.interestRates?.Q1 ||
          0,

        Q2:
          initialData?.interestRates?.Q2 ||
          0,

        Q3:
          initialData?.interestRates?.Q3 ||
          0,

        Q4:
          initialData?.interestRates?.Q4 ||
          0,
      },
    });

  useEffect(() => {
    setForm({
      financialYear,

      openingBalance:
        initialData?.openingBalance || 0,

      openingDate:
        initialData?.openingDate ||
        dates.startDate,

      closingDate:
        initialData?.closingDate ||
        dates.endDate,

      monthlyContribution:
        initialData?.monthlyContribution ||
        0,

      basicPay:
        initialData?.basicPay || 0,

      interestRates: {
        Q1:
          initialData?.interestRates?.Q1 ||
          0,

        Q2:
          initialData?.interestRates?.Q2 ||
          0,

        Q3:
          initialData?.interestRates?.Q3 ||
          0,

        Q4:
          initialData?.interestRates?.Q4 ||
          0,
      },
    });
  }, [
    initialData,
    financialYear,
    dates.startDate,
    dates.endDate,
  ]);

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleRateChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      interestRates: {
        ...previous.interestRates,
        [name]: value,
      },
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      ...form,

      openingBalance:
        Number(
          form.openingBalance
        ) || 0,

      monthlyContribution:
        Number(
          form.monthlyContribution
        ) || 0,

      basicPay:
        Number(
          form.basicPay
        ) || 0,

      interestRates: {
        Q1:
          Number(
            form.interestRates.Q1
          ) || 0,

        Q2:
          Number(
            form.interestRates.Q2
          ) || 0,

        Q3:
          Number(
            form.interestRates.Q3
          ) || 0,

        Q4:
          Number(
            form.interestRates.Q4
          ) || 0,
      },
    });
  }

  const isOwn =
    mode === "own";

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-black/70
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[94vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-3xl
          border
          border-slate-700
          bg-slate-900
          text-white
          shadow-2xl
          sm:max-w-2xl
          sm:rounded-3xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-700
            bg-slate-900
            px-5
            py-4
          "
        >
          <div>
            <h2 className="text-lg font-bold text-white">
              Edit {isOwn ? "Own CPF" : "NVS CPF"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Financial Year{" "}
              {financialYear}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-slate-800
              text-slate-400
              transition
              hover:bg-slate-700
              hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="
            overflow-y-auto
            p-5
            sm:p-6
          "
        >
          {/* Account */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">
                Account Details
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Enter the CPF opening and contribution details.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="Opening Balance"
                name="openingBalance"
                value={
                  form.openingBalance
                }
                onChange={
                  handleChange
                }
              />

              <InputField
                label="Opening Date"
                name="openingDate"
                type="date"
                value={
                  form.openingDate
                }
                onChange={
                  handleChange
                }
                step={undefined}
              />

              <InputField
                label="Closing Date"
                name="closingDate"
                type="date"
                value={
                  form.closingDate
                }
                onChange={
                  handleChange
                }
                step={undefined}
              />

              {isOwn ? (
                <InputField
                  label="Monthly Contribution"
                  name="monthlyContribution"
                  value={
                    form.monthlyContribution
                  }
                  onChange={
                    handleChange
                  }
                />
              ) : (
                <InputField
                  label="Basic Pay"
                  name="basicPay"
                  value={
                    form.basicPay
                  }
                  onChange={
                    handleChange
                  }
                />
              )}
            </div>
          </section>

          {/* Divider */}
          <div className="my-6 h-px bg-slate-800" />

          {/* Rates */}
          <section>
            <div className="mb-4 flex items-start gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-800
                  text-slate-300
                "
              >
                <Percent size={17} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Quarterly Interest Rates
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Enter separate annual rates for each quarter.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <RateField
                quarter="Q1"
                value={
                  form.interestRates.Q1
                }
                onChange={
                  handleRateChange
                }
              />

              <RateField
                quarter="Q2"
                value={
                  form.interestRates.Q2
                }
                onChange={
                  handleRateChange
                }
              />

              <RateField
                quarter="Q3"
                value={
                  form.interestRates.Q3
                }
                onChange={
                  handleRateChange
                }
              />

              <RateField
                quarter="Q4"
                value={
                  form.interestRates.Q4
                }
                onChange={
                  handleRateChange
                }
              />
            </div>
          </section>

          {/* FY Info */}
          <div
            className="
              mt-6
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-slate-700
              bg-slate-800
              p-4
            "
          >
            <CalendarDays
              size={17}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <div>
              <p className="text-xs font-semibold text-slate-300">
                Financial Year
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {dates.startDate}
                {" → "}
                {dates.endDate}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-3
              border-t
              border-slate-800
              pt-5
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3
                text-sm
                font-semibold
                text-slate-300
                transition
                hover:bg-slate-700
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-slate-900
                transition
                hover:bg-slate-200
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}