// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP-Z0NNQEQ3zlZKtA0h0ffORSR11cnhMg",
  authDomain: "anuwad-d169a.firebaseapp.com",
  projectId: "anuwad-d169a",
  storageBucket: "anuwad-d169a.firebasestorage.app",
  messagingSenderId: "491992642923",
  appId: "1:491992642923:web:75904b4310a19c7873082e",
  measurementId: "G-69JECWRC4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};
