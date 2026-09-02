import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import SGBForm from "../../components/investments/sgb/SGBForm";

const AddSGB = () => {
  const navigate = useNavigate();

  const handleSaveSGB = (data) => {
    console.log("SGB Saved:", data);

    // Abhi Firebase connect nahi kiya hai.
    // Filhaal save hone ke baad SGB page par wapas jayenge.

    navigate("/portfolio/sgb");
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-10 pt-4 text-white sm:px-6">
      {/* Header */}
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/portfolio/sgb")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Add SGB
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Add your Sovereign Gold Bond investment
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-xl sm:p-6">
          <SGBForm
            onCancel={() => navigate("/portfolio/sgb")}
            onSave={handleSaveSGB}
          />
        </div>
      </div>
    </div>
  );
};

export default AddSGB;