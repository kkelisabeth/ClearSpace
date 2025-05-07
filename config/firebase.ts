import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Firebase Configuration
 *
 * Configuration object for initializing the Firebase app.
 * Contains necessary keys and identifiers for connecting to the Firebase project.
 */
const firebaseConfig = {
  apiKey: "AIzaSyA7aEcIgcF3qpGtA_NUJiKfn00B0nIfwQc",
  authDomain: "clearspace-fyp.firebaseapp.com",
  projectId: "clearspace-fyp",
  storageBucket: "clearspace-fyp.appspot.com",
  messagingSenderId: "603033428147",
  appId: "1:603033428147:web:61a922d74d9f304910d0c6",
  measurementId: "G-4059VF5G1S",
};

/**
 * Initialize Firebase App
 *
 * This instance is used to interact with all Firebase services.
 */
export const app = initializeApp(firebaseConfig);

/**
 * Initialize Firebase Authentication
 *
 * Sets up Firebase Authentication with persistence using AsyncStorage 
 * for React Native applications.
 */
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Initialize Firestore Database
 *
 * Sets up the Firestore service for accessing and managing the application's database.
 */
export const firestore = getFirestore(app);
