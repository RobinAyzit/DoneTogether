import { getToken, onMessage } from 'firebase/messaging';
import { messaging, db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useNotifications(userId: string | undefined) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        if (!userId || !('Notification' in window)) return;

        const requestPermission = async () => {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    // Get FCM token
                    // Replace YOUR_VAPID_KEY with the actual key from Firebase Console
                    const currentToken = await getToken(messaging, {
                        vapidKey: 'BN4q6ahLqD56ssLIqw8C0CYOb70yDq_7ePfJ8xLO1wL8Uxz9nds2RzRB8gPsJ6_JSq37AxVI-z3ssg11Hz7KU3A'
                    });

                    if (currentToken) {
                        setToken(currentToken);
                        // Save token to user profile
                        const userRef = doc(db, 'users', userId);
                        await updateDoc(userRef, {
                            fcmTokens: arrayUnion(currentToken)
                        });
                    }
                }
            } catch (error) {
                console.error('Error getting notification token:', error);
            }
        };

        requestPermission();

        // Handle foreground messages
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            if (payload.notification) {
                new Notification(payload.notification.title || 'Done Together', {
                    body: payload.notification.body,
                    icon: '/share-plans-done-together/pwa-icon.png'
                });
            }
        });

        return () => unsubscribe();
    }, [userId]);

    return { token };
}
