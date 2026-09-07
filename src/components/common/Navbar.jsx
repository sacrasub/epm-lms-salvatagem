import React, { useState } from 'react';
import { Anchor, Radio, Volume2, QrCode, Wifi, WifiOff, Users, ArrowLeft } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { soundManager } from '../../lib/soundEffects';

export default function Navbar({ role = 'home', roomCode = 'EPM2026', participantCount = 0, onOpenQr, onBackHome }) {
  const [soundActive, setSoundActive] = useState(false);
  const isOnline = isSupabaseConfigured();

  const handleTestSound = () => {
    soundManager.playSonarPing();
    setSoundActive(true);
    setTimeout(() => setSoundActive(false), 800);
  };

  return (
    <header className="hud-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onBackHome && (
          <button 
            onClick={onBackHome}
            className="btn-tactical btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            title="Voltar ao Início"
          >
            <ArrowLeft size={16} />
            <span style={{ display: 'none', md: 'inline' }}>Início</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0f2b48, #07162c)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-marinha)',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.2)'
          }}>
            <Anchor size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                EPM <span style={{ color: 'var(--primary-cyan)' }}>SALVATAGEM</span>
              </h1>
              <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                SOLAS / DPC
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Técnicas de Sobrevivência Pessoal (TSP)
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Código da Sala */}
        <div style={{
          background: 'rgba(7, 22, 44, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--font-tactical)' }}>
            SALA:
          </span>
          <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-cyan)', letterSpacing: '1px' }}>
            {roomCode}
          </span>
        </div>

        {/* Contador de Participantes */}
        <div style={{
          background: 'rgba(7, 22, 44, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <Users size={16} color="var(--primary-cyan)" />
          <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, color: '#fff' }}>
            {participantCount}
          </span>
        </div>

        {/* QR Code Trigger (Para o Telão) */}
        {role === 'telao' && onOpenQr && (
          <button
            onClick={onOpenQr}
            className="btn-tactical btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Exibir QR Code para Alunos Entrarem"
          >
            <QrCode size={16} />
            <span>QR Code</span>
          </button>
        )}

        {/* Botão de Som / Sonar */}
        <button
          onClick={handleTestSound}
          className="btn-tactical btn-outline"
          style={{ 
            padding: '8px 10px', 
            color: soundActive ? 'var(--gold-marinha)' : 'var(--primary-cyan)',
            borderColor: soundActive ? 'var(--gold-marinha)' : 'var(--border-subtle)'
          }}
          title="Testar Áudio Naval"
        >
          <Volume2 size={16} />
        </button>

        {/* Indicador de Conexão */}
        <div 
          title={isOnline ? 'Supabase Realtime Conectado' : 'Modo Híbrido Local Ativo (BroadcastChannel)'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: '4px',
            background: isOnline ? 'rgba(0, 230, 118, 0.1)' : 'rgba(0, 229, 255, 0.1)',
            color: isOnline ? 'var(--tactical-green)' : 'var(--primary-cyan)',
            border: `1px solid ${isOnline ? 'rgba(0, 230, 118, 0.25)' : 'rgba(0, 229, 255, 0.25)'}`
          }}
        >
          {isOnline ? <Wifi size={14} /> : <Radio size={14} />}
          <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 600 }}>
            {isOnline ? 'NUVEM' : 'LOCAL'}
          </span>
        </div>
      </div>
    </header>
  );
}
