// ══════════════════════════════════════════════
//  StockFlow | Serviço de Recebimentos
// ══════════════════════════════════════════════

import {
    collection, doc, addDoc, getDoc, updateDoc,
    onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { db }            from "../config/firebase.js";
import { state }         from "../config/state.js";
import { registrarLog }  from "./logService.js";


export function monitorarRecebimentos(callback) {
    return onSnapshot(
        query(collection(db, "recebimentos"), orderBy("data", "desc")),
        callback
    );
}


export async function importarXML(xmlText) {
    const parser = new DOMParser();
    const xml    = parser.parseFromString(xmlText, "text/xml");

    const nNF  = xml.getElementsByTagName("nNF")[0]?.textContent;
    const forn = xml.getElementsByTagName("xNome")[0]?.textContent.toUpperCase();
    const lote = "L" + Date.now().toString().slice(-5);
    const itens = xml.getElementsByTagName("det");

    const promises = [];
    for (let i = 0; i < itens.length; i++) {
        promises.push(addDoc(collection(db, "recebimentos"), {
            lote,
            nf:           nNF,
            fornecedor:   forn,
            produto:      itens[i].getElementsByTagName("xProd")[0]?.textContent.toUpperCase(),
            qtdEsperada:  parseFloat(itens[i].getElementsByTagName("qCom")[0]?.textContent),
            status:       "PENDENTE",
            data:         serverTimestamp(),
            qtdContada:   0,
            tentativas:   0
        }));
    }

    await Promise.all(promises);
    await registrarLog("IMPORT_XML", `NF ${nNF} enviada para conferência.`);
}


export async function buscarRecebimento(id) {
    const snap = await getDoc(doc(db, "recebimentos", id));
    return { id, ...snap.data() };
}


export async function gravarConferencia(item, qtd, validade) {
    const ref          = doc(db, "recebimentos", item.id);
    const novaTentativa = (item.tentativas || 0) + 1;
    const isAdmin       = state.currentUserRole === "admin";
    const isCorreto     = qtd === item.qtdEsperada;

    if (isAdmin || isCorreto) {
        await updateDoc(ref, {
            status:     "SUCESSO",
            qtdContada: qtd,
            validade,
            tentativas: novaTentativa
        });
        await addDoc(collection(db, "estoque_geral"), {
            produto:    item.produto,
            saldo:      qtd,
            validade,
            fornecedor: item.fornecedor
        });
        await registrarLog("APROVADO", `${item.produto} finalizado.`);
        return { resultado: "SUCESSO" };
    }

    if (novaTentativa >= 2) {
        await updateDoc(ref, {
            status:     "BLOQUEADO_AUDITORIA",
            qtdContada: qtd,
            validade,
            tentativas: novaTentativa
        });
        await registrarLog("DIVERGENCIA", `Erro: ${item.produto} (${novaTentativa}ª tent.)`);
        return { resultado: "BLOQUEADO" };
    }

    await updateDoc(ref, {
        status:     "RECONTAGEM",
        qtdContada: qtd,
        validade,
        tentativas: novaTentativa
    });
    await registrarLog("DIVERGENCIA", `Erro: ${item.produto} (${novaTentativa}ª tent.)`);
    return { resultado: "RECONTAGEM", tentativa: novaTentativa };
}
