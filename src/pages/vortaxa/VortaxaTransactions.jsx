
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useVortaxa,
} from "../../context/VortaxaContext";

import VortaxaDetailsHeader
  from "../../components/vortaxa/details/VortaxaDetailsHeader";

import VortaxaTransactionFilters
  from "../../components/vortaxa/transaction/VortaxaTransactionFilters";

import VortaxaTransactionForm
  from "../../components/vortaxa/transaction/VortaxaTransactionForm";

import VortaxaTransactionList
  from "../../components/vortaxa/transaction/VortaxaTransactionList";


function VortaxaTransactions() {

  const {
    investorId,
  } = useParams();

  const navigate =
    useNavigate();


  /* =========================================================
     CONTEXT
  ========================================================= */

  const {
    getInvestor,
    investorData,

    addFule,
    addPiFule,
    addEarnWithdrawal,

    updateTransaction,
    deleteTransaction,

    loading,
    dataLoading,
  } = useVortaxa();


  /* =========================================================
     INVESTOR
  ========================================================= */

  const investor =
    getInvestor(
      investorId
    );


  /* =========================================================
     CALCULATED INVESTOR DATA
  ========================================================= */

  const investorDetailsData =
    investor
      ? investorData?.find(
          (item) =>
            item.id ===
            investor.id
        )
      : null;


  /* =========================================================
     TRANSACTIONS
  ========================================================= */

  const transactions =
    Array.isArray(
      investor?.transactions
    )
      ? investor.transactions
      : [];


  /* =========================================================
     INITIAL FULE
     
     Liquidity is intentionally NOT used.
  ========================================================= */

  const initialFule =
    Number(
      investor?.initial?.fule || 0
    );


  /* =========================================================
     INITIAL PI FULE
     
     Liquidity is intentionally NOT used.
  ========================================================= */

  const initialPiFule =
    Number(
      investor?.initial?.piFule || 0
    );


  /* =========================================================
     AVAILABLE EARN
  ========================================================= */

  const availableEarn =
    Number(
      investorDetailsData
        ?.summary
        ?.availableEarn || 0
    );


  /* =========================================================
     STATE
  ========================================================= */

  const [showForm, setShowForm] =
    useState(false);

  const [
    editingTransaction,
    setEditingTransaction,
  ] = useState(null);

  const [saving, setSaving] =
    useState(false);


  /* =========================================================
     FILTER STATE
  ========================================================= */

  const [year, setYear] =
    useState("all");

  const [month, setMonth] =
    useState("all");

  const [type, setType] =
    useState("all");


  /* =========================================================
     RESET FORM / FILTERS
     WHEN INVESTOR CHANGES
  ========================================================= */

  useEffect(() => {

    setShowForm(false);

    setEditingTransaction(null);

    setYear("all");

    setMonth("all");

    setType("all");

  }, [
    investorId,
  ]);


  /* =========================================================
     YEARS
  ========================================================= */

  const years =
    useMemo(
      () => {

        const uniqueYears =
          new Set();


        transactions.forEach(
          (transaction) => {

            if (
              !transaction?.date
            ) {
              return;
            }


            const date =
              new Date(
                transaction.date
              );


            if (
              Number.isNaN(
                date.getTime()
              )
            ) {
              return;
            }


            uniqueYears.add(
              date.getFullYear()
            );

          }
        );


        /*
         * Initial transaction date
         * is also included in year
         * filter options.
         */

        const initialTransaction =
          transactions.find(
            (transaction) =>
              transaction?.type ===
              "INITIAL"
          );


        if (
          initialTransaction?.date
        ) {

          const initialDate =
            new Date(
              initialTransaction.date
            );


          if (
            !Number.isNaN(
              initialDate.getTime()
            )
          ) {

            uniqueYears.add(
              initialDate.getFullYear()
            );

          }
        }


        return Array.from(
          uniqueYears
        ).sort(
          (a, b) =>
            b - a
        );

      },
      [
        transactions,
      ]
    );


  /* =========================================================
     FILTERED TRANSACTIONS
  ========================================================= */

  const filteredTransactions =
    useMemo(
      () => {

        return [
          ...transactions,
        ]

          .filter(
            (transaction) => {

              /* ================================================
                 YEAR
              ================================================= */

              if (
                year !== "all"
              ) {

                const transactionYear =
                  transaction?.date
                    ? new Date(
                        transaction.date
                      ).getFullYear()
                    : null;


                if (
                  String(
                    transactionYear
                  ) !==
                  String(year)
                ) {
                  return false;
                }

              }


              /* ================================================
                 MONTH
              ================================================= */

              if (
                month !== "all"
              ) {

                const transactionMonth =
                  transaction?.date
                    ? new Date(
                        transaction.date
                      ).getMonth() + 1
                    : null;


                if (
                  String(
                    transactionMonth
                  ).padStart(
                    2,
                    "0"
                  ) !==
                  String(month).padStart(
                    2,
                    "0"
                  )
                ) {
                  return false;
                }

              }


              /* ================================================
                 TYPE
              ================================================= */

              if (
                type !== "all" &&
                transaction?.type !== type
              ) {
                return false;
              }


              return true;

            }
          )

          /* ================================================
             NEWEST FIRST
          ================================================= */

          .sort(
            (a, b) => {

              const dateA =
                new Date(
                  a?.date || 0
                ).getTime();


              const dateB =
                new Date(
                  b?.date || 0
                ).getTime();


              return (
                dateB -
                dateA
              );

            }
          );

      },
      [
        transactions,
        year,
        month,
        type,
      ]
    );


  /* =========================================================
     ADD TRANSACTION
  ========================================================= */

  function handleAddTransaction() {

    setEditingTransaction(
      null
    );

    setShowForm(
      true
    );

  }


  /* =========================================================
     EDIT TRANSACTION
  ========================================================= */

  function handleEditTransaction(
    transaction
  ) {

    if (!transaction) {
      return;
    }


    setEditingTransaction(
      transaction
    );

    setShowForm(
      true
    );

  }


  /* =========================================================
     SAVE / UPDATE TRANSACTION
  ========================================================= */

  async function handleSaveTransaction(
    transaction
  ) {

    if (!investor) {
      return;
    }


    const currentInvestorId =
      investor.investorId ||
      investor.id;


    setSaving(
      true
    );


    try {

      /* =====================================================
         UPDATE EXISTING
      ===================================================== */

      if (
        editingTransaction
      ) {

        await updateTransaction(
          currentInvestorId,
          editingTransaction.id,
          transaction
        );


        setEditingTransaction(
          null
        );

        setShowForm(
          false
        );

        return;
      }


      /* =====================================================
         ADD FULE
      ===================================================== */

      if (
        transaction.type ===
        "FULE_ADD"
      ) {

        await addFule(
          currentInvestorId,
          transaction.amount,
          transaction.date
        );


      /* =====================================================
         ADD PI FULE
      ===================================================== */

      } else if (
        transaction.type ===
        "PI_FULE_ADD"
      ) {

        await addPiFule(
          currentInvestorId,
          transaction.amount,
          transaction.date
        );


      /* =====================================================
         WITHDRAW EARN
      ===================================================== */

      } else if (
        transaction.type ===
        "EARN_WITHDRAW"
      ) {

        await addEarnWithdrawal(
          currentInvestorId,
          transaction.amount,
          transaction.date
        );

      }


      setShowForm(
        false
      );

      setEditingTransaction(
        null
      );


    } catch (error) {

      console.error(
        "Failed to save transaction:",
        error
      );


      alert(
        error?.message ||
        "Failed to save transaction."
      );


    } finally {

      setSaving(
        false
      );

    }

  }


  /* =========================================================
     DELETE TRANSACTION
  ========================================================= */

  async function handleDeleteTransaction(
    transaction
  ) {

    if (
      !transaction?.id
    ) {
      return;
    }


    if (!investor) {
      return;
    }


    const currentInvestorId =
      investor.investorId ||
      investor.id;


    /* =======================================================
       INITIAL FULE / INITIAL PI FULE
       
       These are display-only.
       They are NOT actual transactions.
    ======================================================= */

    if (
      transaction.type ===
        "INITIAL_FULE" ||
      transaction.type ===
        "INITIAL_PI_FULE"
    ) {

      return;
    }


    /* =======================================================
       LEGACY INITIAL TRANSACTION
       
       Kept only for old stored data.
    ======================================================= */

    if (
      transaction.type ===
      "INITIAL"
    ) {

      const confirmed =
        window.confirm(
          "Deleting the Initial Investment will delete this investor and all of its Vortaxa data.\n\nAre you sure you want to continue?"
        );


      if (!confirmed) {
        return;
      }


      const confirmedAgain =
        window.confirm(
          "This action cannot be undone.\n\nDelete the entire investor?"
        );


      if (!confirmedAgain) {
        return;
      }


      /*
       * deleteInvestor is no longer
       * used from the current UI.
       *
       * This block is only for legacy
       * INITIAL data.
       */

      return;
    }


    /* =======================================================
       OTHER TRANSACTIONS
       DELETE ONLY TRANSACTION
    ======================================================= */

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this transaction?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await deleteTransaction(
        currentInvestorId,
        transaction.id
      );


    } catch (error) {

      console.error(
        "Failed to delete transaction:",
        error
      );


      alert(
        error?.message ||
        "Failed to delete transaction."
      );

    }

  }


  /* =========================================================
     CANCEL FORM
  ========================================================= */

  function handleCancelForm() {

    setShowForm(
      false
    );

    setEditingTransaction(
      null
    );

  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading ||
    dataLoading
  ) {

    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">

        <div className="mx-auto max-w-5xl">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">

            <p className="text-sm text-slate-400">
              Loading transactions...
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* =========================================================
     INVESTOR NOT FOUND
  ========================================================= */

  if (!investor) {

    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">

        <div className="mx-auto max-w-5xl">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">

            <p className="text-sm text-red-400">
              Investor not found.
            </p>

          </div>

        </div>

      </div>
    );
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen sm:px-6">

      <div className="mx-auto max-w-5xl">


        {/* ===================================================
            HEADER
        =================================================== */}

        <VortaxaDetailsHeader
          investor={investor}
          activeTab="transactions"
        />


        {/* ===================================================
            PAGE TITLE
        =================================================== */}

        <div className="mb-4 flex items-center justify-between">

          <div>

            <h1 className="text-lg font-bold sm:text-xl">
              Transactions
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Manage Vortaxa transactions
            </p>

          </div>


          {!showForm && (
            <button
              type="button"
              onClick={
                handleAddTransaction
              }
              className="
                flex
                items-center
                gap-1.5
                rounded-xl
                bg-yellow-400
                px-3
                py-2
                text-xs
                font-semibold
                text-slate-950
                transition
                hover:bg-yellow-300
              "
            >
              <Plus
                size={15}
              />

              Add Transaction

            </button>
          )}

        </div>


        {/* ===================================================
            FORM
        =================================================== */}

        {showForm && (
          <div className="mb-4">

            <VortaxaTransactionForm
              onSave={
                handleSaveTransaction
              }
              onCancel={
                handleCancelForm
              }
              availableEarn={
                availableEarn
              }
              saving={
                saving
              }
              editingTransaction={
                editingTransaction
              }
            />

          </div>
        )}


        {/* ===================================================
            FILTERS
        =================================================== */}

        <div className="mb-4">

          <VortaxaTransactionFilters
            year={
              year
            }
            month={
              month
            }
            type={
              type
            }
            years={
              years
            }
            onYearChange={
              setYear
            }
            onMonthChange={
              setMonth
            }
            onTypeChange={
              setType
            }
          />

        </div>


        {/* ===================================================
            TRANSACTION LIST
        =================================================== */}

        <VortaxaTransactionList
          transactions={
            filteredTransactions
          }

          initialFule={
            initialFule
          }

          initialPiFule={
            initialPiFule
          }

          onEdit={
            handleEditTransaction
          }

          onDelete={
            handleDeleteTransaction
          }
        />

      </div>

    </div>
  );
}


export default VortaxaTransactions;

