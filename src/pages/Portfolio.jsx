import { Plus } from "lucide-react";

import PortfolioFilters from "../components/portfolio/PortfolioFilters";
import PortfolioList from "../components/portfolio/PortfolioList";

const portfolioItems = [
  {
    name: "Reliance Industries",
    symbol: "RELIANCE",
    type: "Stock",
    invested: "₹85,000",
    current: "₹93,450",
    profit: "+₹8,450",
  },
  {
    name: "HDFC Flexi Cap Fund",
    symbol: "HDFCFLEXI",
    type: "Mutual Fund",
    invested: "₹60,000",
    current: "₹67,280",
    profit: "+₹7,280",
  },
  {
    name: "SBI Gold ETF",
    symbol: "SETFGOLD",
    type: "ETF",
    invested: "₹30,000",
    current: "₹33,840",
    profit: "+₹3,840",
  },
];

function Portfolio() {
  return (
    <div className="space-y-5">

      <section className="flex items-end justify-between gap-3">

        <div>

          <p className="text-sm text-slate-500">
            All investments
          </p>

          <h1 className="page-title mt-1">
            Portfolio
          </h1>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">

          <Plus size={17} />

          <span className="hidden sm:inline">
            Add
          </span>

        </button>

      </section>

      <PortfolioFilters />

      <PortfolioList
        items={portfolioItems}
      />

    </div>
  );
}

export default Portfolio;