import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import db from "./firestore";
import auth from "./auth";

const COLLECTION_NAME = "cpf";

const DOCUMENT_ID = "profile";

/**
 * Current logged-in user ka CPF document.
 *
 * users/{uid}/cpf/profile
 */
function getUserCPFDocument() {
  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "User is not logged in."
    );
  }

  return doc(
    db,
    "users",
    user.uid,
    COLLECTION_NAME,
    DOCUMENT_ID
  );
}

/**
 * CPF record fetch
 *
 * Financial year ke according
 * alag document nahi banega.
 *
 * Sirf ek profile document hoga.
 */
export async function getCPFRecord(
  uid
) {
  try {
    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        "User is not logged in."
      );
    }

    if (
      uid &&
      uid !== user.uid
    ) {
      throw new Error(
        "Unauthorized CPF access."
      );
    }

    const recordRef =
      getUserCPFDocument();

    const snapshot =
      await getDoc(
        recordRef
      );

    if (
      !snapshot.exists()
    ) {
      return null;
    }

    return {
      id: snapshot.id,

      ...snapshot.data(),
    };
  } catch (error) {
    console.error(
      "Failed to fetch CPF record:",
      error
    );

    throw error;
  }
}

/**
 * CPF record save
 *
 * Structure:
 *
 * users/{uid}/cpf/profile
 *
 * Data:
 *
 * {
 *   financialYear,
 *   own: {...},
 *   nvs: {...}
 * }
 */
export async function saveCPFRecord(
  uid,
  data
) {
  try {
    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        "User is not logged in."
      );
    }

    if (
      uid &&
      uid !== user.uid
    ) {
      throw new Error(
        "Unauthorized CPF access."
      );
    }

    if (!data) {
      throw new Error(
        "CPF data is required."
      );
    }

    if (
      !data.financialYear
    ) {
      throw new Error(
        "Financial year is required."
      );
    }

    const recordRef =
      getUserCPFDocument();

    const dataToSave = {
      ...data,

      updatedAt:
        serverTimestamp(),
    };

    /**
     * Firestore document ID
     * manually save nahi karna.
     */
    delete dataToSave.id;

    await setDoc(
      recordRef,
      dataToSave,
      {
        merge: true,
      }
    );

    return {
      id: DOCUMENT_ID,

      ...data,
    };
  } catch (error) {
    console.error(
      "Failed to save CPF record:",
      error
    );

    throw error;
  }
}