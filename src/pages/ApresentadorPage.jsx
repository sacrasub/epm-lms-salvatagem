import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MISSIONS } from '../data/missionsData';
import { INSTRUCTOR_NOTES } from '../data/instructorNotesData';
import { realtimeEngine } from '../lib/realtimeEngine';
import { soundManager } from '../lib/soundEffects';
import {
  Monitor,
  Tv,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  AlertOctagon,
  Film,
  Zap,
  Trophy,
  HelpCircle,
  Moon,
  Clock,
  BookOpen,
  ArrowRight,
  Maximize,
  Minimize,
  Sliders,
  CheckCircle,
  Layers,
  MessageSquare
} from 'lucide-react';

export default function ApresentadorPage({ roomCode = 'EPM2026', onBackHome }) {
  const [data, setData] = useState({
    state: realtimeEngine.state,
    participantes: realtimeEngine.participantes,
    respostas: realtimeEngine.respostas,
    duvidas: realtimeEngine.duvidas
  });

  // Janela do projetor aberta
  const projetorWindowRef = useRef(null);
  const [isProjetorOpen, setIsProjetorOpen] = useState(false);

  // Relógio e Cronômetro de aula
  const [currentTime, setCurrentTime] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Modal ativo no painel do apresentador
  const [activeModal, setActiveModal] = useState(null); // 'videos', 'dinamicas', 'duvidas', 'atalhos'

  // Anotações pessoais locais do instrutor
  const [personalNotes, setPersonalNotes] = useState({});

  useEffect(() => {
    realtimeEngine.init(roomCode);
    const unsubscribe = realtimeEngine.subscribe((snapshot) => {
      setData(snapshot);
    });

    // Relógio de Brasília
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const clockTimer = setInterval(updateClock, 1000);

    // Carrega anotações pessoais do localStorage
    try {
      const saved = localStorage.getItem(`epm_instructor_notes_${roomCode}`);
      if (saved) setPersonalNotes(JSON.parse(saved));
    } catch (e) {}

    return () => {
      unsubscribe();
      clearInterval(clockTimer);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [roomCode]);

  // Controle do Cronômetro
  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Dados da Missão e Slides Atuais
  const currentMission = MISSIONS.find((m) => m.id === data.state.missaoAtual) || MISSIONS[0];
  const slides = currentMission.slidesImages || [];
  const totalSlides = slides.length;
  const currentSlideIndex = Math.min(Math.max(data.state.slideAtualIndex || 0, 0), totalSlides - 1);
  const nextSlideIndex = currentSlideIndex < totalSlides - 1 ? currentSlideIndex + 1 : null;

  // Notas pedagógicas DPC para o slide atual
  const missionKey = data.state.missaoAtual === 1 ? 'dia08' : data.state.missaoAtual === 2 ? 'dia09' : 'dia10';
  const currentNote = INSTRUCTOR_NOTES[missionKey]?.[currentSlideIndex + 1] || {
    titulo: `Slide ${currentSlideIndex + 1} — ${currentMission.titulo}`,
    pontosChave: [
      'Apresentar os conceitos da Convenção SOLAS e NORMAM-05/DPC com ênfase na aplicação prática a bordo.',
      'Destacar as responsabilidades individuais e coletivas na salvatagem marítima.'
    ],
    dicaPedagogica: 'Estimule a turma com perguntas sobre procedimentos de emergência.',
    acaoRecomendada: null
  };

  const nextNote = nextSlideIndex !== null
    ? INSTRUCTOR_NOTES[missionKey]?.[nextSlideIndex + 1]
    : null;

  // Navegação de Slides
  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < totalSlides) {
      realtimeEngine.setSlide(index, false);
    }
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      realtimeEngine.setSlide(currentSlideIndex + 1, false);
    }
  }, [currentSlideIndex, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      realtimeEngine.setSlide(currentSlideIndex - 1, false);
    }
  }, [currentSlideIndex]);

  const toggleBlackout = useCallback(() => {
    realtimeEngine.setBlackout(!data.state.isBlackout);
  }, [data.state.isBlackout]);

  // ABRIR JANELA DO PROJETOR (2ª TELA)
  const openProjetorWindow = () => {
    const url = `/projetor?sala=${encodeURIComponent(roomCode)}`;
    const windowFeatures = 'menubar=no,toolbar=no,location=no,status=no,width=1280,height=720,left=100,top=100';

    if (projetorWindowRef.current && !projetorWindowRef.current.closed) {
      projetorWindowRef.current.focus();
    } else {
      projetorWindowRef.current = window.open(url, 'ProjetorEPM', windowFeatures);
      setIsProjetorOpen(true);
    }
  };

  // Monitora se a janela do projetor foi fechada
  useEffect(() => {
    const checkClosed = setInterval(() => {
      if (projetorWindowRef.current) {
        setIsProjetorOpen(!projetorWindowRef.current.closed);
      }
    }, 1500);
    return () => clearInterval(checkClosed);
  }, []);

  // CAPTURA GLOBAL DE TECLADO / PASSADOR DE SLIDES (USB CLICKER)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Se estiver digitando em uma textarea de anotações, não captura as teclas
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'PageDown' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'PageUp' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Backspace') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'b' || e.key === 'B' || e.key === '.') {
        e.preventDefault();
        toggleBlackout();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides - 1);
      } else if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleBlackout, goToSlide, totalSlides]);

  // Salva anotação pessoal rápida do slide
  const handleSavePersonalNote = (text) => {
    const key = `${missionKey}_${currentSlideIndex + 1}`;
    const updated = { ...personalNotes, [key]: text };
    setPersonalNotes(updated);
    try {
      localStorage.setItem(`epm_instructor_notes_${roomCode}`, JSON.stringify(updated));
    } catch (e) {}
  };

  // Disparos do LMS
  const handleSoundAlarm = () => {
    soundManager.playSolasAlarm();
  };

  const handleLaunchDynamic = (din) => {
    soundManager.playSonarPing();
    realtimeEngine.triggerDynamic(din, din.tempoSegundos);
    setActiveModal(null);
  };

  const handlePlayVideo = (vidId) => {
    realtimeEngine.setEtapa(1, 'video', vidId);
    setActiveModal(null);
  };

  const handleShowLeaderboard = () => {
    realtimeEngine.setEtapa(2, 'leaderboard');
    setActiveModal(null);
  };

  const handleReturnToSlides = () => {
    realtimeEngine.setSlide(currentSlideIndex, false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#07162c',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none'
      }}
    >
      {/* 1. BARRA SUPERIOR: CABEÇALHO DO APRESENTADOR */}
      <header
        style={{
          background: 'rgba(10, 25, 44, 0.98)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Identificação & Status Dual-Screen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBackHome}
            className="btn-tactical btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronLeft size={16} />
            Início
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--gold-marinha)', letterSpacing: '1px' }}>
                COCKPIT DO APRESENTADOR
              </span>
              <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                CAAQ-BC 2026
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Terminal de Comando do Laptop // Sala: <strong style={{ color: 'var(--primary-cyan)' }}>{roomCode}</strong>
            </div>
          </div>

          {/* Status da Sincronização Local Dual-Screen */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              color: 'var(--primary-cyan)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isProjetorOpen ? '#00e676' : 'var(--primary-cyan)',
                boxShadow: isProjetorOpen ? '0 0 8px #00e676' : '0 0 8px var(--primary-cyan)',
                display: 'inline-block'
              }}
            />
            <span>{isProjetorOpen ? 'PROJETOR CONECTADO' : 'DUAL-SCREEN 0ms'}</span>
          </div>
        </div>

        {/* Seletor Rápido de Dia (Missão 01, 02, 03) */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {MISSIONS.map((m) => {
            const isSel = m.id === currentMission.id;
            return (
              <button
                key={m.id}
                onClick={() => realtimeEngine.setMission(m.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSel ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                  background: isSel ? 'rgba(0, 229, 255, 0.2)' : 'rgba(15, 35, 61, 0.6)',
                  color: isSel ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-tactical)',
                  transition: 'all 0.15s'
                }}
              >
                {m.dia}
              </button>
            );
          })}
        </div>

        {/* Relógio & Cronômetro de Aula */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Cronômetro */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(7, 22, 44, 0.8)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Clock size={16} color="var(--gold-marinha)" />
            <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-marinha)', minWidth: '46px' }}>
              {formatTimer(timerSeconds)}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  title="Iniciar Cronômetro da Aula"
                  style={{ background: 'none', border: 'none', color: '#00e676', cursor: 'pointer', display: 'flex', padding: 2 }}
                >
                  <Play size={14} />
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  title="Pausar Cronômetro"
                  style={{ background: 'none', border: 'none', color: '#ffb300', cursor: 'pointer', display: 'flex', padding: 2 }}
                >
                  <Pause size={14} />
                </button>
              )}
              <button
                onClick={resetTimer}
                title="Zerar Cronômetro"
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', padding: 2 }}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Relógio de Brasília */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tactical)' }}>
            {currentTime} BRT
          </div>

          {/* BOTÃO MASTER: ABRIR JANELA DO PROJETOR */}
          <button
            onClick={openProjetorWindow}
            className="btn-tactical btn-gold"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.35)'
            }}
            title="Abre a tela limpa da apresentação para exibir no projetor (2ª tela)"
          >
            <Tv size={18} />
            <span>{isProjetorOpen ? 'FOCAR PROJETOR (2ª TELA)' : '📺 ABRIR PROJETOR (2ª TELA)'}</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </header>

      {/* 2. ÁREA CENTRAL SPLIT (SLIDE ATUAL vs PREVIEW & NOTAS PEDAGÓGICAS) */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gap: '16px',
          padding: '16px',
          overflow: 'hidden'
        }}
      >
        {/* COLUNA ESQUERDA: SLIDE ATUAL TRANSMITIDO AO VIVO */}
        <section
          className="naval-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(10, 25, 44, 0.95)',
            border: '1px solid var(--border-subtle)',
            padding: '14px',
            position: 'relative'
          }}
        >
          {/* Cabeçalho do Slide Atual */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: data.state.isBlackout ? '#ff5252' : '#00e676',
                  boxShadow: data.state.isBlackout ? '0 0 10px #ff5252' : '0 0 10px #00e676'
                }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: data.state.isBlackout ? '#ff5252' : '#00e676', letterSpacing: '1px' }}>
                {data.state.isBlackout ? '⚫ TELA PRETA NO PROJETOR (BLACKOUT)' : 'AO VIVO NO PROJETOR'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Slide <strong style={{ color: '#fff' }}>{currentSlideIndex + 1}</strong> de <strong>{totalSlides}</strong>
              </span>
              <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.75rem' }}>
                {Math.round(((currentSlideIndex + 1) / totalSlides) * 100)}%
              </span>
            </div>
          </div>

          {/* Imagem do Slide Atual com Aspect Ratio Protetor */}
          <div
            style={{
              flex: 1,
              background: '#000000',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              border: data.state.isBlackout ? '2px solid #ff5252' : '1px solid var(--border-subtle)',
              minHeight: '280px'
            }}
          >
            {slides[currentSlideIndex] ? (
              <img
                src={slides[currentSlideIndex]}
                alt={`Slide Atual ${currentSlideIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  opacity: data.state.isBlackout ? 0.2 : 1,
                  transition: 'opacity 0.2s ease'
                }}
              />
            ) : (
              <div style={{ color: 'var(--text-dim)' }}>Nenhum slide carregado</div>
            )}

            {data.state.isBlackout && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.85)',
                  color: '#ff5252',
                  gap: '8px'
                }}
              >
                <Moon size={36} />
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>TELA PRETA ATIVA NO PROJETOR</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pressione a tecla B ou o botão abaixo para restaurar</div>
              </div>
            )}
          </div>

          {/* Barra de Controles de Passagem de Slide */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className="btn-tactical btn-outline"
                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                title="Slide Anterior (PageUp / Seta Esquerda)"
              >
                <ChevronLeft size={18} />
                <span>Anterior</span>
              </button>

              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === totalSlides - 1}
                className="btn-tactical btn-cyan"
                style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}
                title="Próximo Slide (PageDown / Seta Direita / Espaço)"
              >
                <span>Próximo</span>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Ações Especiais de Slide */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={toggleBlackout}
                className={`btn-tactical ${data.state.isBlackout ? 'btn-danger' : 'btn-outline'}`}
                style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Alternar Tela Preta (Tecla B ou .)"
              >
                <Moon size={16} />
                <span>{data.state.isBlackout ? 'Restaurar Tela' : 'Tela Preta (B)'}</span>
              </button>

              {data.state.tipoConteudo !== 'slides' && (
                <button
                  onClick={handleReturnToSlides}
                  className="btn-tactical btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Voltar a projetar os slides"
                >
                  <Layers size={16} />
                  <span>Voltar aos Slides</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* COLUNA DIREITA: PREVIEW DO PRÓXIMO SLIDE & NOTAS PEDAGÓGICAS DPC */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflow: 'hidden'
          }}
        >
          {/* 2.1 PREVIEW DO PRÓXIMO SLIDE */}
          <div
            className="naval-card"
            style={{
              padding: '12px 16px',
              background: 'rgba(10, 25, 44, 0.85)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            {/* Miniatura */}
            <div
              style={{
                width: '130px',
                height: '73px',
                background: '#000',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {nextSlideIndex !== null && slides[nextSlideIndex] ? (
                <img
                  src={slides[nextSlideIndex]}
                  alt={`Próximo ${nextSlideIndex + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Fim dos Slides</span>
              )}
            </div>

            {/* Informações do Próximo */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                  A SEGUIR (PREVIEW)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Slide {nextSlideIndex !== null ? nextSlideIndex + 1 : '—'}
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {nextNote ? nextNote.titulo : 'Conclusão da Missão'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {nextNote?.pontosChave?.[0] || 'Próximo tópico do programa oficial DPC.'}
              </div>
            </div>
          </div>

          {/* 2.2 NOTAS DO INSTRUTOR & DIRETRIZES DPC (Scrollable) */}
          <div
            className="naval-card"
            style={{
              flex: 1,
              padding: '18px',
              background: 'rgba(10, 25, 44, 0.95)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              gap: '14px'
            }}
          >
            {/* Título da Lição Atual */}
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="var(--primary-cyan)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                  DIRETRIZ PEDAGÓGICA DPC / SOLAS
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                {currentNote.titulo}
              </h3>
            </div>

            {/* Pontos-Chave Oficiais */}
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold-marinha)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                PONTOS DE ÊNFASE EM SALA:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                {currentNote.pontosChave?.map((pt, idx) => (
                  <li key={idx}>
                    <span dangerouslySetInnerHTML={{ __html: pt.replace(/\b(150 N|5 SEGUNDOS|5s|HRU|2,2 ± 0,4 kN|2\.2 kN|9 GHz|12 PONTOS|406 MHz|COSPAS-SARSAT|NUNCA TOQUE NO CABO)\b/g, '<strong style="color: var(--gold-marinha)">$1</strong>') }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Dica Pedagógica do Instrutor */}
            {currentNote.dicaPedagogica && (
              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderLeft: '3px solid var(--gold-marinha)',
                  padding: '10px 14px',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  color: '#ffe082'
                }}
              >
                <strong>Dica Pedagógica:</strong> {currentNote.dicaPedagogica}
              </div>
            )}

            {/* Ação Recomendada */}
            {currentNote.acaoRecomendada && (
              <div
                style={{
                  background: 'rgba(0, 229, 255, 0.1)',
                  border: '1px dashed var(--primary-cyan)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  color: '#b2ebf2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Zap size={18} color="var(--primary-cyan)" style={{ flexShrink: 0 }} />
                <span>{currentNote.acaoRecomendada}</span>
              </div>
            )}

            {/* Anotação Pessoal Rápida do Instrutor */}
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Suas anotações pessoais para este slide (salvo automaticamente):
              </div>
              <textarea
                value={personalNotes[`${missionKey}_${currentSlideIndex + 1}`] || ''}
                onChange={(e) => handleSavePersonalNote(e.target.value)}
                placeholder="Escreva aqui lembretes ou nomes de alunos para interagir..."
                rows={2}
                style={{
                  width: '100%',
                  background: 'rgba(7, 22, 44, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* 3. BARRA INFERIOR: AÇÕES TÁTICAS RÁPIDAS DO LMS */}
      <footer
        style={{
          background: 'rgba(10, 25, 44, 0.98)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        {/* Bloco 1: Ações de Impacto */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Alarme SOLAS */}
          <button
            onClick={handleSoundAlarm}
            className="btn-tactical btn-danger"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700 }}
            title="Dispara áudio sonoro de Alarme Geral (7 curtos e 1 longo)"
          >
            <AlertOctagon size={18} />
            <span>Soar Alarme SOLAS</span>
          </button>

          {/* Disparar Dinâmica / Quiz */}
          <button
            onClick={() => setActiveModal(activeModal === 'dinamicas' ? null : 'dinamicas')}
            className={`btn-tactical ${activeModal === 'dinamicas' ? 'btn-gold' : 'btn-outline'}`}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
          >
            <Zap size={18} color="var(--gold-marinha)" />
            <span>Disparar Desafio Tático</span>
          </button>

          {/* Vídeos da Missão */}
          <button
            onClick={() => setActiveModal(activeModal === 'videos' ? null : 'videos')}
            className={`btn-tactical ${activeModal === 'videos' ? 'btn-cyan' : 'btn-outline'}`}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
          >
            <Film size={18} color="var(--primary-cyan)" />
            <span>Pílulas em Vídeo ({currentMission.videos?.length || 0})</span>
          </button>

          {/* Placar de Líderes */}
          <button
            onClick={handleShowLeaderboard}
            className="btn-tactical btn-outline"
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            title="Exibe o ranking de XP e medalhas no projetor"
          >
            <Trophy size={16} color="var(--gold-marinha)" />
            <span>Placar</span>
          </button>

          {/* Dúvidas dos Alunos */}
          <button
            onClick={() => setActiveModal(activeModal === 'duvidas' ? null : 'duvidas')}
            className="btn-tactical btn-outline"
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', position: 'relative' }}
          >
            <MessageSquare size={16} />
            <span>Dúvidas</span>
            {data.duvidas.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ff5252',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                {data.duvidas.length}
              </span>
            )}
          </button>
        </div>

        {/* Bloco 2: Legenda do Passador de Slides */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>Passador USB Ativo:</span>
          <span><kbd style={{ background: '#0a192c', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>▶ / PageDown</kbd> Próximo</span>
          <span><kbd style={{ background: '#0a192c', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>◀ / PageUp</kbd> Voltar</span>
          <span><kbd style={{ background: '#0a192c', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>B</kbd> Tela Preta</span>
        </div>
      </footer>

      {/* 4. MODAIS POPUP DO COCKPIT */}

      {/* 4.1 MODAL DE SELEÇÃO DE DINÂMICA / QUIZ */}
      {activeModal === 'dinamicas' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="naval-card naval-card-glow-gold"
            style={{
              maxWidth: '680px',
              width: '100%',
              padding: '24px',
              background: 'rgba(10, 25, 44, 0.98)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={24} color="var(--gold-marinha)" />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>
                  DISPARAR DESAFIO TÁTICO — {currentMission.dia}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="btn-tactical btn-outline" style={{ padding: '4px 8px' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Ao disparar, a pergunta aparecerá em tela cheia no Projetor e os smartphones dos alunos vibrarão para responder:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentMission.dinamicas?.map((din) => (
                <div
                  key={din.id}
                  style={{
                    background: 'rgba(15, 35, 61, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>
                      {din.titulo}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Tempo: {din.tempoSegundos}s // {din.pontosXP} XP // {din.opcoes?.length || 4} alternativas
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunchDynamic(din)}
                    className="btn-tactical btn-gold"
                    style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Play size={16} />
                    <span>Disparar Agora</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4.2 MODAL DE SELEÇÃO DE VÍDEOS */}
      {activeModal === 'videos' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="naval-card naval-card-glow-cyan"
            style={{
              maxWidth: '680px',
              width: '100%',
              padding: '24px',
              background: 'rgba(10, 25, 44, 0.98)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Film size={24} color="var(--primary-cyan)" />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>
                  PÍLULAS EM VÍDEO — {currentMission.dia}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="btn-tactical btn-outline" style={{ padding: '4px 8px' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Selecione uma pílula para reproduzir no projetor da sala:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentMission.videos?.map((vid) => (
                <div
                  key={vid.id}
                  style={{
                    background: 'rgba(15, 35, 61, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      {vid.titulo}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Duração: {vid.duracao} // Foco: {vid.foco}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayVideo(vid.id)}
                    className="btn-tactical btn-cyan"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Play size={16} />
                    <span>Projetar Vídeo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4.3 MODAL DE DÚVIDAS DOS ALUNOS */}
      {activeModal === 'duvidas' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="naval-card"
            style={{
              maxWidth: '680px',
              width: '100%',
              maxHeight: '80vh',
              padding: '24px',
              background: 'rgba(10, 25, 44, 0.98)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={24} color="var(--primary-cyan)" />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>
                  DÚVIDAS ENVIADAS PELOS ALUNOS ({data.duvidas.length})
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="btn-tactical btn-outline" style={{ padding: '4px 8px' }}>
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.duvidas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                  Nenhuma dúvida enviada até o momento.
                </div>
              ) : (
                data.duvidas.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      background: 'rgba(15, 35, 61, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--gold-marinha)', fontSize: '0.85rem' }}>
                        {d.aluno}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{d.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.4 }}>{d.texto}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
