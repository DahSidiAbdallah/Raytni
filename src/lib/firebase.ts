// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2omn-M8ImhB1-6I3aJ-a-sl_3YfDTUxo",
  authDomain: "raytni-504cf.firebaseapp.com",
  projectId: "raytni-504cf",
  storageBucket: "raytni-504cf.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "430221151219",
  appId: "1:430221151219:web:5a667d03eb396ed9d76086",
  measurementId: "G-PC17ZLG9RK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);