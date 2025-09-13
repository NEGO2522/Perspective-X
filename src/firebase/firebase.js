// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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