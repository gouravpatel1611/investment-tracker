import {
  IndianRupee,
} from "lucide-react";

import {
  formatCurrency,
} from "../../utils/licPli/licPliFormatters";

export default function LicPliSummaryCard({
  summary,
}) {
  const rows = [
    {
      key: "lic",
      label: "LIC",
    },
    {
      key: "pli",
      label: "PLI",
    },
    {
      key: "other",
      label: "OTHER",
    },
  ];

  return (
    <section
      className="
        mb-4
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-xl
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          border-b
          border-slate-800
          px-4
          py-3
        "
      >
        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-indigo-500/15
            text-indigo-400
          "
        >
          <IndianRupee size={17} />
        </div>

        <div>
          <h2
            className="
              text-sm
              font-bold
              text-white
            "
          >
            Policy Summary
          </h2>

          <p
            className="
              text-[10px]
              text-slate-500
            "
          >
            Premium & total paid
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-800">
        {rows.map((row) => (
          <div
            key={row.key}
            className="
              grid
              grid-cols-[70px_1fr_1fr]
              items-center
              gap-2
              px-4
              py-2.5
            "
          >
            <span
              className="
                text-xs
                font-bold
                text-slate-300
              "
            >
              {row.label}
            </span>

            <div>
              <p className="text-[9px] text-slate-500">
                PREMIUM
              </p>

              <p
                className="
                  text-xs
                  font-semibold
                  text-white
                "
              >
                {formatCurrency(
                  summary?.[row.key]?.premiumAmount
                )}
              </p>
            </div>

            <div>
              <p className="text-[9px] text-slate-500">
                PAID
              </p>

              <p
                className="
                  text-xs
                  font-bold
                  text-emerald-400
                "
              >
                {formatCurrency(
                  summary?.[row.key]?.paid
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}