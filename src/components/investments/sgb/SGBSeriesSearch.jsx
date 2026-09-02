import { Search, CheckCircle2, AlertCircle } from "lucide-react";

const SGBSeriesSearch = ({
  seriesCode,
  setSeriesCode,
  onSearch,
  loading,
  error,
  selectedSeries,
}) => {
  return (
    <div className="space-y-4">
      {/* Series Code Input */}
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
                onSearch();
              }
            }}
            placeholder="e.g. SGBJAN29IX"
            className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-500"
          />

          <button
            type="button"
            onClick={onSearch}
            disabled={loading || !seriesCode.trim()}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 font-medium text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={18} />

            <span className="hidden sm:inline">
              {loading ? "Searching..." : "Search"}
            </span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={18} />

          <span>{error}</span>
        </div>
      )}

      {/* Found */}
      {selectedSeries && !error && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2
              size={20}
              className="text-green-400"
            />

            <span className="font-semibold text-green-400">
              SGB Found
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoItem
              label="Series Code"
              value={selectedSeries.seriesCode}
            />

            <InfoItem
              label="ISIN"
              value={selectedSeries.isin}
            />

            <InfoItem
              label="Issue Date"
              value={formatDate(selectedSeries.issueDate)}
            />

            <InfoItem
              label="Maturity Date"
              value={formatDate(selectedSeries.maturityDate)}
            />

            <InfoItem
              label="Issue Price"
              value={`₹${selectedSeries.issuePrice.toLocaleString("en-IN")}`}
            />

            <InfoItem
              label="Interest Rate"
              value={`${selectedSeries.interestRate}% p.a.`}
            />

            <InfoItem
              label="Frequency"
              value={selectedSeries.interestFrequency}
            />

            <InfoItem
              label="Denomination"
              value={`${selectedSeries.denomination} Gram`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-gray-900/70 p-3">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-200">
        {value}
      </p>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default SGBSeriesSearch;