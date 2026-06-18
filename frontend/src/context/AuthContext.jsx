import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

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
            googleProvider.setCustomParameters({ prompt: 'select_account' });
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Sign-in failed:', error);
        }
    }, []);

    const signOutUser = useCallback(async () => {
        try {
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
