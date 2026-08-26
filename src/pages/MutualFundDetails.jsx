import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import MutualFundCard from "../components/investments/mutualFunds/MutualFundCard";

import MutualFundTransactionCard from "../components/investments/mutualFunds/MutualFundTransactionCard";

import {
  useMutualFunds,
} from "../context/MutualFundContext";

function MutualFundDetails() {
  const navigate =
    useNavigate();

  const { fundId } =
    useParams();

  const {
    holdings,
    deleteTransaction,
    loading,
  } = useMutualFunds();

  /*
   * --------------------------------
   * FIND FUND
   * --------------------------------
   */

  const fund =
    holdings.find(
      (item) =>
        item.id === fundId
    );

  /*
   * --------------------------------
   * LOADING
   * --------------------------------
   */

  if (loading) {
    return (
      <div className="space-y-5">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              text-slate-300
            "
          >
            <ArrowLeft size={17} />
          </button>

          <p className="text-sm text-slate-400">
            Loading mutual fund...
          </p>

        </div>

      </div>
    );
  }

  /*
   * --------------------------------
   * FUND NOT FOUND
   * --------------------------------
   */

  if (!fund) {
    return (
      <div className="space-y-5">

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-slate-300
            hover:text-white
          "
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div
          className="
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            p-6
            text-center
          "
        >
          <p className="font-semibold text-white">
            Mutual fund not found
          </p>
        </div>

      </div>
    );
  }

  /*
   * --------------------------------
   * TRANSACTIONS
   * --------------------------------
   */

  const transactions =
    [...fund.transactions].sort(
      (a, b) =>
        new Date(
          b.purchaseDate
        ) -
        new Date(
          a.purchaseDate
        )
    );

  /*
   * --------------------------------
   * DELETE
   * --------------------------------
   */

  const handleDelete =
    async (id) => {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error(
          "Delete transaction error:",
          error
        );

        alert(
          "Unable to delete transaction."
        );
      }
    };

  return (
    <div className="space-y-5">

      {/* HEADER */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
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
            hover:bg-slate-800
            hover:text-white
            active:scale-95
          "
          aria-label="Go back"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="min-w-0">

          <h1 className="truncate text-xl font-extrabold text-dark">
            Mutual Fund Details
          </h1>

          <p className="mt-0.5 truncate text-xs text-slate-400">
            {fund.schemeName}
          </p>

        </div>

      </div>

      {/* FUND CARD */}

      <MutualFundCard
        fund={fund}
        clickable={false}
      />

      {/* TRANSACTIONS */}

      <div className="space-y-3">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-base font-bold text-dark">
              Transactions
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Purchase and redemption history
            </p>

          </div>

          <span
            className="
              rounded-full
              border
              border-slate-700
              bg-slate-900
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-slate-300
            "
          >
            {transactions.length}{" "}
            {transactions.length === 1
              ? "Transaction"
              : "Transactions"}
          </span>

        </div>

        {/* TRANSACTION LIST */}

        <div className="space-y-2.5">

          {transactions.length > 0 ? (
            transactions.map(
              (transaction) => (
                <MutualFundTransactionCard
                  key={
                    transaction.id
                  }
                  transaction={
                    transaction
                  }
                  onDelete={
                    handleDelete
                  }
                />
              )
            )
          ) : (
            <div
              className="
                rounded-2xl
                border
                border-slate-700
                bg-slate-900
                p-5
                text-center
              "
            >
              <p className="text-sm font-semibold text-slate-200">
                No transactions found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Transaction history will appear here.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default MutualFundDetails;