import {
  ChevronDown,
  ChevronUp,
  Edit3,
  Landmark,
  Percent,
  Wallet,
  CalendarDays,
  PiggyBank,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
  formatPercent,
} from "../../../utils/cpf/cpfHelpers";

import CPFMonthlyTable from "./CPFMonthlyTable";


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


export default function OwnCPFCard({
  data,
  calculation,
  averageInterestRate,
  expanded,
  onToggle,
  onEdit,
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-blue-800/60
        bg-slate-900
        shadow-lg
        shadow-blue-950/10
      "
    >

      {/* =====================================================
          CARD HEADER
      ====================================================== */}
      <div
        className="
          border-b
          border-blue-900/50
          bg-blue-950/10
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
                bg-blue-900/40
                text-blue-300
              "
            >
              <Wallet size={19} />
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
                Own CPF
              </h2>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-blue-300/70
                "
              >
                Personal Contribution
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
              border-blue-700/60
              bg-blue-950/40
              px-2.5
              py-1.5
              text-[11px]
              font-semibold
              text-blue-200
              transition
              hover:border-blue-600
              hover:bg-blue-900/50
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
            border-blue-800/60
            bg-gradient-to-r
            from-blue-950/50
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
                  text-blue-300/80
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
                  border-blue-700/60
                  bg-blue-950/50
                  px-2
                  py-1
                  text-[10px]
                  font-semibold
                  text-blue-200
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
          DETAILS - 2 COLUMN
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

        {/* Opening Balance */}
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


        {/* Opening Date */}
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


        {/* Interest on Opening */}
        <InfoItem
          label="Opening Int."
          value={formatCurrency(
            calculation?.interestOnOpeningBalance
          )}
          type="interest"
          icon={
            <Percent size={13} />
          }
        />


        {/* Deposit During Year */}
        <InfoItem
          label="Year Deposit"
          value={formatCurrency(
            calculation?.totalDeposit
          )}
          type="deposit"
          icon={
            <Wallet size={13} />
          }
        />


        {/* Interest on Deposit */}
        <InfoItem
          label="Deposit Int."
          value={formatCurrency(
            calculation?.interestOnDeposits
          )}
          type="interest"
          icon={
            <Percent size={13} />
          }
        />


        {/* Total Interest */}
        <InfoItem
          label="Total Int."
          value={formatCurrency(
            calculation?.totalInterest
          )}
          type="interest"
          icon={
            <PiggyBank size={13} />
          }
        />


        {/* Monthly Contribution */}
        <InfoItem
          label="Monthly"
          value={formatCurrency(
            data?.monthlyContribution
          )}
          type="contribution"
          icon={
            <Wallet size={13} />
          }
        />


        {/* Closing Date */}
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


      {/* =====================================================
          MONTHLY EXPANDABLE SECTION
      ====================================================== */}
      <div
        className="
          border-t
          border-blue-900/50
        "
      >

        {/* EXPAND BUTTON */}
        <button
          type="button"
          onClick={onToggle}
          className="
            flex
            w-full
            items-center
            justify-between
            px-4
            py-3
            text-sm
            font-semibold
            text-slate-200
            transition
            hover:bg-blue-950/20
            sm:px-5
          "
        >

          <div>
            <p
              className="
                text-left
                text-xs
                font-semibold
                text-blue-200
              "
            >
              Monthly Deposit & Interest
            </p>

            <p
              className="
                mt-0.5
                text-left
                text-[10px]
                font-normal
                text-slate-500
              "
            >
              12 month calculation
            </p>
          </div>


          {/* ARROW */}
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-blue-950/50
              text-blue-300
            "
          >
            {expanded ? (
              <ChevronUp size={17} />
            ) : (
              <ChevronDown size={17} />
            )}
          </div>

        </button>


        {/* MONTHLY TABLE */}
        {expanded && (
          <div
            className="
              px-3.5
              pb-4
              sm:px-4
            "
          >
            <CPFMonthlyTable
              monthlyDetails={
                calculation?.monthlyDetails
              }
            />
          </div>
        )}

      </div>

    </section>
  );
}