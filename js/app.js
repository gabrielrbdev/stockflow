
import { login, logout, observeAuth }         from "./services/authService.js";
import { monitorarLogs }                      from "./services/logService.js";
import { iniciarDashboard }                   from "./ui/dashboard.js";
import { iniciarConferencia, configurarImportacaoXML, confirmarConferencia }
                                              from "./ui/conferencia.js";
import "./ui/tabs.js";
import "./ui/modalUsuarios.js";

// ── Auth: Login / Logout ─────────────────────

document.getElementById('btnLogin').onclick = () =>
    login(
        document.getElementById('login-email').value,
        document.getElementById('login-pass').value
    ).catch(err => alert("Erro de login: " + err.message));

document.getElementById('btnLogout').onclick = () => logout();

// ── Auth: Observer ───────────────────────────

observeAuth(
    // Usuário autenticado
    (user, role) => {
        document.getElementById('user-display').innerText = user.email;
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
        document.getElementById('nav-abas').classList.remove('hidden');

        // Funcionalidades exclusivas de admin
        document.getElementById('box-import-xml').classList.toggle('hidden', role !== "admin");
        document.getElementById('btnAbaLogs').classList.toggle('hidden', role !== "admin");
        document.getElementById('btnGerenciarUsuarios').classList.toggle('hidden', role !== "admin");

        // Inicia módulos
        iniciarDashboard();
        iniciarConferencia();
        configurarImportacaoXML();

        if (role === "admin") {
            monitorarLogs(document.getElementById('list-logs'));
        }
    },
    // Usuário deslogado
    () => {
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('app-content').classList.add('hidden');
        document.getElementById('nav-abas').classList.add('hidden');
    }
);


document.getElementById('btnConfirmar').onclick = confirmarConferencia;
