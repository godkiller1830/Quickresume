import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyFY2A-1xI-_iprBhyxHWcyboNT-xeCz4",
    authDomain: "quickresume-7c26a.firebaseapp.com",
    projectId: "quickresume-7c26a",
    storageBucket: "quickresume-7c26a.firebasestorage.app",
    messagingSenderId: "441283705332",
    appId: "1:441283705332:web:9a260bb469a69d4ef5e1a1",
    measurementId: "G-JZH7RKYJF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase instances and functions
export { 
    auth, 
    db, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    doc,
    setDoc,
    getDoc
};