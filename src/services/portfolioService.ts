import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function savePortfolio(userId: string, username: string, data: any) {
  if (!userId) throw new Error("userId is required");
  if (!username) throw new Error("username is required");

  const normalized = String(username).toLowerCase().trim();

  // --- STEP 3 FIX: THE SANITIZATION ---
  // This converts the object to a string and back to an object.
  // This automatically removes functions and 'undefined' keys which Firestore hates.
  const sanitizedData = JSON.parse(JSON.stringify(data));

  const portfolioData = {
    userId,
    username: normalized,
    data: sanitizedData, // Use the cleaned version here
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