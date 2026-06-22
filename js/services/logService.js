// ══════════════════════════════════════════════
//  StockFlow | Serviço de Logs
// ══════════════════════════════════════════════

import {
    collection, addDoc, onSnapshot,
    query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { auth } from "../config/firebase.js";
import { db }   from "../config/firebase.js";


export async function registrarLog(acao, detalhes) {
    await addDoc(collection(db, "logs"), {
        usuario: auth.currentUser?.email || "?",
        acao,
        detalhes,
        data: serverTimestamp()
    });
}


export function monitorarLogs(container) {
    onSnapshot(query(collection(db, "logs"), orderBy("data", "desc")), (snap) => {
        container.innerHTML = "";
        snap.forEach(d => {
            const l = d.data();
            const time = l.data?.toDate().toLocaleString() || '...';
            container.innerHTML += `<div>[${time}] ${l.usuario}: ${l.acao} - ${l.detalhes}</div>`;
        });
    });
}
