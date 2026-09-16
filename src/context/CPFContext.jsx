import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  getCPFRecord,
  saveCPFRecord,
} from "../services/firebase/cpfService";

import {
  getCurrentFinancialYear,
  getFinancialYearDates,
} from "../utils/cpf/cpfHelpers";


const CPFContext =
  createContext(null);


/* =========================================================
   EMPTY RECORD
========================================================= */

const EMPTY_RECORD = {
  own: {
    openingBalance: 0,
    openingDate: "",
    monthlyContribution: 0,
    closingDate: "",
    interestRates: {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0,
    },
  },

  nvs: {
    openingBalance: 0,
    openingDate: "",
    basicPay: 0,
    closingDate: "",
    interestRates: {
      Q1: 0,
      Q2: 0,
      Q3: 0,
      Q4: 0,
    },
  },
};


/* =========================================================
   DEFAULT RECORD
========================================================= */

function createDefaultRecord() {
  const financialYear =
    getCurrentFinancialYear();

  const {
    startDate,
    endDate,
  } =
    getFinancialYearDates(
      financialYear
    );

  return {
    financialYear,

    own: {
      ...EMPTY_RECORD.own,

      openingDate:
        startDate,

      closingDate:
        endDate,

      interestRates: {
        ...EMPTY_RECORD
          .own
          .interestRates,
      },
    },

    nvs: {
      ...EMPTY_RECORD.nvs,

      openingDate:
        startDate,

      closingDate:
        endDate,

      interestRates: {
        ...EMPTY_RECORD
          .nvs
          .interestRates,
      },
    },
  };
}


/* =========================================================
   NORMALIZE RECORD
========================================================= */

function normalizeRecord(
  savedRecord
) {
  const defaultRecord =
    createDefaultRecord();

  if (!savedRecord) {
    return defaultRecord;
  }

  return {
    financialYear:
      savedRecord.financialYear ||
      defaultRecord.financialYear,

    own: {
      ...EMPTY_RECORD.own,

      ...(savedRecord.own || {}),

      interestRates: {
        ...EMPTY_RECORD
          .own
          .interestRates,

        ...(savedRecord
          .own
          ?.interestRates || {}),
      },
    },

    nvs: {
      ...EMPTY_RECORD.nvs,

      ...(savedRecord.nvs || {}),

      interestRates: {
        ...EMPTY_RECORD
          .nvs
          .interestRates,

        ...(savedRecord
          .nvs
          ?.interestRates || {}),
      },
    },
  };
}


/* =========================================================
   PROVIDER
========================================================= */

export function CPFProvider({
  children,
}) {
  const { user } =
    useAuth();

  const [
    record,
    setRecord,
  ] = useState(
    createDefaultRecord()
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     LOAD CPF
  ======================================================= */

  useEffect(() => {
    let active = true;

    async function loadCPF() {
      if (!user?.uid) {
        if (active) {
          setRecord(
            createDefaultRecord()
          );

          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const savedRecord =
          await getCPFRecord(
            user.uid
          );

        if (!active) {
          return;
        }

        setRecord(
          normalizeRecord(
            savedRecord
          )
        );
      } catch (err) {
        console.error(
          "CPF loading error:",
          err
        );

        if (active) {
          setError(
            "Unable to load CPF data."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCPF();

    return () => {
      active = false;
    };
  }, [user?.uid]);


  /* =======================================================
     SAVE CPF
  ======================================================= */

  async function saveCPF(
    mode,
    formData
  ) {
    if (!user?.uid) {
      const error =
        new Error(
          "Please login before saving CPF data."
        );

      setError(
        error.message
      );

      throw error;
    }

    try {
      setSaving(true);
      setError("");

      const updatedRecord = {
        ...record,

        [mode]: {
          ...record[mode],

          ...formData,

          interestRates: {
            ...record[mode]
              .interestRates,

            ...(formData
              ?.interestRates || {}),
          },
        },
      };

      await saveCPFRecord(
        user.uid,
        updatedRecord
      );

      setRecord(
        updatedRecord
      );

      return updatedRecord;
    } catch (err) {
      console.error(
        "CPF save error:",
        err
      );

      setError(
        "Unable to save CPF data."
      );

      throw err;
    } finally {
      setSaving(false);
    }
  }


  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  function clearError() {
    setError("");
  }


  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
    record,

    setRecord,

    loading,

    saving,

    error,

    saveCPF,

    clearError,
  };


  return (
    <CPFContext.Provider
      value={value}
    >
      {children}
    </CPFContext.Provider>
  );
}


/* =========================================================
   HOOK
========================================================= */

export function useCPF() {
  const context =
    useContext(CPFContext);

  if (!context) {
    throw new Error(
      "useCPF must be used inside CPFProvider"
    );
  }

  return context;
}