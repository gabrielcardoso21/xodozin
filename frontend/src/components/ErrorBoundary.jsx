import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    console.log('[ErrorBoundary] Constructor chamado');
  }

  static getDerivedStateFromError(error) {
    console.error('[ErrorBoundary] getDerivedStateFromError chamado com erro:', error);
    console.error('[ErrorBoundary] Stack trace:', error.stack);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] componentDidCatch chamado');
    console.error('[ErrorBoundary] Erro:', error);
    console.error('[ErrorBoundary] ErrorInfo:', errorInfo);
    console.error('[ErrorBoundary] document.body existe?', !!document.body);
    console.error('[ErrorBoundary] document.getElementById("root") existe?', !!document.getElementById("root"));
    
    const rootElement = document.getElementById("root");
    if (rootElement) {
      console.error('[ErrorBoundary] #root.innerHTML:', rootElement.innerHTML?.substring(0, 500));
      console.error('[ErrorBoundary] #root.children.length:', rootElement.children.length);
    }
  }

  componentDidMount() {
    console.log('[ErrorBoundary] componentDidMount chamado');
    console.log('[ErrorBoundary] hasError:', this.state.hasError);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('[ErrorBoundary] componentDidUpdate chamado');
    console.log('[ErrorBoundary] prevState.hasError:', prevState.hasError);
    console.log('[ErrorBoundary] currentState.hasError:', this.state.hasError);
    
    if (this.state.hasError && !prevState.hasError) {
      console.error('[ErrorBoundary] Erro detectado, renderizando tela de erro');
    }
  }

  render() {
    console.log('[ErrorBoundary] render chamado, hasError:', this.state.hasError);
    
    if (this.state.hasError) {
      console.error('[ErrorBoundary] Renderizando tela de erro');
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
              onClick={() => {
                console.log('[ErrorBoundary] Botão de recarregar clicado');
                window.location.reload();
              }}
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

    console.log('[ErrorBoundary] Renderizando children normalmente');
    return this.props.children;
  }
}

export default ErrorBoundary;

