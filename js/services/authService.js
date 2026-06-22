// =============================================================================
// services/authService.js — Autenticação de Usuários
// =============================================================================


import {
    signInWithEmailAndPassword, 
    onAuthStateChanged,         
    signOut                     
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db }    from "../config/firebase.js";
import { state }       from "../config/state.js";


export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
    return signOut(auth);
}


export function observeAuth(onLoggedIn, onLoggedOut) {
    onAuthStateChanged(auth, async (user) => {

        if (user) {
            const userDoc = await getDoc(doc(db, "usuarios", user.uid));

            if (userDoc.exists()) {
                state.currentUserRole = userDoc.data().role;
            }

            state.currentUserEmail = user.email;

            onLoggedIn(user, state.currentUserRole);

        } else {
            onLoggedOut();
        }
    });
}
