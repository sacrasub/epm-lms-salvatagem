import React from 'react';
import { HelpCircle, Trash2, Clock, User, X } from 'lucide-react';

export default function InstructorDoubtsPanel({
  isOpen,
  onClose,
  duvidas = [],
  onDeleteDoubt,
  onClearDoubts
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
        maxWidth: '680px',
        width: '100%',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 25, 44, 0.98)',
        padding: '24px',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={24} color="var(--primary-cyan)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontFamily: 'var(--font-tactical)' }}>
                DÚVIDAS DOS MARINHEIROS ({duvidas.length})
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Perguntas enviadas anonimamente ou identificadas diretamente do celular.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {duvidas.length > 0 && (
              <button
                onClick={onClearDoubts}
                className="btn-tactical btn-outline"
                style={{ borderColor: 'var(--solas-red)', color: 'var(--solas-red)', padding: '6px 12px', fontSize: '0.78rem' }}
                title="Limpar Todas as Dúvidas Respondidas"
              >
                <Trash2 size={14} />
                <span>LIMPAR TODAS</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-tactical btn-outline"
              style={{ padding: '6px 10px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Lista de Dúvidas */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
          {duvidas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <HelpCircle size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                Nenhuma dúvida pendente no momento
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem' }}>
                As dúvidas enviadas pelos marinheiros via celular aparecerão aqui em tempo real.
              </p>
            </div>
          ) : (
            duvidas.map((d) => (
              <div
                key={d.id}
                className="naval-card"
                style={{
                  padding: '14px',
                  background: 'rgba(7, 22, 44, 0.75)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--gold-marinha)',
                      fontFamily: 'var(--font-tactical)'
                    }}>
                      <User size={13} /> {d.aluno || 'Marinheiro Anônimo'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {d.timestamp || ''}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff', lineHeight: 1.45 }}>
                    "{d.texto}"
                  </p>
                </div>

                <button
                  onClick={() => onDeleteDoubt(d.id)}
                  className="btn-tactical btn-outline"
                  style={{ padding: '6px', color: 'var(--text-muted)' }}
                  title="Marcar como Respondida / Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
