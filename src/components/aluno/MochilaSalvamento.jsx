import React from 'react';
import { BADGES, PATENTES, calcularPatente } from '../../data/badgesData';
import { Shield, Award, Download, ExternalLink, CheckCircle, Lock } from 'lucide-react';

export default function MochilaSalvamento({ xp = 0, badges = [], alunoNome = 'Aluno' }) {
  const patenteAtual = calcularPatente(xp);

  // Calcula próxima patente
  const proximaPatente = PATENTES.find(p => p.xpMinimo > xp) || null;
  const xpProxima = proximaPatente ? proximaPatente.xpMinimo : xp;
  const xpBase = patenteAtual.xpMinimo;
  const progresso = proximaPatente 
    ? Math.min(100, Math.round(((xp - xpBase) / (xpProxima - xpBase)) * 100))
    : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Cartão de Identificação Naval */}
      <div className="naval-card naval-card-glow-gold" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              TRIPULANTE EM TREINAMENTO
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
              {alunoNome}
            </h2>
          </div>
          <div style={{
            fontSize: '2rem',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid var(--gold-marinha)',
            borderRadius: '50%',
            width: '54px',
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {patenteAtual.icone}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span className="tag-badge tag-badge-gold">
            PATENTE: {patenteAtual.nome}
          </span>
          <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>
            {xp} XP
          </span>
        </div>

        {/* Barra de Progresso de Carreira */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>PROGRESSO PARA PROMOÇÃO</span>
            <span>{proximaPatente ? `${xp}/${xpProxima} XP (${progresso}%)` : 'PATENTE MÁXIMA ATINGIDA'}</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#0a192c', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${progresso}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--gold-marinha), var(--primary-cyan))',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Galeria de Badges (Medalhas de Salvatagem) */}
      <div className="naval-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} />
          <span>QUADRO DE CONDECORAÇÕES (BADGES)</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {BADGES.map((b) => {
            const isUnlocked = badges.includes(b.id) || xp >= b.xpMinimo;

            return (
              <div
                key={b.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isUnlocked ? 'rgba(15, 35, 61, 0.9)' : 'rgba(10, 25, 44, 0.5)',
                  border: isUnlocked ? `1px solid ${b.cor}` : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  opacity: isUnlocked ? 1 : 0.6
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                  flexShrink: 0
                }}>
                  {b.icone}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '0.95rem', color: isUnlocked ? '#fff' : 'var(--text-muted)', margin: 0 }}>
                      {b.nome}
                    </h4>
                    {isUnlocked ? (
                      <CheckCircle size={14} color="var(--tactical-green)" />
                    ) : (
                      <Lock size={14} color="var(--text-dim)" />
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    {b.descricao}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recursos e Manuais de Bordo para Download */}
      <div className="naval-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-marinha)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={18} />
          <span>MANUAIS E GUIAS DE BOLSO</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href="/assets/Guia_Técnico_de_Sobrevivência_Pessoal.webp"
            target="_blank"
            rel="noreferrer"
            className="btn-tactical btn-outline"
            style={{ justifyContent: 'space-between', padding: '12px 16px', fontSize: '0.85rem' }}
          >
            <span>Infográfico Missão 01 (Equipamentos Individuais)</span>
            <ExternalLink size={16} />
          </a>

          <a
            href="/assets/Guia_de_Sobrevivência_Marítima.webp"
            target="_blank"
            rel="noreferrer"
            className="btn-tactical btn-outline"
            style={{ justifyContent: 'space-between', padding: '12px 16px', fontSize: '0.85rem' }}
          >
            <span>Infográfico Missão 02 (Balsas, Telecom & Pirotecnia)</span>
            <ExternalLink size={16} />
          </a>

          <a
            href="/assets/Guia_de_Sobrevivência_e_Emergência.webp"
            target="_blank"
            rel="noreferrer"
            className="btn-tactical btn-outline"
            style={{ justifyContent: 'space-between', padding: '12px 16px', fontSize: '0.85rem' }}
          >
            <span>Infográfico Missão 03 (Hipotermia & Helicóptero)</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
