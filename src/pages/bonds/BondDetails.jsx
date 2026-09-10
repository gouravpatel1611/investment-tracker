import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
} from "lucide-react";

import BondTransactionCard from "../../components/investments/bonds/BondTransactionCard";

import { useBonds } from "../../context/BondContext";


function BondDetails() {
  const navigate = useNavigate();

  const { id } = useParams();


  const {
    bonds,
    loading,
    error,
  } = useBonds();


  // ==================================================
  // FIND BOND
  // ==================================================

  const bond = bonds.find(
    (item) => item.id === id
  );


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="space-y-5">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-slate-300 transition hover:bg-slate-800 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>


          <div className="min-w-0">

            <h1 className="truncate text-2xl font-extrabold text-dark">
              Bond
            </h1>


            <p className="mt-1 text-sm text-slate-400">
              Loading...
            </p>

          </div>

        </div>


        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">

          <p className="text-sm font-semibold text-slate-300">
            Loading bond...
          </p>

        </div>

      </div>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="space-y-5">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-slate-300 transition hover:bg-slate-800 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>


          <div className="min-w-0">

            <h1 className="truncate text-2xl font-extrabold text-dark">
              Bond
            </h1>


            <p className="mt-1 text-sm text-red-400">
              Unable to load bond
            </p>

          </div>

        </div>


        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">

          <p className="text-sm font-semibold text-red-400">
            {error}
          </p>

        </div>

      </div>
    );
  }


  // ==================================================
  // BOND NOT FOUND
  // ==================================================

  if (!bond) {
    return (
      <div className="space-y-5">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-slate-300 transition hover:bg-slate-800 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>


          <div className="min-w-0">

            <h1 className="truncate text-2xl font-extrabold text-dark">
              Bond
            </h1>


            <p className="mt-1 text-sm text-slate-400">
              Interest Transactions
            </p>

          </div>

        </div>


        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">

          <p className="text-sm font-semibold text-slate-200">
            Bond not found
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/portfolio/bonds")
            }
            className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95"
          >
            Back to Bonds
          </button>

        </div>

      </div>
    );
  }


  // ==================================================
  // MAIN
  // ==================================================

  return (
    <div className="space-y-5">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-3">

        {/* Back Button */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-slate-300 shadow-sm transition hover:bg-slate-800 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>


        {/* Title */}

        <div className="min-w-0">

          <h1 className="truncate text-2xl font-extrabold text-dark">
            {bond.bondName || "Bond"}
          </h1>


          <p className="mt-1 truncate text-sm text-slate-400">
            Interest Transactions
          </p>

        </div>

      </div>


      {/* ==================================================
          INTEREST TRANSACTION CARD
      ================================================== */}

      <BondTransactionCard
        bond={bond}
      />

    </div>
  );
}


export default BondDetails;