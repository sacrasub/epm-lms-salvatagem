import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Clock, Send, Shield, X } from 'lucide-react';
import { soundManager } from '../../lib/soundEffects';

export default function PeerDiscussionModal({
  isOpen,
  onClose,
  partnerName = 'Marinheiro Par',
  alunoNome,
  pergunta
}) {
  const [messages, setMessages] = useState([
    {
      sender: partnerName,
      text: `Olá! Qual alternativa você marcou no desafio? Estou em dúvida entre a B e a C por conta da SOLAS.`,
      time: 'Agora'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(60);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: alunoNome || 'Você',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Resposta simulada do par para dinamismo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: partnerName,
          text: 'Entendido! Essa justificativa faz total sentido com a regra de ouro que vimos.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2500);
  };

  const handleQuickArgument = (arg) => {
    setInputText(arg);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 12, 23, 0.88)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '16px'
    }}>
      <div className="naval-card naval-card-glow-cyan" style={{
        maxWidth: '540px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 25, 44, 0.98)',
        padding: '20px',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={22} color="var(--primary-cyan)" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                  PEER INSTRUCTION (ERIC MAZUR)
                </span>
                <span style={{ fontSize: '0.75rem', color: timeLeft <= 15 ? 'var(--solas-red)' : 'var(--primary-cyan)', fontFamily: 'var(--font-tactical)', fontWeight: 700 }}>
                  ⏱️ {timeLeft}s
                </span>
              </div>
              <h3 style={{ margin: '4px 0 0', fontSize: '1.1rem', color: '#fff' }}>
                Debate Tático em Dupla
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Seu par de bordo: <strong style={{ color: 'var(--gold-marinha)' }}>{partnerName}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-tactical btn-outline" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Enunciado do Desafio */}
        {pergunta && (
          <div style={{ background: 'rgba(7, 22, 44, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px', marginBottom: '12px', fontSize: '0.82rem', color: '#cbd5e1' }}>
            <strong>Desafio em Discussão: </strong> {pergunta.enunciado || pergunta.titulo}
          </div>
        )}

        {/* Feed do Chat de Pares */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '12px',
          background: 'rgba(4, 12, 23, 0.9)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          minHeight: '220px',
          maxHeight: '300px'
        }}>
          {messages.map((m, i) => {
            const isMe = m.sender === alunoNome || m.sender === 'Você';
            return (
              <div
                key={i}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: isMe ? 'rgba(0, 229, 255, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                  border: isMe ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: isMe ? 'var(--primary-cyan)' : 'var(--gold-marinha)', fontWeight: 700, marginBottom: '2px' }}>
                  {m.sender}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#fff', lineHeight: 1.35 }}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Argumentos Rápidos Táticos */}
        <div style={{ display: 'flex', gap: '6px', margin: '10px 0 8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleQuickArgument('Pela regra SOLAS, o tempo de desviramento é de 5s.')}
            className="btn-tactical btn-outline"
            style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '12px' }}
          >
            "Tempo de 5s SOLAS"
          </button>
          <button
            type="button"
            onClick={() => handleQuickArgument('Acho que é a opção B devido à flutuabilidade frontal.')}
            className="btn-tactical btn-outline"
            style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '12px' }}
          >
            "Flutuabilidade frontal"
          </button>
          <button
            type="button"
            onClick={() => handleQuickArgument('Concordo com você, vamos confirmar essa opção.')}
            className="btn-tactical btn-outline"
            style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '12px' }}
          >
            "Concordo com você"
          </button>
        </div>

        {/* Input de Mensagem */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Defenda sua escolha tática com seu par..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(7, 22, 44, 0.9)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="btn-tactical btn-cyan"
            style={{ padding: '10px 16px' }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
