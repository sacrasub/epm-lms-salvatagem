import { supabase, isSupabaseConfigured } from './supabaseClient';

export const reportingService = {
  /**
   * Registra ou atualiza pontuação histórica do marinheiro no Supabase
   */
  async saveStudentSession(roomCode, aluno) {
    if (!aluno || !aluno.nome) return null;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('participantes')
          .upsert({
            nome: aluno.nome,
            sala: roomCode,
            patente: aluno.patente || 'Marinheiro',
            xp: aluno.xp || 0,
            badges: aluno.badges || [],
            updated_at: new Date().toISOString()
          }, { onConflict: 'nome,sala' });

        if (error) console.warn('[ReportingService] Erro ao salvar sessão Supabase:', error);
        return data;
      } catch (e) {
        console.warn('[ReportingService] Exceção Supabase:', e);
      }
    }

    // Persistência local complementar
    if (typeof window !== 'undefined') {
      try {
        const key = `epm_history_${roomCode}_${aluno.nome.replace(/\s+/g, '_')}`;
        localStorage.setItem(key, JSON.stringify({ ...aluno, roomCode, timestamp: Date.now() }));
      } catch (e) {}
    }
    return aluno;
  },

  /**
   * Consulta o ranking histórico geral de marinheiros entre turmas
   */
  async getHistoricalLeaderboard(limit = 20) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('participantes')
          .select('nome, patente, xp, badges, sala, updated_at')
          .order('xp', { ascending: false })
          .limit(limit);

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.warn('[ReportingService] Erro consulta histórico Supabase:', e);
      }
    }

    // Fallback com dados do localStorage do ambiente
    if (typeof window !== 'undefined') {
      const historyList = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('epm_history_')) {
          try {
            historyList.push(JSON.parse(localStorage.getItem(k)));
          } catch (e) {}
        }
      }
      historyList.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      return historyList.slice(0, limit);
    }

    return [];
  }
};
