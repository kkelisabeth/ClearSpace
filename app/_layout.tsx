import { auth } from "@/config/firebase";
import { AuthProvider, useAuth } from "@/contexts/authContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
/**
 * StackLayout Component
 *
 * Defines the navigation stack structure of the application,
 * including modals for specific features like shopping list editing,
 * category management, profile settings, and item search.
 */
function StackLayout() {
  const router = useRouter();
  const { setUser, updateUserData } = useAuth();

  useEffect(() => {
    // Monitor authentication state and update user context accordingly
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || null,
          image: null, // Add logic here if you have an image property
        });
        await updateUserData(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/categoryModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(modals)/profileModal"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
}

/**
 * RootLayout Component
 *
 * Entry point for wrapping the entire app with the authentication context provider
 * and rendering the core navigation stack.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
