import { auth, provider } from './firebaseConfig.js';
import { signInWithPopup, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

document.addEventListener("DOMContentLoaded", () => {
  const googleSignInButton = document.getElementById("googleSignIn");
  const errorMessageElement = document.getElementById("errorMessage"); // Assumes an element exists for displaying errors

  // Redirect if user is already signed in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "dashboard.html";
    }
  });

  if (googleSignInButton) {
    googleSignInButton.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        window.location.href = "dashboard.html"; // Redirect after successful login
      } catch (error) {
        displayErrorMessage(error, errorMessageElement);
      }
    });
  }
});

// Helper function to display error messages
function displayErrorMessage(error, element) {
  if (!element) return;

  let message;
  switch (error.code) {
    case "auth/popup-closed-by-user":
      message = "Sign-in was canceled. Please try again.";
      break;
    case "auth/network-request-failed":
      message = "Network error. Check your connection and try again.";
      break;
    default:
      message = "An error occurred during sign-in. Please try again.";
  }

  element.textContent = message;
  element.classList.add("visible");
}
