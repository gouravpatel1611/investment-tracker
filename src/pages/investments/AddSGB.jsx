import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import SGBForm from "../../components/investments/sgb/SGBForm";

import { addSGBTransaction } from "../../services/firebase/sgbService";

const AddSGB = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  /* =========================================================
     SAVE SGB
  ========================================================= */

const handleSaveSGB = async (data) => {
  try {
    setSaving(true);
    setSaveError("");

    console.log("SGB data before Firebase:", data);

    const savedData =
      await addSGBTransaction(data);

    console.log(
      "SGB Saved Successfully:",
      savedData
    );

    // SUCCESS ALERT
    alert("SGB investment saved successfully! ✅");

    navigate("/portfolio/sgb");

  } catch (error) {
    console.error(
      "SGB Save Error:",
      error
    );

    setSaveError(
      error?.message ||
        "Unable to save SGB investment."
    );

  } finally {
    setSaving(false);
  }
};

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-white px-4 pb-10 pt-4 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-6 flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/sgb")
            }
            disabled={saving}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* =====================================
            ERROR
        ====================================== */}

        {saveError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {saveError}
          </div>
        )}

        {/* =====================================
            FORM CARD
        ====================================== */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-xl sm:p-6">

          <SGBForm
            onCancel={() =>
              navigate("/sgb")
            }
            onSave={handleSaveSGB}
            saving={saving}
          />

        </div>
      </div>
    </div>
  );
};

export default AddSGB;