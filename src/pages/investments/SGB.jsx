import { Plus, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SGBSummaryCard from "../../components/investments/sgb/SGBSummaryCard";
import SGBCard from "../../components/investments/sgb/SGBCard";

// ==================================================
// DUMMY SGB DATA
// UI CHECKING ONLY
// NO CALCULATION
// ==================================================

const sgbHoldings = [
  {
    id: "sgb-001",

    seriesNo: "SGB 2023-24 Series IV",

    units: 10,

    purchaseRate: 5926,

    purchaseValue: 59260,

    currentValue: 124500,

    profit: 65240,

    interest: 3704,

    gain: 68944,

    // Total Gain %
    totalGainPercent: 116.35,

    purchaseDate: "2024-02-20",

    maturityDate: "2032-02-20",
  },

  {
    id: "sgb-002",

    seriesNo: "SGB 2024-25 Series I",

    units: 20,

    purchaseRate: 6461,

    purchaseValue: 129220,

    currentValue: 249000,

    profit: 119780,

    interest: 6461,

    gain: 126241,

    // Total Gain %
    totalGainPercent: 97.70,

    purchaseDate: "2024-06-24",

    maturityDate: "2032-06-24",
  },

  {
    id: "sgb-003",

    seriesNo: "SGB 2024-25 Series II",

    units: 5,

    purchaseRate: 7166,

    purchaseValue: 35830,

    currentValue: 62250,

    profit: 26420,

    interest: 1791,

    gain: 28211,

    // Total Gain %
    totalGainPercent: 78.75,

    purchaseDate: "2024-09-10",

    maturityDate: "2032-09-10",
  },
];

// ==================================================
// SUMMARY DUMMY DATA
// DIRECT VALUES ONLY
// ==================================================

const summary = {
  seriesCount: 3,

  units: 35,

  purchaseRate: 6398,

  purchaseValue: 224310,

  currentRate: 12450,

  currentValue: 435750,

  profit: 211440,

  interest: 11956,

  gain: 223396,

  // Total Gain %
  totalGainPercent: 99.60,
};

const SGB = () => {
  const navigate = useNavigate();

  const handleAddSGB = () => {
    navigate("/sgb/add");
  };

  return (
    <div className="space-y-5 pb-6">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <div className="flex items-center justify-between gap-3">

        <div>
          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <Gem size={19} />
            </div>

            <h1 className="text-xl font-bold text-gray-700">
              Sovereign Gold Bonds
            </h1>

          </div>

          <p className="mt-1 text-xs text-gray-500">
            Track your SGB investments
          </p>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddSGB}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-yellow-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-yellow-400"
        >
          <Plus size={16} />

          <span className="hidden sm:inline">
            Add SGB
          </span>
        </button>

      </div>

      {/* ==========================================
          SUMMARY
      ========================================== */}
      <SGBSummaryCard summary={summary} />

      {/* ==========================================
          HOLDINGS HEADER
      ========================================== */}
      <div className="flex items-center justify-between pt-1">

        <div>
          <h2 className="text-base font-semibold text-gray-200">
            Your SGB Holdings
          </h2>

          <p className="text-xs text-gray-500">
            All your sovereign gold bond investments
          </p>
        </div>

        <div className="rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs font-medium text-gray-500">
          {sgbHoldings.length} Holdings
        </div>

      </div>

      {/* ==========================================
          HOLDINGS
      ========================================== */}
      {sgbHoldings.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/50 px-5 py-10 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
            <Gem size={22} />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-gray-300">
            No SGB Holdings
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Add your first Sovereign Gold Bond investment.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {sgbHoldings.map((sgb) => (
            <SGBCard
              key={sgb.id}
              sgb={sgb}
            />
          ))}
        </div>

      )}

    </div>
  );
};

export default SGB;