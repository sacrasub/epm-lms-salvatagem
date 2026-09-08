import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import TelaoPage from './pages/TelaoPage';
import AlunoPage from './pages/AlunoPage';
import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home'); // 'home', 'telao', 'aluno'
  const [roomCode, setRoomCode] = useState('EPM2026');
  const [nomeGuerra, setNomeGuerra] = useState('Marinheiro Silva');

  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const urlSala = params.get('sala') || 'EPM2026';
      const urlNome = params.get('nome');

      setRoomCode(urlSala);

      if (path === '/telao' || params.get('modo') === 'telao') {
        setCurrentRoute('telao');
      } else if (path === '/aluno' || (params.get('modo') === 'aluno' && urlNome)) {
        setNomeGuerra(urlNome || 'Marinheiro');
        setCurrentRoute('aluno');
      } else {
        setCurrentRoute('home');
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  const navigateTo = (route, sala = roomCode, nome = nomeGuerra) => {
    setRoomCode(sala);
    setNomeGuerra(nome);
    setCurrentRoute(route);

    const queryParams = new URLSearchParams();
    queryParams.set('sala', sala);
    if (route === 'aluno') queryParams.set('nome', nome);
    queryParams.set('modo', route);

    const newUrl = `/${route === 'home' ? '' : route}?${queryParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        {currentRoute === 'home' && (
          <Home
            onEnterTelao={(sala) => navigateTo('telao', sala)}
            onEnterAluno={(sala, nome) => navigateTo('aluno', sala, nome)}
          />
        )}

        {currentRoute === 'telao' && (
          <TelaoPage
            roomCode={roomCode}
            onBackHome={() => navigateTo('home')}
          />
        )}

        {currentRoute === 'aluno' && (
          <AlunoPage
            roomCode={roomCode}
            nomeGuerra={nomeGuerra}
            onBackHome={() => navigateTo('home')}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
