import {
  AlertCircle,
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import CFPSummaryCard from "../../components/investments/cpf/CFPSummaryCard";
import OwnCPFCard from "../../components/investments/cpf/OwnCPFCard";
import NVSCPFCard from "../../components/investments/cpf/NVSCPFCard";
import CPFEditForm from "../../components/investments/cpf/CPFEditForm";

import {
  calculateCPF,
  calculateCPFSummary,
  calculateNVSCPF,
  calculateAverageInterestRate,
} from "../../utils/cpf/cpfCalculations";

import { useCPF } from "../../context/CPFContext";


export default function CPF() {

  /* =========================================================
     CPF CONTEXT
  ========================================================= */

  const {
    record,
    loading,
    saving,
    error,
    saveCPF,
  } = useCPF();


  /* =========================================================
     LOCAL UI STATE
  ========================================================= */

  const [
    expandedCard,
    setExpandedCard,
  ] = useState(null);

  const [
    editing,
    setEditing,
  ] = useState(null);


  /* =========================================================
     OWN CPF CALCULATION
  ========================================================= */

  const ownCalculation =
    useMemo(() => {

      return calculateCPF({
        openingBalance:
          record.own.openingBalance,

        monthlyDeposit:
          record.own.monthlyContribution,

        interestRates:
          record.own.interestRates,

        financialYear:
          record.financialYear,
      });

    }, [record]);


  /* =========================================================
     NVS CPF CALCULATION
  ========================================================= */

  const nvsCalculation =
    useMemo(() => {

      return calculateNVSCPF({
        openingBalance:
          record.nvs.openingBalance,

        basicPay:
          record.nvs.basicPay,

        interestRates:
          record.nvs.interestRates,

        financialYear:
          record.financialYear,
      });

    }, [record]);


  /* =========================================================
     AVERAGE INTEREST RATE
     OWN CPF
  ========================================================= */

  const ownAverageRate =
    useMemo(
      () =>
        calculateAverageInterestRate(
          record.own.interestRates
        ),
      [
        record.own.interestRates,
      ]
    );


  /* =========================================================
     AVERAGE INTEREST RATE
     NVS CPF
  ========================================================= */

  const nvsAverageRate =
    useMemo(
      () =>
        calculateAverageInterestRate(
          record.nvs.interestRates
        ),
      [
        record.nvs.interestRates,
      ]
    );


  /* =========================================================
     SUMMARY CALCULATION
  ========================================================= */

  const summary =
    useMemo(
      () =>
        calculateCPFSummary({
          ownCPF:
            ownCalculation,

          nvsCPF:
            nvsCalculation,
        }),
      [
        ownCalculation,
        nvsCalculation,
      ]
    );


  /* =========================================================
     SAVE CPF
  ========================================================= */

  async function handleSave(
    mode,
    formData
  ) {
    try {

      await saveCPF(
        mode,
        formData
      );

      setEditing(null);

    } catch (err) {

      console.error(
        "CPF save error:",
        err
      );

    }
  }


  /* =========================================================
     OPEN EDIT FORM
  ========================================================= */

  function openEdit(mode) {
    setEditing(mode);
  }


  /* =========================================================
     CLOSE EDIT FORM
  ========================================================= */

  function closeEdit() {

    if (!saving) {
      setEditing(null);
    }

  }


  /* =========================================================
     EXPAND / COLLAPSE MONTHLY TABLE
  ========================================================= */

  function toggleCard(card) {

    setExpandedCard(
      (current) =>
        current === card
          ? null
          : card
    );

  }


  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {

    return (
      <main
        className="
          min-h-screen
          bg-slate-950
          px-4
          py-6
        "
      >

        <div
          className="
            mx-auto
            max-w-6xl
          "
        >

          <div
            className="
              flex
              min-h-[60vh]
              items-center
              justify-center
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                text-slate-400
              "
            >

              <LoaderCircle
                size={22}
                className="animate-spin"
              />

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                Loading CPF...
              </span>

            </div>

          </div>

        </div>

      </main>
    );

  }


  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-white
        px-0
        py-5
        sm:px-6
        sm:py-7
      "
    >

      <div
        className="
          mx-auto
          max-w-6xl
        "
      >

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header
          className="
            mb-6
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-4
            shadow-lg
            sm:p-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* Back Button */}

            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                text-slate-300
                transition
                hover:border-slate-600
                hover:bg-slate-700
                hover:text-white
                active:scale-95
              "
              aria-label="Go back"
            >

              <ArrowLeft size={19} />

            </button>


            {/* Header Content */}

            <div className="min-w-0">

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                "
              >
                Financial Planning
              </p>

              <h1
                className="
                  mt-0.5
                  text-xl
                  font-bold
                  tracking-tight
                  text-white
                  sm:text-2xl
                "
              >
                CPF
              </h1>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-400
                  sm:text-sm
                "
              >
                Financial Year{" "}
                {record.financialYear}
              </p>

            </div>

          </div>

        </header>


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (

          <div
            className="
              mb-5
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-red-900/60
              bg-red-950/40
              p-4
              text-sm
              text-red-300
            "
          >

            <AlertCircle
              size={18}
              className="
                mt-0.5
                shrink-0
              "
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* =====================================================
            CPF CARDS
        ====================================================== */}

        <div
          className="
            space-y-5
          "
        >

          {/* =================================================
              1. SUMMARY CARD
          ================================================== */}

          <CFPSummaryCard
            financialYear={
              record.financialYear
            }

            ownClosingBalance={
              summary.ownClosingBalance
            }

            nvsClosingBalance={
              summary.nvsClosingBalance
            }

            totalClosingBalance={
              summary.totalClosingBalance
            }

            ownInterest={
              ownCalculation.totalInterest
            }

            nvsInterest={
              nvsCalculation.totalInterest
            }
          />


          {/* =================================================
              2. OWN CPF CARD
          ================================================== */}

          <OwnCPFCard
            data={record.own}

            calculation={
              ownCalculation
            }

            averageInterestRate={
              ownAverageRate
            }

            expanded={
              expandedCard === "own"
            }

            onToggle={() =>
              toggleCard("own")
            }

            onEdit={() =>
              openEdit("own")
            }
          />


          {/* =================================================
              3. NVS CPF CARD
          ================================================== */}

          <NVSCPFCard
            data={record.nvs}

            calculation={
              nvsCalculation
            }

            averageInterestRate={
              nvsAverageRate
            }

            expanded={
              expandedCard === "nvs"
            }

            onToggle={() =>
              toggleCard("nvs")
            }

            onEdit={() =>
              openEdit("nvs")
            }
          />

        </div>

      </div>


      {/* =====================================================
          EDIT FORM / MODAL
      ====================================================== */}

      {editing && (

        <CPFEditForm
          mode={editing}

          initialData={{
            ...record[editing],

            financialYear:
              record.financialYear,
          }}

          saving={saving}

          onClose={
            closeEdit
          }

          onSave={(data) =>
            handleSave(
              editing,
              data
            )
          }
        />

      )}

    </main>
  );
}