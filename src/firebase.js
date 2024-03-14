// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOn-8cmwn5mw3EEXiOAbeynftCaH4deA0",
  authDomain: "chatroom-c74db.firebaseapp.com",
  databaseURL: "https://chatroom-c74db-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "chatroom-c74db",
  storageBucket: "chatroom-c74db.appspot.com",
  messagingSenderId: "739572603696",
  appId: "1:739572603696:web:d5312a60748ee833db46f5",
  measurementId: "G-TJLMRQ7VCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app)
export const storage = getStorage();
export default app;