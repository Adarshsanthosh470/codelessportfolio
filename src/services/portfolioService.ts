import { db, storage } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Helper to upload images to Firebase Storage instead of saving them as text strings
export async function uploadImage(file: File, userId: string, path: string): Promise<string> {
  const storageRef = ref(storage, `portfolios/${userId}/${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

export async function savePortfolio(userId: string, username: string, data: any) {
  if (!userId) throw new Error("userId is required");

  const normalized = String(username).toLowerCase().trim();

  // --- IMPROVED SANITIZATION ---
  // Deep sanitize data to ensure Firestore compatibility
  const sanitizedData = JSON.parse(JSON.stringify(data));

  const portfolioData = {
    userId,
    username: normalized,
    ...sanitizedData,
    updatedAt: serverTimestamp(),
  };

  const docRef = doc(db, "portfolios", normalized);

  try {
    const existingDoc = await getDoc(docRef);
    if (existingDoc.exists() && existingDoc.data().userId !== userId) {
      throw new Error("This username is already taken.");
    }

    await setDoc(docRef, portfolioData);
    return portfolioData;
  } catch (error: any) {
    console.error("Firestore Error:", error);
    // Specifically handle size-related errors which often look like invalid entities
    if (error.code === 'out-of-range' || error.message?.includes('too large')) {
      throw new Error("Portfolio data is too large. Try reducing image sizes or content.");
    }
    throw error;
  }
}