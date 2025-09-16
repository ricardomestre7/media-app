import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Em produção, enviar erro para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: Sentry, LogRocket, etc.
      // this.reportErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center max-w-lg">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Ops! Algo deu errado</h1>
            <p className="text-red-200 mb-6">
              Ocorreu um erro inesperado. Nossa equipe foi notificada automaticamente.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full"
              >
                Recarregar Página
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors w-full"
              >
                Voltar ao Início
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-red-300 hover:text-red-200">
                  Detalhes do Erro (Dev)
                </summary>
                <div className="mt-4 p-4 bg-black/20 rounded-lg text-sm font-mono">
                  <p className="text-red-400 mb-2">
                    {this.state.error && this.state.error.toString()}
                  </p>
                  <pre className="text-red-300 text-xs overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;