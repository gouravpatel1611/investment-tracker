import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import db from "./firestore";
import auth from "./auth";

/* =========================================================
   COLLECTION
========================================================= */

const COLLECTION_NAME = "sgbTransactions";

/* =========================================================
   GET CURRENT USER COLLECTION

   Firestore structure:

   users
    └── {Firebase UID}
         └── sgbTransactions
              ├── transaction
              ├── transaction
              └── ...
========================================================= */

function getUserCollection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  return collection(
    db,
    "users",
    user.uid,
    COLLECTION_NAME
  );
}

/* =========================================================
   ADD SGB TRANSACTION
========================================================= */

export async function addSGBTransaction(
  transaction
) {
  try {
    if (!transaction) {
      throw new Error(
        "SGB transaction data is required."
      );
    }

    const dataToSave = {
      ...transaction,
      createdAt: serverTimestamp(),
    };

    /*
      Local React id Firestore me save nahi karna.
      Firestore khud document id generate karega.
    */

    delete dataToSave.id;

    const docRef = await addDoc(
      getUserCollection(),
      dataToSave
    );

    return {
      ...transaction,
      id: docRef.id,
    };
  } catch (error) {
    console.error(
      "Failed to add SGB transaction:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET ALL SGB TRANSACTIONS
========================================================= */

export async function getSGBTransactions() {
  try {
    const q = query(
      getUserCollection(),
      orderBy("issueDate", "desc")
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (item) => ({
        ...item.data(),
        id: item.id,
      })
    );
  } catch (error) {
    console.error(
      "Failed to fetch SGB transactions:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE SGB TRANSACTION
========================================================= */

export async function deleteSGBTransaction(
  id
) {
  try {
    if (!id) {
      throw new Error(
        "SGB transaction ID is required for deletion."
      );
    }

    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        "User is not logged in."
      );
    }

    await deleteDoc(
      doc(
        db,
        "users",
        user.uid,
        COLLECTION_NAME,
        String(id)
      )
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to delete SGB transaction:",
      error
    );

    throw error;
  }
}