
# 🧹 ClearSpace – Home Inventory Management App

ClearSpace is a mobile application designed to simplify household inventory management. Built with React Native and powered by Firebase, the app helps users track and organize essential household items like food, hygiene supplies, medicine, and cleaning products. It enables expiry tracking, low-stock alerts, and generates categorized shopping lists—making home management smarter and more efficient.

## 📱 Features

* 🔐 **User Authentication** (via Firebase Auth)
* 🗃️ **Item Management** by category (Food, Hygiene, Medicine, Cleaning)
* 🧼 **Low Stock & Expiry Tracking**
* 🛒 **Smart Shopping List Generation**
* 📦 **Cloud Sync with Firebase Firestore**
* 📸 Future support for **Barcode Scanning** (UI implemented)
* 👨‍👩‍👧 Future support for **Multi-user Collaboration**

## 📦 Tech Stack

* **Frontend**: React Native (Expo)
* **Backend**: Firebase (Auth + Firestore)
* **Navigation**: Expo Router
* **State Management**: Context API
* **Storage**: AsyncStorage, Cloudinary for images, Firebase Database
* **Deployment**: EAS (Expo Application Services)

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js & npm
* Expo CLI:

  ```bash
  npm install -g expo-cli
  ```

### 📥 Clone and Install

```bash
git clone https://github.com/kkelisabeth/ClearSpace.git
cd ClearSpace
npm install
```

### ▶️ Run the App

```bash
npx expo start
```

This will open Expo DevTools in your browser. Scan the QR code using the Expo Go app on your phone to launch the app.

### 📱 Test Using Expo Go

* **Android**: Download [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Google Play
* **iOS**: Download [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from the App Store
* Scan the QR code displayed in Expo DevTools or your terminal

> 💡 Make sure your computer and device are on the same Wi-Fi network.

## 🧪 Testing & APK Builds

* For local development, use `npx expo start`.
* To generate an APK for testing:

  ```
  npx eas build --platform android --profile preview
  ```

> Note: Make sure your `eas.json` and Firebase configuration are correctly set up for production.

## 📂 Project Structure

```
ClearSpace/
├── app/                  # Navigation and page structure (via Expo Router)
├── components/           # Reusable UI components
├── config/               # Firebase and environment configuration
├── contexts/             # Global context (e.g., authentication)
├── assets/               # App assets and images
├── types/                # TypeScript types and interfaces
├── utils/                # Helper functions
├── app.(ts|js)           # Entry point
└── ...
```


## 🙋‍♀️ About the Author

ClearSpace was created as a Final Year Project by [K. Jelizaveta Paula](https://github.com/kkelisabeth), showcasing a full development lifecycle from concept to implementation, focusing on clean design, intuitive UX, and practical utility.
