
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

import db from "../firebase/firestore";
import auth from "../firebase/auth";

/* =========================================================
   COLLECTION
========================================================= */

const COLLECTION_NAME = "licPli";

/* =========================================================
   GET CURRENT USER COLLECTION

   Firestore structure:

   users
    └── {Firebase UID}
         └── licPli
              ├── policy
              ├── policy
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
   ADD LIC / PLI POLICY
========================================================= */

export async function addLicPliPolicy(policy) {
  try {
    if (!policy) {
      throw new Error(
        "LIC / PLI policy data is required."
      );
    }

    const dataToSave = {
      ...policy,

      premiumAmount:
        Number(policy.premiumAmount) || 0,

      installmentPaid:
        Number(policy.installmentPaid) || 0,

      totalPaid:
        Number(policy.totalPaid) || 0,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
      ...policy,
      id: docRef.id,
    };
  } catch (error) {
    console.error(
      "Failed to add LIC / PLI policy:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET ALL LIC / PLI POLICIES
========================================================= */

export async function getLicPliPolicies() {
  try {
    const q = query(
      getUserCollection(),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));
  } catch (error) {
    console.error(
      "Failed to fetch LIC / PLI policies:",
      error
    );

    throw error;
  }
}

/* =========================================================
   UPDATE LIC / PLI POLICY
========================================================= */

export async function updateLicPliPolicy(
  id,
  policy
) {
  try {
    if (!id) {
      throw new Error(
        "LIC / PLI policy ID is required for update."
      );
    }

    if (!policy) {
      throw new Error(
        "LIC / PLI policy data is required."
      );
    }

    const user = auth.currentUser;

    if (!user) {
      throw new Error(
        "User is not logged in."
      );
    }

    const dataToUpdate = {
      ...policy,

      premiumAmount:
        Number(policy.premiumAmount) || 0,

      installmentPaid:
        Number(policy.installmentPaid) || 0,

      totalPaid:
        Number(policy.totalPaid) || 0,

      updatedAt: serverTimestamp(),
    };

    delete dataToUpdate.id;
    delete dataToUpdate.createdAt;

    await updateDoc(
      doc(
        db,
        "users",
        user.uid,
        COLLECTION_NAME,
        String(id)
      ),
      dataToUpdate
    );

    return {
      ...policy,
      id,
    };
  } catch (error) {
    console.error(
      "Failed to update LIC / PLI policy:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE LIC / PLI POLICY
========================================================= */

export async function deleteLicPliPolicy(id) {
  try {
    if (!id) {
      throw new Error(
        "LIC / PLI policy ID is required for deletion."
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
      "Failed to delete LIC / PLI policy:",
      error
    );

    throw error;
  }
}

