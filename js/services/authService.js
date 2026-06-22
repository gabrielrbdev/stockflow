// =============================================================================
// services/authService.js — Autenticação de Usuários
// =============================================================================
//
// Responsável por: login, logout e observar se o usuário está logado.
//
// O Firebase Auth mantém a sessão automaticamente (mesmo após fechar o browser).
// Por isso usamos observeAuth() em vez de checar o login manualmente:
// ele é chamado automaticamente sempre que o estado de login mudar.
// =============================================================================

import {
    signInWithEmailAndPassword, // faz o login com e-mail e senha
    onAuthStateChanged,         // escuta mudanças de sessão em tempo real
    signOut                     // encerra a sessão do usuário
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db }    from "../config/firebase.js";
import { state }       from "../config/state.js";

// -----------------------------------------------------------------------------
// login
// Autentica o usuário no Firebase com e-mail e senha.
// Retorna uma Promise — o .catch() no app.js trata erros de credencial.
// -----------------------------------------------------------------------------
export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// -----------------------------------------------------------------------------
// logout
// Encerra a sessão. O observeAuth() detecta isso automaticamente
// e o app.js esconde a interface e mostra a tela de login.
// -----------------------------------------------------------------------------
export function logout() {
    return signOut(auth);
}

// -----------------------------------------------------------------------------
// observeAuth
// Escuta mudanças de sessão em tempo real e executa o callback adequado.
//
// Quando o usuário loga:
//   1. Buscamos o papel dele (admin/user) no Firestore
//   2. Salvamos no state global
//   3. Chamamos onLoggedIn(user, role) para que o app.js monte a interface
//
// Quando o usuário desloga (ou a sessão expira):
//   1. Chamamos onLoggedOut() para que o app.js mostre a tela de login
// -----------------------------------------------------------------------------
export function observeAuth(onLoggedIn, onLoggedOut) {
    onAuthStateChanged(auth, async (user) => {

        if (user) {
            // Busca o documento do usuário em /usuarios/{uid} para obter seu papel (role)
            const userDoc = await getDoc(doc(db, "usuarios", user.uid));

            // Se o documento existir, salva o papel no estado global
            if (userDoc.exists()) {
                state.currentUserRole = userDoc.data().role;
            }

            state.currentUserEmail = user.email;

            // Avisa o app.js que o login foi concluído, passando usuário e papel
            onLoggedIn(user, state.currentUserRole);

        } else {
            // Sem usuário → sessão encerrada ou nunca iniciada
            onLoggedOut();
        }
    });
}
