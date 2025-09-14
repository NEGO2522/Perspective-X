import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  client_id: import.meta.env.VITE_FIREBASE_CLIENT_ID
});

// Add scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signOutUser = () => {
  return signOut(auth);
};

export const sendSignInLink = (email) => {
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };
  window.localStorage.setItem('emailForSignIn', email);
  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const isSignInLinkUrl = (url) => {
  return isSignInWithEmailLink(auth, url);
};

export const completeSignInWithEmailLink = (email, url) => {
  return signInWithEmailLink(auth, email, url);
};

export { auth };
