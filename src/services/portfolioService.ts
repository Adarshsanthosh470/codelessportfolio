// src/services/portfolioService.ts
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

  // Check if username already exists for another user
  const usernameDocRef = doc(db, "portfolios", normalized);
  const usernameDoc = await getDoc(usernameDocRef);

  if (usernameDoc.exists()) {
    const existingData = usernameDoc.data();
    if (existingData.userId !== userId) {
      throw new Error("Username already taken by another user");
    }
  }

  // --- ADD THIS FIX ---
  // This removes functions and non-serializable data from the state object
  const sanitizedData = JSON.parse(JSON.stringify(data));

  const portfolioData = {
    userId,
    username: normalized,
    data: sanitizedData, // Use sanitizedData instead of raw data
    updatedAt: serverTimestamp(), // Use serverTimestamp for better accuracy
  };

  await setDoc(doc(db, "portfolios", normalized), portfolioData);

  return portfolioData;
}