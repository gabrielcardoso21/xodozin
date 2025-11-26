import { useState, useEffect, Suspense, lazy } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { Skeleton } from './components/ui/skeleton';

// Code splitting - lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Quiz = lazy(() => import('./pages/Quiz'));
const CustomRitual = lazy(() => import('./pages/CustomRitual'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const Kits = lazy(() => import('./pages/Kits'));
const Sobre = lazy(() => import('./pages/Sobre'));
const Rituais = lazy(() => import('./pages/Rituais'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Skeleton className="w-64 h-8 mb-4 mx-auto" />
      <Skeleton className="w-96 h-4 mb-2 mx-auto" />
      <Skeleton className="w-80 h-4 mx-auto" />
    </div>
  </div>
);

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
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </ErrorBoundary>
  );
}

export default App;