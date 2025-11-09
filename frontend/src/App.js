import { useState } from 'react';
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

function App() {
  return (
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
  );
}

export default App;