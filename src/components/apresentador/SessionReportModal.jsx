import React from 'react';
import { Trophy, FileText, Printer, X, CheckCircle2, XCircle, Award, Users, BarChart3 } from 'lucide-react';
import { calcularPatente } from '../../data/badgesData';

export default function SessionReportModal({
  isOpen,
  onClose,
  roomCode = 'EPM2026',
  participantes = [],
  respostas = [],
  currentMission
}) {
  if (!isOpen) return null;

  // Estatísticas consolidadas
  const totalParticipantes = participantes.length;
  const totalRespostas = respostas.length;
  const acertos = respostas.filter(r => r.correta).length;
  const taxaAcerto = totalRespostas > 0 ? Math.round((acertos / totalRespostas) * 100) : 0;

  // Ranking ordenado por XP decrescente
  const ranking = [...participantes].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  // Desempenho por Pergunta
  const perguntasMap = {};
  respostas.forEach(r => {
    if (!perguntasMap[r.perguntaId]) {
      perguntasMap[r.perguntaId] = { total: 0, corretas: 0 };
    }
    perguntasMap[r.perguntaId].total += 1;
    if (r.correta) perguntasMap[r.perguntaId].corretas += 1;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 12, 23, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div className="naval-card naval-card-glow-gold session-report-container" style={{
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 25, 44, 0.98)',
        padding: '28px',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Cabeçalho do Relatório */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tag-badge tag-badge-gold">
                DPC / MARINHA DO BRASIL
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                SALA: <strong>{roomCode}</strong>
              </span>
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.4rem', color: '#fff', fontFamily: 'var(--font-tactical)' }}>
              RELATÓRIO OFICIAL DE DESEMPENHO TÁTICO
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Técnicas de Sobrevivência Pessoal (TSP) — {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }} className="no-print">
            <button
              onClick={handlePrint}
              className="btn-tactical btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Printer size={16} />
              <span>IMPRIMIR / SALVAR PDF</span>
            </button>
            <button
              onClick={onClose}
              className="btn-tactical btn-outline"
              style={{ padding: '8px 10px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '4px' }}>
          {/* Métricas Gerais da Turma */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div className="naval-card" style={{ padding: '14px', textAlign: 'center', background: 'rgba(7, 22, 44, 0.8)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                MARINHEIROS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)', marginTop: '4px' }}>
                {totalParticipantes}
              </div>
            </div>

            <div className="naval-card" style={{ padding: '14px', textAlign: 'center', background: 'rgba(7, 22, 44, 0.8)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                DECISÕES TRANSMITIDAS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-tactical)', marginTop: '4px' }}>
                {totalRespostas}
              </div>
            </div>

            <div className="naval-card" style={{ padding: '14px', textAlign: 'center', background: 'rgba(7, 22, 44, 0.8)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                TAXA DE ACERTO
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: taxaAcerto >= 70 ? 'var(--tactical-green)' : 'var(--solas-red)', fontFamily: 'var(--font-tactical)', marginTop: '4px' }}>
                {taxaAcerto}%
              </div>
            </div>

            <div className="naval-card" style={{ padding: '14px', textAlign: 'center', background: 'rgba(7, 22, 44, 0.8)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                ACERTOS / ERROS
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold-marinha)', fontFamily: 'var(--font-tactical)', marginTop: '6px' }}>
                {acertos} / {totalRespostas - acertos}
              </div>
            </div>
          </div>

          {/* Ranking Final da Turma */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-marinha)', fontFamily: 'var(--font-tactical)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} />
              <span>CLASSIFICAÇÃO FINAL DOS MARINHEIROS</span>
            </h3>

            <div className="naval-card" style={{ padding: '8px', background: 'rgba(7, 22, 44, 0.6)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 12px' }}>#</th>
                    <th style={{ padding: '8px 12px' }}>NOME DE GUERRA</th>
                    <th style={{ padding: '8px 12px' }}>PATENTE CONQUISTADA</th>
                    <th style={{ padding: '8px 12px' }}>MEDALHAS</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>XP FINAL</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Nenhum marinheiro pontuou nesta sessão.
                      </td>
                    </tr>
                  ) : (
                    ranking.map((aluno, idx) => {
                      const patente = calcularPatente(aluno.xp || 0);
                      return (
                        <tr key={aluno.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '10px 12px', fontFamily: 'var(--font-tactical)', fontWeight: 700, color: idx === 0 ? 'var(--gold-marinha)' : '#fff' }}>
                            {idx + 1}º
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#fff' }}>
                            {aluno.nome}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                            <span style={{ marginRight: '6px' }}>{patente.icone}</span> {patente.nome}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--gold-marinha)' }}>
                            🏅 {(aluno.badges || []).length}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'var(--font-tactical)', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                            {aluno.xp || 0} XP
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desempenho por Desafio Tático */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} />
              <span>ESTATÍSTICAS POR DESAFIO TÁTICO</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.keys(perguntasMap).length === 0 ? (
                <div style={{ padding: '14px', background: 'rgba(7, 22, 44, 0.6)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                  Nenhum desafio tático foi respondido nesta sessão.
                </div>
              ) : (
                Object.entries(perguntasMap).map(([pId, stats]) => {
                  const perc = stats.total > 0 ? Math.round((stats.corretas / stats.total) * 100) : 0;
                  return (
                    <div key={pId} className="naval-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(7, 22, 44, 0.7)' }}>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                          Desafio: {pId}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {stats.corretas} acertos de {stats.total} respostas
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontFamily: 'var(--font-tactical)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: perc >= 70 ? 'var(--tactical-green)' : 'var(--solas-red)'
                        }}>
                          {perc}% de Acerto
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
