import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDX8BJYaG7zpel7V-ZGgUA5zEufWFNe66s",
  authDomain: "refundaccount.firebaseapp.com",
  projectId: "refundaccount",
  storageBucket: "refundaccount.firebasestorage.app",
  messagingSenderId: "798120715095",
  appId: "1:798120715095:web:1b09be892b00dfc5e75412",
  measurementId: "G-CX4YZ3R856"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const localPersistence = browserLocalPersistence;