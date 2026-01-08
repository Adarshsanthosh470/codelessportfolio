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

  // 1. Check if username is taken by someone else
  const usernameDocRef = doc(db, "portfolios", normalized);
  const usernameDoc = await getDoc(usernameDocRef);

  if (usernameDoc.exists()) {
    const existingData = usernameDoc.data();
    if (existingData.userId !== userId) {
      throw new Error("Username already taken by another user");
    }
  }

  // 2. IMPORTANT: Remove non-serializable data (functions, etc.)
  // This converts the state into a pure JSON object
  const sanitizedData = JSON.parse(JSON.stringify(data));

  // 3. Save to Firestore
  const portfolioData = {
    userId,
    username: normalized,
    data: sanitizedData, // Use sanitized data here
    updatedAt: serverTimestamp(), // Use serverTimestamp for accuracy
  };

  await setDoc(doc(db, "portfolios", normalized), portfolioData);

  return portfolioData;
}