const assets = [
  {
    name: "Stocks",
    percent: 48,
    amount: "₹93,450",
  },
  {
    name: "Mutual Funds",
    percent: 35,
    amount: "₹67,280",
  },
  {
    name: "ETF",
    percent: 17,
    amount: "₹33,840",
  },
];

function AssetAllocation() {
  return (
    <div className="space-y-4">

      {assets.map((asset) => (

        <div key={asset.name}>

          <div className="flex items-center justify-between text-xs">

            <span className="font-bold">
              {asset.name}
            </span>

            <span className="font-bold text-slate-500">
              {asset.percent}%
            </span>

          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-slate-900"
              style={{
                width: `${asset.percent}%`,
              }}
            />

          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            {asset.amount}
          </p>

        </div>

      ))}

    </div>
  );
}

export default AssetAllocation;