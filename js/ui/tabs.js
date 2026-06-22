// ══════════════════════════════════════════════
//  StockFlow | UI – Controle de Abas
// ══════════════════════════════════════════════

const ABAS = ['Dash', 'Conferencia', 'Fiscal', 'Logs'];


export function switchTab(tab) {
    ABAS.forEach(t => {
        document.getElementById(`aba-${t.toLowerCase()}`)?.classList.add('hidden');
        document.getElementById(`btnAba${t}`)?.classList.remove('tab-active');
    });
    document.getElementById(`aba-${tab.toLowerCase()}`).classList.remove('hidden');
    document.getElementById(`btnAba${tab}`).classList.add('tab-active');
}

window.switchTab = switchTab;
