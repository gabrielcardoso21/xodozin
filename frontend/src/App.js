import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import CustomRitual from './pages/CustomRitual';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Kits from './pages/Kits';
import Sobre from './pages/Sobre';
import Rituais from './pages/Rituais';
import { Toaster } from './components/ui/sonner';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  useEffect(() => {
    console.log('[App] Componente App montado');
    console.log('[App] document.body existe?', !!document.body);
    console.log('[App] document.getElementById("root") existe?', !!document.getElementById("root"));
    
    const rootElement = document.getElementById("root");
    if (rootElement) {
      console.log('[App] #root.innerHTML:', rootElement.innerHTML?.substring(0, 200));
      console.log('[App] #root.children.length:', rootElement.children.length);
    }
    
    // Monitora mudanças no root
    const checkRoot = () => {
      const root = document.getElementById("root");
      if (root) {
        const childrenCount = root.children.length;
        if (childrenCount === 0) {
          console.warn('[App] AVISO: #root está vazio!');
          console.warn('[App] #root.innerHTML:', root.innerHTML);
        }
      }
    };
    
    checkRoot();
    const interval = setInterval(checkRoot, 1000);
    
    return () => {
      clearInterval(interval);
      console.log('[App] Componente App desmontado');
    };
  }, []);

  console.log('[App] Renderizando App');
  
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/kits" element={<Kits />} />
                <Route path="/rituais" element={<Rituais />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/custom-ritual" element={<CustomRitual />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </ErrorBoundary>
  );
}

export default App;