export function getAuthErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/operation-not-allowed':
            return 'Google sign-in is not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/popup-closed-by-user':
            return 'Google sign-in was cancelled. Please try again.';
        case 'auth/popup-blocked':
            return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        case 'auth/internal-error':
            return 'An internal authentication error occurred. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid authentication credentials. Please try again.';
        default:
            return `Authentication error: ${errorCode}`;
    }
}