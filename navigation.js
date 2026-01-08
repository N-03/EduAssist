// navigation.js
import { auth, onAuthStateChanged } from './firebase.js';

export function setupNavigation() {
    onAuthStateChanged(auth, (user) => {
        const nav = document.getElementById('mainNav');
        if (nav) {
            if (user) {
                nav.innerHTML = `
                    <a href="home.html">Басты бет</a>
                    <a href="profile.html">Жеке кабинет</a>
                    <a href="#" id="logoutBtn">Шығу</a>
                `;
                
                document.getElementById('logoutBtn').addEventListener('click', async () => {
                    await import('./firebase.js').then(({ signOut }) => {
                        signOut(auth);
                        window.location.href = 'index.html';
                    });
                });
            } else {
                nav.innerHTML = `
                    <a href="index.html">Кіру</a>
                    <a href="index.html">Тіркелу</a>
                `;
            }
        }
    });
}