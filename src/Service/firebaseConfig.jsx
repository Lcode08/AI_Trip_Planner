// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh8RVqAZupWWNSj_67vGCtQozeG0Zm9Ek",
  authDomain: "ai-trip-planner-a9a51.firebaseapp.com",
  projectId: "ai-trip-planner-a9a51",
  storageBucket: "ai-trip-planner-a9a51.firebasestorage.app",
  messagingSenderId: "474166777307",
  appId: "1:474166777307:web:60d3b45c8492d7d5fdc3fe",
  measurementId: "G-DJ16Q7PZMV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);