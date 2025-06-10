// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2omn-M8ImhB1-6I3aJ-a-sl_3YfDTUxo",
    authDomain: "raytni-504cf.firebaseapp.com",
    projectId: "raytni-504cf",
    storageBucket: "raytni-504cf.firebasestorage.app",
    messagingSenderId: "430221151219",
    appId: "1:430221151219:web:5a667d03eb396ed9d76086",
    measurementId: "G-PC17ZLG9RK"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);