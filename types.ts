import { TextInput, TextInputProps, TextProps, TouchableOpacityProps, ViewStyle, TextStyle } from "react-native";
import React, { ReactNode } from "react";
import { Route } from "expo-router";

/**
 * Props for a generic screen wrapper component.
 */
export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: ReactNode;
  bg?: string;
};

/**
 * Props for a generic modal wrapper component.
 */
export type ModalWrapperProps = {
  style?: ViewStyle;
  children: ReactNode;
  bg?: string;
};

/**
 * Type definition for an account option item.
 */
export type AccountOptionType = {
  title: string;
  icon: ReactNode;
  bgColor: string;
  routeName?: Route;
};

/**
 * Props for the Typo (typography) component.
 */
export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: ReactNode;
  style?: TextStyle;
  textProps?: TextProps;
};

/**
 * Generic type for SVG or icon components.
 */
export type IconComponent = React.ComponentType<{
  height?: number;
  width?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}>;

/**
 * Props for custom icon rendering.
 */
export type IconProps = {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
};

/**
 * Props for a header component.
 */
export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

/**
 * Props for a back button component.
 */
export interface BackButtonProps {
  style?: ViewStyle;
  iconSize?: number;
  onPress?: () => void;
}

/**
 * Props for an input field component.
 */
export interface InputProps extends TextInputProps {
  icon?: ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}

/**
 * Props for a custom button component.
 */
export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  children: ReactNode;
}

/**
 * Props for an image upload component.
 */
export type ImageUploadProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
};

/**
 * User object type definition.
 */
export type UserType = {
  uid?: string;
  email?: string | null;
  name: string | null;
  image?: any;
} | null;

/**
 * Simplified user data type for quick references.
 */
export type UserDataType = {
  name: string;
  image?: any;
};

/**
 * Authentication context type for managing user state.
 */
export type AuthContextType = {
  user: UserType;
  setUser: (user: UserType) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
};

/**
 * Standardized response type for API and function calls.
 */
export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

/**
 * Type for a category item (e.g., Food, Hygiene).
 */
export type CategoryType = {
  id?: string;
  name: string;
  uid?: string;
  created?: Date;
};

/**
 * Type definition for a household inventory item.
 */
export interface Item {
  id: string;
  name: string;
  amount: number;
  minStock: number;
  expiryDate: string;
  shop: string;
  notes: string;
  isLowStock: boolean;
  isExpired: boolean;
  price: number;
  expanded?: boolean;
  category?: string;
}

/**
 * Props for a modal component handling item details.
 */
export interface ItemModalProps {
  visible?: boolean;
  onClose: () => void;
}

/**
 * Navigation parameter list for root stack modals.
 */
export type RootStackParamList = {
  cleaningModal: { item: Item };
  editDeleteModal: { item: Item };
};

/**
 * Props for a home card displaying item statistics.
 */
export interface HomeCardProps {
  totalItems: number;
  lowStockItems: number;
  expiredItems: number;
}

/**
 * Props for the AddShoppingListModal component.
 * Defines the structure of properties passed into the modal.
 */
export interface AddShoppingListModalProps {
  visible: boolean;
  onClose: () => void;
  items: any[]; 
  onSave?: (newList: any) => void;
}

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
}