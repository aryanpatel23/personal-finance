// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfjMjXOTcokV2GiUTcyhC6qsWSIF2HTD4",
  authDomain: "personal-finance-6e613.firebaseapp.com",
  projectId: "personal-finance-6e613",
  storageBucket: "personal-finance-6e613.firebasestorage.app",
  messagingSenderId: "161780434432",
  appId: "1:161780434432:web:7c3e0882a41da956ea7ae5",
  measurementId: "G-MGD2P2BBY1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
