import { useNavigate } from "react-router-dom";

import VortaxaInvestmentForm from "../../components/vortaxa/VortaxaInvestmentForm";

function AddVortaxa() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Page Header */}
      <div
        className="
          mb-4
          rounded-2xl
          border
          border-slate-700
          bg-slate-800
          px-4
          py-3
        "
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-extrabold text-white">
              Add Vortaxa
            </h1>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Create a new Vortaxa investment
            </p>
          </div>
        </div>
      </div>

      {/* Investment Form */}
      <VortaxaInvestmentForm
        onCancel={() => navigate("/vortaxa")}
      />
    </div>
  );
}

export default AddVortaxa;