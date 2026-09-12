import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Clock, Zap, RotateCcw } from 'lucide-react';
import { soundManager } from '../../lib/soundEffects';

export const CENARIOS_SIMULACAO = [
  {
    id: 'cenario_01',
    titulo: 'Operação Homem ao Mar (MOB) no Noturno',
    situacao: 'Às 23h45, em mar força 5, o vigia grita: "Homem ao mar a boreste!". Qual equipamento de emergência no passadiço deve ser lançado imediatamente na água?',
    tempoSegundos: 30,
    pontosXP: 250,
    itens: [
      { id: 'colete', nome: 'Colete Salva-Vidas Pessoal', icon: '🦺', correto: false, feedback: 'O colete pessoal não possui alcance de lançamento nem facho luminoso automático para localização noturna.' },
      { id: 'boia_facho', nome: 'Boia Circular com Facho e Fumígeno', icon: '⭕', correto: true, feedback: 'Correto! A boia com facho luminoso de acendimento automático e sinal fumígeno marca a posição do náufrago no escuro e oferece sustentação imediata (SOLAS Cap. III).' },
      { id: 'epirb', nome: 'Radiobaliza EPIRB 406 MHz', icon: '📡', correto: false, feedback: 'O EPIRB deve ser levado na balsa ou embarcação de sobrevivência, não lançado como boia de resgate.' },
      { id: 'pirotecnico', nome: 'Facho Manual Vermelho', icon: '🧨', correto: false, feedback: 'O facho manual deve ser disparado pelo náufrago para sinalizar resgate, não jogado no mar.' }
    ]
  },
  {
    id: 'cenario_02',
    titulo: 'Ativação Hidrostática da Balsa Salva-Vidas',
    situacao: 'O navio adernou e afundou tão rápido que não houve tempo para lançamento manual. A 3 metros de profundidade, qual componente mecânico corta o cabo para liberar a balsa?',
    tempoSegundos: 30,
    pontosXP: 300,
    itens: [
      { id: 'elo_fraco', nome: 'Elo Fraco (Weak Link)', icon: '🔗', correto: false, feedback: 'O elo fraco se rompe apenas após a balsa inflar para que o navio não a puxe para o fundo.' },
      { id: 'hru', nome: 'Unidade de Escape Hidrostático (HRU)', icon: '⚙️', correto: true, feedback: 'Exato! O HRU corta a linga de fixação sob pressão de água entre 1,5m e 4m de profundidade liberando o casulo (SOLAS Reg. 13.4).' },
      { id: 'ancora_mar', nome: 'Âncora Flutuante', icon: '⚓', correto: false, feedback: 'A âncora flutuante reduz o abatimento pelo vento, não atua no desprendimento do casulo.' },
      { id: 'valvula_alivio', nome: 'Válvula de Alívio de Pressão', icon: '🎛️', correto: false, feedback: 'A válvula de alívio impede sobrepressão das câmaras de ar infladas pelo CO2.' }
    ]
  },
  {
    id: 'cenario_03',
    titulo: 'Aeronave SAR de Resgate da Marinha no Local',
    situacao: 'O helicóptero de resgate da Marinha chegou e desceu o cabo do guincho até a balsa. Qual a regra de ouro número 1 de segurança elétrica e física antes de tocar no gancho?',
    tempoSegundos: 30,
    pontosXP: 350,
    itens: [
      { id: 'pegar_rapido', nome: 'Agarrar o gancho no ar antes que caia na água', icon: '🖐️', correto: false, feedback: 'Perigo mortal! O atrito das pás do helicóptero gera alta estática. Tocar no cabo sem descarregar na água causa choque violento.' },
      { id: 'deixar_aterrar', nome: 'Deixar o cabo tocar na água para descarregar a estática', icon: '⚡', correto: true, feedback: 'Perfeito! O cabo do guincho deve tocar a água primeiro para descarregar a eletricidade estática acumulada pela aeronave antes de ser manuseado.' },
      { id: 'amarrar_balsa', nome: 'Amarrar o cabo firmemente na estrutura da balsa', icon: '🪢', correto: false, feedback: 'Jamais amarre o cabo na balsa! Se o helicóptero precisar manobrar de emergência, virará a balsa com todos os tripulantes.' },
      { id: 'disparar_fumigeno', nome: 'Acender um sinal fumígeno laranja embaixo do helicóptero', icon: '💨', correto: false, feedback: 'A fumaça cega o piloto e pode ser sugada pela turbina do helicóptero, causando pane de voo.' }
    ]
  }
];

export default function ScenarioSimulation({
  onRewardXP,
  alunoNome
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResolved, setIsResolved] = useState(false);
  const [score, setScore] = useState(0);

  const cenario = CENARIOS_SIMULACAO[currentIdx];

  useEffect(() => {
    setTimeLeft(cenario.tempoSegundos);
    setSelectedItem(null);
    setIsResolved(false);
  }, [currentIdx]);

  useEffect(() => {
    if (isResolved || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setIsResolved(true);
          soundManager.playBuzzer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isResolved, timeLeft]);

  const handleSelectItem = (item) => {
    if (isResolved) return;
    setSelectedItem(item);
    setIsResolved(true);

    if (item.correto) {
      soundManager.playSuccess();
      setScore((s) => s + cenario.pontosXP);
      if (onRewardXP) onRewardXP(cenario.pontosXP);
    } else {
      soundManager.playBuzzer();
    }
  };

  const handleNext = () => {
    if (currentIdx < CENARIOS_SIMULACAO.length - 1) {
      setCurrentIdx((c) => c + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <div className="naval-card" style={{ padding: '20px', background: 'rgba(7, 22, 44, 0.95)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="tag-badge tag-badge-gold">
            SIMULADOR TÁTICO
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            CENÁRIO {currentIdx + 1} DE {CENARIOS_SIMULACAO.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: timeLeft <= 10 ? 'var(--solas-red)' : 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)', fontWeight: 700 }}>
          <Clock size={16} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: '#fff' }}>
          {cenario.titulo}
        </h3>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.45 }}>
          {cenario.situacao}
        </p>
      </div>

      {/* Grid de Equipamentos Interativos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {cenario.itens.map((item) => {
          const isChosen = selectedItem?.id === item.id;
          let borderCol = 'var(--border-subtle)';
          let bgCol = 'rgba(15, 35, 61, 0.6)';

          if (isResolved) {
            if (item.correto) {
              borderCol = 'var(--tactical-green)';
              bgCol = 'rgba(0, 230, 118, 0.15)';
            } else if (isChosen && !item.correto) {
              borderCol = 'var(--solas-red)';
              bgCol = 'rgba(255, 51, 68, 0.15)';
            }
          }

          return (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              disabled={isResolved}
              className="naval-card"
              style={{
                padding: '16px 12px',
                textAlign: 'center',
                cursor: isResolved ? 'default' : 'pointer',
                border: `1px solid ${borderCol}`,
                background: bgCol,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '2.2rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                {item.nome}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback da Resolução */}
      {isResolved && (
        <div style={{
          padding: '14px',
          borderRadius: 'var(--radius-sm)',
          background: selectedItem?.correto ? 'rgba(0, 230, 118, 0.12)' : 'rgba(255, 51, 68, 0.12)',
          border: `1px solid ${selectedItem?.correto ? 'var(--tactical-green)' : 'var(--solas-red)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: selectedItem?.correto ? 'var(--tactical-green)' : 'var(--solas-red)', fontSize: '0.92rem' }}>
            {selectedItem?.correto ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span>{selectedItem?.correto ? `AÇÃO CORRETA! (+${cenario.pontosXP} XP)` : 'AÇÃO INCORRETA OU TEMPO ESGOTADO!'}</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.4 }}>
            {selectedItem?.feedback || cenario.itens.find(i => i.correto)?.feedback}
          </p>

          <button
            onClick={handleNext}
            className="btn-tactical btn-gold"
            style={{ padding: '10px', marginTop: '6px', width: '100%', fontSize: '0.85rem' }}
          >
            {currentIdx < CENARIOS_SIMULACAO.length - 1 ? 'PRÓXIMO CENÁRIO TÁTICO' : 'RECOMEÇAR SIMULAÇÃO'}
          </button>
        </div>
      )}
    </div>
  );
}
