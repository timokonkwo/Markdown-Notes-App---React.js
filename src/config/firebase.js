// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {collection, getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUkr7bOJCYsop3UnklpzO9dU9qX5CwxSk",
  authDomain: "notesapp-7bdbb.firebaseapp.com",
  projectId: "notesapp-7bdbb",
  storageBucket: "notesapp-7bdbb.appspot.com",
  messagingSenderId: "777242640967",
  appId: "1:777242640967:web:542394a7c9abd97e786762",
  measurementId: "G-D1J32Q7E5Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const notesCollection = collection(db, 'notes');

