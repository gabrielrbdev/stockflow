// ══════════════════════════════════════════════
//  StockFlow | Serviço de Estoque Geral
// ══════════════════════════════════════════════

import {
    collection, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { db } from "../config/firebase.js";

/**
 * Inicia listener em tempo real no estoque geral.
 * @param {Function} callback - Recebe o snapshot do Firestore
 */
export function monitorarEstoque(callback) {
    return onSnapshot(collection(db, "estoque_geral"), callback);
}
