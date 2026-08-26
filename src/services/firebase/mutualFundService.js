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

const COLLECTION_NAME = "mutualFundTransactions";

/* --------------------------------
   ADD MUTUAL FUND TRANSACTION
-------------------------------- */

export async function addMutualFundTransaction(transaction) {
  try {
    /*
      Firebase document me custom id save
      karne ki zarurat nahi hai.

      Firebase khud document ID generate karega.
    */

    const dataToSave = {
      ...transaction,

      /*
        Agar transaction ke andar id hai,
        to usko Firebase document data me
        rakhne ki zarurat nahi.
      */
      id: undefined,

      createdAt: serverTimestamp(),
    };

    /*
      undefined id ko remove kar do
    */
    delete dataToSave.id;

    const docRef = await addDoc(
      collection(db, COLLECTION_NAME),
      dataToSave
    );

    /*
      IMPORTANT:
      Firebase document ID ko last me set karna hai.
    */

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

/* --------------------------------
   GET ALL MUTUAL FUND TRANSACTIONS
-------------------------------- */

export async function getMutualFundTransactions() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("purchaseDate", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      /*
        Pehle Firebase data
      */
      ...item.data(),

      /*
        IMPORTANT:
        Firebase document ID ko LAST me rakho.
        Isse data ke andar agar purana
        id field bhi ho to Firebase ID hi milegi.
      */
      id: item.id,
    }));
  } catch (error) {
    console.error(
      "Failed to fetch mutual fund transactions:",
      error
    );

    throw error;
  }
}

/* --------------------------------
   DELETE MUTUAL FUND TRANSACTION
-------------------------------- */

export async function deleteMutualFundTransaction(id) {
  try {
    if (!id) {
      throw new Error(
        "Transaction ID is required for deletion."
      );
    }

    await deleteDoc(
      doc(
        db,
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