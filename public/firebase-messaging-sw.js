// Import the functions you need from the SDKs you need
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDBQyniBEySpW0ZUWbTZwwO2huU5GtygRA",
    authDomain: "donetogether-official.firebaseapp.com",
    projectId: "donetogether-official",
    storageBucket: "donetogether-official.firebasestorage.app",
    messagingSenderId: "226200528766",
    appId: "1:226200528766:android:d38c55a71186b84470b52f",
    measurementId: "G-XXXXXXXXXX"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/DoneTogether/pwa-icon.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
