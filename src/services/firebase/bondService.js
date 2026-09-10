import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import db from "./firestore";
import auth from "./auth";

const COLLECTION_NAME = "bonds";

/* =========================================================
   USER BOND COLLECTION
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
    console.error("Failed to add bond:", error);
    throw error;
  }
}

/* =========================================================
   UPDATE BOND
========================================================= */

export async function updateBond(id, bond) {
  try {
    if (!id) {
      throw new Error(
        "Bond ID is required for update."
      );
    }

    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not logged in.");
    }

    const dataToSave = {
      ...bond,
      updatedAt: serverTimestamp(),
    };

    delete dataToSave.id;
    delete dataToSave.createdAt;

    const bondRef = doc(
      db,
      "users",
      user.uid,
      COLLECTION_NAME,
      String(id)
    );

    await updateDoc(
      bondRef,
      dataToSave
    );

    return {
      ...bond,
      id,
    };
  } catch (error) {
    console.error(
      "Failed to update bond:",
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