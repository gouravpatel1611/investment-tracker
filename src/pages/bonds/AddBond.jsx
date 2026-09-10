import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import BondForm from "../../components/investments/bonds/BondForm";

function AddBond() {
  const navigate = useNavigate();
  const location = useLocation();

  const editBond =
    location.state?.bond || null;

  const isEditMode =
    Boolean(editBond);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              text-slate-300
              transition
              hover:bg-slate-800
              hover:text-white
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">

            <h1 className="text-base font-semibold text-white">
              {isEditMode
                ? "Edit Bond"
                : "Add Bond"}
            </h1>

            <p className="text-xs text-slate-500">
              {isEditMode
                ? "Update your bond investment"
                : "Enter your bond details manually"}
            </p>

          </div>

        </div>

      </div>

      {/* FORM */}

      <main className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-5 sm:py-6">

        <BondForm
          mode={
            isEditMode
              ? "edit"
              : "add"
          }
          bond={editBond}
        />

      </main>

    </div>
  );
}

export default AddBond;