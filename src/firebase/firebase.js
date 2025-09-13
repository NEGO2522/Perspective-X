// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink as signInWithEmailLinkAuth
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA080tHPuQ9wDccqdOJS6Hsymr66hgghIs",
  authDomain: "perspectivex-ee5ca.firebaseapp.com",
  projectId: "perspectivex-ee5ca",
  storageBucket: "perspectivex-ee5ca.firebasestorage.app",
  messagingSenderId: "477126592687",
  appId: "1:477126592687:web:56abd31df7b27a48a46c5a",
  measurementId: "G-WD8WK7B8SN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    window.location.href = '/';
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Email Link Authentication
export const sendSignInLink = async (email) => {
  const actionCodeSettings = {
    url: window.location.origin,
    handleCodeInApp: true,
  };
  
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Save the email locally to complete sign-in after clicking the link
    window.localStorage.setItem('emailForSignIn', email);
    return true;
  } catch (error) {
    console.error("Error sending sign in link:", error);
    throw error;
  }
};

// Check if the user is coming from a sign-in link
export const isSignInLinkUrl = (url) => {
  return isSignInWithEmailLink(auth, url);
};

// Complete sign in with email link
export const completeSignInWithEmailLink = async (email, url) => {
  try {
    const result = await signInWithEmailLinkAuth(auth, email, url);
    // Clear the email from storage
    window.localStorage.removeItem('emailForSignIn');
    return result.user;
  } catch (error) {
    console.error("Error completing sign in with email link:", error);
    throw error;
  }
};

export { auth };