// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCY6JjiookDqHXLb-ubzds4NYCwlrli0vk",
    authDomain: "logfit-d47eb.firebaseapp.com",
    projectId: "logfit-d47eb",
    storageBucket: "logfit-d47eb.firebasestorage.app",
    messagingSenderId: "589306144432",
    appId: "1:589306144432:web:0733c43f6f4660c77a3d75",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
