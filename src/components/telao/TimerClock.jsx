import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { soundManager } from '../../lib/soundEffects';

export default function TimerClock({ timerFim, onExpire, isActive }) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!isActive || !timerFim) {
      setSecondsLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.ceil((timerFim - Date.now()) / 1000));
      setSecondsLeft(diff);

      // Tique-taque sonoro nos últimos 10 segundos
      if (diff <= 10 && diff > 0) {
        soundManager.playTick();
      }

      if (diff === 0) {
        clearInterval(interval);
        soundManager.playBuzzer();
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerFim, isActive, onExpire]);

  if (!isActive) return null;

  const isLow = secondsLeft <= 10;
  const isCritical = secondsLeft <= 5;

  const color = isCritical 
    ? 'var(--solas-red)' 
    : isLow 
    ? 'var(--alert-amber)' 
    : 'var(--primary-cyan)';

  return (
    <div className={`naval-card ${isCritical ? 'naval-card-alert' : ''}`} style={{
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      background: 'rgba(10, 25, 44, 0.95)',
      border: `2px solid ${color}`,
      boxShadow: `0 0 25px ${color}40`,
      borderRadius: 'var(--radius-md)'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        {isCritical ? <AlertTriangle size={24} /> : <Clock size={24} />}
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '1px' }}>
          TEMPO DE DECISÃO TÁTICA
        </div>
        <div style={{
          fontFamily: 'var(--font-tactical)',
          fontSize: '2.4rem',
          fontWeight: 700,
          color: color,
          letterSpacing: '2px',
          lineHeight: 1
        }}>
          00:{String(secondsLeft).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
