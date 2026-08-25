import {
  CircleDollarSign,
} from "lucide-react";

function PortfolioSummary() {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-900 p-5 text-white shadow-xl sm:p-7">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-300">
            Total portfolio value
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            ₹1,94,570
          </p>

        </div>

        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
          <CircleDollarSign size={22} />
        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

        <Stat
          label="Invested"
          value="₹1,75,000"
        />

        <Stat
          label="Total P/L"
          value="+₹19,570"
          positive
        />

        <Stat
          label="Return"
          value="+11.18%"
          positive
        />

        <Stat
          label="Today"
          value="+₹1,240"
          positive
        />

      </div>

    </section>
  );
}

function Stat({
  label,
  value,
  positive = false,
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">

      <p className="text-[11px] text-slate-300">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-black ${
          positive
            ? "text-emerald-300"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

export default PortfolioSummary;