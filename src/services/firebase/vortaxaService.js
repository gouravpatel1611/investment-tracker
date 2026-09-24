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


/* =========================================================
   COLLECTIONS
========================================================= */

const INVESTORS_COLLECTION =
  "vortaxaInvestors";

const RATES_COLLECTION =
  "vortaxaRates";


/* =========================================================
   GET CURRENT USER
========================================================= */

function getCurrentUser() {
  const user =
    auth.currentUser;

  if (!user) {
    throw new Error(
      "User is not logged in."
    );
  }

  return user;
}


/* =========================================================
   GET USER COLLECTION
========================================================= */

function getUserCollection(
  collectionName
) {
  const user =
    getCurrentUser();

  return collection(
    db,
    "users",
    user.uid,
    collectionName
  );
}


/* =========================================================
   GET INVESTOR DOCUMENT
========================================================= */

function getInvestorDocument(
  investorId
) {
  const user =
    getCurrentUser();

  if (!investorId) {
    throw new Error(
      "Vortaxa investor ID is required."
    );
  }

  return doc(
    db,
    "users",
    user.uid,
    INVESTORS_COLLECTION,
    String(investorId)
  );
}


/* =========================================================
   INVESTOR TRANSACTION COLLECTION
========================================================= */

function getTransactionCollection(
  investorId
) {
  const user =
    getCurrentUser();

  if (!investorId) {
    throw new Error(
      "Vortaxa investor ID is required."
    );
  }

  return collection(
    db,
    "users",
    user.uid,
    INVESTORS_COLLECTION,
    String(investorId),
    "transactions"
  );
}


/* =========================================================
   GET TRANSACTION DOCUMENT
========================================================= */

function getTransactionDocument(
  investorId,
  transactionId
) {
  const user =
    getCurrentUser();

  if (!investorId) {
    throw new Error(
      "Vortaxa investor ID is required."
    );
  }

  if (!transactionId) {
    throw new Error(
      "Vortaxa transaction ID is required."
    );
  }

  return doc(
    db,
    "users",
    user.uid,
    INVESTORS_COLLECTION,
    String(investorId),
    "transactions",
    String(transactionId)
  );
}


/* =========================================================
   RATE COLLECTION
========================================================= */

function getRateCollection() {
  return getUserCollection(
    RATES_COLLECTION
  );
}


/* =========================================================
   GET RATE DOCUMENT
========================================================= */

function getRateDocument(
  rateId
) {
  const user =
    getCurrentUser();

  if (!rateId) {
    throw new Error(
      "Vortaxa rate ID is required."
    );
  }

  return doc(
    db,
    "users",
    user.uid,
    RATES_COLLECTION,
    String(rateId)
  );
}


/* =========================================================
   INVESTORS
========================================================= */


/* =========================================================
   ADD INVESTOR
========================================================= */

export async function addVortaxaInvestor(
  investor
) {
  try {
    if (!investor) {
      throw new Error(
        "Vortaxa investor data is required."
      );
    }

    const dataToSave = {
      ...investor,
      createdAt:
        serverTimestamp(),
    };

    /*
     * Firestore document ID
     * khud generate karega.
     */
    delete dataToSave.id;

    const docRef =
      await addDoc(
        getUserCollection(
          INVESTORS_COLLECTION
        ),
        dataToSave
      );

    return {
      ...investor,
      id: docRef.id,
    };

  } catch (error) {

    console.error(
      "Failed to add Vortaxa investor:",
      error
    );

    throw error;
  }
}


/* =========================================================
   GET ALL INVESTORS
========================================================= */

export async function getVortaxaInvestors() {
  try {

    const q =
      query(
        getUserCollection(
          INVESTORS_COLLECTION
        ),
        orderBy(
          "createdAt",
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
      "Failed to fetch Vortaxa investors:",
      error
    );

    throw error;
  }
}


/* =========================================================
   UPDATE INVESTOR
========================================================= */

export async function updateVortaxaInvestor(
  id,
  investor
) {
  try {

    if (!id) {
      throw new Error(
        "Vortaxa investor ID is required."
      );
    }

    if (!investor) {
      throw new Error(
        "Vortaxa investor data is required."
      );
    }

    const dataToUpdate = {
      ...investor,
    };

    /*
     * ID and createdAt ko
     * manually update nahi karna.
     */
    delete dataToUpdate.id;
    delete dataToUpdate.createdAt;

    await updateDoc(
      getInvestorDocument(id),
      dataToUpdate
    );

    return {
      ...investor,
      id,
    };

  } catch (error) {

    console.error(
      "Failed to update Vortaxa investor:",
      error
    );

    throw error;
  }
}


/* =========================================================
   DELETE INVESTOR
========================================================= */

/*
  IMPORTANT:

  Firestore mein parent investor document
  delete karne se subcollection automatically
  delete nahi hoti.

  Isliye pehle:

  transactions delete

  aur uske baad:

  investor document delete
*/

export async function deleteVortaxaInvestor(
  id
) {
  try {

    if (!id) {
      throw new Error(
        "Vortaxa investor ID is required for deletion."
      );
    }


    /* -----------------------------------------------------
       GET ALL TRANSACTIONS
    ----------------------------------------------------- */

    const transactionQuery =
      query(
        getTransactionCollection(id)
      );

    const transactionSnapshot =
      await getDocs(
        transactionQuery
      );


    /* -----------------------------------------------------
       DELETE ALL TRANSACTIONS
    ----------------------------------------------------- */

    if (
      !transactionSnapshot.empty
    ) {

      await Promise.all(
        transactionSnapshot.docs.map(
          (transactionDoc) =>
            deleteDoc(
              transactionDoc.ref
            )
        )
      );

    }


    /* -----------------------------------------------------
       DELETE INVESTOR DOCUMENT
    ----------------------------------------------------- */

    await deleteDoc(
      getInvestorDocument(id)
    );


    return true;

  } catch (error) {

    console.error(
      "Failed to delete Vortaxa investor:",
      error
    );

    throw error;
  }
}


/* =========================================================
   TRANSACTIONS
========================================================= */

/*
  Firestore structure:

  users
   └── {uid}
        └── vortaxaInvestors
             └── {investorId}
                  └── transactions
                       ├── transaction
                       ├── transaction
                       └── ...
*/


/* =========================================================
   ADD TRANSACTION
========================================================= */

export async function addVortaxaTransaction(
  investorId,
  transaction
) {
  try {

    if (!investorId) {
      throw new Error(
        "Vortaxa investor ID is required."
      );
    }

    if (!transaction) {
      throw new Error(
        "Vortaxa transaction data is required."
      );
    }


    const dataToSave = {
      ...transaction,

      investorId,

      createdAt:
        serverTimestamp(),
    };


    /*
     * Firestore ID generate karega.
     */
    delete dataToSave.id;


    const docRef =
      await addDoc(
        getTransactionCollection(
          investorId
        ),
        dataToSave
      );


    return {
      ...transaction,

      investorId,

      id: docRef.id,
    };

  } catch (error) {

    console.error(
      "Failed to add Vortaxa transaction:",
      error
    );

    throw error;
  }
}


/* =========================================================
   GET INVESTOR TRANSACTIONS
========================================================= */

export async function getVortaxaTransactions(
  investorId
) {
  try {

    if (!investorId) {
      throw new Error(
        "Vortaxa investor ID is required."
      );
    }


    const q =
      query(
        getTransactionCollection(
          investorId
        ),
        orderBy(
          "date",
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
      "Failed to fetch Vortaxa transactions:",
      error
    );

    throw error;
  }
}


/* =========================================================
   UPDATE TRANSACTION
========================================================= */

export async function updateVortaxaTransaction(
  investorId,
  transactionId,
  transaction
) {
  try {

    if (!investorId) {
      throw new Error(
        "Vortaxa investor ID is required."
      );
    }

    if (!transactionId) {
      throw new Error(
        "Vortaxa transaction ID is required."
      );
    }

    if (!transaction) {
      throw new Error(
        "Vortaxa transaction data is required."
      );
    }


    const dataToUpdate = {
      ...transaction,

      investorId,
    };


    /*
     * ID and createdAt ko
     * overwrite nahi karna.
     */
    delete dataToUpdate.id;
    delete dataToUpdate.createdAt;


    await updateDoc(
      getTransactionDocument(
        investorId,
        transactionId
      ),
      dataToUpdate
    );


    return {
      ...transaction,

      investorId,

      id: transactionId,
    };

  } catch (error) {

    console.error(
      "Failed to update Vortaxa transaction:",
      error
    );

    throw error;
  }
}


/* =========================================================
   DELETE TRANSACTION
========================================================= */

export async function deleteVortaxaTransaction(
  investorId,
  transactionId
) {
  try {

    if (!investorId) {
      throw new Error(
        "Vortaxa investor ID is required."
      );
    }

    if (!transactionId) {
      throw new Error(
        "Vortaxa transaction ID is required."
      );
    }


    await deleteDoc(
      getTransactionDocument(
        investorId,
        transactionId
      )
    );


    return true;

  } catch (error) {

    console.error(
      "Failed to delete Vortaxa transaction:",
      error
    );

    throw error;
  }
}


/* =========================================================
   RATES
========================================================= */

/*
  Rates GLOBAL hain.

  Same rate sabhi investors ke liye
  use hoga.

  Firestore structure:

  users
   └── {uid}
        └── vortaxaRates
             ├── rate
             ├── rate
             └── ...
*/


/* =========================================================
   ADD RATE
========================================================= */

export async function addVortaxaRate(
  rate
) {
  try {

    if (!rate) {
      throw new Error(
        "Vortaxa rate data is required."
      );
    }


    const dataToSave = {
      ...rate,

      createdAt:
        serverTimestamp(),
    };


    /*
     * Firestore ID generate karega.
     */
    delete dataToSave.id;


    const docRef =
      await addDoc(
        getRateCollection(),
        dataToSave
      );


    return {
      ...rate,
      id: docRef.id,
    };

  } catch (error) {

    console.error(
      "Failed to add Vortaxa rate:",
      error
    );

    throw error;
  }
}


/* =========================================================
   GET ALL RATES
========================================================= */

export async function getVortaxaRates() {
  try {

    const q =
      query(
        getRateCollection(),
        orderBy(
          "date",
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
      "Failed to fetch Vortaxa rates:",
      error
    );

    throw error;
  }
}


/* =========================================================
   UPDATE RATE
========================================================= */

/*
  Rate delete nahi hoga.

  Correction ke liye
  sirf update/edit allowed hai.
*/

export async function updateVortaxaRate(
  id,
  rate
) {
  try {

    if (!id) {
      throw new Error(
        "Vortaxa rate ID is required."
      );
    }

    if (!rate) {
      throw new Error(
        "Vortaxa rate data is required."
      );
    }


    const dataToUpdate = {
      ...rate,
    };


    /*
     * ID aur createdAt ko
     * modify nahi karna.
     */
    delete dataToUpdate.id;
    delete dataToUpdate.createdAt;


    await updateDoc(
      getRateDocument(id),
      dataToUpdate
    );


    return {
      ...rate,
      id,
    };

  } catch (error) {

    console.error(
      "Failed to update Vortaxa rate:",
      error
    );

    throw error;
  }
}


/* =========================================================
   DELETE RATE
========================================================= */

/*
  Service level par function rakha gaya hai,
  lekin UI mein delete button expose nahi karna.

  Vortaxa rate history ko delete nahi karna hai.
*/

export async function deleteVortaxaRate(
  id
) {
  try {

    if (!id) {
      throw new Error(
        "Vortaxa rate ID is required."
      );
    }


    await deleteDoc(
      getRateDocument(id)
    );


    return true;

  } catch (error) {

    console.error(
      "Failed to delete Vortaxa rate:",
      error
    );

    throw error;
  }
}