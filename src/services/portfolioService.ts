import { db, storage } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadImage(file: File, userId: string, path: string): Promise<string> {
  const storageRef = ref(storage, `portfolios/${userId}/${path}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export async function savePortfolio(userId: string, username: string, data: any) {
  if (!userId) throw new Error("userId is required");

  const normalized = String(username).toLowerCase().trim();

  // --- CRITICAL FIX ---
  // This removes any circular references or complex objects
  // that cause the "invalid nested entity" error in Firebase.
  const sanitizedData = JSON.parse(JSON.stringify(data));

  const portfolioData = {
    userId,
    username: normalized,
    data: sanitizedData, // Use the cleaned data
    updatedAt: serverTimestamp(),
  };

  const docRef = doc(db, "portfolios", normalized);

  try {
    // Check ownership before saving
    const existingDoc = await getDoc(docRef);
    if (existingDoc.exists() && existingDoc.data().userId !== userId) {
      throw new Error("This username is already taken.");
    }

    await setDoc(docRef, portfolioData);
    return portfolioData;
  } catch (error: any) {
    console.error("Firestore Error:", error);
    throw error;
  }
}