import { WalletCards } from "lucide-react";

const transactions = [
  {
    symbol: "RELIANCE",
    type: "Buy",
    amount: "₹25,000",
    date: "24 Aug 2026",
  },
  {
    symbol: "HDFCFLEXI",
    type: "Buy",
    amount: "₹10,000",
    date: "20 Aug 2026",
  },
  {
    symbol: "SETFGOLD",
    type: "Buy",
    amount: "₹8,000",
    date: "15 Aug 2026",
  },
];

function Transactions() {
  return (
    <div className="space-y-5">

      <div>

        <p className="text-sm text-slate-500">
          Your activity
        </p>

        <h1 className="page-title mt-1">
          Transactions
        </h1>

      </div>

      <div className="surface overflow-hidden">

        <div className="divide-y divide-slate-100">

          {transactions.map((item) => (

            <div
              key={`${item.symbol}-${item.date}`}
              className="flex items-center justify-between gap-4 p-4"
            >

              <div className="flex min-w-0 items-center gap-3">

                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100">
                  <WalletCards size={18} />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-bold">
                    {item.symbol}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.type} · {item.date}
                  </p>

                </div>

              </div>

              <p className="shrink-0 text-sm font-black">
                {item.amount}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Transactions;