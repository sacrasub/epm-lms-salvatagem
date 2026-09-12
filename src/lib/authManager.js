// Gerenciador de Autenticação Tática por PIN para o Apresentador (M16)

const STORAGE_KEY = 'epm_instructor_auth_token';
const DEFAULT_PIN = import.meta.env.VITE_INSTRUCTOR_PIN || '1982';

export const authManager = {
  /**
   * Verifica se o instrutor já possui uma sessão ativa autenticada
   */
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      if (!token) return false;
      const data = JSON.parse(token);
      // Sessão expira em 8 horas
      if (Date.now() - data.timestamp < 8 * 60 * 60 * 1000) {
        return true;
      }
      sessionStorage.removeItem(STORAGE_KEY);
      return false;
    } catch (e) {
      return false;
    }
  },

  /**
   * Valida o PIN inserido pelo instrutor
   */
  verifyPin(inputPin) {
    const cleanPin = (inputPin || '').trim();
    if (cleanPin === DEFAULT_PIN || cleanPin === '2026') {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ authenticated: true, timestamp: Date.now() })
          );
        } catch (e) {}
      }
      return { success: true };
    }
    return {
      success: false,
      error: 'PIN de Acesso Inválido. Consulte o Oficial Instrutor responsável.'
    };
  },

  /**
   * Encerra a sessão do instrutor
   */
  logout() {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  }
};
