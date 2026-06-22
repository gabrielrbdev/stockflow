// =============================================================================
// config/state.js — Estado Global da Aplicação
// =============================================================================
//
// Guarda informações sobre o usuário logado que precisam ser acessadas
// por múltiplos módulos ao mesmo tempo.
//
// Por que não usar variáveis locais em cada módulo?
//   O papel do usuário (role) é necessário tanto em conferencia.js
//   quanto em modalUsuarios.js. Em vez de passar como parâmetro para
//   todos os lados, centralizamos aqui e cada módulo lê quando precisar.
//
// Uso:
//   import { state } from "../config/state.js";
//   state.currentUserRole   // "admin" ou "user"
//   state.currentUserEmail  // "joao@empresa.com"
//   state.activeItem        // item que está aberto no modal de conferência
// =============================================================================

export const state = {
    currentUserRole:  "user",   // papel do usuário logado ("admin" ou "user")
    currentUserEmail: "",       // e-mail do usuário logado
    activeItem:       null,     // item atualmente aberto no modal de conferência
};
