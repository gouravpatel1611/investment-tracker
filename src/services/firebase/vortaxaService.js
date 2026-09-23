import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import db from "./firestore";

/* =========================================================
   HELPERS
========================================================= */
 
function getVortaxaInvestorRef(uid, investorId) {
  return doc(
    db,
    "users",
    uid,
    "vortaxa",
    investorId
  );
}

function getTransactionsRef(uid, investorId) {
  return collection(
    db,
    "users",
    uid,
    "vortaxa",
    investorId,
    "transactions"
  );
}

function getDailyRatesRef(uid, investorId) {
  return collection(
    db,
    "users",
    uid,
    "vortaxa",
    investorId,
    "dailyRates"
  );
}

/* =========================================================
   CREATE / UPDATE VORTAXA INVESTOR
========================================================= */

export async function createVortaxaInvestor(
  uid,
  investorId,
  data
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  if (!investorId) {
    throw new Error("Investor is required.");
  }

  const investorRef =
    getVortaxaInvestorRef(
      uid,
      investorId
    );

  await setDoc(investorRef, {
    investorId,
    investorName: data.investorName || "",

    startDate: data.startDate || "",

    liquidity:
      Number(data.liquidity) || 0,

    totalFule:
      Number(data.fule) || 0,

    totalPiFule:
      Number(data.piFule) || 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return investorId;
}

/* =========================================================
   GET VORTAXA INVESTORS
========================================================= */

export async function getVortaxaInvestors(
  uid
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  const vortaxaRef = collection(
    db,
    "users",
    uid,
    "vortaxa"
  );

  const snapshot =
    await getDocs(vortaxaRef);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/* =========================================================
   ADD TRANSACTION
========================================================= */

export async function addVortaxaTransaction(
  uid,
  investorId,
  transaction
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  if (!investorId) {
    throw new Error("Investor is required.");
  }

  const transactionsRef =
    getTransactionsRef(
      uid,
      investorId
    );

  const docRef = await addDoc(
    transactionsRef,
    {
      ...transaction,

      amount:
        transaction.amount !== undefined
          ? Number(transaction.amount)
          : null,

      liquidity:
        transaction.liquidity !== undefined
          ? Number(transaction.liquidity)
          : null,

      fule:
        transaction.fule !== undefined
          ? Number(transaction.fule)
          : null,

      piFule:
        transaction.piFule !== undefined
          ? Number(transaction.piFule)
          : null,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
}

/* =========================================================
   GET TRANSACTIONS
========================================================= */

export async function getVortaxaTransactions(
  uid,
  investorId
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  if (!investorId) {
    return [];
  }

  const transactionsRef =
    getTransactionsRef(
      uid,
      investorId
    );

  const snapshot =
    await getDocs(transactionsRef);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/* =========================================================
   UPDATE TRANSACTION
========================================================= */

export async function updateVortaxaTransaction(
  uid,
  investorId,
  transactionId,
  data
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  const transactionRef = doc(
    db,
    "users",
    uid,
    "vortaxa",
    investorId,
    "transactions",
    transactionId
  );

  await updateDoc(transactionRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/* =========================================================
   DELETE TRANSACTION
========================================================= */

export async function deleteVortaxaTransaction(
  uid,
  investorId,
  transactionId
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  const transactionRef = doc(
    db,
    "users",
    uid,
    "vortaxa",
    investorId,
    "transactions",
    transactionId
  );

  await deleteDoc(transactionRef);
}

/* =========================================================
   ADD DAILY RATE
========================================================= */

export async function addVortaxaDailyRate(
  uid,
  investorId,
  rateData
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  if (!investorId) {
    throw new Error("Investor is required.");
  }

  if (!rateData.date) {
    throw new Error("Rate date is required.");
  }

  const dailyRatesRef =
    getDailyRatesRef(
      uid,
      investorId
    );

  const docRef = await addDoc(
    dailyRatesRef,
    {
      date: rateData.date,

      rate:
        Number(rateData.rate) || 0,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
}

/* =========================================================
   GET DAILY RATES
========================================================= */

export async function getVortaxaDailyRates(
  uid,
  investorId
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  if (!investorId) {
    return [];
  }

  const dailyRatesRef =
    getDailyRatesRef(
      uid,
      investorId
    );

  const snapshot =
    await getDocs(dailyRatesRef);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/* =========================================================
   UPDATE DAILY RATE
========================================================= */

export async function updateVortaxaDailyRate(
  uid,
  investorId,
  rateId,
  data
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  const rateRef = doc(
    db,
    "users",
    uid,
    "vortaxa",
    investorId,
    "dailyRates",
    rateId
  );

  const updateData = {
    updatedAt: serverTimestamp(),
  };

  if (data.date !== undefined) {
    updateData.date = data.date;
  }

  if (data.rate !== undefined) {
    updateData.rate = Number(data.rate);
  }

  await updateDoc(
    rateRef,
    updateData
  );
}

/* =========================================================
   DELETE DAILY RATE
========================================================= */

export async function deleteVortaxaDailyRate(
  uid,
  investorId,
  rateId
) {
  if (!uid) {
    throw new Error("User is not logged in.");
  }

  const rateRef = doc(
    db,
    "users",
    uid,
    "vortaxa",
    investorId,
    "dailyRates",
    rateId
  );

  await deleteDoc(rateRef);
}