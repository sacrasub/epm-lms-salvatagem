import React from 'react';
import { Zap, Clock, Award, X, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function InstructorDynamicsModal({
  isOpen,
  onClose,
  dinamicas = [],
  dinamicaAtiva,
  perguntaAtiva,
  onTriggerDynamic,
  onCloseDynamic
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 12, 23, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="naval-card naval-card-glow-cyan" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 25, 44, 0.98)',
        padding: '24px',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Cabeçalho do Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={24} color="var(--primary-cyan)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontFamily: 'var(--font-tactical)' }}>
                DISPARO DE DESAFIOS TÁTICOS & QUIZZES
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Dispare perguntas simultâneas para todos os celulares dos marinheiros em tempo real.
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

        {/* Se já houver uma dinâmica em andamento, permite encerrar */}
        {dinamicaAtiva && perguntaAtiva && (
          <div style={{
            background: 'rgba(255, 51, 68, 0.15)',
            border: '1px solid var(--solas-red)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ color: 'var(--solas-red)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertOctagon size={16} />
                <span>DESAFIO ATIVO NO TELÃO E CELULARES:</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#fff', marginTop: '2px' }}>
                {perguntaAtiva.titulo}
              </div>
            </div>
            <button
              onClick={onCloseDynamic}
              className="btn-tactical btn-outline"
              style={{ borderColor: 'var(--solas-red)', color: 'var(--solas-red)', padding: '8px 14px', fontSize: '0.82rem' }}
            >
              ENCERRAR AGORA
            </button>
          </div>
        )}

        {/* Lista de Dinâmicas Disponíveis */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
          {dinamicas.map((din) => {
            const isCurrentlyRunning = dinamicaAtiva && perguntaAtiva?.id === din.id;

            return (
              <div
                key={din.id}
                className="naval-card"
                style={{
                  padding: '16px',
                  border: isCurrentlyRunning ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                  background: isCurrentlyRunning ? 'rgba(0, 229, 255, 0.1)' : 'rgba(7, 22, 44, 0.7)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="tag-badge tag-badge-cyan">
                    {din.tipo === 'peer_instruction' ? 'PEER INSTRUCTION (PARES)' : 'QUIZ DE PRESSÃO'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} color="var(--gold-marinha)" /> {din.tempoSegundos}s
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-cyan)' }}>
                      <Award size={13} /> {din.pontosXP} XP
                    </span>
                  </div>
                </div>

                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', color: '#fff' }}>
                  {din.titulo}
                </h4>
                <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {din.enunciado}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-marinha)' }}>
                    Ref: {din.referencia || 'SOLAS / DPC'}
                  </span>

                  <button
                    onClick={() => {
                      onTriggerDynamic(din, din.tempoSegundos);
                      onClose();
                    }}
                    disabled={isCurrentlyRunning}
                    className="btn-tactical btn-cyan"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    <Zap size={14} />
                    <span>{isCurrentlyRunning ? 'EM ANDAMENTO' : 'DISPARAR AGORA'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
