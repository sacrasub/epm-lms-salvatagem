import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, ArrowRight, ExternalLink, RefreshCw, Copy, Check, Users, Tv, Monitor } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { realtimeEngine } from '../lib/realtimeEngine';

export default function AdminPage({ onBackHome }) {
  const [salas, setSalas] = useState(() => {
    try {
      const saved = localStorage.getItem('epm_admin_salas');
      return saved ? JSON.parse(saved) : ['EPM2026', 'TSP-TURMA-A', 'SALVATAGEM-01'];
    } catch (e) {
      return ['EPM2026'];
    }
  });

  const [newSalaCode, setNewSalaCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const saveSalas = (list) => {
    setSalas(list);
    try {
      localStorage.setItem('epm_admin_salas', JSON.stringify(list));
    } catch (e) {}
  };

  const handleCreateSala = (e) => {
    e.preventDefault();
    const code = (newSalaCode || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!code || salas.includes(code)) return;
    saveSalas([...salas, code]);
    setNewSalaCode('');
  };

  const handleGenerateRandom = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    setNewSalaCode(`TSP-${randomSuffix}`);
  };

  const handleDeleteSala = (code) => {
    if (code === 'EPM2026') {
      alert('A sala EPM2026 é a sala padrão do sistema e não pode ser removida.');
      return;
    }
    if (window.confirm(`Deseja realmente excluir o registro da sala ${code}?`)) {
      saveSalas(salas.filter((s) => s !== code));
    }
  };

  const handleCopyLink = (code, mode) => {
    const origin = window.location.origin;
    let url = `${origin}/?sala=${encodeURIComponent(code)}`;
    if (mode) url += `&modo=${mode}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(`${code}_${mode}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px', maxWidth: '1000px', margin: '0 auto' }}>
      <Navbar role="admin" roomCode="GERENCIAMENTO" onBackHome={onBackHome} />

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Banner Informativo */}
        <div className="naval-card naval-card-glow-cyan" style={{ padding: '24px', background: 'rgba(10, 25, 44, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={28} color="var(--primary-cyan)" />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontFamily: 'var(--font-tactical)' }}>
                PAINEL DE GERENCIAMENTO MULTI-SALA (MULTI-ROOM)
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Crie, configure e monitore sessões simultâneas de instrução para diferentes turmas de Salvatagem.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de Criação de Sala */}
        <div className="naval-card" style={{ padding: '20px', background: 'rgba(7, 22, 44, 0.85)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem', color: 'var(--gold-marinha)', fontFamily: 'var(--font-tactical)' }}>
            CRIAR NOVA SALA DE INSTRUÇÃO
          </h3>

          <form onSubmit={handleCreateSala} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              required
              placeholder="Ex: TSP-TURMA-BRAVO"
              value={newSalaCode}
              onChange={(e) => setNewSalaCode(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                background: 'rgba(4, 12, 23, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                color: 'var(--primary-cyan)',
                fontFamily: 'var(--font-tactical)',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '1px',
                outline: 'none'
              }}
            />

            <button
              type="button"
              onClick={handleGenerateRandom}
              className="btn-tactical btn-outline"
              style={{ padding: '12px 16px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} />
              <span>Gerar Código</span>
            </button>

            <button
              type="submit"
              className="btn-tactical btn-cyan"
              style={{ padding: '12px 20px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              <Plus size={16} />
              <span>CRIAR SALA</span>
            </button>
          </form>
        </div>

        {/* Lista de Salas Cadastradas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-tactical)' }}>
            SALAS DE AULA ATIVAS ({salas.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {salas.map((code) => (
              <div
                key={code}
                className="naval-card"
                style={{
                  padding: '18px',
                  background: 'rgba(10, 25, 44, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: 'var(--font-tactical)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--gold-marinha)',
                    letterSpacing: '1px'
                  }}>
                    {code}
                  </span>

                  {code !== 'EPM2026' && (
                    <button
                      onClick={() => handleDeleteSala(code)}
                      className="btn-tactical btn-outline"
                      style={{ padding: '6px', color: 'var(--solas-red)', borderColor: 'rgba(255, 51, 68, 0.3)' }}
                      title="Excluir Sala"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Acessos Rápidos por Modo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <a
                    href={`/apresentador?sala=${encodeURIComponent(code)}`}
                    className="btn-tactical btn-gold"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'space-between', textDecoration: 'none' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Monitor size={14} /> Cockpit Apresentador
                    </span>
                    <ExternalLink size={14} />
                  </a>

                  <a
                    href={`/telao?sala=${encodeURIComponent(code)}`}
                    className="btn-tactical btn-cyan"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'space-between', textDecoration: 'none' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tv size={14} /> Telão da Sala
                    </span>
                    <ExternalLink size={14} />
                  </a>

                  <a
                    href={`/?sala=${encodeURIComponent(code)}&modo=aluno`}
                    className="btn-tactical btn-outline"
                    style={{ padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'space-between', textDecoration: 'none' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} /> Entrada do Aluno
                    </span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Copiar Links */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  <button
                    onClick={() => handleCopyLink(code, 'aluno')}
                    className="btn-tactical btn-outline"
                    style={{ flex: 1, padding: '6px', fontSize: '0.72rem' }}
                  >
                    {copiedCode === `${code}_aluno` ? <Check size={12} color="var(--tactical-green)" /> : <Copy size={12} />}
                    <span>{copiedCode === `${code}_aluno` ? 'Copiado!' : 'Link Aluno'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(code, 'apresentador')}
                    className="btn-tactical btn-outline"
                    style={{ flex: 1, padding: '6px', fontSize: '0.72rem' }}
                  >
                    {copiedCode === `${code}_apresentador` ? <Check size={12} color="var(--tactical-green)" /> : <Copy size={12} />}
                    <span>{copiedCode === `${code}_apresentador` ? 'Copiado!' : 'Link Cockpit'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
