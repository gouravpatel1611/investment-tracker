import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "./AuthContext";

import {
  addInvestor,
  deleteInvestor,
  getInvestors,
  updateInvestor,
} from "../services/firebase/investorService";


const InvestorContext =
  createContext(null);


/* =========================================================
   INVESTOR PROVIDER
========================================================= */

export function InvestorProvider({
  children,
}) {

  const {
    user,
    loading: authLoading,
  } = useAuth();


  const [
    investors,
    setInvestors,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     LOAD INVESTORS
  ======================================================= */

  async function loadInvestors() {

    if (!user) {

      setInvestors([]);

      setLoading(false);

      return;
    }


    setLoading(true);

    setError("");


    try {

      const data =
        await getInvestors();


      setInvestors(data);

    } catch (error) {

      console.error(
        "Failed to load investors:",
        error
      );


      setError(
        "Unable to load investors."
      );

    } finally {

      setLoading(false);

    }

  }


  /* =======================================================
     LOAD WHEN USER CHANGES
  ======================================================= */

  useEffect(() => {

    if (authLoading) {
      return;
    }

    loadInvestors();

  }, [
    user,
    authLoading,
  ]);


  /* =======================================================
     ADD
  ======================================================= */

  async function createInvestor(
    name
  ) {

    const newInvestor =
      await addInvestor(name);


    setInvestors((current) =>
      [...current, newInvestor]
        .sort((a, b) =>
          a.name.localeCompare(
            b.name
          )
        )
    );


    return newInvestor;
  }


  /* =======================================================
     UPDATE
  ======================================================= */

  async function editInvestor(
    id,
    name
  ) {

    const updatedInvestor =
      await updateInvestor(
        id,
        name
      );


    setInvestors((current) =>
      current
        .map((investor) =>
          investor.id === id
            ? updatedInvestor
            : investor
        )
        .sort((a, b) =>
          a.name.localeCompare(
            b.name
          )
        )
    );


    return updatedInvestor;
  }


  /* =======================================================
     DELETE
  ======================================================= */

  async function removeInvestor(
    id
  ) {

    await deleteInvestor(id);


    setInvestors((current) =>
      current.filter(
        (investor) =>
          investor.id !== id
      )
    );

  }


  /* =======================================================
     REFRESH
  ======================================================= */

  async function reload() {
    await loadInvestors();
  }


  return (
    <InvestorContext.Provider
      value={{
        investors,

        loading,

        error,

        createInvestor,

        editInvestor,

        removeInvestor,

        reload,
      }}
    >
      {children}
    </InvestorContext.Provider>
  );

}


/* =========================================================
   HOOK
========================================================= */

export function useInvestors() {

  return useContext(
    InvestorContext
  );

}