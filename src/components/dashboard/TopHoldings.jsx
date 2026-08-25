import {
  ChevronRight,
  TrendingUp,
} from "lucide-react";

const holdings = [
  {
    name: "Reliance Industries",
    symbol: "RELIANCE",
    type: "Stock",
    current: "₹93,450",
    change: "+9.94%",
  },
  {
    name: "HDFC Flexi Cap Fund",
    symbol: "HDFCFLEXI",
    type: "Mutual Fund",
    current: "₹67,280",
    change: "+12.13%",
  },
  {
    name: "SBI Gold ETF",
    symbol: "SETFGOLD",
    type: "ETF",
    current: "₹33,840",
    change: "+12.80%",
  },
];

function TopHoldings() {
  return (
    <div className="mt-4 space-y-2">

      {holdings.map((item) => (

        <div
          key={item.symbol}
          className="flex items-center gap-3 rounded-2xl p-2 hover:bg-slate-50"
        >

          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100">
            <TrendingUp size={18} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-bold">
              {item.name}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {item.symbol} · {item.type}
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm font-black">
              {item.current}
            </p>

            <p className="mt-0.5 text-[11px] font-bold text-emerald-600">
              {item.change}
            </p>

          </div>

          <ChevronRight
            size={16}
            className="text-slate-300"
          />

        </div>

      ))}

    </div>
  );
}

export default TopHoldings;