import { auth, firestore } from '@/config/firebase';
import * as Notifications from 'expo-notifications';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_KEY = 'lastNotifTimestamp';
const NOTIF_INTERVAL_MS = 60 * 100; // 1 minute for testing

export const scheduleInventoryCheck = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  console.log("[Check] Starting checkForLowOrExpired for UID:", uid);

  const lastNotif = await AsyncStorage.getItem(NOTIF_KEY);
  const now = Date.now();

  if (lastNotif && now - parseInt(lastNotif) < NOTIF_INTERVAL_MS) {
    console.log("[Notif] Skipped — recently notified");
    return;
  }

  const { hasCritical, lowStockCount, expiredCount } = await checkForLowOrExpired(uid);

  if (hasCritical) {
    const messageParts = [];
    if (lowStockCount > 0) messageParts.push(`${lowStockCount} low stock`);
    if (expiredCount > 0) messageParts.push(`${expiredCount} expired`);

    const message = `You have ${messageParts.join(' and ')} items. Check your inventory!`;

    console.warn("[Notif] Critical items found. Sending notification:", message);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "ClearSpace Reminder 📦",
        body: message,
        sound: true,
      },
      trigger: null
    });

    await AsyncStorage.setItem(NOTIF_KEY, now.toString());
  } else {
    console.log("[Notif] No critical items found. No notification scheduled.");
  }
};

const checkForLowOrExpired = async (uid: string): Promise<{
  hasCritical: boolean;
  lowStockCount: number;
  expiredCount: number;
}> => {
  const categoriesRef = collection(firestore, 'users', uid, 'categories');
  const categorySnap = await getDocs(categoriesRef);
  console.log(`[Check] Found ${categorySnap.size} categories.`);

  let lowStockCount = 0;
  let expiredCount = 0;

  for (const doc of categorySnap.docs) {
    const categoryId = doc.id;
    console.log(`[Check] Checking category: ${categoryId}`);

    const itemsRef = collection(firestore, 'users', uid, 'categories', categoryId, 'items');
    const itemsSnap = await getDocs(itemsRef);
    console.log(`[Check] Found ${itemsSnap.size} items in category ${categoryId}`);

    for (const itemDoc of itemsSnap.docs) {
      const data = itemDoc.data();

      const stockCurrent = data.amount ?? 0;
      const minStock = data.minStock ?? 0;
      const isLowStock = stockCurrent < minStock;

      const rawExpiryDate = data.expiryDate;
      let expiryDate: Date | null = null;

      if (rawExpiryDate instanceof Timestamp) {
        expiryDate = rawExpiryDate.toDate();
      } else if (typeof rawExpiryDate === 'string') {
        const [day, month, year] = rawExpiryDate.split('/').map(Number);
        expiryDate = new Date(year, month - 1, day);
      }

      const isExpired = expiryDate ? expiryDate.getTime() < Date.now() : false;

      if (isLowStock) {
        console.warn(`[Check] Low stock item found: ${itemDoc.id}`);
        lowStockCount++;
      }

      if (isExpired) {
        console.warn(`[Check] Expired item found: ${itemDoc.id} (Expired on ${expiryDate?.toISOString()})`);
        expiredCount++;
      }
    }
  }

  const hasCritical = lowStockCount > 0 || expiredCount > 0;
  return { hasCritical, lowStockCount, expiredCount };
};
