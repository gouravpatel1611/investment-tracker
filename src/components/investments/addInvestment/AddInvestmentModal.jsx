import { X } from "lucide-react";

import AssetSelector from "./AssetSelector";

function AddInvestmentModal({
  isOpen,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-950/70
        p-4
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      {/* MODAL */}
      <div
        className="
          w-full
          max-w-xl
          overflow-hidden
          rounded-3xl
          border
          border-slate-700/80
          bg-slate-900
          shadow-2xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >

        {/* HEADER */}
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-slate-800
            p-5
          "
        >
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-white">
              Add investment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the type of investment you want to add
            </p>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-all
              duration-200
              hover:bg-slate-800
              hover:text-slate-200
              active:scale-95
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* ASSET LIST */}
        <div
          className="
            max-h-[70vh]
            overflow-y-auto
            p-4
            sm:p-5
          "
        >
          <AssetSelector
            onClose={onClose}
          />
        </div>

      </div>
    </div>
  );
}

export default AddInvestmentModal;