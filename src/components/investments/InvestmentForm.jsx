import { assetTypes } from "../../data/assetTypes";

function InvestmentForm() {
  return (
    <form className="space-y-4">

      <label className="block">

        <span className="mb-2 block text-xs font-bold text-slate-600">
          Asset type
        </span>

        <select className="input">

          {assetTypes.map((asset) => (
            <option
              key={asset.id}
              value={asset.id}
            >
              {asset.label}
            </option>
          ))}

        </select>

      </label>

      <label className="block">

        <span className="mb-2 block text-xs font-bold text-slate-600">
          Investment / Symbol
        </span>

        <input
          className="input"
          placeholder="Search investment..."
        />

      </label>

      <div className="grid grid-cols-2 gap-3">

        <label>

          <span className="mb-2 block text-xs font-bold text-slate-600">
            Quantity
          </span>

          <input
            className="input"
            type="number"
            placeholder="10"
          />

        </label>

        <label>

          <span className="mb-2 block text-xs font-bold text-slate-600">
            Buy price
          </span>

          <input
            className="input"
            type="number"
            placeholder="2500"
          />

        </label>

      </div>

      <label className="block">

        <span className="mb-2 block text-xs font-bold text-slate-600">
          Purchase date
        </span>

        <input
          className="input"
          type="date"
        />

      </label>

    </form>
  );
}

export default InvestmentForm;