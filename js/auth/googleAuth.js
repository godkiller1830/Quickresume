import { auth, provider, db } from '../firebaseConfig.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export async function signInWithGoogle() {
    try {
        // Clear any existing auth state
        await auth.signOut();
        
        // Trigger Google sign-in popup
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // If this is a new user, create their document in Firestore
        if (result.additionalUserInfo?.isNewUser) {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date()
            });
        }

        // Update last login
        await setDoc(doc(db, "users", user.uid), {
            lastLogin: new Date()
        }, { merge: true });

        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Google Sign In Error:", error);
        throw error;
    }
}