import React from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export default function InstructorTimerPanel({
  currentTime,
  timerSeconds,
  isTimerRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer
}) {
  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Relógio de Brasília */}
      <div style={{
        background: 'rgba(7, 22, 44, 0.85)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Clock size={16} color="var(--primary-cyan)" />
        <span style={{
          fontFamily: 'var(--font-tactical)',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.5px'
        }}>
          {currentTime || '--:--:--'}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BRT</span>
      </div>

      {/* Cronômetro de Instrução */}
      <div style={{
        background: 'rgba(7, 22, 44, 0.85)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '4px 8px 4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          AULA:
        </span>
        <span style={{
          fontFamily: 'var(--font-tactical)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: timerSeconds > 3000 ? 'var(--solas-red)' : 'var(--gold-marinha)',
          letterSpacing: '1px'
        }}>
          {formatSeconds(timerSeconds)}
        </span>

        <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
          {!isTimerRunning ? (
            <button
              onClick={onStartTimer}
              className="btn-tactical btn-outline"
              style={{ padding: '4px 8px', color: 'var(--tactical-green)', borderColor: 'rgba(0, 230, 118, 0.4)' }}
              title="Iniciar Cronômetro"
            >
              <Play size={13} />
            </button>
          ) : (
            <button
              onClick={onPauseTimer}
              className="btn-tactical btn-outline"
              style={{ padding: '4px 8px', color: 'var(--gold-marinha)', borderColor: 'rgba(212, 175, 55, 0.4)' }}
              title="Pausar Cronômetro"
            >
              <Pause size={13} />
            </button>
          )}

          <button
            onClick={onResetTimer}
            className="btn-tactical btn-outline"
            style={{ padding: '4px 6px', color: 'var(--text-muted)' }}
            title="Zerar Cronômetro"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
