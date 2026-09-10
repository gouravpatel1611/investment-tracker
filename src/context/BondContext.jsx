import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getBonds,
  addBond as addBondService,
  updateBond as updateBondService,
  deleteBond as deleteBondService,
} from "../services/firebase/bondService";

import auth from "../services/firebase/auth";

const BondContext = createContext(null);

export function BondProvider({ children }) {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     AUTH + FETCH BONDS
  ========================================================= */

  useEffect(() => {
    const unsubscribe =
      auth.onAuthStateChanged(
        async (user) => {
          if (!user) {
            setBonds([]);
            setLoading(false);
            return;
          }

          try {
            setLoading(true);
            setError("");

            const data =
              await getBonds();

            setBonds(data);
          } catch (err) {
            console.error(
              "Failed to fetch bonds:",
              err
            );

            setError(
              "Bonds load nahi ho pa rahe hain."
            );
          } finally {
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, []);

  /* =========================================================
     ADD BOND
  ========================================================= */

  const addBond = async (bond) => {
    try {
      const savedBond =
        await addBondService(bond);

      setBonds((prev) => [
        savedBond,
        ...prev,
      ]);

      return savedBond;
    } catch (err) {
      console.error(
        "Failed to add bond:",
        err
      );

      throw err;
    }
  };

  /* =========================================================
     UPDATE BOND
  ========================================================= */

  const updateBond = async (
    id,
    bond
  ) => {
    try {
      const updatedBond =
        await updateBondService(
          id,
          bond
        );

      setBonds((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updatedBond,
              }
            : item
        )
      );

      return updatedBond;
    } catch (err) {
      console.error(
        "Failed to update bond:",
        err
      );

      throw err;
    }
  };

  /* =========================================================
     DELETE BOND
  ========================================================= */

  const deleteBond = async (id) => {
    try {
      await deleteBondService(id);

      setBonds((prev) =>
        prev.filter(
          (bond) =>
            bond.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete bond:",
        err
      );

      throw err;
    }
  };

  return (
    <BondContext.Provider
      value={{
        bonds,
        loading,
        error,
        addBond,
        updateBond,
        deleteBond,
      }}
    >
      {children}
    </BondContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useBonds() {
  const context =
    useContext(BondContext);

  if (!context) {
    throw new Error(
      "useBonds must be used inside BondProvider"
    );
  }

  return context;
}