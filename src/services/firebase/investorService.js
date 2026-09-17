import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import db from "./firestore";
import auth from "./auth";

const COLLECTION_NAME =
  "investors";

/* =========================================================
   USER INVESTOR COLLECTION

   Firestore structure:

   users
    └── {Firebase UID}
         └── investors
              ├── investor
              ├── investor
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
   ADD INVESTOR
========================================================= */

export async function addInvestor(
  name
) {
  try {
    const investorName =
      String(name || "").trim();

    if (!investorName) {
      throw new Error(
        "Investor name is required."
      );
    }

    const dataToSave = {
      name: investorName,
      createdAt:
        serverTimestamp(),
    };

    const docRef = await addDoc(
      getUserCollection(),
      dataToSave
    );

    return {
      id: docRef.id,
      name: investorName,
    };
  } catch (error) {
    console.error(
      "Failed to add investor:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET ALL INVESTORS
========================================================= */

export async function getInvestors() {
  try {
    const q = query(
      getUserCollection(),
      orderBy(
        "name",
        "asc"
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
      "Failed to fetch investors:",
      error
    );

    throw error;
  }
}

/* =========================================================
   UPDATE INVESTOR
========================================================= */

export async function updateInvestor(
  id,
  name
) {
  try {
    if (!id) {
      throw new Error(
        "Investor ID is required."
      );
    }

    const investorName =
      String(name || "").trim();

    if (!investorName) {
      throw new Error(
        "Investor name is required."
      );
    }

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        "User is not logged in."
      );
    }

    await updateDoc(
      doc(
        db,
        "users",
        user.uid,
        COLLECTION_NAME,
        String(id)
      ),
      {
        name: investorName,
        updatedAt:
          serverTimestamp(),
      }
    );

    return {
      id,
      name: investorName,
    };
  } catch (error) {
    console.error(
      "Failed to update investor:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE INVESTOR
========================================================= */

export async function deleteInvestor(
  id
) {
  try {
    if (!id) {
      throw new Error(
        "Investor ID is required for deletion."
      );
    }

    const user =
      auth.currentUser;

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
      "Failed to delete investor:",
      error
    );

    throw error;
  }
}