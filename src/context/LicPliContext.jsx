import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  calculateTotalPaid,
} from "../utils/licPli/licPliCalculations";

import {
  addLicPliPolicy,
  getLicPliPolicies,
  updateLicPliPolicy,
  deleteLicPliPolicy,
} from "../services/firebase/licPliService";

import auth from "../services/firebase/auth";

const LicPliContext = createContext(null);

export function LicPliProvider({ children }) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD FIREBASE DATA
  ======================================================= */

  useEffect(() => {
    let unsubscribe;

    async function loadPolicies() {
      try {
        setLoading(true);

        if (!auth.currentUser) {
          setPolicies([]);
          return;
        }

        const data = await getLicPliPolicies();

        setPolicies(data);
      } catch (error) {
        console.error(
          "Failed to load LIC / PLI policies:",
          error
        );

        setPolicies([]);
      } finally {
        setLoading(false);
      }
    }

    /*
      Auth state change hone par
      LIC / PLI data reload hoga.
    */

    import("firebase/auth").then(
      ({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(
          auth,
          async () => {
            await loadPolicies();
          }
        );
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /* =======================================================
     ADD POLICY
  ======================================================= */

  async function addPolicy(data) {
    const premiumAmount =
      Number(data.premiumAmount) || 0;

    const installmentPaid =
      Number(data.installmentPaid) || 0;

    const gstAmountPaid =
      Number(data.gstAmountPaid) || 0;

    const totalPaid =
      calculateTotalPaid(
        premiumAmount,
        installmentPaid,
        gstAmountPaid
      );

    const policyData = {
      ...data,

      premiumAmount,

      installmentPaid,

      gstAmountPaid,

      totalPaid,
    };

    const savedPolicy =
      await addLicPliPolicy(policyData);

    setPolicies((prev) => [
      savedPolicy,
      ...prev,
    ]);

    return savedPolicy;
  }

  /* =======================================================
     UPDATE POLICY
  ======================================================= */

  async function updatePolicy(id, data) {
    const premiumAmount =
      Number(data.premiumAmount) || 0;

    const installmentPaid =
      Number(data.installmentPaid) || 0;

    const gstAmountPaid =
      Number(data.gstAmountPaid) || 0;

    const totalPaid =
      calculateTotalPaid(
        premiumAmount,
        installmentPaid,
        gstAmountPaid
      );

    const policyData = {
      ...data,

      premiumAmount,

      installmentPaid,

      gstAmountPaid,

      totalPaid,
    };

    const updatedPolicy =
      await updateLicPliPolicy(
        id,
        policyData
      );

    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === id
          ? updatedPolicy
          : policy
      )
    );

    return updatedPolicy;
  }

  /* =======================================================
     DELETE POLICY
  ======================================================= */

  async function deletePolicy(id) {
    await deleteLicPliPolicy(id);

    setPolicies((prev) =>
      prev.filter(
        (policy) => policy.id !== id
      )
    );
  }

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      policies,
      loading,
      addPolicy,
      updatePolicy,
      deletePolicy,
    }),
    [policies, loading]
  );

  return (
    <LicPliContext.Provider value={value}>
      {children}
    </LicPliContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useLicPli() {
  const context = useContext(
    LicPliContext
  );

  if (!context) {
    throw new Error(
      "useLicPli must be used inside LicPliProvider"
    );
  }

  return context;
}