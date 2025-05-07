import React, { useEffect, useState, useMemo } from 'react';
import { View, Modal, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Button, RefreshControl } from 'react-native';
import { getDocs, collection, query, where, Timestamp } from 'firebase/firestore';
import { firestore, auth } from '@/config/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Item, ItemModalProps } from '@/types';
import Typo from '@/components/Typo';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import { colors, spacingX, spacingY, radius } from '@/constants/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import EditDeleteModal from './editDeleteModal';
import ScreenWrapper from '@/components/ScreenWrapper';


const CategoryModal: React.FC<ItemModalProps> = ({ visible = true, onClose }) => {
  const { categoriesName } = useLocalSearchParams<{ categoriesName: string }>();
  const router = useRouter();
  onClose = () => router.back();

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const closeEditModal = () => {
    setSelectedItem(null);
    setEditModalVisible(false);
  };

  const lowStockCount = useMemo(() => items.filter(item => item.isLowStock).length, [items]);
  const expiredCount = useMemo(() => items.filter(item => item.isExpired).length, [items]);

  const isExpiredLogic = (expiryDate: string) => {
    if (expiryDate === 'N/A') return false;
    const parsedDate = parseDate(expiryDate);
    if (!parsedDate) {
      console.warn('Invalid date format:', expiryDate);
      return false;
    }
    return parsedDate.getTime() < new Date().getTime();
  };

  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month, day);
  };

  const fetchItems = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const allItems: Item[] = [];
      const categoriesRef = collection(firestore, 'users', user.uid, 'categories');
      const categoryQuery = query(categoriesRef, where('name', '==', categoriesName));
      const categoriesnap = await getDocs(categoryQuery);

      if (categoriesnap.empty) {
        console.log(`❌ Category "${categoriesName}" not found`);
        setItems([]);
        return;
      }

      const categoryId = categoriesnap.docs[0].id;
      setCategoryId(categoryId);
      const itemsRef = collection(firestore, 'users', user.uid, 'categories', categoryId, 'items');
      const itemsSnap = await getDocs(itemsRef);

      itemsSnap.forEach(doc => {
        const data = doc.data();
        const expiryDate = data.expiryDate || 'N/A';
        const amount = data.amount || 0;
        const minStock = data.minStock || 0;

        const item: Item = {
          id: doc.id,
          name: data.name || '',
          amount,
          minStock,
          expiryDate,
          shop: data.shop || '',
          notes: data.notes || '',
          isLowStock: amount < minStock,
          isExpired: expiryDate !== 'N/A' && isExpiredLogic(expiryDate),
          price: data.price || '',
        };
        allItems.push(item);
      });

      const sortedItems = allItems.sort((a, b) => {
        if (a.isExpired && !b.isExpired) return -1;
        if (!a.isExpired && b.isExpired) return 1;
        if (a.isLowStock && !b.isLowStock) return -1;
        if (!a.isLowStock && b.isLowStock) return 1;
        return 0;
      });

      setItems(sortedItems);
    } catch (error) {
      console.error('🔥 Error fetching items:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      await fetchItems();
      if (!isMounted) return;
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [visible]);

  return (
    <ScreenWrapper>
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <Header
            title={categoriesName}
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />

          <View style={styles.statusContainer}>
            <Typo size={16} style={styles.statusText}>🟡 Low Stock: {lowStockCount}</Typo>
            <Typo size={16} style={styles.statusText}>❌ Expired: {expiredCount}</Typo>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : items.length === 0 ? (
            <Typo size={16} style={styles.emptyText}>
              No items in this category.
            </Typo>
          ) : (
            <FlatList
              contentContainerStyle={styles.listStyle}
              data={items}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchItems} tintColor={colors.primary} />
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.itemCard,
                    item.isExpired && { backgroundColor: colors.expired },
                    item.isLowStock && { backgroundColor: colors.lowStock }
                  ]}
                  onPress={() => {
                    setSelectedItem(item);
                    setEditModalVisible(true);
                  }}
                >
                  <Typo size={18} fontWeight="600">{item.name}</Typo>
                  <Typo size={13}>Stock: {item.amount} / {item.minStock}</Typo>
                  <Typo size={13}>Expiry: {item.expiryDate}</Typo>
                  <Typo size={13}>Location: {item.shop || 'N/A'}</Typo>
                  <Typo size={13}>Notes: {item.notes || 'None'}</Typo>
                  <Typo size={13}>Low Stock: {item.isLowStock ? '⚠️ Yes' : '✅ No'}</Typo>
                  <Typo size={13}>Expired: {item.isExpired ? '❌ Yes' : '✅ No'}</Typo>
                  <Typo size={13}>Price: {item.price ? `$${Number(item.price).toFixed(2)}` : 'N/A'}</Typo>
                </TouchableOpacity>
              )}
            />
          )}

          {selectedItem && (
            <EditDeleteModal
              visible={isEditModalVisible}
              item={selectedItem}
              categoryName={categoryId || ''}
              onClose={closeEditModal}
            />
          )}
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default CategoryModal;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._30,
  },
  statusText: {
    color: colors.neutral100,
    marginBottom: spacingY._5,
  },
  loader: {
    marginTop: spacingY._30,
  },
  emptyText: {
    marginTop: spacingY._30,
    color: colors.neutral200,
  },
  listStyle: {
    paddingVertical: spacingY._20,
  },
  itemCard: {
    backgroundColor: colors.neutral800,
    padding: spacingY._15,
    borderRadius: radius._20,
    marginBottom: spacingY._15,
    borderColor: colors.neutral700,
    borderWidth: 1,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacingY._10,
  },
});
