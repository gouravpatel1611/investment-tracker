
import { useState } from "react";
import { Save, X, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InvestorSelect from "../investments/mutualFunds/InvestorSelect";

import { useInvestors } from "../../context/InvestorContext";
import { useVortaxa } from "../../context/VortaxaContext";

function VortaxaInvestmentForm({ onCancel }) {
  const navigate = useNavigate();

  const {
    investors,
    loading: investorsLoading,
  } = useInvestors();

  const { addInvestor } = useVortaxa();

  const [investorId, setInvestorId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!investorId) {
      setError("Please select an investor.");
      return;
    }

    const selectedInvestor = investors.find(
      (investor) => investor.id === investorId
    );

    if (!selectedInvestor) {
      setError("Selected investor was not found.");
      return;
    }

    try {
      setSaving(true);

      await addInvestor({
        investorId,
        investorName:
          selectedInvestor.name ||
          selectedInvestor.investorName ||
          "",
      });

      alert("Vortaxa investor added successfully.");
      navigate("/vortaxa");
    } catch (saveError) {
      console.error("Vortaxa save error:", saveError);
      setError(
        saveError?.message ||
          "Failed to add Vortaxa investor."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <UserRound size={20} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Select Investor
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Choose an investor to add to Vortaxa.
            </p>
          </div>
        </div>

        <InvestorSelect
          investors={investors}
          value={investorId}
          onChange={(value) => {
            setInvestorId(value);
            setError("");
          }}
          loading={investorsLoading}
        />

        <button
          type="button"
          onClick={() => navigate("/investors")}
          className="mt-3 text-sm font-semibold text-purple-400 transition hover:text-purple-300"
        >
          Add / Edit Investor
        </button>
      </div>

      <div className="flex gap-3 pb-6">
        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              navigate("/vortaxa");
            }
          }}
          disabled={saving}
          className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-extrabold text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            investorsLoading ||
            !investorId
          }
          className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
        >
          <Save size={18} />
          {saving ? "Adding..." : "Add Vortaxa"}
        </button>
      </div>
    </form>
  );
}

export default VortaxaInvestmentForm;
