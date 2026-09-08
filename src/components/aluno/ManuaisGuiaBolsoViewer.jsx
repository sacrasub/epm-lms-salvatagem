import React, { useState } from 'react';
import {
  FileText,
  Download,
  Image as ImageIcon,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';

export const MATERIAIS_CURSO = {
  guiasDeBolso: [
    {
      id: 'guia_dia08',
      dia: 'Dia 08',
      titulo: 'Guia Técnico de Sobrevivência Pessoal',
      subtitulo: 'Equipamentos Individuais, Colete SOLAS Tipo I & Tabela Mestra',
      url: '/assets/Guia_Técnico_de_Sobrevivência_Pessoal.png',
      formato: 'PNG Alta Resolução (5.1 MB)',
      tipo: 'imagem'
    },
    {
      id: 'guia_dia09',
      dia: 'Dia 09',
      titulo: 'Guia de Sobrevivência Marítima',
      subtitulo: 'Engenharia da Balsa Salva-Vidas, HRU, Elo Fraco & Racionamento',
      url: '/assets/Guia_de_Sobrevivência_Marítima.png',
      formato: 'PNG Alta Resolução (4.7 MB)',
      tipo: 'imagem'
    },
    {
      id: 'guia_dia10',
      dia: 'Dia 10',
      titulo: 'Guia de Emergência e Resgate',
      subtitulo: 'Pirotecnia, Transponder SART, EPIRB 406 MHz & Helicóptero SAR',
      url: '/assets/Guia_de_Sobrevivência_e_Emergência.png',
      formato: 'PNG Alta Resolução (4.5 MB)',
      tipo: 'imagem'
    }
  ],
  slidesPdf: [
    {
      id: 'slides_dia08',
      dia: 'Dia 08',
      titulo: 'Slides Completos — Dia 08',
      subtitulo: 'Maritime Survival Tactics (12 Slides Full HD)',
      url: '/slides/TSP Dia 08 - Maritime_Survival_Tactics.pdf',
      formato: 'PDF Oficial (12.9 MB)'
    },
    {
      id: 'slides_dia09',
      dia: 'Dia 09',
      titulo: 'Slides Completos — Dia 09',
      subtitulo: 'Engenharia da Sobrevivência (15 Slides Full HD)',
      url: '/slides/TSP Dia 09 - Engenharia_da_Sobrevivência.pdf',
      formato: 'PDF Oficial (18.7 MB)'
    },
    {
      id: 'slides_dia10',
      dia: 'Dia 10',
      titulo: 'Slides Completos — Dia 10',
      subtitulo: 'Tactical Marine Survival (15 Slides Full HD)',
      url: '/slides/TSP Dia 10 - Tactical_Marine_Survival.pdf',
      formato: 'PDF Oficial (18.8 MB)'
    }
  ],
  manuaisOficiais: [
    {
      id: 'apostila_caaq',
      titulo: 'Apostila Oficial CAAQ-BC — 06-TSP 001',
      subtitulo: 'Diretoria de Portos e Costas (DPC) / Marinha do Brasil',
      descricao: 'Manual curricular oficial do curso de Técnicas de Sobrevivência Pessoal.',
      url: '/slides/06-TSP 001-CAAQ- I CT S 2013.pdf',
      formato: 'PDF Oficial DPC (1.2 MB)'
    },
    {
      id: 'manual_cfaq_mfc',
      titulo: 'Manual Técnico CFAQ-MFC — TSP-001',
      subtitulo: 'Técnicas de Sobrevivência Pessoal para Moços de Convés',
      descricao: 'Doutrina completa de salvatagem, equipamentos de bordo e convenções internacionais.',
      url: '/slides/CFAQ-MFC - TSP-001 - TECNICAS DE SOBREVIVENCIA PESSOAL.pdf',
      formato: 'PDF Oficial DPC (1.1 MB)'
    },
    {
      id: 'manual_cfaq_mfm',
      titulo: 'Manual Técnico CFAQ-MFM — TSP-001',
      subtitulo: 'Técnicas de Sobrevivência Pessoal para Moços de Máquinas',
      descricao: 'Prevenção de acidentes, escape de praças de máquinas e procedimentos de abandono.',
      url: '/slides/CFAQ-MFM - TSP-001 .pdf',
      formato: 'PDF Oficial DPC (1.4 MB)'
    },
    {
      id: 'plano_aula',
      titulo: 'Plano de Aula & Manual de Apoio ao Instrutor',
      subtitulo: 'Matriz Pedagógica, Carga Horária e Metodologia PBL',
      descricao: 'Estrutura detalhada dos 3 dias de curso, dinâmicas táticas e referências SOLAS.',
      url: '/slides/Plano de Aula - manual-apoio-instrutor-tsp.pdf',
      formato: 'PDF Técnico (145 KB)'
    }
  ]
};

export default function ManuaisGuiaBolsoViewer({ currentMissionId = 1 }) {
  const [selectedGuia, setSelectedGuia] = useState(
    MATERIAIS_CURSO.guiasDeBolso[currentMissionId - 1] || MATERIAIS_CURSO.guiasDeBolso[0]
  );
  const [activeSection, setActiveSection] = useState('todos'); // 'todos', 'guias', 'slides', 'manuais'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Cabeçalho da Central de Materiais */}
      <div
        className="naval-card naval-card-glow-gold"
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(20, 45, 75, 0.95), rgba(10, 25, 44, 0.95))',
          border: '1px solid var(--gold-marinha)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--gold-marinha)" />
            <span style={{ fontFamily: 'var(--font-tactical)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', letterSpacing: '0.5px' }}>
              MANUAIS TÉCNICOS & GUIAS DE BOLSO
            </span>
          </div>
          <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.7rem' }}>
            DPC / SOLAS
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          Todo o material didático oficial do curso disponível para consulta e download direto no seu smartphone.
        </p>
      </div>

      {/* 1. SEÇÃO: GUIAS RÁPIDOS DE BOLSO (INFOGRÁFICOS EM ALTA DEFINIÇÃO) */}
      <div className="naval-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={18} color="var(--primary-cyan)" />
            <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>
              Guias de Bolso em Alta Resolução
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)' }}>3 Guias Oficiais</span>
        </div>

        {/* Seletor de Guia de Bolso */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {MATERIAIS_CURSO.guiasDeBolso.map((guia) => {
            const isSel = selectedGuia.id === guia.id;
            return (
              <button
                key={guia.id}
                onClick={() => setSelectedGuia(guia)}
                style={{
                  padding: '8px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSel ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                  background: isSel ? 'rgba(0, 229, 255, 0.2)' : 'rgba(15, 35, 61, 0.6)',
                  color: isSel ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontFamily: 'var(--font-tactical)'
                }}
              >
                {guia.dia}
              </button>
            );
          })}
        </div>

        {/* Card do Guia Selecionado */}
        <div
          style={{
            background: 'rgba(7, 22, 44, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
              {selectedGuia.titulo}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {selectedGuia.subtitulo}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gold-marinha)', marginTop: '4px' }}>
              Formato: {selectedGuia.formato}
            </div>
          </div>

          {/* Prévia da Imagem do Guia */}
          <div
            style={{
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#040c17',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxHeight: '320px'
            }}
          >
            <img
              src={selectedGuia.url}
              alt={selectedGuia.titulo}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '320px',
                objectFit: 'contain',
                display: 'block'
              }}
              loading="lazy"
            />
          </div>

          {/* Botões de Ação para o Guia */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <a
              href={selectedGuia.url}
              target="_blank"
              rel="noreferrer"
              className="btn-tactical btn-outline"
              style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <Eye size={15} />
              <span>Visualizar</span>
            </a>

            <a
              href={selectedGuia.url}
              download={`${selectedGuia.titulo}.png`}
              className="btn-tactical btn-cyan"
              style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none', fontWeight: 700 }}
            >
              <Download size={15} />
              <span>Baixar Guia</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. SEÇÃO: SLIDES OFICIAIS DAS AULAS (PDFs COMPLETOS) */}
      <div className="naval-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--gold-marinha)" />
            <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>
              Slides Oficiais das Aulas (PDF)
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-marinha)' }}>3 Apresentações</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MATERIAIS_CURSO.slidesPdf.map((slide) => (
            <div
              key={slide.id}
              style={{
                background: 'rgba(15, 35, 61, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span className="tag-badge tag-badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    {slide.dia}
                  </span>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {slide.titulo}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {slide.subtitulo}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--primary-cyan)', marginTop: '2px' }}>
                  {slide.formato}
                </div>
              </div>

              <a
                href={slide.url}
                download
                className="btn-tactical btn-gold"
                style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', flexShrink: 0, fontWeight: 700 }}
                title={`Baixar slides do ${slide.dia}`}
              >
                <Download size={15} />
                <span>Baixar</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SEÇÃO: MANUAIS E APOSTILAS OFICIAIS DPC / MARINHA DO BRASIL */}
      <div className="naval-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={18} color="#00e676" />
            <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>
              Manuais & Apostilas Oficiais DPC
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#00e676' }}>Homologados</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MATERIAIS_CURSO.manuaisOficiais.map((manual) => (
            <div
              key={manual.id}
              style={{
                background: 'rgba(15, 35, 61, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', lineHeight: 1.3 }}>
                  {manual.titulo}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {manual.subtitulo}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#00e676', marginTop: '2px' }}>
                  {manual.formato}
                </div>
              </div>

              <a
                href={manual.url}
                download
                className="btn-tactical btn-outline"
                style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', flexShrink: 0 }}
                title={`Baixar ${manual.titulo}`}
              >
                <Download size={15} />
                <span>Baixar</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
