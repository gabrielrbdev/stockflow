// ══════════════════════════════════════════════
//  StockFlow | UI – Controle de Abas
// ══════════════════════════════════════════════

const ABAS = ['Dash', 'Conferencia', 'Fiscal', 'Logs'];

/**
 * Alterna a aba visível na tela principal.
 * @param {string} tab - Nome da aba (ex: "Dash")
 */
export function switchTab(tab) {
    ABAS.forEach(t => {
        document.getElementById(`aba-${t.toLowerCase()}`)?.classList.add('hidden');
        document.getElementById(`btnAba${t}`)?.classList.remove('tab-active');
    });
    document.getElementById(`aba-${tab.toLowerCase()}`).classList.remove('hidden');
    document.getElementById(`btnAba${tab}`).classList.add('tab-active');
}

// Expõe para chamadas inline no HTML
window.switchTab = switchTab;
