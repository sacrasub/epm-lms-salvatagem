import React from 'react';
import { BookOpen, CheckCircle2, XCircle, X, Award, Shield } from 'lucide-react';
import { MISSIONS } from '../../data/missionsData';

export default function ReviewModal({
  isOpen,
  onClose,
  alunoNome,
  respostas = []
}) {
  if (!isOpen) return null;

  // Filtra as respostas enviadas por este aluno
  const alunoRespostas = respostas.filter(
    (r) => (r.participanteNome || '').toLowerCase() === (alunoNome || '').toLowerCase()
  );

  // Mapeia perguntas de todas as missões para recuperar o enunciado e as opções
  const todasDinamicas = MISSIONS.flatMap((m) => m.dinamicas || []);

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 12, 23, 0.88)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="naval-card naval-card-glow-cyan" style={{
        maxWidth: '620px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 25, 44, 0.98)',
        padding: '24px',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={22} color="var(--primary-cyan)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--font-tactical)' }}>
                CADERNO DE REVISÃO TÁTICA
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Marinheiro: <strong>{alunoNome}</strong> — Suas decisões e fundamentações SOLAS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-tactical btn-outline"
            style={{ padding: '6px 10px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Lista de Respostas */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
          {alunoRespostas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Shield size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                Nenhuma resposta registrada ainda nesta sessão
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>
                Assim que você responder aos desafios táticos disparados pelo instrutor, eles aparecerão aqui para estudo.
              </p>
            </div>
          ) : (
            alunoRespostas.map((resp, idx) => {
              const perguntaOriginal = todasDinamicas.find((d) => d.id === resp.perguntaId);
              const opcaoEscolhida = perguntaOriginal?.opcoes?.find((o) => o.id === resp.opcaoId);
              const opcaoCorreta = perguntaOriginal?.opcoes?.find((o) => o.correta);

              return (
                <div
                  key={resp.id || idx}
                  className="naval-card"
                  style={{
                    padding: '16px',
                    background: 'rgba(7, 22, 44, 0.75)',
                    border: `1px solid ${resp.correta ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 51, 68, 0.3)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: resp.correta ? 'var(--tactical-green)' : 'var(--solas-red)'
                    }}>
                      {resp.correta ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {resp.correta ? `DECISÃO CORRETA (+${resp.xpGanho || 0} XP)` : 'DECISÃO INCORRETA (0 XP)'}
                    </span>

                    {perguntaOriginal?.referencia && (
                      <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.68rem' }}>
                        {perguntaOriginal.referencia}
                      </span>
                    )}
                  </div>

                  <h4 style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#fff', lineHeight: 1.35 }}>
                    {perguntaOriginal?.enunciado || `Desafio ${resp.perguntaId}`}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                    <div style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: resp.correta ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 51, 68, 0.1)',
                      color: '#fff'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Sua Escolha: </span>
                      <strong>[{resp.opcaoId}] {opcaoEscolhida?.texto || 'Não identificada'}</strong>
                    </div>

                    {!resp.correta && opcaoCorreta && (
                      <div style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0, 230, 118, 0.1)',
                        color: 'var(--tactical-green)'
                      }}>
                        <span>Gabarito Oficial: </span>
                        <strong>[{opcaoCorreta.id}] {opcaoCorreta.texto}</strong>
                      </div>
                    )}
                  </div>

                  {perguntaOriginal?.explicacao && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px',
                      background: 'rgba(0, 229, 255, 0.05)',
                      borderLeft: '3px solid var(--primary-cyan)',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      lineHeight: 1.4
                    }}>
                      <strong style={{ color: 'var(--primary-cyan)' }}>Fundamentação SOLAS/DPC: </strong>
                      {perguntaOriginal.explicacao}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
