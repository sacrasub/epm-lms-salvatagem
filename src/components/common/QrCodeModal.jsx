import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, ShieldCheck } from 'lucide-react';

export default function QrCodeModal({ isOpen, onClose, roomCode = 'EPM2026' }) {
  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://epm.vercel.app';
  const joinUrl = `${currentHost}/?sala=${roomCode}&modo=aluno`;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(3, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="naval-card naval-card-glow-cyan" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '32px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={24} />
        </button>

        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--primary-cyan-dim)',
          border: '1px solid var(--primary-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--primary-cyan)'
        }}>
          <Smartphone size={28} />
        </div>

        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '8px' }}>
          CONECTE SEU SMARTPHONE
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Aponte a câmera do celular para o código abaixo para entrar no terminal do aluno e participar das dinâmicas em tempo real.
        </p>

        {/* QR Code Container */}
        <div style={{
          background: '#fff',
          padding: '16px',
          borderRadius: '12px',
          display: 'inline-block',
          boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)',
          marginBottom: '20px'
        }}>
          <QRCodeSVG 
            value={joinUrl} 
            size={220} 
            level="H" 
            includeMargin={true}
          />
        </div>

        <div style={{
          background: 'rgba(7, 22, 44, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
            OU ACESSE PELO NAVEGADOR:
          </div>
          <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.1rem', color: 'var(--primary-cyan)', wordBreak: 'break-all' }}>
            {joinUrl}
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--gold-marinha)', fontWeight: 600 }}>
            CÓDIGO DA SALA: <span style={{ color: '#fff' }}>{roomCode}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <ShieldCheck size={16} color="var(--tactical-green)" />
          <span>Sincronização Criptografada em Tempo Real</span>
        </div>
      </div>
    </div>
  );
}
