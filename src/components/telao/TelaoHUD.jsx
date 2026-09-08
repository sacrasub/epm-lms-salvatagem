import React, { useState } from 'react';
import { MISSIONS } from '../../data/missionsData';
import { BADGES } from '../../data/badgesData';
import VideoPlayerPill from './VideoPlayerPill';
import TimerClock from './TimerClock';
import LeaderboardView from './LeaderboardView';
import DoubtTicker from './DoubtTicker';
import SlidePresenter from './SlidePresenter';
import { soundManager } from '../../lib/soundEffects';
import { 
  Play, 
  Send, 
  CheckCircle, 
  Layers, 
  Compass, 
  AlertOctagon, 
  Radio, 
  ChevronRight, 
  ChevronLeft,
  Eye,
  FileText,
  Presentation
} from 'lucide-react';

export default function TelaoHUD({
  state,
  participantes,
  respostas,
  duvidas,
  onSetMission,
  onSetEtapa,
  onTriggerDynamic,
  onCloseDynamic
}) {
  const currentMission = MISSIONS.find(m => m.id === state.missaoAtual) || MISSIONS[0];
  const currentBadge = BADGES.find(b => b.id === currentMission.badgeId);
  const [selectedVideo, setSelectedVideo] = useState(currentMission.videos[0]);
  const [showAnswerResults, setShowAnswerResults] = useState(false);

  // Altera a missão
  const handleSelectMission = (id) => {
    onSetMission(id);
    const m = MISSIONS.find(item => item.id === id);
    if (m && m.videos.length > 0) {
      setSelectedVideo(m.videos[0]);
    }
    setShowAnswerResults(false);
  };

  // Dispara o alarme geral de emergência com áudio SOLAS
  const handleSoundAlarm = () => {
    soundManager.playSolasAlarm();
  };

  // Dispara a dinâmica no celular de todos os alunos
  const handleLaunchDynamic = (dinamica) => {
    setShowAnswerResults(false);
    soundManager.playSonarPing();
    onTriggerDynamic(dinamica, dinamica.tempoSegundos);
  };

  // Encerra a dinâmica e revela os resultados e justificativa
  const handleRevealAnswer = () => {
    setShowAnswerResults(true);
    soundManager.playSuccess();
    onCloseDynamic();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Barra de Navegação das 3 Missões */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {MISSIONS.map((m) => {
          const isSelected = m.id === currentMission.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMission(m.id)}
              className={`naval-card ${isSelected ? 'naval-card-glow-cyan' : ''}`}
              style={{
                padding: '14px 18px',
                textAlign: 'left',
                cursor: 'pointer',
                background: isSelected ? 'rgba(15, 35, 61, 0.95)' : 'rgba(10, 25, 44, 0.6)',
                border: isSelected ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ 
                  fontFamily: 'var(--font-tactical)', 
                  fontWeight: 700, 
                  fontSize: '0.95rem',
                  color: isSelected ? 'var(--primary-cyan)' : 'var(--text-muted)' 
                }}>
                  {m.codigo}
                </span>
                <span className="tag-badge" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                  {m.cargaHoraria}
                </span>
              </div>
              <div style={{ fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-muted)', fontSize: '0.95rem' }}>
                {m.titulo.split(':')[1] || m.titulo}
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid Principal: Área de Apresentação/Vídeo/Dinâmica (2/3) + Leaderboard (1/3) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '20px', minHeight: '620px' }}>
        
        {/* Coluna Esquerda: Palco de Conteúdo do Telão */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Seletor de Modos do Instrutor */}
          <div className="naval-card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="var(--primary-cyan)" />
              <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
                FASE OPERACIONAL:
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onSetEtapa(0, 'slides')}
                className={`btn-tactical ${state.tipoConteudo === 'slides' ? 'btn-gold' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                title="Apresentar Slides Oficiais em Tela Cheia com Dock Tático"
              >
                <Presentation size={15} />
                <span>0. Slides ({currentMission.dia})</span>
              </button>

              <button
                onClick={() => onSetEtapa(0, 'storytelling')}
                className={`btn-tactical ${state.tipoConteudo === 'storytelling' ? 'btn-cyan' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                1. Briefing
              </button>

              <button
                onClick={() => onSetEtapa(1, 'video', selectedVideo?.id)}
                className={`btn-tactical ${state.tipoConteudo === 'video' ? 'btn-cyan' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                2. Microlearning ({currentMission.videos.length})
              </button>

              <button
                onClick={() => onSetEtapa(2, 'esquema')}
                className={`btn-tactical ${state.tipoConteudo === 'esquema' ? 'btn-cyan' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                3. Esquemas Visuais
              </button>

              <button
                onClick={() => onSetEtapa(3, 'dinamica')}
                className={`btn-tactical ${state.tipoConteudo === 'dinamica' ? 'btn-danger' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                4. Dinâmica Tática
              </button>
            </div>
          </div>

          {/* PALCO CENTRAL CONFORME O TIPO DE CONTEÚDO */}

          {/* 0. MODO SLIDES EXPOSITIVOS OFICIAIS COM DOCK TÁTICO */}
          {state.tipoConteudo === 'slides' && (
            <SlidePresenter
              mission={currentMission}
              participantes={participantes}
              respostas={respostas}
              duvidas={duvidas}
              state={state}
              onTriggerDynamic={onTriggerDynamic}
              onCloseDynamic={onCloseDynamic}
            />
          )}
          
          {/* 1. MODO BRIEFING / STORYTELLING */}
          {state.tipoConteudo === 'storytelling' && (
            <div className="naval-card naval-card-glow-cyan" style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
                  SITUAÇÃO DE EMERGÊNCIA MARÍTIMA
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Diretriz DPC / Convenção SOLAS
                </span>
              </div>

              <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
                {currentMission.titulo}
              </h2>

              <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '24px', background: 'rgba(7, 22, 44, 0.7)', padding: '20px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--primary-cyan)' }}>
                "{currentMission.briefing}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '2.5rem' }}>{currentBadge?.icone}</div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>MEDALHA DA MISSÃO</div>
                    <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-marinha)' }}>
                      {currentBadge?.nome}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onSetEtapa(0, 'slides')}
                    className="btn-tactical btn-gold"
                    style={{ padding: '12px 20px' }}
                    title="Apresentar Slides Oficiais em Modo Cinema / Tela Cheia"
                  >
                    <Presentation size={18} />
                    <span>APRESENTAR SLIDES ({currentMission.dia})</span>
                  </button>

                  <button
                    onClick={handleSoundAlarm}
                    className="btn-tactical btn-danger"
                    style={{ padding: '12px 20px' }}
                    title="Soar o Alarme Geral da Marinha (7 curtos e 1 longo)"
                  >
                    <AlertOctagon size={18} />
                    <span>SOAR ALARME GERAL (SOLAS)</span>
                  </button>

                  <button
                    onClick={() => onSetEtapa(1, 'video', currentMission.videos[0]?.id)}
                    className="btn-tactical btn-cyan"
                    style={{ padding: '12px 20px' }}
                  >
                    <span>PÍLULAS DE VÍDEO</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. MODO VÍDEO MICROLEARNING */}
          {state.tipoConteudo === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {/* Player do Vídeo Ativo */}
              <VideoPlayerPill video={selectedVideo} />

              {/* Seletor das 4 Pílulas da Missão */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentMission.videos.length}, 1fr)`, gap: '10px' }}>
                {currentMission.videos.map((vid, vIdx) => {
                  const isVidActive = selectedVideo?.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => setSelectedVideo(vid)}
                      className="naval-card"
                      style={{
                        padding: '10px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        background: isVidActive ? 'rgba(0, 229, 255, 0.15)' : 'rgba(10, 25, 44, 0.6)',
                        border: isVidActive ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-tactical)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                          PÍLULA {vIdx + 1}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {vid.duracao}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {vid.titulo.split(':')[1] || vid.titulo}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. MODO ESQUEMAS VISUAIS / INFOGRÁFICOS */}
          {state.tipoConteudo === 'esquema' && (
            <div className="naval-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                    ESQUEMAS TÁTICOS & REGRAS DE OURO
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    Visualização conceitual sem poluição de texto — foco na memorização visual para o mar.
                  </p>
                </div>
                <a
                  href={currentMission.infograficoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-tactical btn-outline"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Eye size={16} />
                  <span>ABRIR INFOGRÁFICO FULL-HD</span>
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
                {currentMission.esquemasVisuais.map((esq) => (
                  <div 
                    key={esq.id} 
                    style={{
                      background: 'rgba(7, 22, 44, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.2rem', color: 'var(--primary-cyan)', marginBottom: '12px' }}>
                        {esq.titulo}
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {esq.pontosChave.map((pt, pIdx) => (
                          <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                            <span style={{ color: 'var(--gold-marinha)', fontWeight: 700 }}>▸</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{
                      marginTop: '16px',
                      background: 'rgba(255, 51, 68, 0.12)',
                      border: '1px solid rgba(255, 51, 68, 0.3)',
                      borderRadius: '4px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      color: '#ff9ba5'
                    }}>
                      <strong style={{ color: 'var(--solas-red)' }}>REGRA DE OURO:</strong> {esq.regraOuro}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MODO DINÂMICA TÁTICA / QUIZ DE SALA */}
          {state.tipoConteudo === 'dinamica' && (
            <div className="naval-card naval-card-alert" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Cabeçalho da Dinâmica */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="tag-badge tag-badge-red" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
                    SITUAÇÃO SOB PRESSÃO
                  </span>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                    {state.perguntaAtiva ? state.perguntaAtiva.titulo : 'PAINEL DE DESAFIOS TÁTICOS'}
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

              {/* Se nenhuma pergunta ativa, exibe o menu de dinâmicas para o instrutor disparar */}
              {!state.perguntaAtiva ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', textAlign: 'center', marginBottom: '10px' }}>
                    Selecione qual dinâmica interativa disparar para os smartphones de todos os alunos simultaneamente:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {currentMission.dinamicas.map((din) => (
                      <div
                        key={din.id}
                        className="naval-card"
                        style={{
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          background: 'rgba(15, 35, 61, 0.85)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className="tag-badge tag-badge-gold">
                              {din.tipo === 'peer_instruction' ? 'PEER INSTRUCTION (MAZUR)' : 'DECISÃO RÁPIDA'}
                            </span>
                            <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, color: 'var(--primary-cyan)' }}>
                              +{din.pontosXP} XP
                            </span>
                          </div>
                          <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '10px' }}>
                            {din.titulo}
                          </h4>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {din.enunciado}
                          </p>
                        </div>

                        <button
                          onClick={() => handleLaunchDynamic(din)}
                          className="btn-tactical btn-danger"
                          style={{ marginTop: '16px', width: '100%' }}
                        >
                          <Send size={16} />
                          <span>DISPARAR NO CELULAR DOS ALUNOS ({din.tempoSegundos}s)</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* PERGUNTA ATIVA NO TELÃO */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ background: 'rgba(7, 22, 44, 0.8)', padding: '20px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--solas-red)', marginBottom: '16px' }}>
                    <p style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                      {state.perguntaAtiva.enunciado}
                    </p>
                  </div>

                  {/* Lista de Opções projetadas no Telão */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {state.perguntaAtiva.opcoes.map((op) => {
                      const isCorrect = op.correta;
                      const showHighlight = showAnswerResults && isCorrect;

                      return (
                        <div
                          key={op.id}
                          style={{
                            padding: '14px 18px',
                            borderRadius: 'var(--radius-sm)',
                            background: showHighlight ? 'rgba(0, 230, 118, 0.2)' : 'rgba(10, 25, 44, 0.7)',
                            border: showHighlight ? '2px solid var(--tactical-green)' : '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <span style={{
                            width: '32px',
                            height: '32px',
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
                          <span style={{ fontSize: '0.95rem', color: showHighlight ? '#fff' : 'var(--text-main)', fontWeight: showHighlight ? 700 : 400 }}>
                            {op.texto}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Justificativa Pedagógica revelada */}
                  {showAnswerResults && (
                    <div style={{
                      background: 'rgba(0, 230, 118, 0.15)',
                      border: '1px solid rgba(0, 230, 118, 0.4)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 18px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tactical-green)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                        <CheckCircle size={16} />
                        <span>JUSTIFICATIVA TÉCNICA E BASE NORMATIVA ({state.perguntaAtiva.referencia})</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff', lineHeight: 1.4 }}>
                        {state.perguntaAtiva.explicacao}
                      </p>
                    </div>
                  )}

                  {/* Controles do Instrutor */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    {!showAnswerResults ? (
                      <button
                        onClick={handleRevealAnswer}
                        className="btn-tactical btn-cyan"
                        style={{ padding: '12px 24px' }}
                      >
                        <CheckCircle size={18} />
                        <span>REVELAR GABARITO & DISTRIBUIR XP</span>
                      </button>
                    ) : (
                      <button
                        onClick={onCloseDynamic}
                        className="btn-tactical btn-outline"
                        style={{ padding: '12px 24px' }}
                      >
                        <span>VOLTAR AO PAINEL DE DESAFIOS</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ticker de Dúvidas ao Vivo no Rodapé da Coluna */}
          <DoubtTicker duvidas={duvidas} />
        </div>

        {/* Coluna Direita: Leaderboard Geral e Conquistas */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <LeaderboardView
            participantes={participantes}
            respostas={respostas}
            perguntaAtiva={state.perguntaAtiva}
          />
        </div>
      </div>
    </div>
  );
}
