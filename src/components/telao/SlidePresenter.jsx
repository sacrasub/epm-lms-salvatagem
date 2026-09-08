import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Maximize, 
  Minimize, 
  Film, 
  Zap, 
  Trophy, 
  AlertOctagon, 
  HelpCircle, 
  Image as ImageIcon, 
  Download, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Grid,
  FileText,
  Presentation,
  Moon
} from 'lucide-react';
import VideoPlayerPill from './VideoPlayerPill';
import TimerClock from './TimerClock';
import LeaderboardView from './LeaderboardView';
import { soundManager } from '../../lib/soundEffects';

export default function SlidePresenter({
  mission,
  participantes = [],
  respostas = [],
  duvidas = [],
  state,
  onTriggerDynamic,
  onCloseDynamic
}) {
  const containerRef = useRef(null);
  const dockTimerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'video', 'dinamica', 'leaderboard', 'infografico', 'duvidas', 'grid'
  const [selectedVideo, setSelectedVideo] = useState(mission.videos[0]);
  const [showAnswerResults, setShowAnswerResults] = useState(false);

  // Controle de visibilidade da barra tática (Auto-hide / Só aparece quando quiser)
  const [isDockVisible, setIsDockVisible] = useState(false);

  // Controle de Página por Página (Passador de Slides)
  const slides = mission.slidesImages && mission.slidesImages.length > 0 
    ? mission.slidesImages 
    : [];
  const totalSlides = slides.length;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBlackout, setIsBlackout] = useState(false);
  const [usePdfFallback, setUsePdfFallback] = useState(false);

  // Manipuladores de mouse para o dock tático
  const handleShowDock = () => {
    if (dockTimerRef.current) clearTimeout(dockTimerRef.current);
    setIsDockVisible(true);
  };

  const handleDockMouseLeave = () => {
    if (dockTimerRef.current) clearTimeout(dockTimerRef.current);
    dockTimerRef.current = setTimeout(() => {
      setIsDockVisible(false);
    }, 2500);
  };

  // Reseta para o primeiro slide se mudar de missão
  useEffect(() => {
    setCurrentSlideIndex(0);
    setIsBlackout(false);
    if (mission.videos && mission.videos.length > 0) {
      setSelectedVideo(mission.videos[0]);
    }
  }, [mission.id]);

  // Pré-carregamento do próximo slide e do anterior em memória para transição instantânea
  useEffect(() => {
    if (totalSlides === 0) return;
    const nextIdx = (currentSlideIndex + 1) % totalSlides;
    const prevIdx = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    const imgNext = new Image();
    imgNext.src = slides[nextIdx];
    const imgPrev = new Image();
    imgPrev.src = slides[prevIdx];
  }, [currentSlideIndex, slides, totalSlides]);

  // Avançar slide
  const nextSlide = useCallback(() => {
    setIsBlackout(false);
    setCurrentSlideIndex((prev) => {
      if (prev < totalSlides - 1) return prev + 1;
      return prev; // Mantém no último slide
    });
  }, [totalSlides]);

  // Voltar slide
  const prevSlide = useCallback(() => {
    setIsBlackout(false);
    setCurrentSlideIndex((prev) => {
      if (prev > 0) return prev - 1;
      return 0; // Mantém no primeiro slide
    });
  }, []);

  // Ir para slide específico
  const goToSlide = (index) => {
    setIsBlackout(false);
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
      setActiveModal(null);
    }
  };

  // Alterna o modo de tela cheia nativo do navegador
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

  // OUVINTE GLOBAL DE TECLADO — TOTALMENTE OTIMIZADO PARA PASSADOR DE SLIDES (CLICKERS)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Se houver modal interativo aberto (ex: digitando dúvida ou vendo vídeo), não captura as teclas
      if (activeModal && activeModal !== 'grid') {
        if (e.key === 'Escape') {
          setActiveModal(null);
        }
        return;
      }

      // Teclas do Passador de Slides para AVANÇAR (PageDown, ArrowRight, ArrowDown, Space, Enter, N)
      if (
        e.key === 'PageDown' || 
        e.key === 'ArrowRight' || 
        e.key === 'ArrowDown' || 
        e.key === ' ' || 
        e.key === 'Enter' || 
        e.key === 'n' || 
        e.key === 'N'
      ) {
        e.preventDefault();
        nextSlide();
      }
      // Teclas do Passador de Slides para VOLTAR (PageUp, ArrowLeft, ArrowUp, Backspace, P)
      else if (
        e.key === 'PageUp' || 
        e.key === 'ArrowLeft' || 
        e.key === 'ArrowUp' || 
        e.key === 'Backspace' || 
        e.key === 'p' || 
        e.key === 'P'
      ) {
        e.preventDefault();
        prevSlide();
      }
      // Tela Preta (Blackout: B ou .)
      else if (e.key === 'b' || e.key === 'B' || e.key === '.') {
        e.preventDefault();
        setIsBlackout((prev) => !prev);
      }
      // Início / Fim da apresentação
      else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides - 1);
      } else if (e.key === 'f' || e.key === 'F' || e.key === 'F5') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'h' || e.key === 'H' || e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsDockVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, totalSlides, activeModal]);

  // Soar alarme SOLAS
  const handleAlarm = () => {
    soundManager.playSolasAlarm();
  };

  // Disparar dinâmica para os alunos
  const handleLaunchDynamic = (din) => {
    setShowAnswerResults(false);
    soundManager.playSonarPing();
    onTriggerDynamic(din, din.tempoSegundos);
    setActiveModal('dinamica_ativa');
  };

  // Revelar gabarito
  const handleRevealAnswer = () => {
    setShowAnswerResults(true);
    soundManager.playSuccess();
    onCloseDynamic();
  };

  return (
    <div 
      ref={containerRef} 
      className={`naval-card ${isFullscreen ? 'presenter-fullscreen' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: isFullscreen ? '100vh' : '650px',
        width: '100%',
        background: '#040c17',
        overflow: 'hidden',
        border: '1px solid var(--border-glow)'
      }}
    >
      {/* Barra de Título Superior dos Slides */}
      <div style={{
        padding: '8px 18px',
        background: 'rgba(7, 22, 44, 0.95)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="tag-badge tag-badge-gold">
            {mission.dia}
          </span>
          <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Presentation size={17} color="var(--primary-cyan)" />
            <span>{mission.slidesTitulo}</span>
          </h3>
        </div>

        {/* Indicador Central de Página com Passador */}
        {!usePdfFallback && totalSlides > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-tactical)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--primary-cyan)',
              background: 'rgba(0, 229, 255, 0.12)',
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid rgba(0, 229, 255, 0.3)'
            }}>
              SLIDE {currentSlideIndex + 1} / {totalSlides}
            </span>

            <button
              onClick={() => setActiveModal('grid')}
              className="btn-tactical btn-outline"
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              title="Mesa de Luz / Grade de Slides"
            >
              <Grid size={14} />
              <span>TODOS</span>
            </button>
          </div>
        )}

        {/* Controles da Direita */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsDockVisible((prev) => !prev)}
            className={`btn-tactical ${isDockVisible ? 'btn-gold' : 'btn-outline'}`}
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Mostrar / Ocultar Barra Tática de Recursos (Tecla H)"
          >
            <Compass size={14} />
            <span>{isDockVisible ? 'OCULTAR BARRA' : 'COMANDOS (H)'}</span>
          </button>

          <button
            onClick={() => setIsBlackout((prev) => !prev)}
            className={`btn-tactical ${isBlackout ? 'btn-danger' : 'btn-outline'}`}
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Apagar Tela (Tecla B no passador)"
          >
            <Moon size={14} />
            <span style={{ display: isFullscreen ? 'inline' : 'none' }}>TELA PRETA (B)</span>
          </button>

          <button
            onClick={() => setUsePdfFallback((prev) => !prev)}
            className="btn-tactical btn-outline"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title={usePdfFallback ? "Mudar para Modo Passador de Slides" : "Mudar para Modo PDF Contínuo"}
          >
            <FileText size={14} />
            <span>{usePdfFallback ? 'MODO PASSADOR' : 'MODO PDF'}</span>
          </button>

          <a
            href={mission.slidesPdf}
            download
            className="btn-tactical btn-outline"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            title="Baixar Arquivo PDF"
          >
            <Download size={14} />
          </a>

          <button
            onClick={toggleFullscreen}
            className="btn-tactical btn-cyan"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            title="Alternar Tela Cheia (Tecla F5 no passador)"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? 'REDUZIR' : 'TELA CHEIA (CINEMA)'}</span>
          </button>
        </div>
      </div>

      {/* Barra Fina de Progresso Visual no Topo */}
      {!usePdfFallback && totalSlides > 0 && (
        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', zIndex: 15 }}>
          <div 
            style={{ 
              width: `${((currentSlideIndex + 1) / totalSlides) * 100}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--primary-cyan), var(--gold-marinha))',
              transition: 'width 0.25s ease'
            }} 
          />
        </div>
      )}

      {/* ÁREA CENTRAL DO SLIDE */}
      <div 
        style={{ 
          flex: 1, 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          background: '#040c17',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          userSelect: 'none'
        }}
      >
        {/* MODO 1: PASSADOR DE SLIDES PÁGINA POR PÁGINA (Padrão Oficial) */}
        {!usePdfFallback && totalSlides > 0 ? (
          <>
            {/* Tela de Blackout (B no passador de slides) */}
            {isBlackout ? (
              <div 
                onClick={() => setIsBlackout(false)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#000000',
                  zIndex: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ textAlign: 'center', color: '#444', fontFamily: 'var(--font-tactical)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>TELA EM ESPERA (ATENÇÃO AO INSTRUTOR)</div>
                  <div style={{ fontSize: '0.85rem' }}>Clique na tela ou aperte qualquer botão no passador de slides para retomar</div>
                </div>
              </div>
            ) : (
              /* Imagem de Alta Resolução do Slide Atual */
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: isFullscreen ? '4px' : '10px'
                }}
              >
                <img
                  key={slides[currentSlideIndex]}
                  src={slides[currentSlideIndex]}
                  alt={`Slide ${currentSlideIndex + 1} de ${totalSlides}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
                    transition: 'opacity 0.15s ease-in-out'
                  }}
                />
              </div>
            )}

            {/* Zonas de Clique Interativas Laterais (Esquerda = Voltar, Direita = Avançar) */}
            <div 
              onClick={prevSlide}
              style={{
                position: 'absolute',
                top: 0,
                bottom: '80px',
                left: 0,
                width: '15%',
                cursor: currentSlideIndex > 0 ? 'pointer' : 'default',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '16px',
                opacity: 0,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => { if (currentSlideIndex > 0) e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
              title="Slide Anterior (Tecla PageUp / Seta Esquerda)"
            >
              <div style={{
                background: 'rgba(7, 22, 44, 0.85)',
                border: '1px solid var(--border-glow)',
                borderRadius: '50%',
                padding: '12px',
                color: 'var(--primary-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChevronLeft size={28} />
              </div>
            </div>

            <div 
              onClick={nextSlide}
              style={{
                position: 'absolute',
                top: 0,
                bottom: '80px',
                right: 0,
                width: '15%',
                cursor: currentSlideIndex < totalSlides - 1 ? 'pointer' : 'default',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '16px',
                opacity: 0,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => { if (currentSlideIndex < totalSlides - 1) e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
              title="Próximo Slide (Tecla PageDown / Seta Direita)"
            >
              <div style={{
                background: 'rgba(7, 22, 44, 0.85)',
                border: '1px solid var(--border-glow)',
                borderRadius: '50%',
                padding: '12px',
                color: 'var(--primary-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChevronRight size={28} />
              </div>
            </div>
          </>
        ) : (
          /* MODO 2: PDF FALLBACK */
          <iframe
            src={`${mission.slidesPdf}#toolbar=0&navpanes=0&view=FitH`}
            title={mission.slidesTitulo}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
          />
        )}
      </div>

      {/* ZONA INVISÍVEL DE PROXIMIDADE NO RODAPÉ (Aproximar o mouse faz a barra aparecer) */}
      <div
        onMouseEnter={handleShowDock}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          zIndex: 35,
          cursor: 'pointer'
        }}
      />

      {/* GATILHO DISCRETO NO RODAPÉ QUANDO A BARRA ESTIVER OCULTA */}
      {!isDockVisible && (
        <button
          onClick={handleShowDock}
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(7, 22, 44, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            borderRadius: '999px',
            padding: '3px 14px',
            color: 'var(--primary-cyan)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-tactical)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            zIndex: 36,
            boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
            opacity: 0.55,
            transition: 'opacity 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.55'; }}
          title="Clique ou aproxime o mouse para exibir os Comandos Táticos (Tecla H)"
        >
          <ChevronUp size={13} />
          <span>RECURSOS DO LMS (H)</span>
        </button>
      )}

      {/* DOCK TÁTICO FLUTUANTE (Floating Quick-Action Dock) — SÓ APARECE QUANDO O INSTRUTOR QUISER */}
      <div 
        onMouseEnter={handleShowDock}
        onMouseLeave={handleDockMouseLeave}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: isDockVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(140%)',
          opacity: isDockVisible ? 1 : 0,
          pointerEvents: isDockVisible ? 'all' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'rgba(7, 22, 44, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.75), 0 0 20px rgba(0, 229, 255, 0.3)',
          borderRadius: '999px',
          padding: '7px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 40
        }}
      >
        {/* 1. Botão Anterior / Próximo no Dock */}
        {!usePdfFallback && totalSlides > 0 && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="btn-tactical btn-outline"
              style={{ padding: '7px 12px', borderRadius: '999px', opacity: currentSlideIndex === 0 ? 0.4 : 1 }}
              title="Voltar Slide (PageUp / ←)"
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{ 
              fontFamily: 'var(--font-tactical)', 
              fontSize: '0.8rem', 
              color: '#fff', 
              fontWeight: 700, 
              minWidth: '55px', 
              textAlign: 'center' 
            }}>
              {currentSlideIndex + 1}/{totalSlides}
            </span>

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
              className="btn-tactical btn-outline"
              style={{ padding: '7px 12px', borderRadius: '999px', opacity: currentSlideIndex === totalSlides - 1 ? 0.4 : 1 }}
              title="Avançar Slide (PageDown / →)"
            >
              <ChevronRight size={16} />
            </button>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
          </>
        )}

        {/* 2. Botão Soar Alarme Geral SOLAS */}
        <button
          onClick={handleAlarm}
          className="btn-tactical btn-danger"
          style={{ padding: '7px 14px', borderRadius: '999px', fontSize: '0.8rem' }}
          title="Soar Alarme Geral SOLAS (7 toques curtos e 1 longo)"
        >
          <AlertOctagon size={15} />
          <span style={{ display: isFullscreen ? 'inline' : 'none' }}>ALARME SOLAS</span>
        </button>

        {/* 3. Botão Pílulas de Vídeo Microlearning */}
        <button
          onClick={() => setActiveModal('video')}
          className="btn-tactical btn-outline"
          style={{ padding: '7px 14px', borderRadius: '999px', fontSize: '0.8rem' }}
          title="Lançar Pílula de Vídeo (≤ 7 min)"
        >
          <Film size={15} color="var(--primary-cyan)" />
          <span>VÍDEOS ({mission.videos.length})</span>
        </button>

        {/* 4. Botão Disparar Desafio Tático / Quiz */}
        <button
          onClick={() => setActiveModal('dinamica')}
          className="btn-tactical btn-gold"
          style={{ padding: '7px 14px', borderRadius: '999px', fontSize: '0.8rem' }}
          title="Disparar Pergunta no Smartphone dos Alunos"
        >
          <Zap size={15} />
          <span>DESAFIO TÁTICO</span>
        </button>

        {/* 5. Botão Placar de Líderes */}
        <button
          onClick={() => setActiveModal('leaderboard')}
          className="btn-tactical btn-outline"
          style={{ padding: '7px 12px', borderRadius: '999px', fontSize: '0.8rem' }}
          title="Abrir Placar de Líderes da Turma"
        >
          <Trophy size={15} color="var(--gold-marinha)" />
          <span style={{ display: isFullscreen ? 'inline' : 'none' }}>PLACAR</span>
        </button>

        {/* 6. Botão Infográfico Técnico */}
        <button
          onClick={() => setActiveModal('infografico')}
          className="btn-tactical btn-outline"
          style={{ padding: '7px 12px', borderRadius: '999px', fontSize: '0.8rem' }}
          title="Visualizar Infográfico Técnico DPC"
        >
          <ImageIcon size={15} color="var(--primary-cyan)" />
          <span style={{ display: isFullscreen ? 'inline' : 'none' }}>INFOGRÁFICO</span>
        </button>

        {/* 7. Botão Sinalizador de Dúvidas */}
        <button
          onClick={() => setActiveModal('duvidas')}
          className="btn-tactical btn-outline"
          style={{ 
            padding: '7px 12px', 
            borderRadius: '999px', 
            fontSize: '0.8rem',
            position: 'relative'
          }}
          title="Dúvidas enviadas pelos alunos pelo celular"
        >
          <HelpCircle size={15} color="var(--primary-cyan)" />
          {duvidas.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--solas-red)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(255, 51, 68, 0.6)'
            }}>
              {duvidas.length}
            </span>
          )}
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />

        {/* 8. Botão de Recolher / Fechar o Dock */}
        <button
          onClick={() => setIsDockVisible(false)}
          className="btn-tactical btn-outline"
          style={{ padding: '7px 10px', borderRadius: '999px' }}
          title="Ocultar Barra (Tecla H)"
        >
          <ChevronDown size={15} />
        </button>
      </div>

      {/* MODAL 0: GRADE / MESA DE LUZ DE TODOS OS SLIDES */}
      {activeModal === 'grid' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 12, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Grid size={20} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                MESA DE LUZ — SELECIONAR SLIDE ({mission.dia})
              </h3>
            </div>
            <button 
              onClick={() => setActiveModal(null)} 
              className="btn-tactical btn-outline" 
              style={{ padding: '6px 12px' }}
            >
              <X size={16} />
              <span>FECHAR</span>
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
            paddingRight: '8px'
          }}>
            {slides.map((slideImg, sIdx) => {
              const isCurrent = sIdx === currentSlideIndex;
              return (
                <div
                  key={sIdx}
                  onClick={() => goToSlide(sIdx)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: isCurrent ? '2px solid var(--gold-marinha)' : '1px solid var(--border-subtle)',
                    boxShadow: isCurrent ? '0 0 16px rgba(255, 215, 0, 0.4)' : 'none',
                    background: 'rgba(10, 25, 44, 0.8)',
                    transition: 'transform 0.15s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <img 
                    src={slideImg} 
                    alt={`Slide ${sIdx + 1}`} 
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '4px 8px',
                    background: 'rgba(0,0,0,0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: isCurrent ? 'var(--gold-marinha)' : '#fff',
                    fontFamily: 'var(--font-tactical)',
                    fontWeight: 700
                  }}>
                    <span>SLIDE {sIdx + 1}</span>
                    {isCurrent && <span>★ ATUAL</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: PÍLULA DE VÍDEO MICROLEARNING */}
      {activeModal === 'video' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 12, 23, 0.94)',
          backdropFilter: 'blur(12px)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Film size={20} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                PÍLULA DE VÍDEO MICROLEARNING — {mission.dia}
              </h3>
            </div>
            <button 
              onClick={() => setActiveModal(null)} 
              className="btn-tactical btn-outline" 
              style={{ padding: '6px 12px' }}
            >
              <X size={16} />
              <span>VOLTAR AOS SLIDES</span>
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <VideoPlayerPill video={selectedVideo} />

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mission.videos.length}, 1fr)`, gap: '10px' }}>
              {mission.videos.map((vid, idx) => {
                const isActive = selectedVideo?.id === vid.id;
                return (
                  <button
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="naval-card"
                    style={{
                      padding: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(0, 229, 255, 0.15)' : 'rgba(10, 25, 44, 0.6)',
                      border: isActive ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                        VÍDEO {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vid.duracao}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {vid.titulo.split(':')[1] || vid.titulo}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SELEÇÃO DE DINÂMICA TÁTICA / QUIZ */}
      {activeModal === 'dinamica' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 12, 23, 0.94)',
          backdropFilter: 'blur(12px)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color="var(--gold-marinha)" />
              <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                LANÇAR DESAFIO TÁTICO NO SMARTPHONE DOS ALUNOS ({mission.dia})
              </h3>
            </div>
            <button 
              onClick={() => setActiveModal(null)} 
              className="btn-tactical btn-outline" 
              style={{ padding: '6px 12px' }}
            >
              <X size={16} />
              <span>VOLTAR AOS SLIDES</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, alignItems: 'center' }}>
            {mission.dinamicas.map((din) => (
              <div
                key={din.id}
                className="naval-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(15, 35, 61, 0.9)',
                  border: '1px solid var(--border-glow)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className="tag-badge tag-badge-gold">
                      {din.tipo === 'peer_instruction' ? 'PEER INSTRUCTION (MAZUR)' : 'DECISÃO RÁPIDA'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                      +{din.pontosXP} XP
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '12px' }}>
                    {din.titulo}
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {din.enunciado}
                  </p>
                </div>

                <button
                  onClick={() => handleLaunchDynamic(din)}
                  className="btn-tactical btn-danger"
                  style={{ marginTop: '24px', width: '100%', padding: '14px' }}
                >
                  <Zap size={18} />
                  <span>DISPARAR NO CELULAR DOS ALUNOS ({din.tempoSegundos}s)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 3: DINÂMICA ATIVA COM CRONÔMETRO E GABARITO */}
      {activeModal === 'dinamica_ativa' && state.perguntaAtiva && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 12, 23, 0.96)',
          backdropFilter: 'blur(16px)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="tag-badge tag-badge-red" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
                SITUAÇÃO SOB PRESSÃO
              </span>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                {state.perguntaAtiva.titulo}
              </h3>
            </div>

            {state.dinamicaAtiva && (
              <TimerClock 
                timerFim={state.timerFim} 
                isActive={state.dinamicaAtiva} 
                onExpire={handleRevealAnswer}
              />
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ background: 'rgba(7, 22, 44, 0.85)', padding: '20px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--solas-red)' }}>
              <p style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                {state.perguntaAtiva.enunciado}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '20px 0' }}>
              {state.perguntaAtiva.opcoes.map((op) => {
                const isCorrect = op.correta;
                const showHighlight = showAnswerResults && isCorrect;

                return (
                  <div
                    key={op.id}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-sm)',
                      background: showHighlight ? 'rgba(0, 230, 118, 0.2)' : 'rgba(10, 25, 44, 0.7)',
                      border: showHighlight ? '2px solid var(--tactical-green)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}
                  >
                    <span style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: showHighlight ? 'var(--tactical-green)' : '#163252',
                      color: showHighlight ? '#040c17' : '#fff',
                      fontFamily: 'var(--font-tactical)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {op.id}
                    </span>
                    <span style={{ fontSize: '1rem', color: showHighlight ? '#fff' : 'var(--text-main)', fontWeight: showHighlight ? 700 : 400 }}>
                      {op.texto}
                    </span>
                  </div>
                );
              })}
            </div>

            {showAnswerResults && (
              <div style={{
                background: 'rgba(0, 230, 118, 0.15)',
                border: '1px solid rgba(0, 230, 118, 0.4)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 20px',
                marginBottom: '16px'
              }}>
                <div style={{ color: 'var(--tactical-green)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                  JUSTIFICATIVA TÉCNICA ({state.perguntaAtiva.referencia})
                </div>
                <p style={{ margin: 0, fontSize: '1rem', color: '#fff', lineHeight: 1.4 }}>
                  {state.perguntaAtiva.explicacao}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px' }}>
              {!showAnswerResults ? (
                <button
                  onClick={handleRevealAnswer}
                  className="btn-tactical btn-cyan"
                  style={{ padding: '12px 24px' }}
                >
                  <span>REVELAR GABARITO & DISTRIBUIR XP</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveModal(null)}
                  className="btn-tactical btn-gold"
                  style={{ padding: '12px 24px' }}
                >
                  <span>RETOMAR OS SLIDES</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PLACAR DE LÍDERES */}
      {activeModal === 'leaderboard' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 12, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trophy size={20} color="var(--gold-marinha)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                PLACAR DE LÍDERES — TRIPULAÇÃO EPM 2026
              </h3>
            </div>
            <button 
              onClick={() => setActiveModal(null)} 
              className="btn-tactical btn-outline" 
              style={{ padding: '6px 12px' }}
            >
              <X size={16} />
              <span>VOLTAR AOS SLIDES</span>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <LeaderboardView
              participantes={participantes}
              respostas={respostas}
              perguntaAtiva={state.perguntaAtiva}
            />
          </div>
        </div>
      )}

      {/* MODAL 5: INFOGRÁFICO TÉCNICO DPC */}
      {activeModal === 'infografico' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 12, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ImageIcon size={20} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                {mission.infograficoTitulo}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={mission.infograficoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="btn-tactical btn-outline" 
                style={{ padding: '6px 12px' }}
              >
                <span>ABRIR ORIGINAL</span>
              </a>
              <button 
                onClick={() => setActiveModal(null)} 
                className="btn-tactical btn-outline" 
                style={{ padding: '6px 12px' }}
              >
                <X size={16} />
                <span>VOLTAR AOS SLIDES</span>
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img 
              src={mission.infograficoUrl} 
              alt={mission.infograficoTitulo} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
            />
          </div>
        </div>
      )}

      {/* MODAL 6: DÚVIDAS DA TURMA */}
      {activeModal === 'duvidas' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 12, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={20} color="var(--primary-cyan)" />
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                PAINEL DE DÚVIDAS SILENCIOSAS ENVIADAS PELOS ALUNOS
              </h3>
            </div>
            <button 
              onClick={() => setActiveModal(null)} 
              className="btn-tactical btn-outline" 
              style={{ padding: '6px 12px' }}
            >
              <X size={16} />
              <span>VOLTAR AOS SLIDES</span>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {duvidas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Nenhuma dúvida enviada pela tripulação até o momento.
              </div>
            ) : (
              duvidas.map((d) => (
                <div 
                  key={d.id} 
                  style={{
                    background: 'rgba(10, 25, 44, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>
                      {d.autorNome}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {d.criadoEm ? new Date(d.criadoEm).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#fff', fontSize: '1rem', lineHeight: 1.4 }}>
                    "{d.texto}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
