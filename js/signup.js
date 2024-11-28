// signup.js
import { auth, db } from "./js/firebaseConfig.js";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const errorMessage = document.getElementById("errorMessage");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date()
            });

            window.location.href = "dashboard.html";
        } catch (error) {
            errorMessage.textContent = "Error: " + error.message;
            console.error("Error during sign-up:", error);
        }
    });

    const googleSignUpButton = document.getElementById("googleSignUp");
    googleSignUpButton.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (result.additionalUserInfo.isNewUser) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    displayName: user.displayName,
                    createdAt: new Date()
                });
            }

            window.location.href = "dashboard.html";
        } catch (error) {
            errorMessage.textContent = "Error: " + error.message;
            console.error("Error during Google sign-up:", error);
        }
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = "dashboard.html";
        }
    });
});
