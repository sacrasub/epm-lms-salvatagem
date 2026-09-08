import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[EPM ErrorBoundary]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#040c17',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: '#fff',
          fontFamily: 'var(--font-main)'
        }}>
          <div className="naval-card naval-card-alert" style={{
            maxWidth: '540px',
            width: '100%',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255, 51, 68, 0.15)',
              border: '1px solid var(--solas-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--solas-red)',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
              AVISO OPERACIONAL DO SISTEMA
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Ocorreu uma interrupção temporária na interface. Clique no botão abaixo para restabelecer a conexão naval.
            </p>

            <button
              onClick={this.handleReload}
              className="btn-tactical btn-cyan"
              style={{ padding: '12px 24px', margin: '0 auto' }}
            >
              <RefreshCw size={18} />
              <span>RECARREGAR TELA</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
