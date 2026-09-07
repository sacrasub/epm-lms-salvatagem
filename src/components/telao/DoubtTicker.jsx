import React from 'react';
import { HelpCircle, MessageSquare } from 'lucide-react';

export default function DoubtTicker({ duvidas = [] }) {
  if (!duvidas || duvidas.length === 0) {
    return (
      <div style={{
        background: 'rgba(7, 22, 44, 0.7)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.85rem',
        color: 'var(--text-dim)'
      }}>
        <HelpCircle size={16} color="var(--primary-cyan)" />
        <span>SINALIZADOR DE DÚVIDAS SILENCIOSO: Nenhuma dúvida pendente. Alunos podem enviar perguntas pelo smartphone.</span>
      </div>
    );
  }

  const ultimaDuvida = duvidas[0];

  return (
    <div style={{
      background: 'rgba(15, 35, 61, 0.85)',
      border: '1px solid var(--border-glow)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 0 15px rgba(0, 229, 255, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
        <div style={{
          background: 'rgba(0, 229, 255, 0.15)',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--primary-cyan)',
          fontFamily: 'var(--font-tactical)',
          fontWeight: 700,
          fontSize: '0.85rem',
          flexShrink: 0
        }}>
          <MessageSquare size={14} />
          <span>DÚVIDA DE BORDO [{ultimaDuvida.aluno}]:</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          "{ultimaDuvida.texto}"
        </p>
      </div>

      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '12px' }}>
        {ultimaDuvida.timestamp} ({duvidas.length} total)
      </span>
    </div>
  );
}
