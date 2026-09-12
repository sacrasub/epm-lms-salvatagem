import React, { useState } from 'react';
import { ArrowLeft, Anchor, Users, QrCode, Volume2, Wifi, Radio, Monitor, LogOut } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { isFirebaseConfigured } from '../../lib/firebaseClient';
import { soundManager } from '../../lib/soundEffects';

export default function Navbar({ role = 'home', roomCode = 'EPM2026', participantCount = 0, onOpenQr, onBackHome }) {
  const [soundActive, setSoundActive] = useState(false);
  const isCloudOnline = isFirebaseConfigured() || isSupabaseConfigured();

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
            style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title={role === 'aluno' ? 'Desconectar / Trocar Nome de Guerra' : 'Voltar ao Início'}
          >
            {role === 'aluno' ? <LogOut size={16} /> : <ArrowLeft size={16} />}
            <span>{role === 'aluno' ? 'Sair' : 'Início'}</span>
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

        {/* Botão para Modo Apresentador (2 Telas) */}
        {role === 'telao' && (
          <a
            href={`/apresentador?sala=${encodeURIComponent(roomCode)}`}
            className="btn-tactical btn-gold"
            style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            title="Abrir o Cockpit do Apresentador (Laptop + Projetor)"
          >
            <Monitor size={16} />
            <span>Modo Apresentador (2 Telas)</span>
          </a>
        )}

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

        {/* Indicador de Conexão com Ponto de Pulso Tático (M8) */}
        <div 
          title={isCloudOnline ? 'Conexão em Nuvem Ativa (Firebase RTDB / Supabase)' : 'Modo Híbrido Local Ativo (BroadcastChannel)'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            padding: '5px 10px',
            borderRadius: '20px',
            background: isCloudOnline ? 'rgba(0, 230, 118, 0.12)' : 'rgba(0, 229, 255, 0.12)',
            color: isCloudOnline ? 'var(--tactical-green)' : 'var(--primary-cyan)',
            border: `1px solid ${isCloudOnline ? 'rgba(0, 230, 118, 0.35)' : 'rgba(0, 229, 255, 0.35)'}`
          }}
        >
          <span 
            className="animate-pulse"
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isCloudOnline ? 'var(--tactical-green)' : 'var(--primary-cyan)',
              boxShadow: isCloudOnline ? '0 0 8px var(--tactical-green)' : '0 0 8px var(--primary-cyan)'
            }}
          />
          {isCloudOnline ? <Wifi size={13} /> : <Radio size={13} />}
          <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, letterSpacing: '0.5px' }}>
            {isCloudOnline ? 'ONLINE NUVEM' : 'REDE LOCAL'}
          </span>
        </div>
      </div>
    </header>
  );
}
