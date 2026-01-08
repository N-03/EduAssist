// js/auth-check.js
import { auth, onAuthStateChanged } from './firebase.js';

// Функция для проверки авторизации
export function checkAuth(redirectIfNotAuth = false, redirectUrl = "index.html") {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user);
            } else {
                if (redirectIfNotAuth) {
                    window.location.href = redirectUrl;
                }
                resolve(null);
            }
        });
    });
}

// Получить текущего пользователя
export function getCurrentUser() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });
}