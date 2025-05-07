import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import HomeCard from "@/components/HomeCard";
import Button from "@/components/Button";
import { auth, firestore } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { scheduleInventoryCheck } from "@/utils/notifications";
import * as Notifications from "expo-notifications";

const screenWidth = Dimensions.get("window").width;
const cardSize = (screenWidth - spacingX._20 * 2 - spacingX._10) / 2;

export const setupNotificationHandling = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.warn('[Notif] Notification permission denied.');
      return;
    }
  }
  console.log('[Notif] Notification permissions granted.');
};

/** Props for CategoryCard component */
interface CategoryCardProps {
  title: string;
  lowStockCount: number;
  expiredCount: number;
  categoryId: string;
}

/** 
 * CategoryCard
 * Displays a category card showing low stock and expired item counts.
 */
const CategoryCard = ({ title, lowStockCount, expiredCount }: CategoryCardProps) => (
  <View style={styles.categoryCard}>
    <Typo fontWeight="600" size={18} style={styles.titleStyle}>
      {title}
    </Typo>
    <View style={styles.centeredContent}>
      <Typo size={16} style={styles.statusText}>
        🟡 Low Stock: {lowStockCount}
      </Typo>
      <Typo size={16} style={styles.statusText}>
        ❌ Expired: {expiredCount}
      </Typo>
    </View>
  </View>
);

/** 
 * Home Screen
 * Fetches categories and their stats. Displays total inventory status and categories list.
 */
const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [categoriesStats, setCategoriesStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /** Fetch categories and calculate stats for each category */
  const fetchCategoriesAndStats = async () => {
    try {
      if (!user?.uid) return;

      const categoriesRef = collection(firestore, "users", user.uid, "categories");
      const categorySnap = await getDocs(categoriesRef);

      const categoriesData = await Promise.all(
        categorySnap.docs.map(async (doc) => {
          const categoryId = doc.id;
          const categoryName = doc.data().name;

          const itemsRef = user?.uid
            ? collection(firestore, "users", user.uid, "categories", categoryId, "items")
            : null;

          if (!itemsRef) {
            throw new Error("User ID is undefined, cannot fetch items.");
          }
          const itemsSnap = await getDocs(itemsRef);

          const items = itemsSnap.docs.map((itemDoc) => {
            const data = itemDoc.data();
            const rawExpiryDate = data.expiryDate;
            let expiryDate: Date | null = null;

            if (rawExpiryDate instanceof Timestamp) {
              expiryDate = rawExpiryDate.toDate();
            } else if (typeof rawExpiryDate === "string") {
              const [day, month, year] = rawExpiryDate.split("/").map(Number);
              expiryDate = new Date(year, month - 1, day);
            }

            const stockCurrent = data.amount || 0;
            const minStock = data.minStock || 0;

            return {
              isLowStock: stockCurrent < minStock,
              isExpired: expiryDate ? expiryDate.getTime() < Date.now() : false,
            };
          });

          const totalCount = items.length;
          const lowStockCount = items.filter((item) => item.isLowStock).length;
          const expiredCount = items.filter((item) => item.isExpired).length;

          return {
            id: categoryId,
            name: categoryName,
            lowStockCount,
            expiredCount,
            totalCount,
          };
        })
      );

      setCategoriesStats(categoriesData);
    } catch (err) {
      console.error("🔥 Error fetching categories and items:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /** Refresh the categories data manually */
  const onRefresh = () => {
    setRefreshing(true);
    fetchCategoriesAndStats();
  };

  /** Navigate to the specific category modal */
  const handleOpenCategory = (categoryName: string) => {
    router.push({
      pathname: "/(modals)/categoryModal",
      params: { categoriesName: categoryName },
    });
  };

  // Set up foreground behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  /** Auto-refresh categories every 10 minutes */
  useEffect(() => {
    fetchCategoriesAndStats();
    setupNotificationHandling();
    scheduleInventoryCheck();
    const interval = setInterval(fetchCategoriesAndStats, 10 * 60 * 1000); // every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const totalItems = categoriesStats.reduce((acc, cat) => acc + cat.totalCount, 0);
  const totalLowStock = categoriesStats.reduce((acc, cat) => acc + cat.lowStockCount, 0);
  const totalExpired = categoriesStats.reduce((acc, cat) => acc + cat.expiredCount, 0);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo fontWeight="500" size={20}>
              {user?.name || ""}
            </Typo>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          <HomeCard
            totalItems={totalItems}
            lowStockItems={totalLowStock}
            expiredItems={totalExpired}
          />

          <Typo size={20} fontWeight="500" style={{ marginBottom: spacingY._10 }}>
            Categories
          </Typo>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <View style={styles.grid}>
              {categoriesStats.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleOpenCategory(category.name)}
                >
                  <CategoryCard
                    categoryId={category.id}
                    title={category.name}
                    lowStockCount={category.lowStockCount}
                    expiredCount={category.expiredCount}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Floating Button */}
        <Button
          onPress={() => router.push("/(modals)/addItemModal")}
          style={styles.floatingButton}
        >
          <Icons.Plus color={colors.black} weight="bold" size={verticalScale(24)} />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

/** Styles for the Home Screen */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: cardSize,
    height: cardSize,
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._10,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  statusText: {
    color: colors.neutral400,
    marginBottom: spacingY._5,
  },
  titleStyle: {
    position: "absolute",
    top: spacingY._35,
    color: colors.neutral200,
    textAlign: "center",
    width: "100%",
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    top: spacingY._20,
    flex: 1,
    width: "100%",
  },
});
