import { X } from "lucide-react";

import InvestmentForm from "./InvestmentForm";

function InvestmentModal({
  open,
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-5">

      <div className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-black">
              Add investment
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Investment details
            </p>

          </div>

          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"
          >
            <X size={19} />
          </button>

        </div>

        <div className="mt-5">
          <InvestmentForm />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
          >
            Save investment
          </button>

        </div>

      </div>

    </div>
  );
}

export default InvestmentModal;