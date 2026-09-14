
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addIntFd,
  getIntFds,
  updateIntFd,
  deleteIntFd,
} from "../services/firebase/intFdService";

import {
  useAuth,
} from "./AuthContext";

const IntFdContext =
  createContext(null);

/* =========================================================
   PROVIDER
========================================================= */

export function IntFdProvider({
  children,
}) {
  /* =======================================================
     AUTH
  ======================================================= */

  const {
    user,
    loading: authLoading,
  } = useAuth();

  /* =======================================================
     FD DATA
  ======================================================= */

  const [
    fds,
    setFds,
  ] = useState([]);

  /* =======================================================
     LOADING
  ======================================================= */

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* =======================================================
     ERROR
  ======================================================= */

  const [
    error,
    setError,
  ] = useState("");

  /* =======================================================
     EDITING FD
  ======================================================= */

  const [
    editingFd,
    setEditingFd,
  ] = useState(null);

  /* =======================================================
     LOAD FIREBASE DATA
  ======================================================= */

  const loadFds =
    useCallback(
      async () => {

        /*
          Firebase Auth abhi check kar raha hai.
        */

        if (authLoading) {
          return;
        }

        /*
          User login nahi hai.
        */

        if (!user?.uid) {
          setFds([]);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");

        try {
          const data =
            await getIntFds();

          setFds(data);
        } catch (error) {

          console.error(
            "Failed to load INT-FD data:",
            error
          );

          setError(
            "Unable to load INT-FD data."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        user?.uid,
        authLoading,
      ]
    );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    if (authLoading) {
      return;
    }

    loadFds();

  }, [
    authLoading,
    loadFds,
  ]);

  /* =======================================================
     ADD FD
  ======================================================= */

  const addFd =
    useCallback(
      async (fdData) => {

        try {

          const savedFd =
            await addIntFd(
              fdData
            );

          setFds(
            (current) => [
              savedFd,
              ...current,
            ]
          );

          return savedFd;

        } catch (error) {

          console.error(
            "Add INT-FD error:",
            error
          );

          throw error;
        }
      },
      []
    );

  /* =======================================================
     UPDATE FD
  ======================================================= */

  const updateFd =
    useCallback(
      async (
        id,
        fdData
      ) => {

        if (!id) {
          throw new Error(
            "FD ID is required."
          );
        }

        try {

          const updatedFd =
            await updateIntFd(
              id,
              fdData
            );

          setFds(
            (current) =>
              current.map(
                (fd) =>
                  fd.id === id
                    ? {
                        ...fd,
                        ...updatedFd,
                      }
                    : fd
              )
          );

          return updatedFd;

        } catch (error) {

          console.error(
            "Update INT-FD error:",
            error
          );

          throw error;
        }
      },
      []
    );

  /* =======================================================
     DELETE FD
  ======================================================= */

  const deleteFd =
    useCallback(
      async (id) => {

        if (!id) {
          throw new Error(
            "FD ID is required."
          );
        }

        try {

          await deleteIntFd(
            id
          );

          setFds(
            (current) =>
              current.filter(
                (fd) =>
                  fd.id !== id
              )
          );

          return true;

        } catch (error) {

          console.error(
            "Delete INT-FD error:",
            error
          );

          throw error;
        }
      },
      []
    );

  /* =======================================================
     GET FD BY ID
  ======================================================= */

  const getFdById =
    useCallback(
      (id) => {

        return (
          fds.find(
            (fd) =>
              fd.id === id
          ) || null
        );

      },
      [fds]
    );

  /* =======================================================
     START EDITING
  ======================================================= */

  const startEditing =
    useCallback(
      (fd) => {
        setEditingFd(fd);
      },
      []
    );

  /* =======================================================
     STOP EDITING
  ======================================================= */

  const stopEditing =
    useCallback(
      () => {
        setEditingFd(null);
      },
      []
    );

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({
        fds,

        editingFd,

        loading,

        error,

        addFd,

        updateFd,

        deleteFd,

        getFdById,

        startEditing,

        stopEditing,

        reload:
          loadFds,
      }),
      [
        fds,
        editingFd,
        loading,
        error,
        addFd,
        updateFd,
        deleteFd,
        getFdById,
        startEditing,
        stopEditing,
        loadFds,
      ]
    );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <IntFdContext.Provider
      value={value}
    >
      {children}
    </IntFdContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useIntFd() {

  const context =
    useContext(
      IntFdContext
    );

  if (!context) {
    throw new Error(
      "useIntFd must be used inside IntFdProvider"
    );
  }

  return context;
}

