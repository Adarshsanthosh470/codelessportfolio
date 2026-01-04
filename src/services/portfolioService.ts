import { db } from "@/services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Saves or updates a user's portfolio.
 * - Enforces unique username
 * - Stores portfolio data as JSON
 */
export async function savePortfolio(
  userId: string,
  username: string,
  data: any
) {
  if (!userId) throw new Error("userId is required");
  if (!username) throw new Error("username is required");

  // normalize username
  const normalized = String(username).toLowerCase().trim();

  // check if username already exists for another user
  const usernameDocRef = doc(db, "portfolios", normalized);
  const usernameDoc = await getDoc(usernameDocRef);

  if (usernameDoc.exists()) {
    const existingData = usernameDoc.data();
    if (existingData.userId !== userId) {
      throw new Error("Username already taken by another user");
    }
  }

  // save/update portfolio
  const portfolioData = {
    userId,
    username: normalized,
    data,
    updatedAt: new Date(),
  };

  await setDoc(doc(db, "portfolios", normalized), portfolioData);

  return portfolioData;
}

export default { savePortfolio };
