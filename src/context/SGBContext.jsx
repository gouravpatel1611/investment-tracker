import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "./AuthContext";

import {
  getSGBPortfolio,
} from "../services/sgb/sgbPortfolioService";

import {
  addSGBTransaction,
  deleteSGBTransaction,
} from "../services/firebase/sgbService";

// ==========================================================
// CONTEXT
// ==========================================================

const SGBContext =
  createContext(null);

// ==========================================================
// EMPTY PORTFOLIO
// ==========================================================

const EMPTY_PORTFOLIO = {
  holdings: [],

  summary: {
    seriesCount: 0,
    units: 0,
    purchaseRate: 0,
    purchaseValue: 0,
    currentRate: 0,
    currentValue: 0,
    profit: 0,
    interest: 0,
    gain: 0,
    totalGainPercent: 0,
  },
};

// ==========================================================
// PROVIDER
// ==========================================================

export function SGBProvider({
  children,
}) {
  // --------------------------------------------------------
  // AUTH
  // --------------------------------------------------------

  const {
    user,
    loading: authLoading,
  } = useAuth();

  // --------------------------------------------------------
  // PORTFOLIO
  // --------------------------------------------------------

  const [
    portfolio,
    setPortfolio,
  ] = useState(
    EMPTY_PORTFOLIO
  );

  // --------------------------------------------------------
  // SGB LOADING
  // --------------------------------------------------------

  const [
    loading,
    setLoading,
  ] = useState(true);

  // --------------------------------------------------------
  // ERROR
  // --------------------------------------------------------

  const [
    error,
    setError,
  ] = useState(null);

  // ========================================================
  // LOAD PORTFOLIO
  // ========================================================

  const loadPortfolio =
    useCallback(
      async () => {
        // --------------------------------------------------
        // Auth abhi determine nahi hua
        // --------------------------------------------------

        if (authLoading) {
          return;
        }

        // --------------------------------------------------
        // User logged in nahi hai
        // --------------------------------------------------

        if (!user) {
          setPortfolio(
            EMPTY_PORTFOLIO
          );

          setLoading(false);
          setError(null);

          return;
        }

        // --------------------------------------------------
        // Load SGB
        // --------------------------------------------------

        try {
          setLoading(true);
          setError(null);

          const data =
            await getSGBPortfolio();

          setPortfolio(
            data || EMPTY_PORTFOLIO
          );
        } catch (error) {
          console.error(
            "Failed to load SGB portfolio:",
            error
          );

          setError(
            error?.message ||
              "Unable to load SGB portfolio"
          );

          setPortfolio(
            EMPTY_PORTFOLIO
          );
        } finally {
          setLoading(false);
        }
      },
      [
        user,
        authLoading,
      ]
    );

  // ========================================================
  // INITIAL / AUTH CHANGE LOAD
  // ========================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadPortfolio();
  }, [
    authLoading,
    user,
    loadPortfolio,
  ]);

  // ========================================================
  // ADD SGB
  // ========================================================

  const addSGB =
    useCallback(
      async (transaction) => {
        if (!user) {
          throw new Error(
            "User is not logged in."
          );
        }

        try {
          setError(null);

          const newTransaction =
            await addSGBTransaction(
              transaction
            );

          // ----------------------------------------------
          // Refresh portfolio
          // ----------------------------------------------

          await loadPortfolio();

          return newTransaction;
        } catch (error) {
          console.error(
            "Failed to add SGB:",
            error
          );

          setError(
            error?.message ||
              "Unable to add SGB"
          );

          throw error;
        }
      },
      [
        user,
        loadPortfolio,
      ]
    );

  // ========================================================
  // DELETE SGB
  // ========================================================

  const deleteSGB =
    useCallback(
      async (id) => {
        if (!user) {
          throw new Error(
            "User is not logged in."
          );
        }

        try {
          setError(null);

          await deleteSGBTransaction(
            id
          );

          // ----------------------------------------------
          // Refresh portfolio
          // ----------------------------------------------

          await loadPortfolio();

          return true;
        } catch (error) {
          console.error(
            "Failed to delete SGB:",
            error
          );

          setError(
            error?.message ||
              "Unable to delete SGB"
          );

          throw error;
        }
      },
      [
        user,
        loadPortfolio,
      ]
    );

  // ========================================================
  // REFRESH
  // ========================================================

  const refreshSGB =
    useCallback(
      async () => {
        if (!user) {
          return;
        }

        await loadPortfolio();
      },
      [
        user,
        loadPortfolio,
      ]
    );

  // ========================================================
  // CONTEXT VALUE
  // ========================================================

  const value = {
    // ------------------------------------------------------
    // Portfolio
    // ------------------------------------------------------

    portfolio,

    holdings:
      portfolio?.holdings || [],

    summary:
      portfolio?.summary || {},

    // ------------------------------------------------------
    // State
    // ------------------------------------------------------

    loading:
      authLoading ||
      loading,

    error,

    // ------------------------------------------------------
    // Auth
    // ------------------------------------------------------

    user,

    // ------------------------------------------------------
    // Actions
    // ------------------------------------------------------

    addSGB,

    deleteSGB,

    refreshSGB,

    reload:
      refreshSGB,
  };

  return (
    <SGBContext.Provider
      value={value}
    >
      {children}
    </SGBContext.Provider>
  );
}

// ==========================================================
// HOOK
// ==========================================================

export function useSGB() {
  const context =
    useContext(
      SGBContext
    );

  if (!context) {
    throw new Error(
      "useSGB must be used inside SGBProvider"
    );
  }

  return context;
}