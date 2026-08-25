import { assetTypes } from "../../data/assetTypes";

function InvestmentTypeSelector({
  value,
  onChange,
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

      {assetTypes.map((asset) => {

        const selected =
          value === asset.id;

        return (
          <button
            key={asset.id}
            type="button"
            onClick={() =>
              onChange?.(asset.id)
            }
            className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${
              selected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {asset.label}
          </button>
        );
      })}

    </div>
  );
}

export default InvestmentTypeSelector;