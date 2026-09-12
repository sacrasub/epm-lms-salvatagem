import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MISSIONS } from '../data/missionsData';
import { INSTRUCTOR_NOTES } from '../data/instructorNotesData';
import { realtimeEngine } from '../lib/realtimeEngine';
import { soundManager } from '../lib/soundEffects';
import { authManager } from '../lib/authManager';
import {
  Monitor,
  Tv,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  AlertOctagon,
  Film,
  Zap,
  Trophy,
  HelpCircle,
  Moon,
  Maximize,
  Minimize,
  Sliders,
  CheckCircle,
  Layers,
  MessageSquare,
  Lock,
  ArrowRight,
  Shield,
  FileText,
  Keyboard,
  X
} from 'lucide-react';
import LeaderboardView from '../components/telao/LeaderboardView';
import InstructorTimerPanel from '../components/apresentador/InstructorTimerPanel';
import InstructorNotesPanel from '../components/apresentador/InstructorNotesPanel';
import InstructorDynamicsModal from '../components/apresentador/InstructorDynamicsModal';
import InstructorDoubtsPanel from '../components/apresentador/InstructorDoubtsPanel';
import SessionReportModal from '../components/apresentador/SessionReportModal';

export default function ApresentadorPage({ roomCode = 'EPM2026', onBackHome }) {
  // Autenticação por PIN do Instrutor (M16)
  const [isAuthenticated, setIsAuthenticated] = useState(() => authManager.isAuthenticated());
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(null);

  const [data, setData] = useState({
    state: realtimeEngine.state,
    participantes: realtimeEngine.participantes,
    respostas: realtimeEngine.respostas,
    duvidas: realtimeEngine.duvidas
  });

  // Janela do projetor aberta (2ª tela)
  const projetorWindowRef = useRef(null);
  const [isProjetorOpen, setIsProjetorOpen] = useState(false);

  // Relógio e Cronômetro
  const [currentTime, setCurrentTime] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Modais do Apresentador
  const [activeModal, setActiveModal] = useState(null); // 'dinamicas', 'duvidas', 'videos', 'relatorio', 'atalhos', 'placar'

  // Anotações Pessoais
  const [personalNotes, setPersonalNotes] = useState({});

  useEffect(() => {
    if (!isAuthenticated) return;

    realtimeEngine.init(roomCode);
    const unsubscribe = realtimeEngine.subscribe((snapshot) => {
      setData(snapshot);
    });

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const clockTimer = setInterval(updateClock, 1000);

    try {
      const saved = localStorage.getItem(`epm_instructor_notes_${roomCode}`);
      if (saved) setPersonalNotes(JSON.parse(saved));
    } catch (e) {}

    return () => {
      unsubscribe();
      clearInterval(clockTimer);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [roomCode, isAuthenticated]);

  // Cronômetro
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

  // Dados da Missão Atual
  const currentMission = MISSIONS.find((m) => m.id === data.state.missaoAtual) || MISSIONS[0];
  const slides = currentMission.slidesImages || [];
  const totalSlides = slides.length;
  const currentSlideIndex = Math.min(Math.max(data.state.slideAtualIndex || 0, 0), totalSlides - 1);
  const nextSlideIndex = currentSlideIndex < totalSlides - 1 ? currentSlideIndex + 1 : null;

  const missionKey = data.state.missaoAtual === 1 ? 'dia08' : data.state.missaoAtual === 2 ? 'dia09' : 'dia10';
  const currentSlideNotes = INSTRUCTOR_NOTES[missionKey]?.[currentSlideIndex + 1];

  // Navegação
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

  // Janela do Projetor
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

  useEffect(() => {
    const checkClosed = setInterval(() => {
      if (projetorWindowRef.current) {
        setIsProjetorOpen(!projetorWindowRef.current.closed);
      }
    }, 1500);
    return () => clearInterval(checkClosed);
  }, []);

  // Atalhos de Teclado & Clicker USB
  useEffect(() => {
    const handleKeyDown = (e) => {
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
        if (data.state.videoAtivoId) {
          realtimeEngine.closeVideo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleBlackout, goToSlide, totalSlides, data.state.videoAtivoId]);

  const handleSavePersonalNotes = (slideIdx, text) => {
    const key = `${missionKey}_${slideIdx + 1}`;
    const updated = { ...personalNotes, [key]: text };
    setPersonalNotes(updated);
    try {
      localStorage.setItem(`epm_instructor_notes_${roomCode}`, JSON.stringify(updated));
    } catch (e) {}
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const res = authManager.verifyPin(inputPin);
    if (res.success) {
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      setPinError(res.error);
    }
  };

  // Se não estiver autenticado, exibe Tela Tática de PIN (M16)
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #0f2b48 0%, #040c17 100%)',
        padding: '20px'
      }}>
        <div className="naval-card naval-card-glow-gold" style={{
          maxWidth: '440px',
          width: '100%',
          padding: '36px',
          background: 'rgba(10, 25, 44, 0.95)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--gold-marinha-glow)',
            border: '2px solid var(--gold-marinha)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-marinha)',
            margin: '0 auto 16px'
          }}>
            <Lock size={28} />
          </div>

          <span className="tag-badge tag-badge-gold" style={{ marginBottom: '10px' }}>
            ACESSO RESTRITO — COCKPIT DO APRESENTADOR
          </span>

          <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '8px 0 4px' }}>
            AUTENTICAÇÃO NAVAL
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Digite o PIN tático de instrução para comandar a sala <strong>{roomCode}</strong>.
          </p>

          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <input
                type="password"
                maxLength={8}
                required
                autoFocus
                placeholder="PIN (Ex: 1982)"
                value={inputPin}
                onChange={(e) => {
                  setInputPin(e.target.value);
                  if (pinError) setPinError(null);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(7, 22, 44, 0.9)',
                  border: pinError ? '1px solid var(--solas-red)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  color: 'var(--gold-marinha)',
                  fontFamily: 'var(--font-tactical)',
                  fontSize: '1.6rem',
                  letterSpacing: '6px',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
              {pinError && (
                <div style={{ marginTop: '8px', color: 'var(--solas-red)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {pinError}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {onBackHome && (
                <button
                  type="button"
                  onClick={onBackHome}
                  className="btn-tactical btn-outline"
                  style={{ flex: 1, padding: '12px' }}
                >
                  VOLTAR
                </button>
              )}
              <button
                type="submit"
                className="btn-tactical btn-gold"
                style={{ flex: 2, padding: '12px', fontSize: '0.95rem' }}
              >
                <span>DESBLOQUEAR COCKPIT</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#040c17',
      color: '#fff'
    }}>
      {/* Barra de Controle Superior do Cockpit */}
      <header style={{
        background: 'rgba(7, 22, 44, 0.95)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onBackHome && (
            <button
              onClick={onBackHome}
              className="btn-tactical btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              VOLTAR AO INÍCIO
            </button>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.7rem' }}>
                COCKPIT DO INSTRUTOR
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                SALA: <strong style={{ color: 'var(--primary-cyan)' }}>{roomCode}</strong>
              </span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {currentMission.titulo}
            </div>
          </div>
        </div>

        {/* Relógio e Cronômetro Modular (M11) */}
        <InstructorTimerPanel
          currentTime={currentTime}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          onStartTimer={startTimer}
          onPauseTimer={pauseTimer}
          onResetTimer={resetTimer}
        />

        {/* Ações Táticas Rápidas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botão Janela do Projetor */}
          <button
            onClick={openProjetorWindow}
            className="btn-tactical btn-outline"
            style={{
              padding: '8px 14px',
              fontSize: '0.84rem',
              borderColor: isProjetorOpen ? 'var(--tactical-green)' : 'var(--primary-cyan)',
              color: isProjetorOpen ? 'var(--tactical-green)' : 'var(--primary-cyan)'
            }}
            title="Abrir a 2ª Tela para o Projetor / Telão da Sala"
          >
            <Tv size={16} />
            <span>{isProjetorOpen ? 'Projetor Ativo (2ª Tela)' : 'Abrir Tela Projetor'}</span>
          </button>

          {/* Botão Relatório Final (M12) */}
          <button
            onClick={() => setActiveModal('relatorio')}
            className="btn-tactical btn-gold"
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
            title="Exibir Relatório Oficial de Desempenho e Exportar PDF"
          >
            <FileText size={16} />
            <span>Relatório da Sessão</span>
          </button>

          {/* Dúvidas Ticker */}
          <button
            onClick={() => setActiveModal('duvidas')}
            className="btn-tactical btn-outline"
            style={{ padding: '8px 12px', fontSize: '0.84rem', position: 'relative' }}
            title="Dúvidas enviadas pelos alunos"
          >
            <HelpCircle size={16} color="var(--primary-cyan)" />
            <span>Dúvidas</span>
            {data.duvidas.length > 0 && (
              <span style={{
                background: 'var(--solas-red)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                borderRadius: '10px',
                padding: '1px 6px',
                marginLeft: '4px'
              }}>
                {data.duvidas.length}
              </span>
            )}
          </button>

          {/* Atalhos de Teclado */}
          <button
            onClick={() => setActiveModal('atalhos')}
            className="btn-tactical btn-outline"
            style={{ padding: '8px 10px' }}
            title="Atalhos de Teclado"
          >
            <Keyboard size={16} />
          </button>
        </div>
      </header>

      {/* Grid Principal do Cockpit: Slide Atual, Próximo Slide, Notas e Painéis */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '16px',
        padding: '16px',
        maxWidth: '1800px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* COLUNA ESQUERDA: Slide Atual em Grande Escala + Controles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Card do Slide Atual */}
          <div className="naval-card" style={{
            padding: '16px',
            background: 'rgba(7, 22, 44, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="tag-badge tag-badge-gold">
                  TRANSMITINDO NO TELÃO
                </span>
                <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-tactical)', fontWeight: 700 }}>
                  SLIDE {currentSlideIndex + 1} DE {totalSlides}
                </span>
              </div>

              {data.state.isBlackout && (
                <span className="tag-badge tag-badge-red" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Moon size={12} /> BLACKOUT ATIVO
                </span>
              )}
            </div>

            {/* Imagem do Slide Atual com Preview de Blackout */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              background: '#000',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {slides[currentSlideIndex] ? (
                <img
                  src={slides[currentSlideIndex]}
                  alt={`Slide ${currentSlideIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: data.state.isBlackout ? 0.15 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>Slide não carregado</div>
              )}

              {data.state.isBlackout && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.7)'
                }}>
                  <Moon size={36} color="var(--solas-red)" />
                  <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.2rem', color: '#fff' }}>
                    TELA DO TELÃO APAGADA (FOCO NO INSTRUTOR)
                  </span>
                </div>
              )}
            </div>

            {/* Barra de Controles de Navegação */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                  className="btn-tactical btn-outline"
                  style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                >
                  <ChevronLeft size={18} />
                  <span>ANTERIOR</span>
                </button>

                <button
                  onClick={nextSlide}
                  disabled={currentSlideIndex === totalSlides - 1}
                  className="btn-tactical btn-cyan"
                  style={{ padding: '10px 24px', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  <span>PRÓXIMO SLIDE</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Botão Blackout */}
                <button
                  onClick={toggleBlackout}
                  className="btn-tactical btn-outline"
                  style={{
                    padding: '10px 16px',
                    borderColor: data.state.isBlackout ? 'var(--solas-red)' : 'var(--border-subtle)',
                    color: data.state.isBlackout ? 'var(--solas-red)' : '#fff'
                  }}
                  title="Apagar Tela do Telão (Tecla B)"
                >
                  <Moon size={16} />
                  <span>{data.state.isBlackout ? 'Desativar Blackout' : 'Blackout (B)'}</span>
                </button>

                {/* Botão Disparar Desafio */}
                <button
                  onClick={() => setActiveModal('dinamicas')}
                  className="btn-tactical btn-gold"
                  style={{ padding: '10px 16px', fontWeight: 700 }}
                >
                  <Zap size={16} />
                  <span>Disparar Desafio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Seletor Rápido de Missão */}
          <div className="naval-card" style={{ padding: '12px 16px', background: 'rgba(7, 22, 44, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ALTERAR MISSÃO DA SESSÃO:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {MISSIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => realtimeEngine.setMission(m.id)}
                  className="btn-tactical"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    background: data.state.missaoAtual === m.id ? 'var(--gold-marinha)' : 'rgba(15, 35, 61, 0.6)',
                    color: data.state.missaoAtual === m.id ? '#040c17' : '#fff',
                    borderColor: data.state.missaoAtual === m.id ? 'var(--gold-marinha)' : 'var(--border-subtle)',
                    fontWeight: data.state.missaoAtual === m.id ? 700 : 400
                  }}
                >
                  {m.codigo}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Preview do Próximo Slide + Notas Pedagógicas Modulares (M11) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Card do Próximo Slide (Preview) */}
          <div className="naval-card" style={{ padding: '14px', background: 'rgba(7, 22, 44, 0.85)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                PRÓXIMO SLIDE (PREVIEW INSTRUTOR):
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)' }}>
                {nextSlideIndex !== null ? `Slide ${nextSlideIndex + 1}` : 'Fim da Missão'}
              </span>
            </div>

            <div style={{
              width: '100%',
              aspectRatio: '16 / 9',
              background: '#040c17',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {nextSlideIndex !== null && slides[nextSlideIndex] ? (
                <img
                  src={slides[nextSlideIndex]}
                  alt={`Próximo Slide ${nextSlideIndex + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ fontSize: '0.84rem', color: 'var(--text-dim)' }}>
                  Último slide da missão
                </div>
              )}
            </div>
          </div>

          {/* Painel de Anotações do Slide Modularizado (M11) */}
          <InstructorNotesPanel
            currentSlideIndex={currentSlideIndex}
            currentMission={currentMission}
            slideNotes={currentSlideNotes}
            personalNotes={personalNotes}
            onSavePersonalNotes={(idx, val) => handleSavePersonalNotes(val)}
          />
        </div>
      </main>

      {/* MODAL DE DISPARO DE DINÂMICAS (M11) */}
      <InstructorDynamicsModal
        isOpen={activeModal === 'dinamicas'}
        onClose={() => setActiveModal(null)}
        dinamicas={currentMission.dinamicas}
        dinamicaAtiva={data.state.dinamicaAtiva}
        perguntaAtiva={data.state.perguntaAtiva}
        onTriggerDynamic={(din, tempo) => {
          soundManager.playSonarPing();
          realtimeEngine.triggerDynamic(din, tempo);
        }}
        onCloseDynamic={() => {
          realtimeEngine.closeDynamic();
        }}
      />

      {/* MODAL DE DÚVIDAS DOS MARINHEIROS (M11) */}
      <InstructorDoubtsPanel
        isOpen={activeModal === 'duvidas'}
        onClose={() => setActiveModal(null)}
        duvidas={data.duvidas}
        onDeleteDoubt={(id) => realtimeEngine.deleteDoubt(id)}
        onClearDoubts={() => realtimeEngine.clearDoubts()}
      />

      {/* MODAL DE RELATÓRIO FINAL DA SESSÃO (M12) */}
      <SessionReportModal
        isOpen={activeModal === 'relatorio'}
        onClose={() => setActiveModal(null)}
        roomCode={roomCode}
        participantes={data.participantes}
        respostas={data.respostas}
        currentMission={currentMission}
      />

      {/* MODAL DE ATALHOS DE TECLADO */}
      {activeModal === 'atalhos' && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(4, 12, 23, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="naval-card naval-card-glow-cyan" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            background: 'rgba(10, 25, 44, 0.98)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-tactical)' }}>
                ATALHOS DE TECLADO & CLICKER USB
              </h3>
              <button onClick={() => setActiveModal(null)} className="btn-tactical btn-outline" style={{ padding: '6px' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Avançar Slide:</span>
                <kbd style={{ background: '#07162c', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary-cyan)' }}>Seta Direita / PageDown / Espaço</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Recuar Slide:</span>
                <kbd style={{ background: '#07162c', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary-cyan)' }}>Seta Esquerda / PageUp</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Blackout Telão:</span>
                <kbd style={{ background: '#07162c', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary-cyan)' }}>Tecla B ou .</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Primeiro / Último Slide:</span>
                <kbd style={{ background: '#07162c', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary-cyan)' }}>Home / End</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fechar Modais / Vídeo:</span>
                <kbd style={{ background: '#07162c', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary-cyan)' }}>Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
