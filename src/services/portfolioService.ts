import { db, storage } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Helper to upload images to Firebase Storage instead of saving them as text strings
export async function uploadImage(file: File, userId: string, path: string): Promise<string> {
  const storageRef = ref(storage, `portfolios/${userId}/${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

// Sanitize data for Firestore compatibility
function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (obj instanceof Date) return obj; // Firestore accepts Date objects
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item)).filter(item => item !== undefined);
  }
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value !== undefined && typeof value !== 'function' && typeof value !== 'symbol') {
          sanitized[key] = sanitizeForFirestore(value);
        }
      }
    }
    return sanitized;
  }
  // For any other type (function, symbol, etc.), return null
  return null;
}

export async function savePortfolio(userId: string, username: string, data: any) {
  if (!userId) throw new Error("userId is required");

  const normalized = String(username).toLowerCase().trim();

  // --- IMPROVED SANITIZATION ---
  // Deep sanitize data to ensure Firestore compatibility
  const sanitizedData = sanitizeForFirestore(data);

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