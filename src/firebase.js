import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-SRVP-J9ziVxASEQjYFavyyVie1i5Hzs",
  authDomain: "blog-react-65fa9.firebaseapp.com",
  projectId: "blog-react-65fa9",
  storageBucket: "blog-react-65fa9.firebasestorage.app",
  messagingSenderId: "988003212432",
  appId: "1:988003212432:web:dba0e62274790751b1cc15",
  measurementId: "G-2JT11JJGRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);