import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
} from "../../../utils/vortaxa/vortaxaFormatters";


/* =========================================================
   TRANSACTION INFO
========================================================= */

function getTransactionInfo(type) {
  switch (type) {
    case "INITIAL":
      return {
        label: "Initial Investment",
        description: "Initial amount",
        icon: CircleDollarSign,
        direction: "in",
      };

    case "FULE_ADD":
      return {
        label: "FULE Added",
        description: "Additional FULE",
        icon: ArrowDownLeft,
        direction: "in",
      };

    case "PI_FULE_ADD":
      return {
        label: "PI FULE Added",
        description: "Additional PI FULE",
        icon: ArrowDownLeft,
        direction: "in",
      };

    case "EARN_WITHDRAW":
      return {
        label: "EARN Withdrawal",
        description: "EARN withdrawn",
        icon: ArrowUpRight,
        direction: "out",
      };

    default:
      return {
        label: "Transaction",
        description: "Vortaxa transaction",
        icon: CircleDollarSign,
        direction: "in",
      };
  }
}


/* =========================================================
   COMPONENT
========================================================= */

function VortaxaTransactionPreview({
  transactions = [],
  onViewAll,
}) {
  /* =======================================================
     SAFE TRANSACTIONS
  ======================================================= */

  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];


  /* =======================================================
     RECENT 5 TRANSACTIONS
  ======================================================= */

  const recentTransactions =
    [...safeTransactions]
      .sort((a, b) => {

        const dateA =
          new Date(
            a?.date || 0
          ).getTime();

        const dateB =
          new Date(
            b?.date || 0
          ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    recentTransactions.length === 0
  ) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900/70
          p-4
        "
      >

        {/* HEADER */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-white
              "
            >
              Recent Transactions
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Latest Vortaxa transactions
            </p>

          </div>

        </div>


        {/* EMPTY */}

        <div
          className="
            flex
            min-h-[120px]
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-slate-700
            bg-slate-950
          "
        >

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            No transactions found
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-4
      "
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-base
              font-semibold
              text-white
            "
          >
            Recent Transactions
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            Latest Vortaxa transactions
          </p>

        </div>


        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="
              flex
              items-center
              gap-1
              text-xs
              font-medium
              text-yellow-400
              transition
              hover:text-yellow-300
            "
          >
            View All

            <ChevronRight
              size={15}
            />
          </button>
        )}

      </div>


      {/* ===================================================
          TRANSACTIONS
      =================================================== */}

      <div className="space-y-2">

        {recentTransactions.map(
          (transaction) => {

            const info =
              getTransactionInfo(
                transaction?.type
              );

            const Icon =
              info.icon;

            const amount =
              Number(
                transaction?.amount || 0
              );


            return (
              <div
                key={transaction?.id}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-950/50
                  px-3
                  py-3
                "
              >

                {/* =======================================
                    LEFT
                ======================================== */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >

                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      ${
                        info.direction === "out"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }
                    `}
                  >

                    <Icon
                      size={17}
                    />

                  </div>


                  <div
                    className="
                      min-w-0
                    "
                  >

                    <p
                      className="
                        truncate
                        text-sm
                        font-medium
                        text-slate-200
                      "
                    >
                      {info.label}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-500
                      "
                    >
                      {formatDate(
                        transaction?.date
                      )}
                    </p>

                  </div>

                </div>


                {/* =======================================
                    RIGHT
                ======================================== */}

                <div
                  className="
                    ml-3
                    shrink-0
                    text-right
                  "
                >

                  <p
                    className={`
                      text-sm
                      font-semibold
                      ${
                        info.direction === "out"
                          ? "text-red-400"
                          : "text-emerald-400"
                      }
                    `}
                  >
                    {info.direction === "out"
                      ? "- "
                      : "+ "}

                    {formatCurrency(
                      amount
                    )}

                  </p>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


export default VortaxaTransactionPreview;