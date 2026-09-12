import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../lib/soundEffects';
import { CheckCircle2, XCircle, Clock, Zap, Award } from 'lucide-react';

export default function QuizCard({
  pergunta,
  timerFim,
  alunoNome,
  onAnswerSubmit,
  currentXP,
  badgeMissao
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pergunta.tempoSegundos || 40);
  const [isCorrect, setIsCorrect] = useState(null);
  const [earnedXP, setEarnedXP] = useState(0);

  // Vibração tátil no celular quando a pergunta chega
  useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 80, 100]);
      } catch (e) {}
    }
  }, [pergunta.id]);

  // Contagem regressiva
  useEffect(() => {
    if (!timerFim) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.ceil((timerFim - Date.now()) / 1000));
      setTimeLeft(diff);

      if (diff === 0 && !hasSubmitted) {
        clearInterval(interval);
        handleSubmitAnswer(null); // tempo esgotado
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerFim, hasSubmitted]);

  const handleSelect = (opId) => {
    if (hasSubmitted) return;
    setSelectedOption(opId);
  };

  const handleSubmitAnswer = (chosenId = selectedOption) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);

    const optionObj = pergunta.opcoes.find(o => o.id === chosenId);
    const correct = Boolean(optionObj && optionObj.correta);
    setIsCorrect(correct);

    let xp = 0;
    let newBadge = null;

    if (correct) {
      // Bônus por velocidade
      const speedBonus = timeLeft > 20 ? 50 : 0;
      xp = (pergunta.pontosXP || 100) + speedBonus;
      setEarnedXP(xp);
      soundManager.playSuccess();

      // Desbloqueia badge da missão se aplicável
      if (badgeMissao) {
        newBadge = badgeMissao.id;
      }

      // Efeito de confete tático
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      soundManager.playBuzzer();
    }

    onAnswerSubmit(chosenId, correct, xp, newBadge);
  };

  return (
    <div className="naval-card naval-card-alert" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: 'rgba(10, 25, 44, 0.95)'
    }}>
      {/* Cabeçalho da Decisão */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="tag-badge tag-badge-red" style={{ fontSize: '0.8rem' }}>
          DECISÃO TÁTICA SOB PRESSÃO
        </span>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-tactical)',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: timeLeft <= 5 ? 'var(--solas-red)' : 'var(--primary-cyan)'
        }}>
          <Clock size={16} />
          <span>00:{String(timeLeft).padStart(2, '0')}</span>
        </div>
      </div>

      <h3 style={{ fontSize: '1.15rem', color: '#fff', lineHeight: 1.4 }}>
        {pergunta.enunciado}
      </h3>

      {/* Lista de Opções de Resposta para Toque no Smartphone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {pergunta.opcoes.map((op) => {
          const isSelected = selectedOption === op.id;
          let bg = 'rgba(15, 35, 61, 0.8)';
          let borderColor = 'var(--border-subtle)';

          if (hasSubmitted) {
            if (op.correta) {
              bg = 'rgba(0, 230, 118, 0.2)';
              borderColor = 'var(--tactical-green)';
            } else if (isSelected && !op.correta) {
              bg = 'rgba(255, 51, 68, 0.2)';
              borderColor = 'var(--solas-red)';
            }
          } else if (isSelected) {
            bg = 'rgba(0, 229, 255, 0.15)';
            borderColor = 'var(--primary-cyan)';
          }

          return (
            <button
              key={op.id}
              onClick={() => handleSelect(op.id)}
              disabled={hasSubmitted}
              style={{
                background: bg,
                border: `1.5px solid ${borderColor}`,
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: hasSubmitted ? 'default' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isSelected ? 'var(--primary-cyan)' : '#163252',
                color: isSelected ? '#040c17' : '#fff',
                fontFamily: 'var(--font-tactical)',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {op.id}
              </div>
              <span style={{ fontSize: '0.92rem', color: '#fff', lineHeight: 1.35 }}>
                {op.texto}
              </span>
            </button>
          );
        })}
      </div>

      {/* Botão de Confirmação de Resposta */}
      {!hasSubmitted ? (
        <button
          onClick={() => handleSubmitAnswer()}
          disabled={!selectedOption}
          className="btn-tactical btn-cyan"
          style={{ width: '100%', padding: '14px', marginTop: '6px' }}
        >
          <Zap size={18} />
          <span>TRANSMITIR DECISÃO AO TELÃO</span>
        </button>
      ) : (
        /* Tela de Pós-Envio: Aguardando Próximo Desafio & Fundamentação Tática (M5) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: isCorrect ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 51, 68, 0.15)',
            border: `1px solid ${isCorrect ? 'var(--tactical-green)' : 'var(--solas-red)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: 'var(--font-tactical)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: isCorrect ? 'var(--tactical-green)' : 'var(--solas-red)',
              marginBottom: '6px'
            }}>
              {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              <span>{isCorrect ? `DECISÃO CORRETA! (+${earnedXP} XP)` : 'DECISÃO INCORRETA! (0 XP)'}</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '4px' }}>
              Sua resposta (Opção <strong>{selectedOption || 'Nenhuma'}</strong>) foi computada na central do Telão.
            </div>

            <div style={{
              marginTop: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(7, 22, 44, 0.8)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Saldo Atualizado:</span>
              <strong style={{ color: 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)' }}>
                {(currentXP || 0) + (isCorrect ? earnedXP : 0)} XP
              </strong>
            </div>
          </div>

          {/* Fundamentação Regulamentar SOLAS / DPC */}
          {(pergunta.explicacao || pergunta.referencia) && (
            <div style={{
              background: 'rgba(15, 35, 61, 0.7)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-marinha)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  FUNDAMENTAÇÃO OFICIAL DPC / SOLAS:
                </span>
                {pergunta.referencia && (
                  <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    {pergunta.referencia}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                {pergunta.explicacao}
              </p>
            </div>
          )}

          {/* Radar / Aguardando Próxima Etapa */}
          <div style={{
            textAlign: 'center',
            padding: '12px',
            background: 'rgba(7, 22, 44, 0.6)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-cyan)' }}></span>
            <span>Aguardando o Instrutor avançar para a próxima etapa no Telão...</span>
          </div>
        </div>
      )}
    </div>
  );
}
