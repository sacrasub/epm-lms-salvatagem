import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import AlunoHUD from '../components/aluno/AlunoHUD';
import { realtimeEngine } from '../lib/realtimeEngine';
import { reportingService } from '../lib/reportingService';

export default function AlunoPage({ roomCode = 'EPM2026', nomeGuerra = 'Marinheiro', onBackHome }) {
  const [data, setData] = useState({
    state: realtimeEngine.state,
    participantes: realtimeEngine.participantes,
    respostas: realtimeEngine.respostas,
    duvidas: realtimeEngine.duvidas
  });
  const [currentStudent, setCurrentStudent] = useState({
    nome: nomeGuerra,
    patente: 'Praticante de Salvatagem',
    xp: 0,
    badges: []
  });

  useEffect(() => {
    realtimeEngine.init(roomCode);
    const student = realtimeEngine.registerStudent(nomeGuerra);
    setCurrentStudent(student);
    reportingService.saveStudentSession(roomCode, student);

    const unsubscribe = realtimeEngine.subscribe((snapshot) => {
      setData(snapshot);
      // Atualiza o estado do aluno atual a partir do snapshot
      const me = snapshot.participantes.find(
        (p) => p.nome.toLowerCase() === (nomeGuerra || '').toLowerCase()
      );
      if (me) {
        const updatedMe = {
          ...me,
          xp: Math.max(currentStudent.xp || 0, me.xp || 0),
          badges: Array.from(new Set([...(currentStudent.badges || []), ...(me.badges || [])]))
        };
        setCurrentStudent(updatedMe);
        reportingService.saveStudentSession(roomCode, updatedMe);
      }
    });

    return () => unsubscribe();
  }, [roomCode, nomeGuerra]);

  const handleAnswerSubmit = (alunoNome, perguntaId, opcaoId, correta, xpGanho, newBadge) => {
    // Atualização otimista imediata na interface do aluno
    if (correta) {
      setCurrentStudent((prev) => {
        const updated = {
          ...prev,
          xp: (prev.xp || 0) + (xpGanho || 0),
          badges: newBadge && !prev.badges?.includes(newBadge) ? [...(prev.badges || []), newBadge] : prev.badges
        };
        reportingService.saveStudentSession(roomCode, updated);
        return updated;
      });
    }
    realtimeEngine.submitAnswer(alunoNome, perguntaId, opcaoId, correta, 0, xpGanho, newBadge);
  };

  const handleSendDoubt = (alunoNome, texto) => {
    realtimeEngine.sendDoubt(alunoNome, texto);
  };

  // Deslogar: volta para a tela de login do aluno, NUNCA para o menu de terminais do instrutor
  const handleLogoutAluno = () => {
    window.location.href = `/?sala=${encodeURIComponent(roomCode)}&modo=aluno`;
  };

  return (
    <div style={{ minHeight: '100vh', padding: '12px' }}>
      <Navbar
        role="aluno"
        roomCode={roomCode}
        participantCount={data.participantes.length}
        onBackHome={handleLogoutAluno}
      />

      <AlunoHUD
        state={data.state}
        aluno={currentStudent}
        respostas={data.respostas}
        onAnswerSubmit={handleAnswerSubmit}
        onSendDoubt={handleSendDoubt}
      />
    </div>
  );
}
