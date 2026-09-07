import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import TelaoHUD from '../components/telao/TelaoHUD';
import QrCodeModal from '../components/common/QrCodeModal';
import { realtimeEngine } from '../lib/realtimeEngine';

export default function TelaoPage({ roomCode = 'EPM2026', onBackHome }) {
  const [data, setData] = useState({
    state: realtimeEngine.state,
    participantes: realtimeEngine.participantes,
    respostas: realtimeEngine.respostas,
    duvidas: realtimeEngine.duvidas
  });
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
    realtimeEngine.init(roomCode);
    const unsubscribe = realtimeEngine.subscribe((snapshot) => {
      setData(snapshot);
    });

    return () => unsubscribe();
  }, [roomCode]);

  return (
    <div style={{ minHeight: '100vh', padding: '16px' }}>
      <Navbar
        role="telao"
        roomCode={roomCode}
        participantCount={data.participantes.length}
        onOpenQr={() => setIsQrOpen(true)}
        onBackHome={onBackHome}
      />

      <TelaoHUD
        state={data.state}
        participantes={data.participantes}
        respostas={data.respostas}
        duvidas={data.duvidas}
        onSetMission={(mId) => realtimeEngine.setMission(mId)}
        onSetEtapa={(etapaIdx, tipo, vidId) => realtimeEngine.setEtapa(etapaIdx, tipo, vidId)}
        onTriggerDynamic={(din, tempo) => realtimeEngine.triggerDynamic(din, tempo)}
        onCloseDynamic={() => realtimeEngine.closeDynamic()}
      />

      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        roomCode={roomCode}
      />
    </div>
  );
}
