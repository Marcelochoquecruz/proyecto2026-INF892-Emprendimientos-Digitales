import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration (from Firebase console)
export const firebaseConfig = {
  apiKey: "AIzaSyA2H1m45mv5gPaQNWYJnkPZULOCe6Q12vQ",
  authDomain: "museo-61be0.firebaseapp.com",
  projectId: "museo-61be0",
  storageBucket: "museo-61be0.firebasestorage.app",
  messagingSenderId: "662031988621",
  appId: "1:662031988621:web:8db1e12d5668b3d332efc4"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export auth and firestore instances for use throughout the app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
