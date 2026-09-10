import { useMemo } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BondSummaryCard from "../../components/investments/bonds/BondSummaryCard";
import BondCard from "../../components/investments/bonds/BondCard";

import {
  useBonds,
} from "../../context/BondContext";

function Bonds() {
  const navigate = useNavigate();

  const {
    bonds,
    loading,
    error,
  } = useBonds();

  /* --------------------------------
     SUMMARY
  -------------------------------- */

  const summary = useMemo(() => {

    return bonds.reduce(
      (total, bond) => {

        const invested =
          Number(bond.purchaseValue) ||
          (
            Number(bond.quantity) || 0
          ) *
          (
            Number(bond.purchasePrice) || 0
          );

        const currentValue =
          Number(bond.currentValue) ||
          invested;

        const profit =
          currentValue - invested;

        total.invested += invested;
        total.currentValue += currentValue;
        total.profit += profit;

        return total;
      },
      {
        invested: 0,
        currentValue: 0,
        profit: 0,
      }
    );

  }, [bonds]);


  const returnPercent =
    summary.invested > 0
      ? (
          summary.profit /
          summary.invested
        ) * 100
      : 0;


  /* --------------------------------
     LOADING
  -------------------------------- */

  if (loading) {
    return (
      <div className="space-y-5">

        <div>
          <h1 className="text-2xl font-extrabold text-dark">
            Bonds
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Loading your investments...
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            p-8
            text-center
          "
        >
          <p className="text-sm font-semibold text-slate-300">
            Loading bonds...
          </p>
        </div>

      </div>
    );
  }


  /* --------------------------------
     ERROR
  -------------------------------- */

  if (error) {
    return (
      <div className="space-y-5">

        <div>
          <h1 className="text-2xl font-extrabold text-dark">
            Bonds
          </h1>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            p-5
          "
        >
          <p className="text-sm font-semibold text-red-400">
            {error}
          </p>
        </div>

      </div>
    );
  }


  return (
    <div className="space-y-5">

      {/* --------------------------------
          HEADER
      -------------------------------- */}

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1 className="text-2xl font-extrabold text-dark">
            Bonds
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Track and manage your bond investments
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            navigate("/portfolio/bonds/add")
          }
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            self-end
            rounded-xl
            bg-slate-900
            text-white
            shadow-sm
            transition
            hover:bg-slate-800
            active:scale-95
            sm:self-auto
          "
          aria-label="Add Bond"
        >
          <Plus size={19} />
        </button>

      </div>


      {/* --------------------------------
          SUMMARY
      -------------------------------- */}

      <BondSummaryCard
        data={{
          invested:
            summary.invested,

          currentValue:
            summary.currentValue,

          profit:
            summary.profit,

          returnPercent,

          holdings:
            bonds.length,
        }}
      />


      {/* --------------------------------
          HOLDINGS
      -------------------------------- */}

      <div className="space-y-3">

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <h2 className="text-base font-bold text-dark">
            Your Bonds
          </h2>

          <span className="text-xs font-medium text-slate-400">
            {bonds.length}{" "}
            {bonds.length === 1
              ? "Bond"
              : "Bonds"}
          </span>

        </div>


        {bonds.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              p-8
              text-center
            "
          >

            <p className="text-sm font-semibold text-slate-200">
              No bonds found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add your first bond investment.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              gap-3
              lg:grid-cols-2
            "
          >

            {[...bonds]
              .sort((a, b) =>
                String(a.bondName || "")
                  .localeCompare(
                    String(b.bondName || "")
                  )
              )
              .map((bond) => (
                <BondCard
                  key={bond.id}
                  bond={bond}
                />
              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Bonds;