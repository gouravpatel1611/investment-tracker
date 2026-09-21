
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
   NORMALIZE BOND DATA
========================================================= */

function normalizeBondData(bond = {}) {
  const data = {
    ...bond,

    quantity:
      Number(bond.quantity) || 0,

    faceValue:
      Number(bond.faceValue) || 0,

    purchaseValue:
      Number(bond.purchaseValue) || 0,

    couponRate:
      Number(bond.couponRate) || 0,

    /*
      Interest adjustment:

      +500  = add ₹500
      -350  = deduct ₹350
      0     = no adjustment
    */

    interestAdjustment:
      Number(
        bond.interestAdjustment
      ) || 0,

    /*
      TDS:

      TDS is stored separately.

      It will NOT reduce Total Interest.

      It will be deducted only from
      Interest Received during calculation.

      Old bonds without TDS
      will automatically get 0.
    */

    tds:
      Number(bond.tds) || 0,

    principalRepayments:
      Array.isArray(
        bond.principalRepayments
      )
        ? bond.principalRepayments.map(
            (item) => ({
              id:
                item.id ||
                crypto.randomUUID(),

              date:
                item.date || "",

              amount:
                Number(item.amount) || 0,
            })
          )
        : [],
  };

  delete data.id;

  return data;
}

/* =========================================================
   ADD BOND
========================================================= */

export async function addBond(bond) {
  try {
    const dataToSave =
      normalizeBondData(bond);

    dataToSave.createdAt =
      serverTimestamp();

    const docRef =
      await addDoc(
        getUserCollection(),
        dataToSave
      );

    return {
      ...dataToSave,
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
   UPDATE BOND
========================================================= */

export async function updateBond(
  id,
  bond
) {
  try {
    if (!id) {
      throw new Error(
        "Bond ID is required for update."
      );
    }

    const user =
      auth.currentUser;

    if (!user) {
      throw new Error(
        "User is not logged in."
      );
    }

    const dataToSave =
      normalizeBondData(bond);

    dataToSave.updatedAt =
      serverTimestamp();

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
      ...dataToSave,
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
      orderBy(
        "purchaseDate",
        "desc"
      )
    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(
      (item) => {
        const data =
          item.data();

        return {
          ...data,

          /*
            Old bonds may not have
            interestAdjustment.
          */

          interestAdjustment:
            Number(
              data.interestAdjustment
            ) || 0,

          /*
            Old bonds may not have TDS.

            If TDS is missing from
            Firebase, treat it as 0.
          */

          tds:
            Number(data.tds) || 0,

          id: item.id,
        };
      }
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
      "Failed to delete bond:",
      error
    );

    throw error;
  }
}
