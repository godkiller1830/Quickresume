import { 
    auth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    db,
    doc,
    setDoc
} from './firebaseConfig.js';

// Handle Google Sign In
const googleSignInButton = document.getElementById("googleSignIn");

if (googleSignInButton) {
    googleSignInButton.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Create user document in Firestore if it doesn't exist
            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString()
            }, { merge: true });

            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Error during sign-in:", error);
            const errorMessage = document.getElementById("errorMessage");
            if (errorMessage) {
                errorMessage.textContent = error.message;
            }
        }
    });
}

// Handle Sign Out
const signOutButton = document.getElementById("signOutButton");

if (signOutButton) {
    signOutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    });
}