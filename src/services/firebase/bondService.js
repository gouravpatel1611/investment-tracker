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

const COLLECTION_NAME = "bonds";

/* =========================================================
   USER BOND COLLECTION

   Firestore structure:

   users
    └── {Firebase UID}
         └── bonds
              ├── bond
              ├── bond
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
   ADD BOND
========================================================= */

export async function addBond(bond) {
  try {
    const dataToSave = {
      ...bond,
      createdAt: serverTimestamp(),
    };

    /*
      Local id agar form/object me ho
      to Firestore me save nahi karna.
    */

    delete dataToSave.id;

    const docRef = await addDoc(
      getUserCollection(),
      dataToSave
    );

    return {
      ...bond,
      id: docRef.id,
    };
  } catch (error) {
    console.error(
      "Failed to add bond:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET ALL BONDS
========================================================= */

export async function getBonds() {
  try {
    const q = query(
      getUserCollection(),
      orderBy("purchaseDate", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (item) => ({
        ...item.data(),
        id: item.id,
      })
    );
  } catch (error) {
    console.error(
      "Failed to fetch bonds:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE BOND
========================================================= */

export async function deleteBond(id) {
  try {
    if (!id) {
      throw new Error(
        "Bond ID is required for deletion."
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
      "Failed to delete bond:",
      error
    );

    throw error;
  }
}