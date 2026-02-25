import { useState, useEffect, useRef } from 'react';
import { Geolocation, type Position } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { usePlans } from './useFirestore';
import type { Item } from '../types';

const GEOFENCE_RADIUS = 100; // meters

export function useLocation(userId: string | undefined) {
    const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<string>('prompt');
    const { plans } = usePlans(userId);
    const [isTracking, setIsTracking] = useState(false);
    const watchIdRef = useRef<string | null>(null);

    // Request permissions and start watching
    useEffect(() => {
        const startWatching = async () => {
            try {
                // 1. Request Location Permissions
                console.log('Checking location permissions...');
                let permission = await Geolocation.checkPermissions();

                if (permission.location !== 'granted') {
                    console.log('Requesting location permissions...');
                    permission = await Geolocation.requestPermissions({
                        permissions: ['location', 'coarseLocation']
                    });
                }

                console.log('Location permission result:', permission.location);
                setPermissionStatus(permission.location);

                if (permission.location !== 'granted') {
                    console.log('Location permission not granted, skipping tracking.');
                    setIsTracking(false);
                    return;
                }

                // 2. Request Local Notification permissions (Only if location granted)
                console.log('Checking notification permissions...');
                let notifyPermission = await LocalNotifications.checkPermissions();
                if (notifyPermission.display !== 'granted') {
                    console.log('Requesting notification permissions...');
                    await LocalNotifications.requestPermissions();
                }

                console.log('Permissions check complete, starting tracking.');
                setIsTracking(true);

                // Clear any existing watch
                if (watchIdRef.current) {
                    await Geolocation.clearWatch({ id: watchIdRef.current });
                }

                watchIdRef.current = await Geolocation.watchPosition(
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
                    (position) => {
                        if (position) {
                            setCurrentPosition(position);
                        }
                    }
                );
            } catch (error) {
                console.error('Error starting location watch:', error);
                setIsTracking(false);
            }
        };

        if (userId) {
            startWatching();
        }

        return () => {
            if (watchIdRef.current) {
                Geolocation.clearWatch({ id: watchIdRef.current });
            }
        };
    }, [userId]);

    // Separate effect to check geofences when position or plans update
    useEffect(() => {
        if (currentPosition && plans) {
            checkGeofences(currentPosition, plans);
        }
    }, [currentPosition, plans]);

    // Check distance to all items with location
    const checkGeofences = async (position: Position, currentPlans: any[]) => {
        for (const plan of currentPlans) {
            if (plan.completed) continue;

            for (const item of plan.items) {
                if (item.checked || !item.location || !item.location.active) continue;

                // Skip if location data is missing or invalid
                if (!item.location.latitude || !item.location.longitude) continue;

                const distance = getDistanceFromLatLonInKm(
                    position.coords.latitude,
                    position.coords.longitude,
                    item.location.latitude,
                    item.location.longitude
                ) * 1000; // convert to meters

                if (distance <= (item.location.radius || GEOFENCE_RADIUS)) {
                    // Trigger notification
                    await triggerNotification(item);
                }
            }
        }
    };

    const triggerNotification = async (item: Item) => {
        // Check if we already notified recently to avoid spam (could use local storage)
        const key = `notified_${item.id}`;
        const lastNotified = localStorage.getItem(key);
        const now = Date.now();

        if (lastNotified && now - parseInt(lastNotified) < 3600000) { // 1 hour cooldown
            return;
        }

        await LocalNotifications.schedule({
            notifications: [{
                title: '📍 Du är framme!',
                body: `Kom ihåg: ${item.text}`,
                id: Math.floor(Math.random() * 100000),
                schedule: { at: new Date(Date.now() + 100) },
                sound: 'beep.wav'
            }]
        });

        localStorage.setItem(key, now.toString());
    };

    // Helper: Haversine formula
    function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

    const getCurrentLocation = async () => {
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            return coordinates;
        } catch (error) {
            console.error('Error getting current position:', error);
            return null;
        }
    };

    return {
        currentPosition,
        permissionStatus,
        isTracking,
        getCurrentLocation
    };
}
