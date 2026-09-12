import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TelaoPage from './pages/TelaoPage';
import AlunoPage from './pages/AlunoPage';
import ApresentadorPage from './pages/ApresentadorPage';
import ProjetorPage from './pages/ProjetorPage';
import AdminPage from './pages/AdminPage';
import ErrorBoundary from './components/common/ErrorBoundary';

// Wrapper da Home com detecção de redirecionamento por query param
function HomeRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sala = searchParams.get('sala') || 'EPM2026';
  const modo = searchParams.get('modo');
  const nome = searchParams.get('nome');

  // Redireciona se a URL tiver parâmetros legados ?modo=...
  if (modo === 'apresentador') {
    return <Navigate to={`/apresentador?sala=${encodeURIComponent(sala)}`} replace />;
  }
  if (modo === 'projetor') {
    return <Navigate to={`/projetor?sala=${encodeURIComponent(sala)}`} replace />;
  }
  if (modo === 'telao') {
    return <Navigate to={`/telao?sala=${encodeURIComponent(sala)}`} replace />;
  }
  if (modo === 'aluno' && nome) {
    return <Navigate to={`/aluno?sala=${encodeURIComponent(sala)}&nome=${encodeURIComponent(nome)}`} replace />;
  }

  return (
    <Home
      onEnterTelao={(s) => navigate(`/telao?sala=${encodeURIComponent(s)}`)}
      onEnterApresentador={(s) => navigate(`/apresentador?sala=${encodeURIComponent(s)}`)}
      onEnterAluno={(s, n) => navigate(`/aluno?sala=${encodeURIComponent(s)}&nome=${encodeURIComponent(n)}`)}
    />
  );
}

function ApresentadorRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sala = searchParams.get('sala') || 'EPM2026';

  return (
    <ApresentadorPage
      roomCode={sala}
      onBackHome={() => navigate('/')}
    />
  );
}

function ProjetorRoute() {
  const [searchParams] = useSearchParams();
  const sala = searchParams.get('sala') || 'EPM2026';

  return <ProjetorPage roomCode={sala} />;
}

function TelaoRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sala = searchParams.get('sala') || 'EPM2026';

  return (
    <TelaoPage
      roomCode={sala}
      onBackHome={() => navigate('/')}
    />
  );
}

function AlunoRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sala = searchParams.get('sala') || 'EPM2026';
  const nome = searchParams.get('nome') || 'Marinheiro';

  return (
    <AlunoPage
      roomCode={sala}
      nomeGuerra={nome}
      onBackHome={() => navigate('/')}
    />
  );
}

function AdminRoute() {
  const navigate = useNavigate();
  return <AdminPage onBackHome={() => navigate('/')} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/apresentador" element={<ApresentadorRoute />} />
            <Route path="/projetor" element={<ProjetorRoute />} />
            <Route path="/telao" element={<TelaoRoute />} />
            <Route path="/aluno" element={<AlunoRoute />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
