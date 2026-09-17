import {
  IndianRupee,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  formatCurrency,
} from "../../../utils/cpf/cpfHelpers";

function roundValue(value = 0) {
  return Math.round(
    Number(value) || 0
  );
}

function SummaryRow({
  label,
  currentValue = 0,
  profit = 0,
  type = "own",
  icon,
}) {
  const styles = {
    own: {
      card: `
        border-blue-400/20
        bg-blue-500/10
      `,
      icon: `
        bg-blue-500/15
        text-blue-300
      `,
      label: "text-blue-100",
      value: "text-blue-50",
      profit: "text-blue-300",
    },

    nvs: {
      card: `
        border-violet-400/20
        bg-violet-500/10
      `,
      icon: `
        bg-violet-500/15
        text-violet-300
      `,
      label: "text-violet-100",
      value: "text-violet-50",
      profit: "text-violet-300",
    },

    total: {
      card: `
        border-emerald-400/20
        bg-emerald-500/10
      `,
      icon: `
        bg-emerald-500/15
        text-emerald-300
      `,
      label: "text-emerald-100",
      value: "text-emerald-50",
      profit: "text-emerald-300",
    },
  };

  const style =
    styles[type] ||
    styles.own;

  const roundedCurrentValue =
    roundValue(currentValue);

  const roundedProfit =
    roundValue(profit);

  return (
    <div
      className={`
        rounded-xl
        border
        px-3
        py-3
        ${style.card}
      `}
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        {/* Left */}
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              ${style.icon}
            `}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p
              className={`
                truncate
                text-sm
                font-semibold
                ${style.label}
              `}
            >
              {label}
            </p>

            <p
              className="
                mt-0.5
                text-[11px]
                text-white
              "
            >
              Current Value
            </p>
          </div>
        </div>

        {/* Right */}
        <div
          className="
            shrink-0
            text-right
          "
        >
          <p
            className={`
              text-[15px]
              font-bold
              tracking-tight
              text-yellow-400
              ${style.value}
            `}
          >
            {formatCurrency(
              roundedCurrentValue
            )}
          </p>

          <div
            className="
              mt-0.5
              flex
              items-center
              justify-end
              gap-1
            "
          >
            <TrendingUp
              size={11}
              strokeWidth={2.5}
              className={style.profit}
            />

            <span
              className="
                text-[11px]
                text-white
              "
            >
              Profit
            </span>

            <span
              className={`
                text-[11px]
                font-semibold
                text-green-400
              `}
            >
              {formatCurrency(
                roundedProfit
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CFPSummaryCard({
  financialYear,

  ownCurrentValue = 0,
  ownProfit = 0,

  nvsCurrentValue = 0,
  nvsProfit = 0,

  totalCurrentValue = 0,
  totalProfit = 0,
}) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-950
        p-3.5
        shadow-sm
        sm:p-4
      "
    >
      {/* Header */}
      <div
        className="
          mb-3
          flex
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
            rounded-lg
            bg-slate-800
            text-white
          "
        >
          <WalletCards
            size={18}
            strokeWidth={2}
          />
        </div>

        <div>
          <h2
            className="
              text-sm
              font-semibold
              text-white
            "
          >
            CPF Summary
          </h2>

          <p
            className="
              mt-0.5
              text-[11px]
              text-white
            "
          >
            FY {financialYear}
          </p>
        </div>
      </div>

      {/* Rows */}
      <div
        className="
          space-y-2
        "
      >
        <SummaryRow
          label="Own CPF"
          currentValue={
            ownCurrentValue
          }
          profit={
            ownProfit
          }
          type="own"
          icon={
            <IndianRupee
              size={16}
              strokeWidth={2.2}
            />
          }
        />

        <SummaryRow
          label="NVS CPF"
          currentValue={
            nvsCurrentValue
          }
          profit={
            nvsProfit
          }
          type="nvs"
          icon={
            <IndianRupee
              size={16}
              strokeWidth={2.2}
            />
          }
        />

        <SummaryRow
          label="Total CPF"
          currentValue={
            totalCurrentValue
          }
          profit={
            totalProfit
          }
          type="total"
          icon={
            <WalletCards
              size={16}
              strokeWidth={2.2}
            />
          }
        />
      </div>

      {/* Footer */}
      <p
        className="
          mt-3
          text-center
          text-[10px]
          text-white
        "
      >
        Current CPF value & profit
        for FY {financialYear}
      </p>
    </section>
  );
}