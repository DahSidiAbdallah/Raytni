// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2omn-M8ImhB1-6I3aJ-a-sl_3YfDTUxo",
  authDomain: "raytni-504cf.firebaseapp.com",
  projectId: "raytni-504cf",
  storageBucket: "gs://raytni-504cf.firebasestorage.app",  // Make sure this matches your Firebase project
  messagingSenderId: "430221151219",
  appId: "1:430221151219:web:5a667d03eb396ed9d76086",
  measurementId: "G-PC17ZLG9RK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Add storage connection test
if (process.env.NODE_ENV === 'development') {
  const testStorageConnection = async () => {
    try {
      const testRef = ref(storage, 'test');
      await getDownloadURL(testRef).catch(() => {});
      console.log('📦 Firebase Storage connected successfully');
    } catch (error) {
      console.error('❌ Firebase Storage connection error:', error);
    }
  };
  testStorageConnection();
}

export const handleStorageError = (error: any): string => {
  switch (error.code) {
    case 'storage/unauthorized':
      return 'Not authorized to access storage';
    case 'storage/canceled':
      return 'Upload cancelled';
    case 'storage/unknown':
      return 'An unknown error occurred';
    default:
      return error.message;
  }
};

// Test function for storage upload
export const testStorageUpload = async () => {
  try {
    // Create a test blob (simulating an image)
    const testBlob = new Blob(['test image content'], { type: 'image/jpeg' });
    const testFile = new File([testBlob], 'test-image.jpg', { type: 'image/jpeg' });

    // Create a reference to the storage location
    const storageRef = ref(storage, 'test/test-image.jpg');

    // Upload the test file
    console.log('Starting test upload...');
    const snapshot = await uploadBytes(storageRef, testFile);
    console.log('Upload completed!');

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File available at:', downloadURL);

    return {
      success: true,
      url: downloadURL
    };
  } catch (error) {
    console.error('Test upload failed:', handleStorageError(error));
    return {
      success: false,
      error: handleStorageError(error)
    };
  }
};

