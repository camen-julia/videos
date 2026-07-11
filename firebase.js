import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUUyZ-NgqhvrLve4u7BpDKbt560P5UJgQ",
  authDomain: "videos-d583f.firebaseapp.com",
  projectId: "videos-d583f",
  storageBucket: "videos-d583f.firebasestorage.app",
  messagingSenderId: "1027579550246",
  appId: "1:1027579550246:web:3979429f01d4aa763b64e7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment
};
