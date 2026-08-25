const filters = [
  "All",
  "Stocks",
  "Mutual Funds",
  "ETF",
  "Gold",
  "FD",
];

function PortfolioFilters() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

      {filters.map((filter, index) => (

        <button
          key={filter}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${
            index === 0
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          {filter}
        </button>

      ))}

    </div>
  );
}

export default PortfolioFilters;