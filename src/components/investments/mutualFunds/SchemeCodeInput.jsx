import {
  CheckCircle2,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";

function SchemeCodeInput({
  value,
  onChange,
  onSearch,
  loading,
  fund,
  notFound,
}) {
  return (
    <div>
      <label
        htmlFor="schemeCode"
        className="mb-2 block text-sm font-bold text-slate-200"
      >
        Scheme Code
      </label>

      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <input
            id="schemeCode"
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(event) => {
              onChange(
                event.target.value.replace(/\D/g, "")
              );
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearch();
              }
            }}
            placeholder="Enter scheme code"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-3
              text-sm
              font-semibold
              text-white
              outline-none
              placeholder:text-slate-600
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-500/20
            "
          />
        </div>

        <button
          type="button"
          onClick={onSearch}
          disabled={
            loading ||
            !value.trim()
          }
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-purple-600
            text-white
            transition
            hover:bg-purple-500
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          aria-label="Search scheme"
        >
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Search size={18} />
          )}
        </button>
      </div>

      {/* SUCCESS */}
      {fund && (
        <div
          className="
            mt-3
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            p-3
          "
        >
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-emerald-400"
          />

          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-300">
              {fund.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {fund.fundHouse} · {fund.category}
            </p>
          </div>
        </div>
      )}

      {/* NOT FOUND */}
      {notFound && (
        <div
          className="
            mt-3
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            p-3
          "
        >
          <XCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <div>
            <p className="text-sm font-bold text-red-300">
              Scheme not found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please check the scheme code and try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchemeCodeInput;