import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDF6mr2ZZXm6NJv4xHg4qyC-d7ZQ3ZcxX4",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nagar-alert-hub-ranchi.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nagar-alert-hub-ranchi",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nagar-alert-hub-ranchi.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "345338268122",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:345338268122:web:0114857874e26f5bced8e3",
    measurementId: "G-XJ8VYKSV9C"
};

// Initialize Firebase (Singleton Check to prevent HMR errors)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
