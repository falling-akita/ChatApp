import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

//ファイアベースの設定

const firebaseConfig = {
  apiKey: "AIzaSyCqLyriStSFnDdmSe8WpBKI8arllKYYpO8",
  authDomain: "messageapp-166ff.firebaseapp.com",
  projectId: "messageapp-166ff",
  storageBucket: "messageapp-166ff.firebasestorage.app",
  messagingSenderId: "422547074446",
  appId: "1:422547074446:web:822dc8f62d226aec2148df",
  measurementId: "G-ELQX6CMGJK",
};

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
