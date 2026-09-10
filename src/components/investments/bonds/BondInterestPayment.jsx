import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Circle,
} from "lucide-react";

// ==================================================
// FORMAT
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

function formatDate(value) {
  if (!value) return "-";

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

// ==================================================
// STATUS
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

function BondInterestPayment({
  payment,
}) {
  return (
    <div
      className="
        border-t
        border-slate-800
        bg-slate-950/60
        px-3
        py-3
        sm:px-4
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
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <CalendarDays
              size={13}
              className="
                shrink-0
                text-slate-500
              "
            />

            <p
              className="
                text-xs
                font-semibold
                text-slate-200
              "
            >
              {formatDate(
                payment.date
              )}
            </p>

            {payment.isMaturityPayment && (
              <span
                className="
                  rounded-md
                  bg-blue-500/10
                  px-1.5
                  py-0.5
                  text-[9px]
                  font-semibold
                  text-blue-400
                "
              >
                MATURITY
              </span>
            )}
          </div>

          <p
            className="
              mt-1
              text-[10px]
              text-slate-600
            "
          >
            {formatDate(
              payment.periodStart
            )}
            {" → "}
            {formatDate(
              payment.periodEnd
            )}
            {" • "}
            {payment.days} days
          </p>

          {payment.principalAtStart !==
            undefined && (
            <p
              className="
                mt-1
                text-[10px]
                text-slate-600
              "
            >
              Principal:{" "}
              {formatCurrency(
                payment.principalAtStart
              )}
            </p>
          )}
        </div>

        {/* RIGHT */}

        <div
          className="
            shrink-0
            text-right
          "
        >
          <p
            className="
              text-sm
              font-bold
              text-white
            "
          >
            {formatCurrency(
              payment.interest
            )}
          </p>

          <div
            className="
              mt-1
              flex
              items-center
              justify-end
              gap-1
            "
          >
            <StatusIcon
              status={
                payment.status
              }
            />

            <span
              className={`
                text-[10px]
                font-medium
                ${
                  payment.status ===
                  "Paid"
                    ? "text-emerald-400"
                    : payment.status ===
                      "Running"
                    ? "text-amber-400"
                    : "text-slate-500"
                }
              `}
            >
              {payment.status}
            </span>
          </div>
        </div>
      </div>

      {/* REPAYMENT SPLIT INFO */}

      {payment.segments &&
        payment.segments.length >
          1 && (
          <div
            className="
              mt-3
              rounded-lg
              border
              border-slate-800
              bg-slate-900/60
              px-3
              py-2
            "
          >
            <p
              className="
                mb-2
                text-[10px]
                font-medium
                text-slate-500
              "
            >
              Interest calculation split
            </p>

            <div className="space-y-1.5">
              {payment.segments.map(
                (
                  segment,
                  index
                ) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      text-[10px]
                    "
                  >
                    <span className="text-slate-500">
                      {formatDate(
                        segment.start
                      )}
                      {" → "}
                      {formatDate(
                        segment.end
                      )}
                    </span>

                    <span className="text-slate-400">
                      ₹
                      {Number(
                        segment.principal
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span className="font-medium text-slate-300">
                      {formatCurrency(
                        segment.interest
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default BondInterestPayment;