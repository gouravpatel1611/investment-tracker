import { useState } from "react";
import { CheckCircle2, Database, Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { migrateMutualFundTransactions } from "../services/firebase/migrateMutualFunds";

function Migration() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleMigration = async () => {
    if (!user?.uid) {
      setError("No logged-in user found.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const count =
        await migrateMutualFundTransactions(
          user.uid
        );

      setResult(count);
    } catch (error) {
      console.error("Migration failed:", error);
      setError(
        error.message ||
          "Migration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-lg">

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/10 text-blue-400">
            <Database size={26} />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Mutual Fund Data Migration
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Your existing mutual fund transactions
            will be copied to your personal user
            account.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-800/70 p-4">
            <p className="text-xs text-slate-400">
              Logged-in account
            </p>

            <p className="mt-1 truncate text-sm font-semibold">
              {user?.email || "Unknown"}
            </p>

            <p className="mt-3 text-xs text-slate-400">
              Firebase UID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-300">
              {user?.uid}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm font-semibold text-amber-400">
              Safe Migration
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Existing data will only be copied.
              Nothing will be deleted from the old
              collection.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMigration}
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-bold text-white transition hover:bg-blue-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Migrating...
              </>
            ) : (
              <>
                <Database size={18} />
                Start Migration
              </>
            )}
          </button>

          {result !== null && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div>
                <p className="text-sm font-semibold text-emerald-400">
                  Migration completed
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Transactions copied:{" "}
                  <span className="font-bold text-white">
                    {result}
                  </span>
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm font-semibold text-red-400">
                Migration failed
              </p>

              <p className="mt-1 text-xs leading-5 text-red-300/80">
                {error}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Migration;