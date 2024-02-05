import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC14nSLmpzwLfpD4sQBKcizCM6k8w9JWPE",
  authDomain: "project-tic-8676f.firebaseapp.com",
  projectId: "project-tic-8676f",
  storageBucket: "project-tic-8676f.appspot.com",
  messagingSenderId: "792449229151",
  appId: "1:792449229151:web:bafdabddeba3c67d3a56ea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
