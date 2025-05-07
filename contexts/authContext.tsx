import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContextType, UserType } from "@/types";
import { auth, firestore } from "@/config/firebase";
import { useRouter } from "expo-router";

// Create the Authentication Context
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider component.
 * Wraps the application and provides authentication-related state and actions.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();

  useEffect(() => {
    // Listen for changes to the authentication state.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        });
        updateUserData(firebaseUser.uid);
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });

    // Clean up the subscription when component unmounts.
    return () => unsubscribe();
  }, []);

  /**
   * Attempts to log in a user with the provided email and password.
   * Returns a success status and an optional error message.
   */
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong credentials";
      return { success: false, msg };
    }
  };

  /**
   * Registers a new user with the provided email, password, and name.
   * Saves the new user's information in Firestore.
   * Returns a success status and the newly created user or an error message.
   */
  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = response.user;

      await setDoc(doc(firestore, "users", createdUser.uid), {
        name,
        email,
        uid: createdUser.uid,
      });

      return { success: true, user: createdUser };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/email-already-in-use)")) msg = "This email is already in use";
      return { success: false, msg };
    }
  };

  /**
   * Fetches the latest user data from Firestore using the user's UID.
   * Updates the current user state with the retrieved data.
   */
  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const updatedUser: UserType = {
          uid: data.uid,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };
        setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 * Must be used inside an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
