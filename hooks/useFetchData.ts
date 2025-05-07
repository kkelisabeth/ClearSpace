import { collection, query, onSnapshot, QueryConstraint } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "@/config/firebase";

/**
 * Custom React hook for fetching real-time data from a Firestore collection.
 *
 * @template T - The type of the data being fetched.
 * @param {string} collectionName - Name of the Firestore collection to fetch data from.
 * @param {QueryConstraint[]} [constraints=[]] - Optional array of Firestore query constraints (e.g., where, orderBy).
 * @returns An object containing the fetched data, loading status, and any error message.
 *
 * This hook automatically listens for real-time updates and updates the local state accordingly.
 */
const useFetchData = <T,>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) return;

    const collectionRef = collection(firestore, collectionName);
    const queryRef = query(collectionRef, ...constraints);

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setData(fetchedData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, constraints]); // Correct dependency array for full reactivity.

  return { data, loading, error };
};

export default useFetchData;
