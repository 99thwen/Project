// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZTtAf-LB0jDR-jSrJK27SF5MktXxasbQ",
  authDomain: "jaji-electronics.firebaseapp.com",
  projectId: "jaji-electronics",
  storageBucket: "jaji-electronics.firebasestorage.app",
  messagingSenderId: "711584665972",
  appId: "1:711584665972:web:30ddfd85cf31ac3d3e9c21"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);