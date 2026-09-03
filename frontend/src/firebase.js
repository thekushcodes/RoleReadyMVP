import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBr4L-yKxnfJDf_-C7Iy7a1va1LkZG1bmU",
  authDomain: "internalmvp-eee08.firebaseapp.com",
  projectId: "internalmvp-eee08",
  storageBucket: "internalmvp-eee08.firebasestorage.app",
  messagingSenderId: "363446233882",
  appId: "1:363446233882:web:5f9cc8e664cf55b61b9aa3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };