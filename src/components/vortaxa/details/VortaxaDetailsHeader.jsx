import {
  ArrowLeft,
  CalendarDays,
} from "lucide-react";

import { formatDate } from "../../../utils/vortaxa/vortaxaFormatters";

function VortaxaDetailsHeader({
  investorName = "Investor",
  startDate = "",
  onBack,
}) {
  return (
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
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
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
            hover:border-slate-600
            hover:bg-slate-700
            hover:text-white
          "
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Investor Info */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold text-white">
            {investorName}
          </h1>

          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
            <CalendarDays className="h-3 w-3 shrink-0" />

            <span>
              Started{" "}
              {startDate
                ? formatDate(startDate)
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VortaxaDetailsHeader;