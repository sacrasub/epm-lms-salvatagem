import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, ShieldCheck, Copy, Check, Globe } from 'lucide-react';

export default function QrCodeModal({ isOpen, onClose, roomCode = 'EPM2026' }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Se o instrutor estiver no localhost ou 127.0.0.1, o celular do aluno precisa acessar o domínio público da nuvem!
  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.')
  );

  const publicProductionUrl = 'https://epm-marinha.vercel.app';
  const baseUrl = isLocal 
    ? publicProductionUrl 
    : (typeof window !== 'undefined' ? window.location.origin : publicProductionUrl);

  const joinUrl = `${baseUrl}/?sala=${roomCode}&modo=aluno`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          background: 'rgba(7, 22, 44, 0.85)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--primary-cyan)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
            <Globe size={14} />
            <span>LINK DE ACESSO DIRETO PARA SMARTPHONES:</span>
          </div>
          <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.05rem', color: '#fff', wordBreak: 'break-all', marginBottom: '10px' }}>
            {joinUrl}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={handleCopy}
              className="btn-tactical btn-cyan"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'LINK COPIADO!' : 'COPIAR LINK'}</span>
            </button>

            <span style={{ fontSize: '0.85rem', color: 'var(--gold-marinha)', fontWeight: 700 }}>
              SALA: <strong style={{ color: '#fff' }}>{roomCode}</strong>
            </span>
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
