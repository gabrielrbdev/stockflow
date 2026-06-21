// ══════════════════════════════════════════════
//  StockFlow | UI – Modal Gerenciar Usuários
// ══════════════════════════════════════════════

import {
    cadastrarUsuario,
    listarUsuarios,
    removerUsuario,
    ERROS_AUTH
} from "../services/usuarioService.js";

import { state } from "../config/state.js";

let muRole = 'user';

// ── Abertura / Fechamento ────────────────────

export function abrirModalUsuarios() {
    document.getElementById('modal-usuarios').classList.add('open');
    muSwitchTab('novo');
    _limparAlerta();
}

export function fecharModalUsuarios() {
    document.getElementById('modal-usuarios').classList.remove('open');
}

// Fecha ao clicar fora do box
document.getElementById('modal-usuarios').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-usuarios')) fecharModalUsuarios();
});

// ── Abas internas ────────────────────────────

export function muSwitchTab(tab) {
    document.getElementById('mu-pane-novo').style.display  = tab === 'novo'  ? 'block' : 'none';
    document.getElementById('mu-pane-lista').style.display = tab === 'lista' ? 'block' : 'none';
    document.getElementById('mu-tab-novo').classList.toggle('active',  tab === 'novo');
    document.getElementById('mu-tab-lista').classList.toggle('active', tab === 'lista');
    if (tab === 'lista') _carregarLista();
}

// ── Seleção de perfil ────────────────────────

export function muSelectRole(role) {
    muRole = role;
    document.getElementById('role-opt-user').classList.toggle('selected',  role === 'user');
    document.getElementById('role-opt-admin').classList.toggle('selected', role === 'admin');
}

// ── Cadastro ─────────────────────────────────

export async function muCadastrar() {
    const email = document.getElementById('mu-email').value.trim();
    const senha = document.getElementById('mu-senha').value;

    if (!email || !senha)  return _showAlerta('Preencha e-mail e senha.', 'error');
    if (senha.length < 6)  return _showAlerta('Senha deve ter mínimo 6 caracteres.', 'error');

    const btn = document.getElementById('mu-btn-salvar');
    btn.disabled    = true;
    btn.textContent = 'Cadastrando...';

    try {
        await cadastrarUsuario(email, senha, muRole);
        _showAlerta(`Usuário ${email} criado com sucesso!`, 'success');
        document.getElementById('mu-email').value = '';
        document.getElementById('mu-senha').value = '';
        muSelectRole('user');
    } catch (err) {
        _showAlerta(ERROS_AUTH[err.message] || 'Erro: ' + err.message, 'error');
    } finally {
        btn.disabled    = false;
        btn.textContent = 'Cadastrar Usuário';
    }
}

// ── Lista de usuários ────────────────────────

async function _carregarLista() {
    const container = document.getElementById('mu-lista-container');
    const emptyMsg  = document.getElementById('list-usuarios-empty');
    container.innerHTML = '<p style="font-size:11px;color:#94a3b8;text-align:center;padding:12px">Carregando...</p>';

    try {
        const usuarios = await listarUsuarios();
        container.innerHTML = '';

        if (usuarios.length === 0) {
            emptyMsg.classList.remove('hidden');
            return;
        }
        emptyMsg.classList.add('hidden');

        usuarios.forEach(u => {
            const initials   = (u.email || '??').substring(0, 2).toUpperCase();
            const badgeClass = u.role === 'admin' ? 'badge-admin' : 'badge-user';
            const badgeLabel = u.role === 'admin' ? 'Admin' : 'Conferente';
            const isSelf     = u.email === state.currentUserEmail;

            const item = document.createElement('div');
            item.className = 'user-item';
            item.innerHTML = `
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <div class="user-email">${u.email}</div>
                    <span class="role-badge ${badgeClass}">${badgeLabel}</span>
                </div>
                <button class="btn-del"
                    ${isSelf
                        ? 'disabled title="Você mesmo"'
                        : `onclick="muRemoverUsuario('${u.uid}', this)"`}>
                    ${isSelf ? 'Você' : 'Remover'}
                </button>`;
            container.appendChild(item);
        });
    } catch (err) {
        container.innerHTML = `<p style="font-size:11px;color:#dc2626;padding:8px">Erro ao carregar: ${err.message}</p>`;
    }
}

export async function muRemoverUsuario(uid, btn) {
    if (!confirm('Tem certeza que deseja remover este usuário?\n(O acesso ao sistema será revogado.)')) return;
    btn.disabled    = true;
    btn.textContent = '...';
    try {
        await removerUsuario(uid);
        btn.closest('.user-item').remove();
    } catch (err) {
        alert('Erro ao remover: ' + err.message);
        btn.disabled    = false;
        btn.textContent = 'Remover';
    }
}

// ── Alertas ──────────────────────────────────

function _showAlerta(msg, tipo) {
    const el = document.getElementById('mu-alert');
    el.textContent   = msg;
    el.className     = 'mu-alert ' + tipo;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 4500);
}

function _limparAlerta() {
    document.getElementById('mu-alert').style.display = 'none';
}

// Expõe funções chamadas via onclick no HTML
window.abrirModalUsuarios = abrirModalUsuarios;
window.fecharModalUsuarios = fecharModalUsuarios;
window.muSwitchTab        = muSwitchTab;
window.muSelectRole       = muSelectRole;
window.muCadastrar        = muCadastrar;
window.muRemoverUsuario   = muRemoverUsuario;
