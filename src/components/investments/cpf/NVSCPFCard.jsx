import {
  Building2,
  CalendarDays,
  Edit3,
  Landmark,
  Percent,
  Wallet,
  BriefcaseBusiness,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
  formatPercent,
} from "../../../utils/cpf/cpfHelpers";

function InfoItem({
  label,
  value,
  icon,
  type = "default",
}) {
  const styles = {
    opening: {
      wrapper:
        "border-blue-900/60 bg-blue-950/30",
      icon:
        "bg-blue-900/50 text-blue-300",
      label:
        "text-blue-300",
      value:
        "text-blue-100",
    },

    interest: {
      wrapper:
        "border-amber-900/60 bg-amber-950/30",
      icon:
        "bg-amber-900/50 text-amber-300",
      label:
        "text-amber-300",
      value:
        "text-amber-100",
    },

    deposit: {
      wrapper:
        "border-violet-900/60 bg-violet-950/30",
      icon:
        "bg-violet-900/50 text-violet-300",
      label:
        "text-violet-300",
      value:
        "text-violet-100",
    },

    pay: {
      wrapper:
        "border-cyan-900/60 bg-cyan-950/30",
      icon:
        "bg-cyan-900/50 text-cyan-300",
      label:
        "text-cyan-300",
      value:
        "text-cyan-100",
    },

    contribution: {
      wrapper:
        "border-emerald-900/60 bg-emerald-950/30",
      icon:
        "bg-emerald-900/50 text-emerald-300",
      label:
        "text-emerald-300",
      value:
        "text-emerald-100",
    },

    date: {
      wrapper:
        "border-slate-700 bg-slate-800/70",
      icon:
        "bg-slate-700 text-slate-300",
      label:
        "text-slate-400",
      value:
        "text-slate-100",
    },

    default: {
      wrapper:
        "border-slate-700 bg-slate-800/70",
      icon:
        "bg-slate-700 text-slate-300",
      label:
        "text-slate-400",
      value:
        "text-slate-100",
    },
  };

  const currentStyle =
    styles[type] || styles.default;

  return (
    <div
      className={`
        min-w-0
        rounded-xl
        border
        px-3
        py-2.5
        ${currentStyle.wrapper}
      `}
    >
      <div
        className={`
          flex
          items-center
          gap-1.5
          text-[10px]
          font-medium
          uppercase
          tracking-wide
          ${currentStyle.label}
        `}
      >
        <span
          className={`
            flex
            h-6
            w-6
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${currentStyle.icon}
          `}
        >
          {icon}
        </span>

        <span className="truncate">
          {label}
        </span>
      </div>

      <p
        className={`
          mt-1.5
          truncate
          text-sm
          font-bold
          leading-tight
          ${currentStyle.value}
        `}
      >
        {value}
      </p>
    </div>
  );
}

export default function NVSCPFCard({
  data,
  calculation,
  averageInterestRate,
  onEdit,
}) {
  /*
   * NVS CPF:
   *
   * Basic Pay × 10%
   * = Monthly Contribution
   *
   * Monthly Contribution × 12
   * = Year Contribution
   *
   * Contribution par interest nahi.
   *
   * Isliye:
   *
   * Total Interest
   * =
   * Opening Balance Interest
   */

  const monthlyContribution =
    Number(
      calculation?.contribution ??
        calculation?.monthlyDeposit ??
        0
    ) || 0;

  const annualContribution =
    Number(
      calculation?.totalDeposit
    ) || 0;

  const openingInterest =
    Number(
      calculation?.interestOnOpeningBalance
    ) || 0;

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-violet-800/60
        bg-slate-900
        shadow-lg
        shadow-violet-950/10
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          border-b
          border-violet-900/50
          bg-violet-950/10
          p-4
          sm:p-5
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          {/* TITLE */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-violet-900/40
                text-violet-300
              "
            >
              <Building2 size={19} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-base
                  font-bold
                  text-white
                  sm:text-lg
                "
              >
                NVS CPF
              </h2>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-violet-300/70
                "
              >
                NVS Contribution
              </p>
            </div>
          </div>

          {/* EDIT */}

          <button
            type="button"
            onClick={onEdit}
            className="
              inline-flex
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              border
              border-violet-700/60
              bg-violet-950/40
              px-2.5
              py-1.5
              text-[11px]
              font-semibold
              text-violet-200
              transition
              hover:border-violet-600
              hover:bg-violet-900/50
              active:scale-95
            "
          >
            <Edit3 size={13} />

            <span>
              Edit
            </span>
          </button>
        </div>

        {/* =================================================
            CLOSING BALANCE
        ================================================== */}

        <div
          className="
            mt-4
            rounded-xl
            border
            border-violet-800/60
            bg-gradient-to-r
            from-violet-950/50
            to-slate-800
            px-4
            py-3.5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            {/* BALANCE */}

            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wide
                  text-violet-300/80
                "
              >
                Closing
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-bold
                  leading-tight
                  text-white
                  sm:text-2xl
                "
              >
                {formatCurrency(
                  calculation?.closingBalance
                )}
              </p>
            </div>

            {/* RATE + DATE */}

            <div
              className="
                shrink-0
                text-right
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-lg
                  border
                  border-violet-700/60
                  bg-violet-950/50
                  px-2
                  py-1
                  text-[10px]
                  font-semibold
                  text-violet-200
                "
              >
                <Percent size={11} />

                Avg.{" "}
                {formatPercent(
                  averageInterestRate
                )}
              </div>

              <p
                className="
                  mt-1.5
                  text-[10px]
                  text-slate-500
                "
              >
                {formatDate(
                  data?.closingDate
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          DETAILS
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-2.5
          p-3.5
          sm:gap-3
          sm:p-4
        "
      >
        {/* 1. OPENING BALANCE */}

        <InfoItem
          label="Opening"
          value={formatCurrency(
            data?.openingBalance
          )}
          type="opening"
          icon={
            <Landmark size={13} />
          }
        />

        {/* 2. OPENING DATE */}

        <InfoItem
          label="Open Date"
          value={formatDate(
            data?.openingDate
          )}
          type="date"
          icon={
            <CalendarDays size={13} />
          }
        />

        {/* 3. OPENING INTEREST */}

        <InfoItem
          label="Opening Int."
          value={formatCurrency(
            openingInterest
          )}
          type="interest"
          icon={
            <Percent size={13} />
          }
        />

        {/* 4. BASIC PAY */}

        <InfoItem
          label="Basic Pay"
          value={formatCurrency(
            data?.basicPay
          )}
          type="pay"
          icon={
            <BriefcaseBusiness
              size={13}
            />
          }
        />

        {/* 5. MONTHLY CONTRIBUTION */}

        <InfoItem
          label="Monthly Contribution"
          value={formatCurrency(
            monthlyContribution
          )}
          type="contribution"
          icon={
            <Wallet size={13} />
          }
        />

        {/* 6. YEAR CONTRIBUTION */}

        <InfoItem
          label="Year Contribution"
          value={formatCurrency(
            annualContribution
          )}
          type="deposit"
          icon={
            <Wallet size={13} />
          }
        />

        {/* 7. CLOSE DATE */}

        <InfoItem
          label="Close Date"
          value={formatDate(
            data?.closingDate
          )}
          type="date"
          icon={
            <CalendarDays size={13} />
          }
        />
      </div>
    </section>
  );
}