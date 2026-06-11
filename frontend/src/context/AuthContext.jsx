import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { setGcpAccessToken, clearGcpAccessToken, requestGcpToken } from '../services/gcpTokenService';

const ADMIN_EMAIL = 'schomer@google.com';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const isAdmin = user?.email === ADMIN_EMAIL;

    const signIn = useCallback(async () => {
        try {
            // Add cloud-platform scope for Vertex AI (Gemini) access
            googleProvider.addScope('https://www.googleapis.com/auth/cloud-platform');
            googleProvider.setCustomParameters({ prompt: 'select_account' });

            const result = await signInWithPopup(auth, googleProvider);

            // Capture the OAuth access token for Vertex AI calls
            try {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential?.accessToken) {
                    console.log('[Auth] Captured OAuth access token via credential');
                    setGcpAccessToken(credential.accessToken);
                } else {
                    console.warn('[Auth] No access token from credential — triggering GIS token request');
                    await requestGcpToken(result.user.email || undefined);
                }
            } catch (err) {
                console.warn('[Auth] Could not extract OAuth token, trying GIS:', err);
                try {
                    await requestGcpToken(result.user.email || undefined);
                } catch (gisErr) {
                    console.error('[Auth] GIS fallback failed:', gisErr);
                }
            }
        } catch (error) {
            console.error('Sign-in failed:', error);
        }
    }, []);

    const signOutUser = useCallback(async () => {
        try {
            clearGcpAccessToken();
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign-out failed:', error);
        }
    }, []);

    const getAuthHeaders = useCallback(async () => {
        if (!user) return {};
        try {
            const token = await user.getIdToken();
            return { Authorization: `Bearer ${token}` };
        } catch {
            return {};
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin,
            loading,
            signIn,
            signOut: signOutUser,
            getAuthHeaders,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
