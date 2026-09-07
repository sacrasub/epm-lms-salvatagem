import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import AlunoHUD from '../components/aluno/AlunoHUD';
import { realtimeEngine } from '../lib/realtimeEngine';

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

    const unsubscribe = realtimeEngine.subscribe((snapshot) => {
      setData(snapshot);
      // Atualiza o estado do aluno atual a partir do snapshot
      const me = snapshot.participantes.find(p => p.nome === nomeGuerra);
      if (me) {
        setCurrentStudent(me);
      }
    });

    return () => unsubscribe();
  }, [roomCode, nomeGuerra]);

  const handleAnswerSubmit = (alunoNome, perguntaId, opcaoId, correta, xpGanho, newBadge) => {
    realtimeEngine.submitAnswer(alunoNome, perguntaId, opcaoId, correta, 0, xpGanho, newBadge);
  };

  const handleSendDoubt = (alunoNome, texto) => {
    realtimeEngine.sendDoubt(alunoNome, texto);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '12px' }}>
      <Navbar
        role="aluno"
        roomCode={roomCode}
        participantCount={data.participantes.length}
        onBackHome={onBackHome}
      />

      <AlunoHUD
        state={data.state}
        aluno={currentStudent}
        onAnswerSubmit={handleAnswerSubmit}
        onSendDoubt={handleSendDoubt}
      />
    </div>
  );
}
