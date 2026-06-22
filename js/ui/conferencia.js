

import { state }                  from "../config/state.js";
import { monitorarRecebimentos, buscarRecebimento, gravarConferencia, importarXML }
                                  from "../services/recebimentoService.js";
import { switchTab }              from "./tabs.js";


export function iniciarConferencia() {
    monitorarRecebimentos((snap) => {
        const listConf   = document.getElementById('list-conferencia');
        const listFiscal = document.getElementById('list-fiscal-body');
        listConf.innerHTML = "";
        listFiscal.innerHTML = "";

        snap.forEach(d => {
            const i  = d.data();
            const id = d.id;

            _renderItemConferencia(listConf, i, id);
            _renderItemFiscal(listFiscal, i, id);
        });
    });
}

//Configura o input de arquivo XML para importação.
 
export function configurarImportacaoXML() {
    document.getElementById('xml-input').onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                await importarXML(ev.target.result);
                e.target.value = "";
                switchTab('Conferencia');
                alert("Nota importada! Os produtos já estão na lista.");
            } catch (err) {
                alert("Erro ao importar: " + err.message);
            }
        };
        reader.readAsText(file);
    };
}


//Abre o modal de conferência para um item específico.
export async function abrirModal(id, prod, esp, nf, forn) {
    const item = await buscarRecebimento(id);
    state.activeItem = { id, prod, esp, nf, forn, ...item };

    document.getElementById('modal-prod-nome').innerText  = prod;
    document.getElementById('input-qtd').value            = "";
    document.getElementById('input-validade').value       = "";
    document.getElementById('modal-conferencia').classList.remove('hidden');
}


export function fecharModal() {
    document.getElementById('modal-conferencia').classList.add('hidden');
}

export async function confirmarConferencia() {
    const qtd = parseFloat(document.getElementById('input-qtd').value);
    const val = document.getElementById('input-validade').value;

    if (isNaN(qtd) || !val) {
        alert("Erro: Preencha todos os campos.");
        return;
    }

    const resultado = await gravarConferencia(state.activeItem, qtd, val);
    fecharModal();

    if (resultado.resultado === "BLOQUEADO") {
        alert("BLOQUEADO! O item foi enviado para auditoria.");
    } else if (resultado.resultado === "RECONTAGEM") {
        alert(`DIVERGÊNCIA! Recontagem necessária (Tentativa ${resultado.tentativa}/2).`);
    }
}

// Expõe funções chamadas via onclick no HTML
window.abrirModal  = abrirModal;
window.fecharModal = fecharModal;


function _renderItemConferencia(container, i, id) {
    if (i.status === "SUCESSO" || i.status === "BLOQUEADO_AUDITORIA" || i.tentativas >= 2) return;

    const emRecontagem = i.tentativas === 1;
    container.innerHTML += `
        <div class="winthor-card overflow-hidden ${emRecontagem ? 'border-l-4 border-l-amber-500' : ''}">
            <div class="winthor-table-header ${emRecontagem ? 'bg-amber-700' : 'bg-slate-600'} flex justify-between">
                <span>NF: ${i.nf} | ${i.fornecedor} ${emRecontagem ? '(RECONTAGEM)' : ''}</span>
                <span>LOTE: ${i.lote}</span>
            </div>
            <div class="p-3 flex justify-between items-center">
                <div>
                    <span class="font-black text-[11px] uppercase">${i.produto}</span>
                    ${emRecontagem ? `<span class="ml-2 bg-amber-100 text-amber-800 px-2 py-0.5 font-bold text-[9px]">ÚLT. QTD: ${i.qtdContada}</span>` : ''}
                </div>
                <button onclick="abrirModal('${id}','${i.produto}',${i.qtdEsperada},'${i.nf}','${i.fornecedor}')"
                    class="btn-winthor">Conferir</button>
            </div>
        </div>`;
}

function _renderItemFiscal(container, i, id) {
    const statusClass = i.status === 'SUCESSO'
        ? 'text-emerald-600'
        : i.status === 'BLOQUEADO_AUDITORIA'
            ? 'text-rose-700'
            : 'text-slate-500';

    const isAdmin = state.currentUserRole === 'admin';

    container.innerHTML += `
        <tr class="border-b bg-white">
            <td class="p-2 border-r font-bold">${i.lote}</td>
            <td class="p-2 border-r">${i.fornecedor}</td>
            <td class="p-2 border-r">${i.produto}</td>
            <td class="p-2 border-r text-center">${i.tentativas}/2</td>
            <td class="p-2 border-r font-bold ${statusClass}">${i.status}</td>
            <td class="p-2 text-center">
                <button onclick="abrirModal('${id}','${i.produto}',${i.qtdEsperada},'${i.nf}','${i.fornecedor}')"
                    class="btn-winthor ${isAdmin ? '' : 'hidden'}">AUDITAR</button>
            </td>
        </tr>`;
}
