import { ChevronDown, UserRound } from "lucide-react";

function InvestorSelect({
  investors,
  value,
  onChange,
}) {
  return (
    <div>
      <label
        htmlFor="investor"
        className="mb-2 block text-sm font-bold text-slate-200"
      >
        Investor
      </label>

      <div className="relative">
        <UserRound
          size={17}
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />

        <select
          id="investor"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="
            h-12
            w-full
            appearance-none
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            pl-10
            pr-10
            text-sm
            font-medium
            text-white
            outline-none
            transition
            focus:border-purple-500
            focus:ring-2
            focus:ring-purple-500/20
          "
        >
          <option value="">
            Select investor
          </option>

          {investors.map((investor) => (
            <option
              key={investor.id}
              value={investor.id}
            >
              {investor.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />
      </div>
    </div>
  );
}

export default InvestorSelect;