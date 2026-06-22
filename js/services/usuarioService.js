

import {
    collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { db, firebaseConfig } from "../config/firebase.js";
import { state }              from "../config/state.js";
import { registrarLog }       from "./logService.js";


export async function cadastrarUsuario(email, senha, role) {
    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
        {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email, password: senha, returnSecureToken: true })
        }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    await setDoc(doc(db, "usuarios", data.localId), {
        email,
        role,
        criadoPor: state.currentUserEmail,
        criadoEm:  serverTimestamp()
    });

    await registrarLog("CRIAR_USUARIO", `${email} (${role}) cadastrado.`);
}


export async function listarUsuarios() {
    const snap = await getDocs(collection(db, "usuarios"));
    const lista = [];
    snap.forEach(d => lista.push({ uid: d.id, ...d.data() }));
    return lista;
}


export async function removerUsuario(uid) {
    await deleteDoc(doc(db, "usuarios", uid));
    await registrarLog("REMOVER_USUARIO", `UID ${uid} removido.`);
}

/** Mapeamento de códigos de erro da API do Firebase para mensagens amigáveis */
export const ERROS_AUTH = {
    'EMAIL_EXISTS':   'Este e-mail já está cadastrado.',
    'INVALID_EMAIL':  'E-mail inválido.',
    'WEAK_PASSWORD : Password should be at least 6 characters': 'Senha muito fraca (mín. 6 caracteres).',
};
