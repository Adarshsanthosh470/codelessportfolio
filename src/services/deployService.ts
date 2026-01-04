import { db } from "@/services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function todayIsoDate(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export async function canDeploy(userId: string): Promise<boolean> {
  if (!userId) return false;

  const deployDate = todayIsoDate();
  const docId = `${userId}_${deployDate}`;
  const docRef = doc(db, "deployLogs", docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return true;

  const data = docSnap.data();
  return (data.count || 0) < 2;
}

export async function incrementDeploy(userId: string): Promise<boolean> {
  if (!userId) return false;

  const deployDate = todayIsoDate();
  const docId = `${userId}_${deployDate}`;
  const docRef = doc(db, "deployLogs", docId);
  const docSnap = await getDoc(docRef);

  let newCount = 1;
  if (docSnap.exists()) {
    const data = docSnap.data();
    newCount = (data.count || 0) + 1;
  }

  await setDoc(docRef, {
    userId,
    deployDate,
    count: newCount,
    updatedAt: new Date(),
  });

  return true;
}
