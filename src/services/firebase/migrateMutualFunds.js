import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import db from "./firestore";

const OLD_COLLECTION = "mutualFundTransactions";

export async function migrateMutualFundTransactions(userId) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const oldCollectionRef = collection(
    db,
    OLD_COLLECTION
  );

  const snapshot = await getDocs(oldCollectionRef);

  let migratedCount = 0;

  for (const item of snapshot.docs) {
    const newDocRef = doc(
      db,
      "users",
      userId,
      OLD_COLLECTION,
      item.id
    );

    await setDoc(newDocRef, item.data());

    migratedCount++;
  }

  return migratedCount;
}