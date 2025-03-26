// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB9EtpLDHI6YbAXbj9mDIMsUBfFf2WrEc",
  authDomain: "drdapp-6063c.firebaseapp.com",
  projectId: "drdapp-6063c",
  storageBucket: "drdapp-6063c.appspot.com",
  messagingSenderId: "107946370064",
  appId: "1:107946370064:web:a888dfec6de6eb0cffd695",
  measurementId: "G-NW3N42W9GX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { db, storage, auth };
