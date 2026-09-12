import React, { useRef, useEffect, useState } from 'react';
import { Award, Download, Printer, X, CheckCircle, Shield } from 'lucide-react';
import { calcularPatente } from '../../data/badgesData';

export default function CertificateGenerator({
  isOpen,
  onClose,
  aluno,
  roomCode = 'EPM2026'
}) {
  const canvasRef = useRef(null);
  const [certUrl, setCertUrl] = useState(null);

  if (!isOpen || !aluno) return null;

  const patente = calcularPatente(aluno.xp || 0);
  const authCode = `MB-${roomCode}-${(aluno.nome || '').substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 1200;
    canvas.height = 800;

    // 1. Fundo Azul Marinho Tático com Borda Dourada
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGradient.addColorStop(0, '#040c17');
    bgGradient.addColorStop(0.5, '#071b30');
    bgGradient.addColorStop(1, '#040c17');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 800);

    // 2. Moldura Ornamental Naval
    ctx.strokeStyle = '#d4af37'; // Ouro Marinha
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = '#00e5ff'; // Ciano
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, 1116, 716);

    // Cantoneiras Ornamentais
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(42, 42);
    drawCorner(1158, 42);
    drawCorner(42, 758);
    drawCorner(1158, 758);

    // 3. Marca d'água / Brasão
    ctx.save();
    ctx.translate(600, 400);
    ctx.font = '220px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.04)';
    ctx.fillText('⚓', 0, 0);
    ctx.restore();

    // 4. Cabeçalho Oficial
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 20px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText('MARINHA DO BRASIL — DIRETORIA DE PORTOS E COSTAS', 600, 95);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText('ENSINO PROFISSIONAL MARÍTIMO • SISTEMA DE SIMULAÇÃO TÁTICA', 600, 125);

    // Título Principal do Certificado
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText('CERTIFICADO DE APTIDÃO EM SALVATAGEM', 600, 185);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 16px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText('CONVENÇÃO SOLAS 74/88 • CÓDIGO LSA • NORMAM-01 / DPC', 600, 215);

    // 5. Texto de Concessão
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px "Segoe UI", sans-serif';
    ctx.fillText('Certificamos para os devidos fins de instrução e qualificação naval que o marinheiro:', 600, 275);

    // Nome de Guerra do Aluno em Destaque
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 44px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText((aluno.nome || 'MARINHEIRO').toUpperCase(), 600, 340);

    // Linha divisória sob o nome
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 365);
    ctx.lineTo(850, 365);
    ctx.stroke();

    // Corpo descritivo
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '17px "Segoe UI", sans-serif';
    ctx.fillText(
      'concluiu com êxito os desafios práticos de Técnicas de Sobrevivência Pessoal (TSP),',
      600,
      410
    );
    ctx.fillText(
      'demonstrando proficiência em abandono de embarcação, escape hidrostático, balsas salva-vidas,',
      600,
      438
    );
    ctx.fillText(
      'equipamentos individuais SOLAS, telecomunicações de socorro (EPIRB/SART) e resgate helitransportado.',
      600,
      466
    );

    // 6. Painel de Conquistas e Patente
    ctx.fillStyle = 'rgba(7, 22, 44, 0.8)';
    ctx.fillRect(250, 505, 700, 80);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(250, 505, 700, 80);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText(`PATENTE: ${patente.icone} ${patente.nome.toUpperCase()}`, 280, 540);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 15px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText(`DESEMPENHO: ${aluno.xp || 0} XP • 🏅 ${(aluno.badges || []).length} MEDALHAS`, 280, 565);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText(`SESSÃO: SALA ${roomCode}`, 920, 540);
    ctx.fillText(`DATA: ${new Date().toLocaleDateString('pt-BR')}`, 920, 565);

    // 7. Assinaturas e Autenticação
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;

    // Assinatura Instrutor
    ctx.beginPath();
    ctx.moveTo(250, 680);
    ctx.lineTo(520, 680);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText('OFICIAL INSTRUTOR DE TSP', 385, 702);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillText('Diretoria de Portos e Costas / DPC', 385, 720);

    // Assinatura Aluno
    ctx.beginPath();
    ctx.moveTo(680, 680);
    ctx.lineTo(950, 680);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "Chakra Petch", "Segoe UI", sans-serif';
    ctx.fillText((aluno.nome || 'MARINHEIRO').toUpperCase(), 815, 702);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillText('Identificação de Bordo', 815, 720);

    // Código de Validação
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.fillText(`AUTENTICAÇÃO DIGITAL: ${authCode}`, 600, 755);

    try {
      setCertUrl(canvas.toDataURL('image/png'));
    } catch (e) {}
  }, [aluno, roomCode, authCode, patente]);

  const handleDownload = () => {
    if (!certUrl) return;
    const a = document.createElement('a');
    a.href = certUrl;
    a.download = `Certificado_Salvatagem_${(aluno.nome || 'Marinheiro').replace(/\s+/g, '_')}.png`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 12, 23, 0.9)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '16px'
    }}>
      <div className="naval-card naval-card-glow-gold" style={{
        maxWidth: '880px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 25, 44, 0.98)',
        padding: '24px',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} color="var(--gold-marinha)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--font-tactical)' }}>
                CERTIFICADO OFICIAL DE SALVATAGEM (TSP)
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Emitido pela Diretoria de Portos e Costas — Sistema EPM LMS
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDownload}
              className="btn-tactical btn-gold"
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              title="Baixar Certificado em Alta Resolução (PNG)"
            >
              <Download size={15} />
              <span>BAIXAR PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-tactical btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              title="Imprimir / Salvar em PDF"
            >
              <Printer size={15} />
              <span>IMPRIMIR</span>
            </button>
            <button
              onClick={onClose}
              className="btn-tactical btn-outline"
              style={{ padding: '8px 10px' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Canvas do Certificado com Preview */}
        <div style={{
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#040c17',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              maxWidth: '800px',
              height: 'auto',
              boxShadow: '0 0 25px rgba(212, 175, 55, 0.25)',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>
    </div>
  );
}
