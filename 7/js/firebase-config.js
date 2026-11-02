import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjX9UPyH8JDiz9OC1aAfxpmb5Nj1oT9JE",
  authDomain: "brbwebdevproj.firebaseapp.com",
  projectId: "brbwebdevproj",
  storageBucket: "brbwebdevproj.firebasestorage.app",
  messagingSenderId: "802975662777",
  appId: "1:802975662777:web:12876471f8b120a7c91168"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
