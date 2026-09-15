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

const COLLECTION_NAME =
  "etfStockTransactions";

/* =========================================================
   USER ETF / STOCK COLLECTION

   Firestore structure:

   users
    └── {Firebase UID}
         └── etfStockTransactions
              ├── transaction
              ├── transaction
              └── ...
========================================================= */

function getUserCollection() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "User is not logged in."
    );
  }

  return collection(
    db,
    "users",
    user.uid,
    COLLECTION_NAME
  );
}

/* =========================================================
   ADD TRANSACTION
========================================================= */

export async function addETFStockTransaction(
  transaction
) {
  try {
    const dataToSave = {
      ...transaction,
      createdAt: serverTimestamp(),
    };

    /*
      Local id Firestore document ke andar
      save nahi karna.
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
      "Failed to add ETF / Stock transaction:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET ALL TRANSACTIONS
========================================================= */

export async function getETFStockTransactions() {
  try {
    const q = query(
      getUserCollection(),
      orderBy(
        "transactionDate",
        "desc"
      )
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
      "Failed to fetch ETF / Stock transactions:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE TRANSACTION
========================================================= */

export async function deleteETFStockTransaction(
  id
) {
  try {
    if (!id) {
      throw new Error(
        "Transaction ID is required for deletion."
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
      "Failed to delete ETF / Stock transaction:",
      error
    );

    throw error;
  }
}