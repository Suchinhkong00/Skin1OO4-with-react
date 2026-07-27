import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMah3lL8rFs9UNq2g42XzFm_PQS-sMs6o",
  authDomain: "skin1004-react.firebaseapp.com",
  projectId: "skin1004-react",
  storageBucket: "skin1004-react.firebasestorage.app",
  messagingSenderId: "560747530681",
  appId: "1:560747530681:web:578f58f68695bdb676ce68",
  measurementId: "G-3V9BF4RR7N"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);