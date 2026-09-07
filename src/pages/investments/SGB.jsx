import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Gem,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import SGBSummaryCard from "../../components/investments/sgb/SGBSummaryCard";

import SGBCard from "../../components/investments/sgb/SGBCard";

import {
  getSGBPortfolio,
} from "../../services/sgb/sgbPortfolioService";

import {
  deleteSGBTransaction,
} from "../../services/firebase/sgbService";

// ==========================================================
// SGB PAGE
// ==========================================================

const SGB = () => {
  const navigate =
    useNavigate();

  // ========================================================
  // STATE
  // ========================================================

  const [
    sgbHoldings,
    setSgbHoldings,
  ] = useState([]);

  const [
    summary,
    setSummary,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  // ========================================================
  // LOAD PORTFOLIO
  // ========================================================

  const loadPortfolio =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getSGBPortfolio();

        setSgbHoldings(
          data.holdings
        );

        setSummary(
          data.summary
        );

      } catch (err) {
        console.error(
          "SGB Portfolio Error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load SGB portfolio."
        );
      } finally {
        setLoading(false);
      }
    };

  // ========================================================
  // INITIAL LOAD
  // ========================================================

  useEffect(() => {
    loadPortfolio();
  }, []);

  // ========================================================
  // ADD SGB
  // ========================================================

  const handleAddSGB =
    () => {
      navigate("/sgb/add");
    };

  // ========================================================
  // DELETE SGB
  // ========================================================

  const handleDeleteSGB =
    async (sgb) => {

      // ----------------------------------------------------
      // CONFIRMATION
      // ----------------------------------------------------

      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${sgb.seriesNo}?`
        );

      if (!confirmed) {
        return;
      }

      try {

        // --------------------------------------------------
        // Show deleting state
        // --------------------------------------------------

        setDeletingId(
          sgb.id
        );

        setError("");

        // --------------------------------------------------
        // Delete from Firebase
        // --------------------------------------------------

        await deleteSGBTransaction(
          sgb.id
        );

        // --------------------------------------------------
        // Reload everything
        //
        // Firebase data
        // API current rate
        // Interest
        // Profit
        // Summary
        // --------------------------------------------------

        await loadPortfolio();

      } catch (err) {

        console.error(
          "Failed to delete SGB:",
          err
        );

        setError(
          err?.message ||
            "Unable to delete SGB. Please try again."
        );

      } finally {

        setDeletingId(
          null
        );

      }
    };

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="space-y-5 pb-6">

      {/* ================================================== */}
      {/* PAGE HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between gap-3">

        <div>

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">

              <Gem size={19} />

            </div>

            <h1 className="text-xl font-bold text-gray-700">
              Sovereign Gold Bonds
            </h1>

          </div>

          <p className="mt-1 text-xs text-gray-500">
            Track your SGB investments
          </p>

        </div>

        {/* ADD BUTTON */}

        <button
          type="button"
          onClick={handleAddSGB}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-yellow-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-yellow-400"
        >

          <Plus size={16} />

          <span className="hidden sm:inline">
            Add SGB
          </span>

        </button>

      </div>

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ================================================== */}
      {/* LOADING */}
      {/* ================================================== */}

      {loading ? (

        <div className="rounded-2xl border border-gray-800 bg-gray-900 px-5 py-10 text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-yellow-400" />

          <p className="mt-3 text-sm text-gray-400">
            Loading SGB portfolio...
          </p>

        </div>

      ) : (

        <>
          {/* ============================================== */}
          {/* SUMMARY */}
          {/* ============================================== */}

          {summary && (
            <SGBSummaryCard
              summary={summary}
            />
          )}

          {/* ============================================== */}
          {/* HOLDINGS HEADER */}
          {/* ============================================== */}

          <div className="flex items-center justify-between pt-1">

            <div>

              <h2 className="text-base font-semibold text-gray-200">
                Your SGB Holdings
              </h2>

              <p className="text-xs text-gray-500">
                All your sovereign gold bond investments
              </p>

            </div>

            <div className="rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs font-medium text-gray-500">
              {sgbHoldings.length} Holdings
            </div>

          </div>

          {/* ============================================== */}
          {/* EMPTY STATE */}
          {/* ============================================== */}

          {sgbHoldings.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/50 px-5 py-10 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">

                <Gem size={22} />

              </div>

              <h3 className="mt-3 text-sm font-semibold text-gray-300">
                No SGB Holdings
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Add your first Sovereign Gold Bond investment.
              </p>

              <button
                type="button"
                onClick={handleAddSGB}
                className="mt-4 rounded-xl bg-yellow-500 px-4 py-2 text-xs font-semibold text-black hover:bg-yellow-400"
              >
                Add SGB
              </button>

            </div>

          ) : (

            /* ============================================ */
            /* HOLDINGS */
            /* ============================================ */

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {[...sgbHoldings]
                .sort(
                  (a, b) =>
                    new Date(a.issueDate) -
                    new Date(b.issueDate)
                )
                .map((sgb) => (
                  <div
                    key={sgb.id}
                    className={
                      deletingId === sgb.id
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  >
                    <SGBCard
                      sgb={sgb}
                      onDelete={handleDeleteSGB}
                    />
                  </div>
                ))}
            </div>

          )}

        </>
      )}

    </div>
  );
};

export default SGB;