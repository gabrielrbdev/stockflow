// ══════════════════════════════════════════════
//  StockFlow | UI – Dashboard (KPIs e Estoque)
// ══════════════════════════════════════════════

import { monitorarEstoque }       from "../services/estoqueService.js";
import { monitorarRecebimentos }  from "../services/recebimentoService.js";

/**
 * Inicializa os listeners e atualiza os KPIs e grid de estoque.
 */
export function iniciarDashboard() {
    _observarEstoque();
    _observarKpis();
}

// ── Privado ─────────────────────────────────

function _observarEstoque() {
    const container = document.getElementById('grid-estoque-fornecedor');
    const kpiTotal  = document.getElementById('kpi-total-itens');

    monitorarEstoque((snap) => {
        container.innerHTML = "";
        let total = 0;
        snap.forEach(d => {
            const i = d.data();
            container.innerHTML += `
                <div class="winthor-card p-2 text-[10px] uppercase flex justify-between">
                    <span>${i.produto}</span>
                    <b>${i.saldo} UN</b>
                </div>`;
            total++;
        });
        kpiTotal.innerText = total;
    });
}

function _observarKpis() {
    const kpiPend = document.getElementById('kpi-pendentes');
    const kpiDiv  = document.getElementById('kpi-divergencias');

    monitorarRecebimentos((snap) => {
        let pend = 0, div = 0;
        snap.forEach(d => {
            const i = d.data();
            if (i.status !== "SUCESSO" && i.status !== "BLOQUEADO_AUDITORIA" && i.tentativas < 2) pend++;
            if (i.status === "BLOQUEADO_AUDITORIA") div++;
        });
        kpiPend.innerText = pend;
        kpiDiv.innerText  = div;
    });
}
