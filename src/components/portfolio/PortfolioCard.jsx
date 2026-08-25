import {
  ChevronRight,
  TrendingUp,
} from "lucide-react";

function PortfolioCard({
  name,
  symbol,
  type,
  invested,
  current,
  profit,
}) {
  return (
    <div className="surface p-4 shadow-sm">

      <div className="flex items-start gap-3">

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100">
          <TrendingUp size={19} />
        </div>

        <div className="min-w-0 flex-1">

          <p className="truncate font-bold">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {symbol} · {type}
          </p>

        </div>

        <button className="text-slate-400">
          <ChevronRight size={19} />
        </button>

      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">

        <Data
          label="Invested"
          value={invested}
        />

        <Data
          label="Current"
          value={current}
        />

        <Data
          label="P/L"
          value={profit}
          positive
        />

      </div>

    </div>
  );
}

function Data({
  label,
  value,
  positive = false,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-[10px] font-semibold text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-black ${
          positive
            ? "text-emerald-600"
            : "text-slate-800"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

export default PortfolioCard;