// js/firebase.js - упрощенная версия
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase конфигурация прямо здесь, без отдельного файла
const firebaseConfig = {
  apiKey: "AIzaSyBJrCYwCJHqvZtkm6ojuCNMvrmUeYXHP5A",
  authDomain: "eduassist-eb506.firebaseapp.com",
  projectId: "eduassist-eb506",
  storageBucket: "eduassist-eb506.appspot.com",
  messagingSenderId: "977276770732",
  appId: "1:977276770732:web:89e61415aa457039894209"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация сервисов
const auth = getAuth(app);
const db = getFirestore(app);

// Экспорт
export { app, auth, db };