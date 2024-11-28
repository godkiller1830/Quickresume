import { auth, db } from '../firebaseConfig.js';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export async function signUpWithEmail(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date()
    });

    window.location.href = 'dashboard.html';
  } catch (error) {
    throw error;
  }
}

export async function signInWithEmail(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (error) {
    throw error;
  }
}