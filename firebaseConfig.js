import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyArBPRTgdGux-gHRql-uPOgRwPD-H8LZuc",
  authDomain: "npm-app-c6312.firebaseapp.com",
  projectId: "npm-app-c6312",
  storageBucket: "npm-app-c6312.appspot.com",
  messagingSenderId: "911763302910",
  appId: "1:911763302910:web:b92109400357c21e69b8af",
  measurementId: "G-KGG9KTDJ38"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { auth, db, firebaseConfig };
