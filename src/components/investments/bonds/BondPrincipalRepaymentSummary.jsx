
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  IndianRupee,
  WalletCards,
} from "lucide-react";

import { useState } from "react";

// ==================================================
// DATE STATUS
// ==================================================

function isRepaymentPaid(date) {
  if (!date) return false;

  const repaymentDate = new Date(date);
  const today = new Date();

  repaymentDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return repaymentDate <= today;
}

// ==================================================
// SAFE DATE KEY
// ==================================================

function getDateKey(date) {
  if (!date) return "unknown";

  if (date instanceof Date) {
    return date.getTime();
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.getTime();
}

// ==================================================
// COMPONENT
// ==================================================

function BondPrincipalRepaymentSummary({
  principalSummary,
  formatCurrency,
  formatDate,
}) {
  const [isExpanded, setIsExpanded] =
    useState(false);

  // ==================================================
  // VALIDATION
  // ==================================================

  if (
    !principalSummary?.repayments ||
    principalSummary.repayments.length === 0
  ) {
    return null;
  }

  // ==================================================
  // COUNTS
  // ==================================================

  const totalRepayments =
    principalSummary.repayments.length;

  const paidRepayments =
    principalSummary.repayments.filter(
      (repayment) =>
        isRepaymentPaid(repayment.date)
    );

  const upcomingRepayments =
    principalSummary.repayments.filter(
      (repayment) =>
        !isRepaymentPaid(repayment.date)
    );

  const paidCount = paidRepayments.length;

  const upcomingCount =
    upcomingRepayments.length;

  // ==================================================
  // TOTALS
  // ==================================================

  const totalPrincipalPaid =
    Number(
      principalSummary.totalPrincipalPaid
    ) || 0;

  const remainingPrincipal =
    Number(
      principalSummary.remainingPrincipal
    ) || 0;

  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      className="
        mx-4
        mb-4
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-950
        shadow-sm
        sm:mx-5
      "
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <button
        type="button"
        onClick={() =>
          setIsExpanded((prev) => !prev)
        }
        aria-expanded={isExpanded}
        className="
          group
          flex
          w-full
          items-center
          justify-between
          gap-3
          px-4
          py-4
          text-left
          transition
          hover:bg-slate-900/60
          active:bg-slate-900
          sm:px-5
        "
      >
        {/* LEFT SIDE */}

        <div className="min-w-0 flex-1">
          {/* TITLE */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-emerald-500/10
                text-emerald-400
              "
            >
              <WalletCards size={16} />
            </div>

            <div className="min-w-0">
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <h3
                  className="
                    text-sm
                    font-bold
                    text-slate-100
                  "
                >
                  Principal Repayments
                </h3>


              </div>

            </div>
          </div>

          {/* MINI STATUS */}

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            {/* PAID */}

            {paidCount > 0 && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-emerald-500/10
                  px-2
                  py-1
                  text-[10px]
                  font-medium
                  text-emerald-400
                "
              >
                <CheckCircle2 size={11} />

                {paidCount} Paid
              </span>
            )}

            {/* UPCOMING */}

            {upcomingCount > 0 && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-amber-500/10
                  px-2
                  py-1
                  text-[10px]
                  font-medium
                  text-amber-400
                "
              >
                <Clock3 size={11} />

                {upcomingCount} Upcoming
              </span>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            sm:gap-3
          "
        >
          {/* REMAINING */}



          {/* CHEVRON */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-800
              bg-slate-900
              text-slate-500
              transition
              group-hover:border-slate-700
              group-hover:text-slate-300
            "
          >
            {isExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>
      </button>

      {/* ==================================================
          EXPANDABLE CONTENT
      ================================================== */}

      <div
        className={`
          grid
          transition-all
          duration-300
          ease-in-out
          ${
            isExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="min-h-0 overflow-hidden">
          {/* ==================================================
              CONTENT
          ================================================== */}

          <div
            className="
              border-t
              border-slate-800
              px-3
              py-3
              sm:px-4
              sm:py-4
            "
          >
            {/* ==================================================
                REPAYMENT LIST
            ================================================== */}

            <div className="space-y-2.5">
              {principalSummary.repayments.map(
                (repayment, index) => {
                  const isPaid =
                    isRepaymentPaid(
                      repayment.date
                    );

                  return (
                    <div
                      key={`${getDateKey(
                        repayment.date
                      )}-${index}`}
                      className={`
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        p-3
                        transition
                        sm:px-4
                        ${
                          isPaid
                            ? `
                              border-emerald-500/10
                              bg-emerald-500/[0.035]
                            `
                            : `
                              border-amber-500/10
                              bg-amber-500/[0.035]
                            `
                        }
                      `}
                    >
                      {/* STATUS LINE */}

                      <div
                        className={`
                          absolute
                          left-0
                          top-0
                          h-full
                          w-0.5
                          ${
                            isPaid
                              ? "bg-emerald-400"
                              : "bg-amber-400"
                          }
                        `}
                      />

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                        "
                      >
                        {/* LEFT */}

                        <div className="min-w-0">
                          {/* DATE */}

                          <p
                            className="
                              text-sm
                              font-bold
                              text-slate-200
                            "
                          >
                            {formatDate(
                              repayment.date
                            )}
                          </p>

                          {/* STATUS */}

                          <div
                            className="
                              mt-1.5
                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >
                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1
                                rounded-full
                                px-2
                                py-0.5
                                text-[9px]
                                font-semibold
                                ${
                                  isPaid
                                    ? `
                                      bg-emerald-500/10
                                      text-emerald-400
                                    `
                                    : `
                                      bg-amber-500/10
                                      text-amber-400
                                    `
                                }
                              `}
                            >
                              {isPaid ? (
                                <CheckCircle2
                                  size={10}
                                />
                              ) : (
                                <Clock3
                                  size={10}
                                />
                              )}

                              {isPaid
                                ? "Paid"
                                : "Upcoming"}
                            </span>

                            <span
                              className="
                                text-[9px]
                                text-slate-600
                              "
                            >
                              Principal payment #
                              {index + 1}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT */}

                        <div
                          className="
                            shrink-0
                            text-right
                          "
                        >
                          {/* AMOUNT */}

                          <p
                            className={`
                              text-sm
                              font-bold
                              sm:text-base
                              ${
                                isPaid
                                  ? "text-emerald-400"
                                  : "text-amber-400"
                              }
                            `}
                          >
                            {formatCurrency(
                              repayment.amount
                            )}
                          </p>

                          {/* BALANCE */}

                          <p
                            className="
                              mt-1
                              text-[9px]
                              text-slate-600
                            "
                          >
                            Balance{" "}
                            <span
                              className="
                                font-medium
                                text-slate-500
                              "
                            >
                              {formatCurrency(
                                repayment.remainingPrincipal
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div
              className="
                mt-3
                rounded-xl
                border
                border-slate-800
                bg-slate-900/70
                p-3
                sm:p-4
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
                {/* LEFT */}

                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-600
                    "
                  >
                    Total Principal Paid
                  </p>

                  <p
                    className="
                      mt-1
                      text-base
                      font-bold
                      text-white
                      sm:text-lg
                    "
                  >
                    {formatCurrency(
                      totalPrincipalPaid
                    )}
                  </p>
                </div>

                {/* RIGHT */}

                <div
                  className="
                    text-right
                  "
                >
                  <p
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-wide
                      text-slate-600
                    "
                  >
                    Remaining
                  </p>

                  <p
                    className="
                      mt-1
                      text-base
                      font-bold
                      text-amber-400
                      sm:text-lg
                    "
                  >
                    {formatCurrency(
                      remainingPrincipal
                    )}
                  </p>
                </div>
              </div>

              {/* PROGRESS */}

              <div className="mt-3">
                <div
                  className="
                    mb-1.5
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-[9px]
                      text-slate-600
                    "
                  >
                    Principal recovery
                  </span>

                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-slate-500
                    "
                  >
                    {totalPrincipalPaid +
                      remainingPrincipal >
                    0
                      ? (
                          (totalPrincipalPaid /
                            (totalPrincipalPaid +
                              remainingPrincipal)) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </span>
                </div>

                <div
                  className="
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-slate-800
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-emerald-500
                      transition-all
                      duration-500
                    "
                    style={{
                      width: `${
                        totalPrincipalPaid +
                          remainingPrincipal >
                        0
                          ? Math.min(
                              100,
                              (totalPrincipalPaid /
                                (totalPrincipalPaid +
                                  remainingPrincipal)) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BondPrincipalRepaymentSummary;
