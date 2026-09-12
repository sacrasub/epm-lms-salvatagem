import React, { useState, useEffect } from 'react';
import { Anchor, Monitor, Smartphone, Shield, Radio, ArrowRight, Award, Lock, AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { realtimeEngine } from '../lib/realtimeEngine';

export default function Home({ onEnterTelao, onEnterApresentador, onEnterAluno }) {
  const [roomCode, setRoomCode] = useState('EPM2026');
  const [nomeGuerra, setNomeGuerra] = useState('');
  const [mode, setMode] = useState('choice'); // 'choice', 'aluno_form'
  const [isRestrictedToAluno, setIsRestrictedToAluno] = useState(false);
  const [isQrLocked, setIsQrLocked] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const isCloudConnected = isSupabaseConfigured();

  // Se vier com parâmetros na URL (ex: ?sala=EPM2026&modo=aluno)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramSala = params.get('sala');
    const paramModo = params.get('modo');

    if (paramSala) {
      setRoomCode(paramSala);
      setIsQrLocked(true);
      realtimeEngine.init(paramSala);
    } else {
      realtimeEngine.init('EPM2026');
    }

    if (paramModo === 'aluno') {
      setMode('aluno_form');
      setIsRestrictedToAluno(true);
    }
    if (paramModo === 'apresentador' && onEnterApresentador) onEnterApresentador(paramSala || 'EPM2026');
    if (paramModo === 'telao') onEnterTelao(paramSala || 'EPM2026');

    // Recupera último nome de guerra salvo no celular
    try {
      const savedNome = localStorage.getItem('epm_last_nome_guerra');
      if (savedNome) setNomeGuerra(savedNome);
    } catch (e) {}
  }, [onEnterTelao, onEnterApresentador]);

  const handleStartAluno = (e) => {
    e.preventDefault();
    setNameError(null);
    setNameSuggestions([]);
    const trimmedNome = nomeGuerra.trim();
    if (!trimmedNome) return;

    // Validação de unicidade de nome de guerra na sala (M6)
    const check = realtimeEngine.checkNomeGuerraAvailability(trimmedNome);
    if (!check.disponivel) {
      setNameError(check.motivo);
      setNameSuggestions(check.sugestoes || []);
      return;
    }

    onEnterAluno(roomCode.trim(), trimmedNome);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Brasão e Identidade Naval */}
      <div style={{ textAlign: 'center', maxWidth: '640px', marginBottom: '32px' }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0f2b48, #07162c)',
          border: '2px solid var(--gold-marinha)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold-marinha)',
          margin: '0 auto 16px',
          boxShadow: '0 0 25px rgba(212, 175, 55, 0.3)'
        }}>
          <Anchor size={36} />
        </div>

        <span className="tag-badge tag-badge-gold" style={{ marginBottom: '12px' }}>
          ENSINO PROFISSIONAL MARÍTIMO — DPC / MARINHA DO BRASIL
        </span>

        <h1 style={{ fontSize: '2.4rem', color: '#fff', margin: '8px 0', lineHeight: 1.2 }}>
          TÉCNICAS DE SOBREVIVÊNCIA PESSOAL <span style={{ color: 'var(--primary-cyan)' }}>(TSP)</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Ambiente LMS Dual-Screen com Gamificação Pedagógica PBL e Simulação Tática de Salvatagem no Mar.
        </p>
      </div>

      {/* Cartão de Seleção de Modo */}
      <div className="naval-card naval-card-glow-cyan" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '32px',
        background: 'rgba(10, 25, 44, 0.9)'
      }}>
        {mode === 'choice' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '4px' }}>
                SELECIONE SEU TERMINAL DE BORDO
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Escolha o perfil para iniciar ou ingressar na sessão interativa:
              </p>
            </div>

            {/* Opção Master: Modo Apresentador (Dual-Screen: Laptop + Projetor) */}
            <button
              onClick={() => (onEnterApresentador ? onEnterApresentador(roomCode) : onEnterTelao(roomCode))}
              className="naval-card naval-card-glow-gold"
              style={{
                padding: '18px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(20, 45, 75, 0.95), rgba(10, 25, 44, 0.95))',
                border: '1.5px solid var(--gold-marinha)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '16px',
                background: 'var(--gold-marinha)',
                color: '#07162c',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '10px',
                letterSpacing: '0.5px'
              }}>
                RECOMENDADO PARA 2 TELAS
              </div>

              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid var(--gold-marinha)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-marinha)',
                flexShrink: 0
              }}>
                <Monitor size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#fff', margin: 0 }}>
                    MODO APRESENTADOR (2 TELAS)
                  </h3>
                  <ArrowRight size={18} color="var(--gold-marinha)" />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Laptop com slide atual, próximo slide, notas DPC e controle por passador de slides + Janela limpa no Projetor.
                </p>
              </div>
            </button>

            {/* Opção 2: Telão da Sala HUD */}
            <button
              onClick={() => onEnterTelao(roomCode)}
              className="naval-card"
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                background: 'rgba(15, 35, 61, 0.8)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'rgba(0, 229, 255, 0.15)',
                border: '1px solid var(--primary-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-cyan)',
                flexShrink: 0
              }}>
                <Radio size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#fff', margin: 0 }}>
                    TELÃO HUD (TELA ÚNICA)
                  </h3>
                  <ArrowRight size={18} color="var(--primary-cyan)" />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Visão geral integrada: Storytelling, slides com dock retrátil, vídeos e dinâmicas na mesma tela.
                </p>
              </div>
            </button>

            {/* Opção 3: Terminal do Aluno */}
            <button
              onClick={() => setMode('aluno_form')}
              className="naval-card"
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                background: 'rgba(15, 35, 61, 0.8)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--gold-marinha)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-marinha)',
                flexShrink: 0
              }}>
                <Smartphone size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>
                    TERMINAL DO ALUNO (SMARTPHONE)
                  </h3>
                  <ArrowRight size={18} color="var(--gold-marinha)" />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                  Para celular: Responda a desafios rápidos, conquiste medalhas e consulte o infográfico de bolso.
                </p>
              </div>
            </button>

            {/* Configuração de Sala */}
            <div style={{
              background: 'rgba(7, 22, 44, 0.6)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                CÓDIGO DA SALA:
              </span>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary-cyan)',
                  fontFamily: 'var(--font-tactical)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  width: '100px',
                  textAlign: 'right',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        ) : (
          /* Formulário de Identificação do Aluno */
          <form onSubmit={handleStartAluno} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--gold-marinha-glow)',
                border: '1px solid var(--gold-marinha)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-marinha)',
                margin: '0 auto 10px'
              }}>
                <Award size={24} />
              </div>
              <h2 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>
                IDENTIFICAÇÃO DE BORDO
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Digite seu Nome de Guerra para sincronizar suas conquistas e medalhas na sala <strong>{roomCode}</strong>.
              </p>
            </div>

            {/* Campo da Sala com trava visual se veio por QR Code (M9) */}
            <div style={{
              background: 'rgba(7, 22, 44, 0.7)',
              border: isQrLocked ? '1px solid var(--gold-marinha)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isQrLocked ? <Lock size={15} color="var(--gold-marinha)" /> : <Radio size={15} color="var(--primary-cyan)" />}
                <span style={{ fontSize: '0.8rem', color: isQrLocked ? 'var(--gold-marinha)' : 'var(--text-muted)', fontWeight: isQrLocked ? 700 : 400 }}>
                  {isQrLocked ? 'SALA VINCULADA VIA QR CODE:' : 'SALA DA SESSÃO:'}
                </span>
              </div>
              <span style={{
                color: isQrLocked ? 'var(--gold-marinha)' : 'var(--primary-cyan)',
                fontFamily: 'var(--font-tactical)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '1px'
              }}>
                {roomCode}
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                NOME DE GUERRA DO MARINHEIRO / ALUNO:
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Ex: Marinheiro Silva / Oficial Santos"
                value={nomeGuerra}
                onChange={(e) => {
                  setNomeGuerra(e.target.value);
                  if (nameError) setNameError(null);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(7, 22, 44, 0.9)',
                  border: nameError ? '1px solid var(--solas-red)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />

              {/* Alerta de Nome Duplicado e Sugestões Táticas (M6) */}
              {nameError && (
                <div style={{
                  marginTop: '10px',
                  background: 'rgba(255, 51, 68, 0.12)',
                  border: '1px solid var(--solas-red)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--solas-red)', fontSize: '0.82rem', fontWeight: 600 }}>
                    <AlertTriangle size={16} />
                    <span>{nameError}</span>
                  </div>

                  {nameSuggestions.length > 0 && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Sugestões disponíveis para embarque imediato:
                      </span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {nameSuggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => {
                              setNomeGuerra(sug);
                              setNameError(null);
                              setNameSuggestions([]);
                            }}
                            className="btn-tactical btn-outline"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)' }}
                          >
                            Usar "{sug}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!isRestrictedToAluno && (
                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  className="btn-tactical btn-outline"
                  style={{ flex: 1, padding: '12px' }}
                >
                  VOLTAR
                </button>
              )}

              <button
                type="submit"
                disabled={!nomeGuerra.trim()}
                className="btn-tactical btn-gold"
                style={{ flex: isRestrictedToAluno ? 1 : 2, padding: '14px', fontSize: '1rem', fontWeight: 700 }}
              >
                <span>EMBARCAR NA MISSÃO</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Rodapé Tático com Indicador de Conexão */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        <Shield size={14} color={isCloudConnected ? 'var(--tactical-green)' : 'var(--primary-cyan)'} />
        <span>
          {isCloudConnected 
            ? 'Supabase Cloud Realtime Ativo' 
            : 'Modo Local Dual-Screen Híbrido Ativo (BroadcastChannel)'}
        </span>
      </div>
    </div>
  );
}
