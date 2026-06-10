// Data Cloud Design System — Firebase Configuration
// Uses the same Firebase project as hey-data-now (malloy-data)

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBAmqEk0uffrau95ArrczJCmC7e3YBfONM",
  authDomain: "malloy-data.firebaseapp.com",
  projectId: "malloy-data",
  storageBucket: "malloy-data.firebasestorage.app",
  messagingSenderId: "347391727005",
  appId: "1:347391727005:web:898b7137adc8945c7e0b74",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
