import React, { useState, useRef, useEffect } from 'react';
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
  ExternalLink,
  Presentation
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'video', 'dinamica', 'leaderboard', 'infografico', 'duvidas'
  const [selectedVideo, setSelectedVideo] = useState(mission.videos[0]);
  const [showAnswerResults, setShowAnswerResults] = useState(false);

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
        height: isFullscreen ? '100vh' : '640px',
        width: '100%',
        background: '#040c17',
        overflow: 'hidden',
        border: '1px solid var(--border-glow)'
      }}
    >
      {/* Barra de Título Superior dos Slides */}
      <div style={{
        padding: '10px 18px',
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
          <h3 style={{ fontSize: '1.05rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Presentation size={18} color="var(--primary-cyan)" />
            <span>{mission.slidesTitulo}</span>
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href={mission.slidesPdf}
            download
            className="btn-tactical btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            title="Baixar Arquivo PDF"
          >
            <Download size={14} />
            <span>PDF</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="btn-tactical btn-cyan"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            title="Alternar Tela Cheia (F11)"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? 'REDUZIR' : 'TELA CHEIA (CINEMA)'}</span>
          </button>
        </div>
      </div>

      {/* Visualizador dos Slides (PDF Embed Nativo de Alta Definição) */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', background: '#1e1e1e' }}>
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
      </div>

      {/* DOCK TÁTICO FLUTUANTE (Floating Quick-Action Dock) */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(7, 22, 44, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-glow)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 229, 255, 0.25)',
        borderRadius: '999px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 50
      }}>
        {/* 1. Botão Soar Alarme Geral SOLAS */}
        <button
          onClick={handleAlarm}
          className="btn-tactical btn-danger"
          style={{ padding: '8px 16px', borderRadius: '999px', fontSize: '0.85rem' }}
          title="Soar Alarme Geral SOLAS (7 toques curtos e 1 longo)"
        >
          <AlertOctagon size={16} />
          <span style={{ display: isFullscreen ? 'inline' : 'none' }}>ALARME SOLAS</span>
        </button>

        {/* 2. Botão Pílulas de Vídeo Microlearning */}
        <button
          onClick={() => setActiveModal('video')}
          className="btn-tactical btn-outline"
          style={{ padding: '8px 16px', borderRadius: '999px', fontSize: '0.85rem' }}
          title="Lançar Pílula de Vídeo (≤ 7 min)"
        >
          <Film size={16} color="var(--primary-cyan)" />
          <span>VÍDEOS ({mission.videos.length})</span>
        </button>

        {/* 3. Botão Disparar Desafio Tático / Quiz */}
        <button
          onClick={() => setActiveModal('dinamica')}
          className="btn-tactical btn-gold"
          style={{ padding: '8px 16px', borderRadius: '999px', fontSize: '0.85rem' }}
          title="Disparar Pergunta no Smartphone dos Alunos"
        >
          <Zap size={16} />
          <span>DESAFIO TÁTICO</span>
        </button>

        {/* 4. Botão Placar de Líderes */}
        <button
          onClick={() => setActiveModal('leaderboard')}
          className="btn-tactical btn-outline"
          style={{ padding: '8px 14px', borderRadius: '999px', fontSize: '0.85rem' }}
          title="Abrir Placar de Líderes da Turma"
        >
          <Trophy size={16} color="var(--gold-marinha)" />
          <span style={{ display: isFullscreen ? 'inline' : 'none' }}>PLACAR</span>
        </button>

        {/* 5. Botão Infográfico Técnico */}
        <button
          onClick={() => setActiveModal('infografico')}
          className="btn-tactical btn-outline"
          style={{ padding: '8px 14px', borderRadius: '999px', fontSize: '0.85rem' }}
          title="Visualizar Infográfico Técnico DPC"
        >
          <ImageIcon size={16} color="var(--primary-cyan)" />
          <span style={{ display: isFullscreen ? 'inline' : 'none' }}>INFOGRÁFICO</span>
        </button>

        {/* 6. Botão Sinalizador de Dúvidas */}
        <button
          onClick={() => setActiveModal('duvidas')}
          className="btn-tactical btn-outline"
          style={{ 
            padding: '8px 14px', 
            borderRadius: '999px', 
            fontSize: '0.85rem',
            position: 'relative'
          }}
          title="Dúvidas enviadas pelos alunos pelo celular"
        >
          <HelpCircle size={16} color="var(--primary-cyan)" />
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
          <span style={{ display: isFullscreen ? 'inline' : 'none' }}>DÚVIDAS</span>
        </button>

        {/* 7. Botão Tela Cheia no Dock */}
        <button
          onClick={toggleFullscreen}
          className="btn-tactical btn-outline"
          style={{ padding: '8px 12px', borderRadius: '999px' }}
          title="Alternar Tela Cheia"
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>

      {/* ========================================================
          MODAIS OVERLAY INTEGRADOS (SEM SAIR DA APRESENTAÇÃO)
          ======================================================== */}

      {/* MODAL 1: PÍLULAS DE VÍDEO MICROLEARNING */}
      {activeModal === 'video' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 10, 20, 0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 100
        }}>
          <div style={{ width: '100%', maxWidth: '960px', position: 'relative' }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.95rem'
              }}
            >
              <span>FECHAR E VOLTAR AOS SLIDES</span>
              <X size={20} />
            </button>

            <VideoPlayerPill video={selectedVideo} />

            {/* Seletor rápido das pílulas */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mission.videos.length}, 1fr)`, gap: '10px', marginTop: '12px' }}>
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
                      background: isActive ? 'rgba(0, 229, 255, 0.2)' : 'rgba(10, 25, 44, 0.7)',
                      border: isActive ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: 700 }}>
                      PÍLULA {idx + 1} ({vid.duracao})
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {vid.titulo.split(':')[1] || vid.titulo}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SELETOR DE DESAFIOS TÁTICOS */}
      {activeModal === 'dinamica' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 10, 20, 0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 100
        }}>
          <div style={{ width: '100%', maxWidth: '850px', position: 'relative' }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.95rem'
              }}
            >
              <span>FECHAR E VOLTAR AOS SLIDES</span>
              <X size={20} />
            </button>

            <div className="naval-card naval-card-alert" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
                DISPARAR DESAFIO TÁTICO NO SMARTPHONE DOS ALUNOS
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Selecione o teste formativo para enviar diretamente para a tela de todos os alunos da turma:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {mission.dinamicas.map((din) => (
                  <div
                    key={din.id}
                    className="naval-card"
                    style={{
                      padding: '18px',
                      background: 'rgba(15, 35, 61, 0.85)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span className="tag-badge tag-badge-gold">
                          {din.tipo === 'peer_instruction' ? 'PEER INSTRUCTION' : 'DECISÃO RÁPIDA'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                          +{din.pontosXP} XP
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', color: '#fff', margin: '8px 0' }}>
                        {din.titulo}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {din.enunciado}
                      </p>
                    </div>

                    <button
                      onClick={() => handleLaunchDynamic(din)}
                      className="btn-tactical btn-danger"
                      style={{ marginTop: '16px', width: '100%' }}
                    >
                      <Zap size={16} />
                      <span>DISPARAR AGORA ({din.tempoSegundos}s)</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DINÂMICA ATIVA COM CRONÔMETRO */}
      {activeModal === 'dinamica_ativa' && state.perguntaAtiva && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 10, 20, 0.94)',
          backdropFilter: 'blur(14px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 110
        }}>
          <div style={{ width: '100%', maxWidth: '900px', position: 'relative' }}>
            <div className="naval-card naval-card-alert" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span className="tag-badge tag-badge-red" style={{ fontSize: '0.9rem' }}>
                  DECISÃO TÁTICA EM ANDAMENTO NO SMARTPHONE
                </span>

                <TimerClock 
                  timerFim={state.timerFim} 
                  isActive={state.dinamicaAtiva} 
                  onExpire={handleRevealAnswer}
                />
              </div>

              <h3 style={{ fontSize: '1.4rem', color: '#fff', lineHeight: 1.4, marginBottom: '20px' }}>
                {state.perguntaAtiva.enunciado}
              </h3>

              {/* Opções */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {state.perguntaAtiva.opcoes.map((op) => {
                  const showHighlight = showAnswerResults && op.correta;
                  return (
                    <div
                      key={op.id}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-sm)',
                        background: showHighlight ? 'rgba(0, 230, 118, 0.25)' : 'rgba(10, 25, 44, 0.7)',
                        border: showHighlight ? '2px solid var(--tactical-green)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: showHighlight ? 'var(--tactical-green)' : '#163252',
                        color: showHighlight ? '#040c17' : '#fff',
                        fontFamily: 'var(--font-tactical)',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {op.id}
                      </span>
                      <span style={{ fontSize: '0.95rem', color: '#fff' }}>
                        {op.texto}
                      </span>
                    </div>
                  );
                })}
              </div>

              {showAnswerResults && (
                <div style={{
                  background: 'rgba(0, 230, 118, 0.15)',
                  border: '1px solid var(--tactical-green)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  marginBottom: '20px'
                }}>
                  <strong style={{ color: 'var(--tactical-green)' }}>GABARITO SOLAS / DPC: </strong>
                  <span style={{ color: '#fff', fontSize: '0.92rem' }}>{state.perguntaAtiva.explicacao}</span>
                </div>
              )}

              {/* Botões de Ação */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                {!showAnswerResults ? (
                  <button
                    onClick={handleRevealAnswer}
                    className="btn-tactical btn-cyan"
                    style={{ padding: '12px 24px' }}
                  >
                    REVELAR RESPOSTA & DISTRIBUIR XP
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      onCloseDynamic();
                    }}
                    className="btn-tactical btn-gold"
                    style={{ padding: '12px 24px' }}
                  >
                    RETOMAR APRESENTAÇÃO DE SLIDES
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: LEADERBOARD OVERLAY */}
      {activeModal === 'leaderboard' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 10, 20, 0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 100
        }}>
          <div style={{ width: '100%', maxWidth: '620px', position: 'relative' }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-tactical)',
                fontSize: '0.95rem'
              }}
            >
              <span>FECHAR E VOLTAR AOS SLIDES</span>
              <X size={20} />
            </button>

            <LeaderboardView
              participantes={participantes}
              respostas={respostas}
              perguntaAtiva={state.perguntaAtiva}
            />
          </div>
        </div>
      )}

      {/* MODAL 5: INFOGRÁFICO DE APOIO */}
      {activeModal === 'infografico' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 10, 20, 0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 100
        }}>
          <div style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>
                {mission.infograficoTitulo}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-tactical)',
                  fontSize: '0.95rem'
                }}
              >
                <span>VOLTAR AOS SLIDES</span>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', textAlign: 'center', background: '#000', borderRadius: '8px', padding: '10px' }}>
              <img
                src={mission.infograficoUrl}
                alt={mission.infograficoTitulo}
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '75vh', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: PAINEL DE DÚVIDAS */}
      {activeModal === 'duvidas' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 10, 20, 0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 100
        }}>
          <div className="naval-card" style={{ width: '100%', maxWidth: '640px', padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                DÚVIDAS RECEBIDAS DOS SMARTPHONES ({duvidas.length})
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '60vh', overflowY: 'auto' }}>
              {duvidas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                  Nenhuma dúvida pendente no momento.
                </div>
              ) : (
                duvidas.map((d) => (
                  <div key={d.id} style={{ background: 'rgba(15, 35, 61, 0.8)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem' }}>{d.aluno}</strong>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{d.timestamp}</span>
                    </div>
                    <p style={{ margin: 0, color: '#fff', fontSize: '0.95rem' }}>"{d.texto}"</p>
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
