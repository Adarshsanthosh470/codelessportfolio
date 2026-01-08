import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function savePortfolio(
  userId: string,
  username: string,
  data: any
) {
  if (!userId) throw new Error("userId is required");
  if (!username) throw new Error("username is required");

  const normalized = String(username).toLowerCase().trim();

  // 1. Check if username is taken (existing logic)
  const usernameDocRef = doc(db, "portfolios", normalized);
  const usernameDoc = await getDoc(usernameDocRef);

  if (usernameDoc.exists()) {
    const existingData = usernameDoc.data();
    if (existingData.userId !== userId) {
      throw new Error("Username already taken by another user");
    }
  }

  /**
   * FIX: Sanitize the data
   * This converts the complex React state object into a plain JSON string 
   * and back into an object, which automatically strips out functions 
   * and 'undefined' values that Firestore cannot store.
   */
  const sanitizedData = JSON.parse(JSON.stringify(data));

  const portfolioData = {
    userId,
    username: normalized,
    data: sanitizedData, // Save the cleaned data
    updatedAt: serverTimestamp(), // Use server-side time for accuracy
  };

  try {
    // Attempt to save to Firestore
    await setDoc(doc(db, "portfolios", normalized), portfolioData);
    return portfolioData;
  } catch (error: any) {
    console.error("Firestore Save Error Details:", error);
    throw new Error(error.message || "Failed to save to database");
  }
}