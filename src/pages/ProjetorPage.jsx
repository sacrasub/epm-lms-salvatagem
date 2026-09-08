import React, { useState, useEffect, useRef } from 'react';
import { MISSIONS } from '../data/missionsData';
import { realtimeEngine } from '../lib/realtimeEngine';
import { Maximize, Minimize, AlertOctagon, HelpCircle, Trophy } from 'lucide-react';
import VideoPlayerPill from '../components/telao/VideoPlayerPill';
import LeaderboardView from '../components/telao/LeaderboardView';

export default function ProjetorPage({ roomCode = 'EPM2026' }) {
  const [data, setData] = useState({
    state: realtimeEngine.state,
    participantes: realtimeEngine.participantes,
    respostas: realtimeEngine.respostas,
    duvidas: realtimeEngine.duvidas
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFsBtn, setShowFsBtn] = useState(false);
  const hideTimerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    realtimeEngine.init(roomCode);
    const unsubscribe = realtimeEngine.subscribe((snapshot) => {
      setData(snapshot);
    });

    return () => unsubscribe();
  }, [roomCode]);

  // Controle de auto-hide do botão de tela cheia ao mover o mouse
  const handleMouseMove = () => {
    setShowFsBtn(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowFsBtn(false);
    }, 2500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current?.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Teclas de controle no Projetor (caso o passador de slides esteja plugado nesta máquina)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        realtimeEngine.closeVideo();
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'b' || e.key === 'B' || e.key === '.') {
        e.preventDefault();
        realtimeEngine.setBlackout(!data.state.isBlackout);
      } else if (
        e.key === 'PageDown' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === ' ' ||
        e.key === 'Enter'
      ) {
        e.preventDefault();
        // Se houver vídeo ativo, fecha o vídeo e avança
        if (data.state.videoAtivoId) {
          realtimeEngine.closeVideo();
        }
        const currentM = MISSIONS.find(m => m.id === data.state.missaoAtual) || MISSIONS[0];
        const maxIdx = (currentM.slidesImages?.length || 1) - 1;
        const nextIdx = Math.min((data.state.slideAtualIndex || 0) + 1, maxIdx);
        realtimeEngine.setSlide(nextIdx, false);
      } else if (
        e.key === 'PageUp' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'Backspace'
      ) {
        e.preventDefault();
        if (data.state.videoAtivoId) {
          realtimeEngine.closeVideo();
        }
        const prevIdx = Math.max((data.state.slideAtualIndex || 0) - 1, 0);
        realtimeEngine.setSlide(prevIdx, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data.state]);

  const currentMission = MISSIONS.find(m => m.id === data.state.missaoAtual) || MISSIONS[0];
  const slides = currentMission.slidesImages || [];
  const slideIndex = Math.min(Math.max(data.state.slideAtualIndex || 0, 0), slides.length - 1);
  const currentSlideSrc = slides[slideIndex] || slides[0];

  // Identifica vídeo ativo se houver
  const activeVideo = data.state.videoAtivoId 
    ? currentMission.videos?.find(v => v.id === data.state.videoAtivoId) 
    : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: showFsBtn ? 'default' : 'none',
        userSelect: 'none'
      }}
    >
      {/* 1. SLIDE PRINCIPAL */}
      {currentSlideSrc && (
        <img
          src={currentSlideSrc}
          alt={`Slide ${slideIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            opacity: data.state.isBlackout ? 0 : 1,
            transition: 'opacity 0.25s ease-in-out'
          }}
        />
      )}

      {/* 2. BLACKOUT OVERLAY */}
      {data.state.isBlackout && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000000',
            zIndex: 10
          }}
        />
      )}

      {/* 3. OVERLAY: VÍDEO ATIVO EM TELA CHEIA */}
      {activeVideo && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px'
          }}
        >
          <div style={{ width: '90%', maxWidth: '1280px' }}>
            <VideoPlayerPill video={activeVideo} onClose={() => realtimeEngine.closeVideo()} />
          </div>
        </div>
      )}

      {/* 4. OVERLAY: DINÂMICA / DESAFIO TÁTICO ATIVO */}
      {data.state.dinamicaAtiva && data.state.perguntaAtiva && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 14, 28, 0.94)',
            backdropFilter: 'blur(10px)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div
            className="naval-card naval-card-glow-gold"
            style={{
              maxWidth: '960px',
              width: '100%',
              padding: '40px',
              background: 'rgba(10, 25, 44, 0.98)',
              border: '2px solid var(--gold-marinha)',
              boxShadow: '0 0 60px rgba(212, 175, 55, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '2px solid var(--gold-marinha)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-marinha)'
                  }}
                >
                  <AlertOctagon size={28} />
                </div>
                <div>
                  <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.85rem' }}>
                    SIMULAÇÃO TÁTICA EM TEMPO REAL — DPC / SOLAS
                  </span>
                  <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: '4px 0 0 0' }}>
                    {data.state.perguntaAtiva.titulo || 'Desafio Tático de Salvatagem'}
                  </h2>
                </div>
              </div>

              {/* Indicador de Responda no Smartphone */}
              <div
                style={{
                  background: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid var(--primary-cyan)',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'right'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  AÇÃO REQUERIDA
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                  Responda no Smartphone
                </div>
              </div>
            </div>

            {/* Enunciado da Pergunta */}
            <div
              style={{
                fontSize: '1.45rem',
                color: '#fff',
                lineHeight: 1.5,
                background: 'rgba(5, 14, 28, 0.7)',
                padding: '24px 28px',
                borderRadius: 'var(--radius-md)',
                borderLeft: '5px solid var(--gold-marinha)'
              }}
            >
              {data.state.perguntaAtiva.enunciado}
            </div>

            {/* Alternativas visíveis no telão */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {data.state.perguntaAtiva.opcoes?.map((op) => (
                <div
                  key={op.id}
                  style={{
                    background: 'rgba(15, 35, 61, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <span
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(0, 229, 255, 0.15)',
                      border: '1px solid var(--primary-cyan)',
                      color: 'var(--primary-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}
                  >
                    {op.id}
                  </span>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {op.texto}
                  </span>
                </div>
              ))}
            </div>

            {/* Rodapé do Desafio */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Referência: {data.state.perguntaAtiva.referencia || 'SOLAS Cap. III / NORMAM-05'}
              </span>
              <span style={{ color: 'var(--primary-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>
                Valendo +{data.state.perguntaAtiva.pontosXP || 150} XP e Medalha de Bordo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. OVERLAY: PLACAR / LEADERBOARD */}
      {data.state.tipoConteudo === 'leaderboard' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 14, 28, 0.95)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px'
          }}
        >
          <div style={{ maxWidth: '900px', width: '100%' }}>
            <LeaderboardView participantes={data.participantes} />
          </div>
        </div>
      )}

      {/* 6. BOTÃO DISCRETO DE FULLSCREEN (Auto-hide) */}
      <button
        onClick={toggleFullscreen}
        title="Alternar Tela Cheia (F11 ou F)"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(10, 25, 44, 0.65)',
          color: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '8px',
          padding: '10px',
          cursor: 'pointer',
          zIndex: 50,
          opacity: showFsBtn ? 1 : 0,
          transition: 'opacity 0.25s ease-in-out',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem'
        }}
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        <span>{isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia (F11)'}</span>
      </button>

      {/* 7. INDICADOR DISCRETO DE SALA NO CANTO INFERIOR (Opacidade baixa) */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '16px',
          color: 'rgba(255, 255, 255, 0.25)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-tactical)',
          letterSpacing: '1px',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        EPM PROJETOR // SALA {roomCode} // {currentMission.dia}
      </div>
    </div>
  );
}
