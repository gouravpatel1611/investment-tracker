
import {
  Pencil,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
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

    case "INITIAL_FULE":
      return {
        label: "Initial FULE",
        icon: CircleDollarSign,
        direction: "in",
      };


    case "INITIAL_PI_FULE":
      return {
        label: "Initial PI FULE",
        icon: CircleDollarSign,
        direction: "in",
      };


    case "FULE_ADD":
      return {
        label: "FULE Added",
        icon: ArrowDownLeft,
        direction: "in",
      };


    case "PI_FULE_ADD":
      return {
        label: "PI FULE Added",
        icon: ArrowDownLeft,
        direction: "in",
      };


    case "EARN_WITHDRAW":
      return {
        label: "EARN Withdrawal",
        icon: ArrowUpRight,
        direction: "out",
      };


    default:
      return {
        label: "Transaction",
        icon: CircleDollarSign,
        direction: "in",
      };
  }
}


/* =========================================================
   COMPONENT
========================================================= */

function VortaxaTransactionList({
  transactions = [],

  /*
   * Initial FULE and PI FULE are passed separately.
   *
   * Liquidity is intentionally NOT used.
   */
  initialFule = 0,
  initialPiFule = 0,

  onEdit,
  onDelete,
}) {

  const safeTransactions =
    Array.isArray(transactions)
      ? transactions
      : [];


  /* =======================================================
     REMOVE OLD INITIAL TRANSACTION
     
     We do NOT show the old combined INITIAL transaction.
  ======================================================= */

  const normalTransactions =
    safeTransactions.filter(
      (transaction) =>
        transaction?.type !== "INITIAL"
    );


  /* =======================================================
     CREATE INITIAL FULE + INITIAL PI FULE
     
     Liquidity is completely ignored.
  ======================================================= */

  const initialDate =
    safeTransactions.find(
      (transaction) =>
        transaction?.type === "INITIAL"
    )?.date || null;


  const initialTransactions = [];


  /* =======================================================
     INITIAL FULE
  ======================================================= */

  if (
    Number(initialFule) > 0
  ) {
    initialTransactions.push({
      id: "initial-fule",
      type: "INITIAL_FULE",
      date: initialDate,
      amount: Number(initialFule) || 0,
      isInitial: true,
    });
  }


  /* =======================================================
     INITIAL PI FULE
  ======================================================= */

  if (
    Number(initialPiFule) > 0
  ) {
    initialTransactions.push({
      id: "initial-pi-fule",
      type: "INITIAL_PI_FULE",
      date: initialDate,
      amount: Number(initialPiFule) || 0,
      isInitial: true,
    });
  }


  /* =======================================================
     FINAL TRANSACTION LIST
  ======================================================= */

  const displayTransactions = [
    ...initialTransactions,
    ...normalTransactions,
  ];


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    displayTransactions.length === 0
  ) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
          text-center
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
      "
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-800
          px-4
          py-3
        "
      >

        <div>

          <h2
            className="
              text-sm
              font-semibold
              text-white
            "
          >
            Transactions
          </h2>

          <p
            className="
              mt-0.5
              text-xs
              text-slate-500
            "
          >
            {displayTransactions.length} transaction
            {displayTransactions.length !== 1
              ? "s"
              : ""}
          </p>

        </div>

      </div>


      {/* ===================================================
          LIST
      =================================================== */}

      <div
        className="
          divide-y
          divide-slate-800
        "
      >

        {displayTransactions.map(
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


            /*
             * Initial FULE / Initial PI FULE
             * cannot be edited or deleted from
             * transaction list.
             */
            const isInitial =
              transaction?.isInitial === true;


            return (
              <div
                key={transaction?.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  px-4
                  py-3
                "
              >

                {/* =========================================
                    LEFT
                ========================================== */}

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
                        text-white
                      "
                    >
                      {info.label}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-400
                      "
                    >
                      {formatDate(
                        transaction?.date
                      )}
                    </p>

                  </div>

                </div>


                {/* =========================================
                    RIGHT
                ========================================== */}

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                  "
                >

                  {/* =======================================
                      AMOUNT
                  ======================================== */}

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


                  {/* =======================================
                      ACTION BUTTONS
                  ======================================== */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                    "
                  >

                    {/* =====================================
                        EDIT
                    ====================================== */}

                    {onEdit &&
                      !isInitial && (
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              transaction
                            )
                          }
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-slate-800
                            hover:text-yellow-400
                          "
                          title="Edit transaction"
                        >
                          <Pencil
                            size={15}
                          />
                        </button>
                      )}


                    {/* =====================================
                        DELETE
                    ====================================== */}

                    {onDelete &&
                      !isInitial && (
                        <button
                          type="button"
                          onClick={() =>
                            onDelete(
                              transaction
                            )
                          }
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-red-500/10
                            hover:text-red-400
                          "
                          title="Delete transaction"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      )}

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


export default VortaxaTransactionList;

