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
  "mutualFundTransactions";

/* =========================================================
   USER MUTUAL FUND COLLECTION

   Firestore structure:

   users
    └── {Firebase UID}
         └── mutualFundTransactions
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

export async function addMutualFundTransaction(
  transaction
) {
  try {
    const dataToSave = {
      ...transaction,
      createdAt: serverTimestamp(),
    };

    /*
      Firebase document ke andar apna
      local id save nahi karna.
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
      "Failed to add mutual fund transaction:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET ALL TRANSACTIONS
========================================================= */

export async function getMutualFundTransactions() {
  try {
    const q = query(
      getUserCollection(),
      orderBy(
        "purchaseDate",
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
      "Failed to fetch mutual fund transactions:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE TRANSACTION
========================================================= */

export async function deleteMutualFundTransaction(
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
      "Failed to delete mutual fund transaction:",
      error
    );

    throw error;
  }
}