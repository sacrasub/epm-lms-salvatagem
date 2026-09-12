import React, { useState } from 'react';
import { MISSIONS } from '../../data/missionsData';
import { BADGES, calcularPatente } from '../../data/badgesData';
import QuizCard from './QuizCard';
import MochilaSalvamento from './MochilaSalvamento';
import DoubtInput from './DoubtInput';
import ManuaisGuiaBolsoViewer from './ManuaisGuiaBolsoViewer';
import ReviewModal from './ReviewModal';
import CertificateGenerator from './CertificateGenerator';
import ScenarioSimulation from './ScenarioSimulation';
import PeerDiscussionModal from './PeerDiscussionModal';
import { 
  Zap, 
  Briefcase, 
  HelpCircle, 
  BookOpen, 
  Radio, 
  CheckCircle,
  AlertTriangle,
  Compass,
  Award,
  Users,
  Layers,
  FileCheck
} from 'lucide-react';

export default function AlunoHUD({
  state,
  aluno,
  onAnswerSubmit,
  onSendDoubt,
  respostas = []
}) {
  const [activeTab, setActiveTab] = useState('sala'); // 'sala', 'mochila', 'duvidas', 'manuais', 'simulador'
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isPeerOpen, setIsPeerOpen] = useState(false);

  const currentMission = MISSIONS.find(m => m.id === state.missaoAtual) || MISSIONS[0];
  const currentBadge = BADGES.find(b => b.id === currentMission.badgeId);
  const patente = calcularPatente(aluno.xp || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '580px', margin: '0 auto', padding: '12px' }}>
      
      {/* Barra de Status Naval do Aluno */}
      <div className="naval-card naval-card-glow-cyan" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '1.6rem' }}>{patente.icone}</div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              {aluno.nome}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {patente.nome}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-tactical)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-cyan)', lineHeight: 1.1 }}>
            {aluno.xp || 0} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>XP</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--gold-marinha)' }}>
            🏅 {(aluno.badges || []).length} Medalhas
          </div>
        </div>
      </div>

      {/* Ações Rápidas do Marinheiro: Revisão e Certificado (M15, M19) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          onClick={() => setIsReviewOpen(true)}
          className="btn-tactical btn-outline"
          style={{ padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}
        >
          <FileCheck size={15} color="var(--primary-cyan)" />
          <span>Caderno de Revisão</span>
        </button>

        <button
          onClick={() => setIsCertOpen(true)}
          className="btn-tactical btn-gold"
          style={{ padding: '8px 12px', fontSize: '0.8rem', justifyContent: 'center' }}
        >
          <Award size={15} />
          <span>Certificado Digital</span>
        </button>
      </div>

      {/* Navegação por Abas Ergonômicas (Toque no Celular) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
        <button
          onClick={() => setActiveTab('sala')}
          className="naval-card"
          style={{
            padding: '8px 2px',
            textAlign: 'center',
            cursor: 'pointer',
            background: activeTab === 'sala' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(10, 25, 44, 0.6)',
            border: activeTab === 'sala' ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Zap size={15} color={activeTab === 'sala' ? 'var(--primary-cyan)' : 'var(--text-muted)'} />
          <span style={{ fontSize: '0.66rem', fontWeight: 700, fontFamily: 'var(--font-tactical)', color: activeTab === 'sala' ? '#fff' : 'var(--text-muted)' }}>
            SALA
          </span>
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className="naval-card"
          style={{
            padding: '8px 2px',
            textAlign: 'center',
            cursor: 'pointer',
            background: activeTab === 'simulador' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(10, 25, 44, 0.6)',
            border: activeTab === 'simulador' ? '1px solid var(--tactical-green)' : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Compass size={15} color={activeTab === 'simulador' ? 'var(--tactical-green)' : 'var(--text-muted)'} />
          <span style={{ fontSize: '0.66rem', fontWeight: 700, fontFamily: 'var(--font-tactical)', color: activeTab === 'simulador' ? '#fff' : 'var(--text-muted)' }}>
            SIMULADOR
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mochila')}
          className="naval-card"
          style={{
            padding: '8px 2px',
            textAlign: 'center',
            cursor: 'pointer',
            background: activeTab === 'mochila' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(10, 25, 44, 0.6)',
            border: activeTab === 'mochila' ? '1px solid var(--gold-marinha)' : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Briefcase size={15} color={activeTab === 'mochila' ? 'var(--gold-marinha)' : 'var(--text-muted)'} />
          <span style={{ fontSize: '0.66rem', fontWeight: 700, fontFamily: 'var(--font-tactical)', color: activeTab === 'mochila' ? '#fff' : 'var(--text-muted)' }}>
            MOCHILA
          </span>
        </button>

        <button
          onClick={() => setActiveTab('duvidas')}
          className="naval-card"
          style={{
            padding: '8px 2px',
            textAlign: 'center',
            cursor: 'pointer',
            background: activeTab === 'duvidas' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(10, 25, 44, 0.6)',
            border: activeTab === 'duvidas' ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <HelpCircle size={15} color={activeTab === 'duvidas' ? 'var(--primary-cyan)' : 'var(--text-muted)'} />
          <span style={{ fontSize: '0.66rem', fontWeight: 700, fontFamily: 'var(--font-tactical)', color: activeTab === 'duvidas' ? '#fff' : 'var(--text-muted)' }}>
            DÚVIDAS
          </span>
        </button>

        <button
          onClick={() => setActiveTab('manuais')}
          className="naval-card"
          style={{
            padding: '8px 2px',
            textAlign: 'center',
            cursor: 'pointer',
            background: activeTab === 'manuais' ? 'rgba(0, 229, 255, 0.2)' : 'rgba(10, 25, 44, 0.6)',
            border: activeTab === 'manuais' ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <BookOpen size={15} color={activeTab === 'manuais' ? 'var(--primary-cyan)' : 'var(--text-muted)'} />
          <span style={{ fontSize: '0.66rem', fontWeight: 700, fontFamily: 'var(--font-tactical)', color: activeTab === 'manuais' ? '#fff' : 'var(--text-muted)' }}>
            MANUAIS
          </span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA SELECIONADA */}

      {/* 1. ABA SALA AO VIVO */}
      {activeTab === 'sala' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Se houver DINÂMICA ATIVA disparada pelo Instrutor, o Quiz toma conta da tela */}
          {state.dinamicaAtiva && state.perguntaAtiva ? (
            <QuizCard
              pergunta={state.perguntaAtiva}
              timerFim={state.timerFim}
              alunoNome={aluno.nome}
              currentXP={aluno.xp}
              badgeMissao={currentBadge}
              onAnswerSubmit={(opcaoId, correta, xpGanho, newBadge) => {
                onAnswerSubmit(aluno.nome, state.perguntaAtiva.id, opcaoId, correta, xpGanho, newBadge);
              }}
            />
          ) : (
            /* Modo Acompanhamento Normal (Sem texto redundante) */
            <div className="naval-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span className="tag-badge tag-badge-gold">
                  {currentMission.codigo}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-muted)' }}>SLIDE ATUAL:</span>
                  <span style={{ background: 'rgba(0, 229, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-cyan-glow)' }}>
                    {(state.slideAtualIndex || 0) + 1} / {currentMission.slidesCount || 12}
                  </span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, lineHeight: 1.3 }}>
                {currentMission.titulo}
              </h2>

              {/* Medalha em Disputa na Missão Atual */}
              {currentBadge && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px'
                }}>
                  <div style={{ fontSize: '1.6rem' }}>{currentBadge.icone}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gold-marinha)', fontWeight: 700, textTransform: 'uppercase' }}>
                      MEDALHA EM DISPUTA NESTA ETAPA:
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                      {currentBadge.titulo}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currentBadge.criterio}
                    </div>
                  </div>
                </div>
              )}

              {/* Status do que está passando no Telão */}
              <div style={{
                background: 'rgba(7, 22, 44, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  ATIVIDADE EM ANDAMENTO NO TELÃO:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>
                  <Radio size={16} className="animate-pulse" />
                  <span>
                    {state.isBlackout
                      ? 'Blackout Tático — Atenção ao Instrutor'
                      : state.tipoConteudo === 'slides'
                      ? `Exibição de Slides Táticos (Slide ${(state.slideAtualIndex || 0) + 1} de ${currentMission.slidesCount || 12})`
                      : state.tipoConteudo === 'storytelling'
                      ? 'Apresentação do Cenário de Emergência Real'
                      : state.tipoConteudo === 'video'
                      ? `Exibição de Vídeo Microlearning: ${currentMission.videos?.find(v => v.id === state.videoAtivoId)?.titulo || 'Vídeo Tático de Instrução'}`
                      : state.tipoConteudo === 'esquema'
                      ? 'Análise de Esquemas Visuais & Regras de Ouro'
                      : state.tipoConteudo === 'dinamica'
                      ? 'Aguardando Disparo de Desafio Tático'
                      : 'Sessão Interativa Sincronizada'}
                  </span>
                </div>
              </div>

              {/* Esquema Visual Interativo de Bolso */}
              <div>
                <h4 style={{ fontFamily: 'var(--font-tactical)', fontSize: '1rem', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
                  ESQUEMA DE APOIO RÁPIDO (SEM REDUNDÂNCIA)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentMission.esquemasVisuais.map(esq => (
                    <div key={esq.id} style={{ background: 'rgba(15, 35, 61, 0.6)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', marginBottom: '6px' }}>
                        {esq.titulo}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#ff9ba5' }}>
                        <strong>Regra de Ouro:</strong> {esq.regraOuro}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dica de engajamento */}
              <div style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(0, 229, 255, 0.05)',
                border: '1px dashed rgba(0, 229, 255, 0.3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}>
                Fique atento ao Telão. Quando o instrutor disparar o Desafio Tático, este terminal vibrará para sua tomada de decisão imediata.
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ABA SIMULADOR TÁTICO (M17) */}
      {activeTab === 'simulador' && (
        <ScenarioSimulation
          alunoNome={aluno.nome}
          onRewardXP={(xp) => {
            onAnswerSubmit(aluno.nome, 'simulador_cenario', 'correto', true, xp, null);
          }}
        />
      )}

      {/* 3. ABA MOCHILA */}
      {activeTab === 'mochila' && (
        <MochilaSalvamento xp={aluno.xp} badges={aluno.badges} alunoNome={aluno.nome} />
      )}

      {/* 4. ABA DÚVIDAS */}
      {activeTab === 'duvidas' && (
        <DoubtInput alunoNome={aluno.nome} onSendDoubt={onSendDoubt} />
      )}

      {/* 5. ABA MANUAIS E GUIA DE BOLSO (DOWNLOADS) */}
      {activeTab === 'manuais' && (
        <ManuaisGuiaBolsoViewer currentMissionId={state.missaoAtual} />
      )}

      {/* MODAL DE REVISÃO DE QUESTÕES (M15) */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        alunoNome={aluno.nome}
        respostas={respostas}
      />

      {/* MODAL DE CERTIFICADO DIGITAL OFICIAL (M19) */}
      <CertificateGenerator
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        aluno={aluno}
        roomCode={state.roomCode || 'EPM2026'}
      />

      {/* MODAL DE DEBATE ENTRE PARES - PEER INSTRUCTION (M20) */}
      <PeerDiscussionModal
        isOpen={isPeerOpen || (state.dinamicaAtiva && state.perguntaAtiva?.tipo === 'peer_instruction')}
        onClose={() => setIsPeerOpen(false)}
        alunoNome={aluno.nome}
        partnerName="Grumete de Bordo"
        pergunta={state.perguntaAtiva}
      />

    </div>
  );
}
