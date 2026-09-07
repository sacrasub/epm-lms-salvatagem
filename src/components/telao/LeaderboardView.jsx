import React from 'react';
import { Trophy, Award, Shield, UserCheck } from 'lucide-react';
import { calcularPatente } from '../../data/badgesData';

export default function LeaderboardView({ participantes = [], respostas = [], perguntaAtiva = null }) {
  // Ordena participantes por XP decrescente
  const sorted = [...participantes].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  // Telemetria de respostas da pergunta ativa
  const respostasPergunta = perguntaAtiva 
    ? respostas.filter(r => r.perguntaId === perguntaAtiva.id)
    : [];

  const totalParticipantes = participantes.length;
  const totalRespostas = respostasPergunta.length;
  const percRespostas = totalParticipantes > 0 
    ? Math.round((totalRespostas / totalParticipantes) * 100) 
    : 0;

  return (
    <div className="naval-card" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Cabeçalho do Placar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={20} color="var(--gold-marinha)" />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-marinha)', margin: 0 }}>
            PLACAR DE LÍDERES
          </h3>
        </div>
        <span className="tag-badge tag-badge-gold">
          {totalParticipantes} ALUNOS
        </span>
      </div>

      {/* Telemetria se dinâmica estiver ativa */}
      {perguntaAtiva && (
        <div style={{
          background: 'rgba(7, 22, 44, 0.9)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>RESPOSTAS RECEBIDAS:</span>
            <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, color: 'var(--primary-cyan)' }}>
              {totalRespostas} / {totalParticipantes} ({percRespostas}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#0a192c', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${percRespostas}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary-cyan), var(--tactical-green))',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Lista de Alunos / Ranking */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-dim)' }}>
            <UserCheck size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
            <p style={{ fontSize: '0.85rem' }}>Aguardando conexão dos alunos pelo Smartphone...</p>
          </div>
        ) : (
          sorted.slice(0, 7).map((p, index) => {
            const patente = calcularPatente(p.xp || 0);
            const isTop3 = index < 3;
            const medalColors = ['#ffd700', '#c0c0c0', '#cd7f32'];

            return (
              <div
                key={p.id || p.nome}
                style={{
                  background: isTop3 ? 'rgba(15, 35, 61, 0.85)' : 'rgba(10, 25, 44, 0.6)',
                  border: isTop3 ? `1px solid ${medalColors[index]}60` : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isTop3 ? `0 2px 10px ${medalColors[index]}20` : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isTop3 ? medalColors[index] : '#163252',
                    color: isTop3 ? '#040c17' : 'var(--text-muted)',
                    fontFamily: 'var(--font-tactical)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {index + 1}
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                      {p.nome}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{patente.icone}</span>
                      <span>{patente.nome}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--font-tactical)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--primary-cyan)'
                  }}>
                    {p.xp || 0} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>XP</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', justifyContent: 'flex-end', marginTop: '2px' }}>
                    {(p.badges || []).map((bId, bIdx) => (
                      <span key={bIdx} title={bId} style={{ fontSize: '0.85rem' }}>
                        🏅
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
