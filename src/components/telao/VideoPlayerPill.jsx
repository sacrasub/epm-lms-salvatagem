import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Film, X } from 'lucide-react';

export default function VideoPlayerPill({ video, onEnded, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');

  // Escuta ESC para fechar o vídeo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        if (videoRef.current) videoRef.current.pause();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [video?.url]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.log('Autoplay policy:', e));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((curr / dur) * 100);

    const format = (t) => {
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    setCurrentTime(format(curr));
    if (videoRef.current.duration) {
      setDuration(format(videoRef.current.duration));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  if (!video) {
    return (
      <div className="naval-card" style={{
        height: '420px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }}>
        <Film size={48} color="var(--primary-cyan)" style={{ marginBottom: '16px', opacity: 0.6 }} />
        <p style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.2rem', letterSpacing: '1px' }}>
          SELECIONE UMA PÍLULA DE MICROLEARNING (≤ 7 MIN)
        </p>
      </div>
    );
  }

  return (
    <div className="naval-card" style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{
        padding: '12px 18px',
        background: 'rgba(7, 22, 44, 0.95)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="tag-badge tag-badge-gold">MICROLEARNING</span>
          <h3 style={{ fontSize: '1.05rem', color: '#fff', margin: 0 }}>
            {video.titulo}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Duração: <strong style={{ color: 'var(--primary-cyan)' }}>{video.duracao}</strong>
          </span>

          {onClose && (
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                onClose();
              }}
              className="btn-tactical btn-danger"
              style={{
                padding: '6px 14px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                boxShadow: '0 0 12px rgba(255, 59, 48, 0.45)',
                cursor: 'pointer'
              }}
              title="Interromper vídeo e voltar aos slides (ESC)"
            >
              <X size={16} />
              <span>FECHAR VÍDEO (ESC)</span>
            </button>
          )}
        </div>
      </div>

      {/* Container de Vídeo */}
      <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9', maxHeight: '520px' }}>
        <video
          ref={videoRef}
          src={video.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
          onClick={togglePlay}
          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
          playsInline
        />

        {/* Overlay do Botão Play quando pausado */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(0, 229, 255, 0.25)',
              backdropFilter: 'blur(6px)',
              border: '2px solid var(--primary-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.5)',
              transition: 'all 0.2s ease'
            }}
          >
            <Play size={36} color="#fff" style={{ marginLeft: '4px' }} />
          </div>
        )}
      </div>

      {/* Barra de Progresso Tática */}
      <div 
        style={{ 
          width: '100%', 
          height: '6px', 
          background: 'rgba(10, 25, 44, 0.8)', 
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          if (videoRef.current) {
            videoRef.current.currentTime = pos * videoRef.current.duration;
          }
        }}
      >
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--primary-cyan), var(--gold-marinha))',
          boxShadow: '0 0 10px var(--primary-cyan)'
        }} />
      </div>

      {/* Controles de Reprodução */}
      <div style={{
        padding: '12px 18px',
        background: 'rgba(7, 22, 44, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={togglePlay}
            className="btn-tactical btn-cyan"
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'PAUSAR' : 'REPRODUZIR'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="btn-tactical btn-outline"
            style={{ padding: '8px 12px' }}
            title="Reiniciar Vídeo"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={toggleMute}
            className="btn-tactical btn-outline"
            style={{ padding: '8px 12px' }}
            title={isMuted ? 'Ativar Áudio' : 'Mutar Áudio'}
          >
            {isMuted ? <VolumeX size={16} color="var(--solas-red)" /> : <Volume2 size={16} />}
          </button>

          <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            {currentTime} / {duration}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            Foco: {video.foco}
          </span>
          <button
            onClick={handleFullscreen}
            className="btn-tactical btn-outline"
            style={{ padding: '8px 12px' }}
            title="Tela Cheia"
          >
            <Maximize size={16} />
          </button>

          {onClose && (
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                onClose();
              }}
              className="btn-tactical btn-danger"
              style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              title="Interromper vídeo e voltar aos slides"
            >
              <X size={16} />
              <span>INTERROMPER</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
