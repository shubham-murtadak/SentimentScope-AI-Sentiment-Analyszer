// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBtqJqStm6rFspxQPvzuIaX1XiMmyJ_Tcg",
    authDomain: "sentiment-analysis-6b019.firebaseapp.com",
    projectId: "sentiment-analysis-6b019",
    storageBucket: "sentiment-analysis-6b019.firebasestorage.app",
    messagingSenderId: "213934842335",
    appId: "1:213934842335:web:1cb2984c85526105a6e46a",
    measurementId: "G-1DJWYSDZED"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };