import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCA_1UxB7z86TvyIEpgqnTwnUgqOWTEf_4",
    authDomain: "donetogether-v1.firebaseapp.com",
    projectId: "donetogether-v1",
    storageBucket: "donetogether-v1.firebasestorage.app",
    messagingSenderId: "677287957451",
    appId: "1:677287957451:web:812a897c8f906a63b8dc4e",
    measurementId: "G-CL4ST1C496"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    ignoreUndefinedProperties: true
});
export const messaging = getMessaging(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
