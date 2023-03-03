// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmnDUOsPk9Ad9siqbit_hHJsRTz8NiWRI",
  authDomain: "test-firebase-1a87a.firebaseapp.com",
  databaseURL: "https://test-firebase-1a87a-default-rtdb.firebaseio.com",
  projectId: "test-firebase-1a87a",
  storageBucket: "test-firebase-1a87a.appspot.com",
  messagingSenderId: "1082066647673",
  appId: "1:1082066647673:web:c0f029534c4536ec1df2a8",
  measurementId: "G-6KJBY9QYKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const getAuth = getAuth(app);
console.log(app);
