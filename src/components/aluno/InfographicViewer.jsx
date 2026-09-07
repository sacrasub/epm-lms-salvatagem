import React from 'react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function InfographicViewer({ mission }) {
  if (!mission || !mission.infograficoUrl) return null;

  return (
    <div className="naval-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImageIcon size={18} color="var(--primary-cyan)" />
          <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>
            {mission.infograficoTitulo}
          </h3>
        </div>

        <a
          href={mission.infograficoUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-tactical btn-outline"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <span>Abrir Original</span>
          <ExternalLink size={14} />
        </a>
      </div>

      <div style={{
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        background: '#040c17',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img
          src={mission.infograficoUrl}
          alt={mission.infograficoTitulo}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '480px',
            objectFit: 'contain',
            display: 'block'
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
