import {
  Search,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

const SGBSeriesSearch = ({
  seriesCode,
  setSeriesCode,
  onSearch,
  loading,
  error,
  selectedSeries,
  issueDate,
  maturityDate,
  setIssueDate,
}) => {
  // ==========================================
  // FORMAT DATE
  // DD/MMM/YYYY
  // Example: 15/Jan/2021
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // OPEN DATE PICKER
  // ==========================================

  const openDatePicker = (inputId) => {
    const input = document.getElementById(inputId);

    if (!input) return;

    // Modern browsers
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // Fallback
      }
    }

    // Fallback
    input.focus();
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* ======================================
          SERIES CODE INPUT
      ======================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          SGB Series Code
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={seriesCode}
            onChange={(e) =>
              setSeriesCode(e.target.value.toUpperCase())
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch();
              }
            }}
            placeholder="e.g. SGBJAN29IX"
            className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-500"
          />

          <button
            type="button"
            onClick={onSearch}
            disabled={
              loading || !seriesCode.trim()
            }
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 font-medium text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={18} />

            <span className="hidden sm:inline">
              {loading ? "Searching..." : "Search"}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================
          ERROR
      ======================================= */}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ======================================
          FOUND
      ======================================= */}

      {selectedSeries && !error && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">

          {/* Header */}

          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2
              size={20}
              className="text-green-400"
            />

            <span className="font-semibold text-green-400">
              SGB Found
            </span>
          </div>

          {/* ==================================
              BASIC DETAILS
          =================================== */}

          <div className="grid grid-cols-2 gap-3">

            {/* Symbol */}

            <InfoItem
              label="Symbol"
              value={selectedSeries.seriesCode}
            />

            {/* Issue Price */}

            <InfoItem
              label="Issue Price"
              value={`₹${Number(
                selectedSeries.issuePrice || 0
              ).toLocaleString("en-IN")}`}
            />

            {/* Issue Date */}

            <InfoItem
              label="Issue Date"
              value={
                formatDate(issueDate) || "Select Date"
              }
            />

            {/* Maturity Date */}

            <InfoItem
              label="Maturity Date"
              value={
                formatDate(maturityDate) || "Auto"
              }
            />
          </div>

          {/* ==================================
              ISSUE DATE PICKER
          =================================== */}

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Issue Date
            </label>

            <div
              onClick={() =>
                openDatePicker("sgb-issue-date")
              }
              className="relative cursor-pointer"
            >
              {/* Calendar Icon */}

              <CalendarDays
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-500"
              />

              {/* Visible Date */}

              <div
                className={`w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 pl-11 pr-12 text-sm outline-none transition hover:border-gray-600 ${
                  issueDate
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                {issueDate
                  ? formatDate(issueDate)
                  : "DD/MMM/YYYY"}
              </div>

              {/* Actual Date Input */}

              <input
                id="sgb-issue-date"
                type="date"
                value={issueDate || ""}
                onChange={(e) =>
                  setIssueDate(e.target.value)
                }
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                tabIndex="-1"
              />
            </div>

            {issueDate && (
              <p className="mt-2 text-xs text-gray-500">
                Selected:{" "}
                <span className="text-gray-300">
                  {formatDate(issueDate)}
                </span>
              </p>
            )}
          </div>



          
        </div>
      )}
    </div>
  );
};

// ==========================================
// INFO ITEM
// ==========================================

const InfoItem = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-gray-900/70 p-3">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-200">
        {value || "-"}
      </p>
    </div>
  );
};

export default SGBSeriesSearch;