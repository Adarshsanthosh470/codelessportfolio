import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config with fallbacks to provided values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBLF3OvbLqhRYRftRZQJMllkVqGdow6bBw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lamplight-community-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lamplight-community-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lamplight-community-hub.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "651672927489",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:651672927489:web:6ebec6edf3d9174b97ef00",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DLS3K9YBZE",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// analytics can throw in non-browser/SSR environments — guard it
try {
  if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    getAnalytics(app);
  }
} catch (e) {
  // ignore analytics init errors
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);