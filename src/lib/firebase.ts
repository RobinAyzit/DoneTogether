import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
    apiKey: "AIzaSyDsGmC9FOrwuJQMqFKhmCuxiJIP0vxoTBU",
    authDomain: "donetogether-v1.firebaseapp.com",
    projectId: "donetogether-v1",
    storageBucket: "donetogether-v1.firebasestorage.app",
    messagingSenderId: "677287957451",
    appId: "1:677287957451:web:812a897c8f906a63b8dc4e",
    measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    ignoreUndefinedProperties: true
});

let messagingInstance = null;
try {
  if (!Capacitor.isNativePlatform()) {
    messagingInstance = getMessaging(app);
  }
} catch (error) {
  console.error('Firebase Messaging initialization failed:', error);
}
export const messaging = messagingInstance;

export const googleProvider = new GoogleAuthProvider();

// FÖR CAPACITOR: Använd en mycket enklare approach - låt Firebase hantera redirect automatiskt
// Istället för att försöka sätta custom redirect_uri, låt Firebase använda sin standardkonfiguration
// Capacitor's WebView kommer automatiskt att hantera redirecten tillbaka till appen
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
