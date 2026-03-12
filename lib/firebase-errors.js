export function getFirebaseAuthMessage(errorCode) {
  const messages = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account was found with this email.",
    "auth/wrong-password": "The password you entered is incorrect.",
    "auth/invalid-credential": "Your login details are incorrect.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/missing-password": "Please enter your password.",
    "auth/missing-email": "Please enter your email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/popup-closed-by-user": "Google sign-in was closed before completion.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
    "auth/too-many-requests":
      "Too many attempts. Please wait a bit and try again.",
    "auth/operation-not-allowed":
      "This sign-in method is not enabled in Firebase console.",
    "auth/unverified-email":
      "Please verify your email address before signing in.",
  };

  return messages[errorCode] || "Something went wrong. Please try again.";
}