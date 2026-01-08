import { db, storage } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Uploads a file to Firebase Storage and returns the public URL
export async function uploadImage(file: File, userId: string, path: string): Promise<string> {
  // Create a unique path for the file
  const storageRef = ref(storage, `portfolios/${userId}/${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

export async function savePortfolio(userId: string, username: string, data: any) {
  if (!userId) throw new Error("userId is required");

  const normalized = String(username).toLowerCase().trim();

  // Clean the data to remove non-serializable properties (functions, etc.)
  const sanitizedData = JSON.parse(JSON.stringify(data));

  const portfolioData = {
    userId,
    username: normalized,
    data: sanitizedData,
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
    // If the error is related to size, inform the user
    if (error.code === 'out-of-range') {
      throw new Error("Portfolio data is too large. Try using fewer or smaller images.");
    }
    throw error;
  }
}