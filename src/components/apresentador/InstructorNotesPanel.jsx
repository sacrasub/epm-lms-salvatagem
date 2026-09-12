import React from 'react';
import { BookOpen, Edit3, CheckCircle, AlertOctagon } from 'lucide-react';

export default function InstructorNotesPanel({
  currentSlideIndex,
  currentMission,
  slideNotes,
  personalNotes,
  onSavePersonalNotes
}) {
  const currentPersonalNote = personalNotes[currentSlideIndex] || '';

  const handleTextChange = (e) => {
    onSavePersonalNotes(currentSlideIndex, e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Notas Pedagógicas Oficiais SOLAS / DPC */}
      <div className="naval-card" style={{ padding: '16px', background: 'rgba(7, 22, 44, 0.75)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--gold-marinha)" />
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--gold-marinha)', fontFamily: 'var(--font-tactical)' }}>
              DIRETRIZ PEDAGÓGICA SOLAS / DPC
            </h4>
          </div>
          <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.7rem' }}>
            SLIDE {(currentSlideIndex || 0) + 1}
          </span>
        </div>

        {slideNotes ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {slideNotes.objetivo && (
              <div style={{ fontSize: '0.86rem', color: '#fff', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--primary-cyan)' }}>Objetivo:</strong> {slideNotes.objetivo}
              </div>
            )}

            {slideNotes.pontosChave && slideNotes.pontosChave.length > 0 && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Pontos Críticos de Ênfase:
                </span>
                <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                  {slideNotes.pontosChave.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {slideNotes.perguntasSocraticas && slideNotes.perguntasSocraticas.length > 0 && (
              <div style={{ background: 'rgba(0, 229, 255, 0.06)', borderLeft: '3px solid var(--primary-cyan)', padding: '8px 12px', borderRadius: '0 4px 4px 0' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Gatilho Socrático para Turma:
                </span>
                <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                  "{slideNotes.perguntasSocraticas[0]}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Nenhuma diretriz cadastrada para este slide. Conduza conforme o manual geral de TSP.
          </div>
        )}
      </div>

      {/* Bloco de Anotações Pessoais do Instrutor */}
      <div className="naval-card" style={{ padding: '16px', background: 'rgba(7, 22, 44, 0.75)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit3 size={16} color="var(--primary-cyan)" />
            <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)' }}>
              MINHAS ANOTAÇÕES DO SLIDE (AUTO-SAVE)
            </h4>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--tactical-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={12} /> Salvo Localmente
          </span>
        </div>

        <textarea
          value={currentPersonalNote}
          onChange={handleTextChange}
          placeholder="Ex: Reforçar o caso real do naufrágio de 2019; perguntar ao Grumete Silva sobre o fecho do colete..."
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(4, 12, 23, 0.9)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            color: '#fff',
            fontSize: '0.84rem',
            lineHeight: 1.4,
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
      </div>
    </div>
  );
}
