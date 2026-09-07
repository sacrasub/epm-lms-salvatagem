import React, { useState } from 'react';
import { Send, MessageSquare, Check, HelpCircle } from 'lucide-react';

export default function DoubtInput({ alunoNome, onSendDoubt }) {
  const [texto, setTexto] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    onSendDoubt(alunoNome, texto.trim());
    setTexto('');
    setEnviado(true);

    setTimeout(() => {
      setEnviado(false);
    }, 4000);
  };

  return (
    <div className="naval-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <HelpCircle size={20} color="var(--primary-cyan)" />
        <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
          SINALIZADOR DE DÚVIDAS SILENCIOSO
        </h3>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
        Envie sua pergunta discretamente. Ela aparecerá diretamente no painel do instrutor no Telão da Sala, sem você precisar interromper a explicação.
      </p>

      {enviado ? (
        <div style={{
          background: 'rgba(0, 230, 118, 0.15)',
          border: '1px solid var(--tactical-green)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          textAlign: 'center',
          color: 'var(--tactical-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontWeight: 600
        }}>
          <Check size={18} />
          <span>Dúvida enviada com sucesso para o Telão do Instrutor!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Digite sua dúvida ou observação técnica sobre o procedimento..."
            rows={3}
            maxLength={180}
            style={{
              width: '100%',
              background: 'rgba(7, 22, 44, 0.9)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              color: '#fff',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {texto.length}/180 caracteres
            </span>

            <button
              type="submit"
              disabled={!texto.trim()}
              className="btn-tactical btn-cyan"
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              <Send size={16} />
              <span>TRANSMITIR DÚVIDA</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
