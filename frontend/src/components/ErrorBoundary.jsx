import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F2cc8f] p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#Da2c38] mb-4">
              Ops! Algo deu errado
            </h2>
            <p className="text-[#463f3a] mb-4">
              Ocorreu um erro ao carregar a página. Por favor, recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#da2c38] text-white px-4 py-2 rounded-lg hover:bg-[#c02530] transition-colors"
            >
              Recarregar Página
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-[#463f3a]">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
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

