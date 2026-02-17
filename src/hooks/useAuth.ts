import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type User, signOut as firebaseSignOut, getRedirectResult, GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { UserProfile } from '../types';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { i18n } = useTranslation();

    useEffect(() => {
        // Initialize GoogleAuth for native platforms
        if (Capacitor.isNativePlatform()) {
            GoogleAuth.initialize({
                clientId: '677287957451-6vja60qu97qvobgr61li4b3dlrj1pslq.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
                grantOfflineAccess: true,
            });
        }

        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            try {
                setUser(firebaseUser);
                if (firebaseUser) {
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const profile = userSnap.data() as UserProfile;
                        setUserProfile(profile);
                    } else {
                        const newProfile: UserProfile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || 'User',
                            photoURL: firebaseUser.photoURL || undefined,
                            friends: [],
                            createdAt: Timestamp.now(),
                            language: i18n.language || 'en',
                        };
                        await setDoc(userRef, newProfile);
                        setUserProfile(newProfile);
                    }
                } else {
                    setUserProfile(null);
                }
            } catch (err) {
                console.error('Auth state change error:', err);
            } finally {
                setLoading(false);
            }
        });

        // Kolla efter redirect-resultat (för både webb och mobil)
        const checkRedirect = async () => {
            try {
                console.log('🔍 Checking for redirect result...');
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    console.log('✅ Redirect login success:', result.user.email);
                    console.log('✅ User ID:', result.user.uid);
                    console.log('✅ Provider:', result.providerId);
                } else {
                    console.log('⚠️ No redirect result found (this is normal on first page load)');
                    console.log('⚠️ Current URL:', window.location.href);
                    console.log('⚠️ URL params:', window.location.search);
                }
            } catch (err: any) {
                console.error('❌ Redirect result error:', err);
                console.error('❌ Error code:', err.code);
                console.error('❌ Error message:', err.message);
                console.error('❌ Full error:', JSON.stringify(err, null, 2));
                if (err.code === 'auth/unauthorized-domain') {
                    console.error('🔧 FIX: Add localhost to Firebase Authorized Domains');
                } else if (err.code === 'auth/popup-blocked') {
                    console.error('🔧 FIX: Enable popups or use redirect (already using redirect)');
                }
            }
        };
        
        // Wait a bit before checking redirect result
        setTimeout(checkRedirect, 500);

        return () => unsubscribe();
    }, [i18n]);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (Capacitor.isNativePlatform()) {
                console.log('📱 Starting native sign in with explicit clientId...');
                // Some versions of the plugin work better if we pass the clientId here
                // For native platforms, we use the serverClientId (Web Client ID)
                const googleUser = await GoogleAuth.signIn();
                console.log('✅ Native sign in success, getting credential...');
                const idToken = googleUser.authentication.idToken;
                
                if (!idToken) {
                    throw new Error("No idToken received from Google Auth");
                }
                
                const credential = GoogleAuthProvider.credential(idToken);
                const userCredential = await signInWithCredential(auth, credential);
                console.log('✅ Firebase sign in with credential success:', userCredential.user.email);
            } else {
                console.log('🌐 Starting Firebase POPUP sign in (changed from redirect)...');
                console.log('🌐 Current URL:', window.location.href);
                
                // Create a fresh GoogleAuthProvider instance
                const provider = new GoogleAuthProvider();
                provider.setCustomParameters({
                    prompt: 'select_account'
                });
                
                // Try popup instead of redirect for localhost
                const result = await signInWithPopup(auth, provider);
                console.log('✅ Popup sign in success:', result.user.email);
            }
            
        } catch (err: any) {
            console.error('❌ Detailed sign in error:', err);
            console.error('❌ Error code:', err.code);
            console.error('❌ Error message:', err.message);
            const errorMessage = err.message || "Something went wrong";
            setError(`Inloggning misslyckades: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setError(null);
            await firebaseSignOut(auth);
        } catch (err: any) {
            setError(err.message);
            console.error('Sign out error:', err);
        }
    };

    return {
        user,
        userProfile,
        loading,
        error,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!user,
    };
}
