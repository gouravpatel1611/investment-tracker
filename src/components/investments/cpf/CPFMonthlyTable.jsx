import {
  CalendarDays,
  Percent,
  Wallet,
  TrendingUp,
} from "lucide-react";

import {
  formatCurrency,
  formatShortDate,
} from "../../../utils/cpf/cpfHelpers";

export default function CPFMonthlyTable({
  monthlyDetails = [],
}) {
  if (
    !monthlyDetails.length
  ) {
    return (
      <div
        className="
          rounded-xl
          border
          border-slate-700
          bg-slate-800
          p-5
          text-center
          text-xs
          text-slate-400
        "
      >
        No monthly data available.
      </div>
    );
  }

  const totalInterest =
    monthlyDetails.reduce(
      (total, item) =>
        total +
        Number(
          item.interest || 0
        ),
      0
    );

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-slate-700
        bg-slate-900
      "
    >
      <table className="w-full table-fixed text-xs">
        <thead>
          <tr
            className="
              border-b
              border-slate-700
              bg-slate-800
            "
          >
            <th
              className="
                w-[25%]
                px-1.5
                py-2.5
                text-left
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
                sm:px-3
                sm:text-[12px]
              "
            >
              <span className="inline-flex items-center gap-1">
                <CalendarDays
                  size={11}
                  className="text-blue-400"
                />

                Date
              </span>
            </th>

            <th
              className="
                w-[27%]
                px-1.5
                py-2.5
                text-right
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
                sm:px-3
                sm:text-[12px]
              "
            >
              <span className="inline-flex items-center gap-1">
                <Wallet
                  size={11}
                  className="text-violet-400"
                />

                Deposit
              </span>
            </th>

            <th
              className="
                w-[20%]
                px-1.5
                py-2.5
                text-right
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
                sm:px-3
                sm:text-[12px]
              "
            >
              <span className="inline-flex items-center gap-1">
                <Percent
                  size={10}
                  className="text-amber-400"
                />

                Rate
              </span>
            </th>

            <th
              className="
                w-[28%]
                px-1.5
                py-2.5
                text-right
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
                sm:px-3
                sm:text-[12px]
              "
            >
              <span className="inline-flex items-center gap-1">
                <TrendingUp
                  size={11}
                  className="text-emerald-400"
                />

                Interest
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {monthlyDetails.map(
            (item, index) => (
              <tr
                key={`${item.date}-${index}`}
                className="
                  border-b
                  border-slate-800
                  transition
                  last:border-0
                  hover:bg-slate-800/60
                "
              >
                <td
                  className="
                    whitespace-nowrap
                    px-1.5
                    py-2.5
                    text-[12px]
                    font-medium
                    text-slate-200
                    sm:px-3
                    sm:text-xs
                  "
                >
                  {formatShortDate(
                    item.date
                  )}
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-1.5
                    py-2.5
                    text-right
                    text-[12px]
                    font-medium
                    text-violet-300
                    sm:px-3
                    sm:text-xs
                  "
                >
                  {formatCurrency(
                    item.deposit
                  )}
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-1.5
                    py-2.5
                    text-right
                    text-[12px]
                    text-slate-400
                    sm:px-3
                    sm:text-xs
                  "
                >
                  {Number(
                    item.rate || 0
                  ).toFixed(2)}
                  %
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-1.5
                    py-2.5
                    text-right
                    text-[12px]
                    font-bold
                    text-emerald-400
                    sm:px-3
                    sm:text-xs
                  "
                >
                  {formatCurrency(
                    item.interest
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-emerald-900/50
          bg-emerald-950/30
          px-3
          py-2.5
          sm:px-4
        "
      >
        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              bg-emerald-900/50
              text-emerald-400
            "
          >
            <TrendingUp size={14} />
          </div>

          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-emerald-300
              sm:text-xs
            "
          >
            Total Interest
          </span>
        </div>

        <span
          className="
            text-sm
            font-bold
            text-emerald-400
            sm:text-base
          "
        >
          {formatCurrency(
            totalInterest
          )}
        </span>
      </div>
    </div>
  );
}