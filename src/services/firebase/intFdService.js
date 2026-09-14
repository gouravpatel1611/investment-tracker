
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import db from "./firestore";
import auth from "./auth";

const COLLECTION_NAME = "intFds";

/* =========================================================
   USER INT-FD COLLECTION

   Firestore structure:

   users
    └── {Firebase UID}
         └── intFds
              ├── FD
              ├── FD
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
   ADD INT-FD
========================================================= */

export async function addIntFd(fdData) {
  try {
    const dataToSave = {
      ...fdData,
      createdAt: serverTimestamp(),
    };

    /*
      Firebase document ke andar
      local id save nahi karna.
    */

    delete dataToSave.id;

    const docRef = await addDoc(
      getUserCollection(),
      dataToSave
    );

    return {
      ...fdData,
      id: docRef.id,
    };
  } catch (error) {
    console.error(
      "Failed to add INT-FD:",
      error
    );

    throw error;
  }
}

/* =========================================================
   GET ALL INT-FD
========================================================= */

export async function getIntFds() {
  try {
    const q = query(
      getUserCollection(),
      orderBy(
        "openingDate",
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
      "Failed to fetch INT-FD data:",
      error
    );

    throw error;
  }
}

/* =========================================================
   UPDATE INT-FD
========================================================= */

export async function updateIntFd(
  id,
  fdData
) {
  try {
    if (!id) {
      throw new Error(
        "FD ID is required for update."
      );
    }

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        "User is not logged in."
      );
    }

    const dataToUpdate = {
      ...fdData,
      updatedAt:
        serverTimestamp(),
    };

    /*
      Firebase document me id field
      save nahi karna.
    */

    delete dataToUpdate.id;

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
      ...fdData,
      id: String(id),
    };
  } catch (error) {
    console.error(
      "Failed to update INT-FD:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE INT-FD
========================================================= */

export async function deleteIntFd(id) {
  try {
    if (!id) {
      throw new Error(
        "FD ID is required for deletion."
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
      "Failed to delete INT-FD:",
      error
    );

    throw error;
  }
}

