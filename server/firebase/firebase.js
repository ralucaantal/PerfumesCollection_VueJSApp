// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAuO2B6J4V7ySoj6GnPeDu91vSY__z3XD8",
  authDomain: "project-tic-3844b.firebaseapp.com",
  projectId: "project-tic-3844b",
  storageBucket: "project-tic-3844b.appspot.com",
  messagingSenderId: "121715110958",
  appId: "1:121715110958:web:2aa8ac64758c4c67eddbbf",
  measurementId: "G-QS27XYJXYE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);