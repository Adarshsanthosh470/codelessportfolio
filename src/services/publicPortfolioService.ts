import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getPortfolioByUsername(username: string) {
  const normalized = username.toLowerCase().trim();
  const docRef = doc(db, "portfolios", normalized);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Portfolio not found");
  }

  const data = docSnap.data();
  return data;
}
