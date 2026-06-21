// ══════════════════════════════════════════════
//  StockFlow | Serviço de Autenticação
// ══════════════════════════════════════════════

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { doc, getDoc }    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db }       from "../config/firebase.js";
import { state }          from "../config/state.js";

/**
 * Realiza o login com e-mail e senha.
 */
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Realiza o logout do usuário atual.
 */
export function logout() {
    return signOut(auth);
}

/**
 * Observa mudanças no estado de autenticação.
 * @param {Function} onLoggedIn  - callback(user, role) chamado após login validado
 * @param {Function} onLoggedOut - callback() chamado quando não há sessão
 */
export function observeAuth(onLoggedIn, onLoggedOut) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const snap = await getDoc(doc(db, "usuarios", user.uid));
            if (snap.exists()) state.currentUserRole = snap.data().role;
            state.currentUserEmail = user.email;
            onLoggedIn(user, state.currentUserRole);
        } else {
            onLoggedOut();
        }
    });
}
