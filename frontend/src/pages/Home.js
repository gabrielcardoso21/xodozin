import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Gift, Leaf } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Home() {
  const navigate = useNavigate();
  const [kits, setKits] = useState([]);

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      const response = await axios.get(`${API}/kits`);
      setKits(response.data);
    } catch (error) {
      console.error('Error fetching kits:', error);
    }
  };

  const kitIcons = {
    'xodo': Heart,
    'encanto': Sparkles,
    'completo': Gift
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content fade-in-up text-center">
          <div className="mb-6 flex justify-center">
            <div className="float-animation">
              <Sparkles className="w-16 h-16 text-[#C19A6B]" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#8B5A3C] mb-6 leading-tight">
            Mais que um presente,<br />
            um ritual de chamego
          </h1>
          
          <p className="text-base sm:text-lg text-[#6B5244] mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubra rituais que transformam o ato de presentear em momentos de magia e significado
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              data-testid="monte-seu-ritual-btn"
              onClick={() => navigate('/quiz')}
              className="btn-primary text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl"
              size="lg"
            >
              Monte seu ritual ✨
            </Button>
          </div>
          
          <div className="mt-12 relative">
            <img 
              src="https://images.unsplash.com/photo-1759137395099-01af9f4eb4af?w=800" 
              alt="Mãos oferecendo presente"
              className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="container py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#8B5A3C] mb-12">
          Como funciona
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card text-center fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#C19A6B] to-[#DAA58C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#8B5A3C] mb-3">① Escolha o ritual</h3>
            <p className="text-[#6B5244] text-sm leading-relaxed">Selecione entre nossos kits prontos ou crie um ritual personalizado</p>
          </div>
          
          <div className="card text-center fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#C19A6B] to-[#DAA58C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#8B5A3C] mb-3">② Personalize o presente</h3>
            <p className="text-[#6B5244] text-sm leading-relaxed">Escolha cada item com carinho e adicione uma mensagem especial</p>
          </div>
          
          <div className="card text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#C19A6B] to-[#DAA58C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#8B5A3C] mb-3">③ Receba com chamego</h3>
            <p className="text-[#6B5244] text-sm leading-relaxed">Entregamos em São Paulo com todo cuidado e afeto</p>
          </div>
        </div>
      </section>

      {/* Kits Prontos */}
      <section className="container py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#8B5A3C] mb-4">
          Rituais que já nascem prontos
        </h2>
        <p className="text-center text-[#6B5244] mb-12 max-w-2xl mx-auto">
          Kits cuidadosamente montados para diferentes momentos e intenções
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {kits.map((kit, index) => {
            const Icon = kitIcons[kit.tier] || Heart;
            const priceDisplay = kit.price_max && kit.price_max !== kit.price_min 
              ? `R$${kit.price_min}–${kit.price_max}`
              : `R$${kit.price_min}`;
            
            return (
              <div key={kit.id} className="product-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <img 
                  src={kit.image_url} 
                  alt={kit.name}
                  className="product-image"
                />
                <div className="p-6">
                  <div className="flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-[#C19A6B] mr-2" />
                    <h3 className="text-2xl font-bold text-[#8B5A3C]">{kit.name}</h3>
                  </div>
                  <p className="text-[#6B5244] mb-4 text-sm text-center">{kit.description}</p>
                  <p className="text-3xl font-bold text-[#C19A6B] text-center mb-4">{priceDisplay}</p>
                  <Button 
                    data-testid={`add-kit-${kit.tier}-btn`}
                    onClick={() => navigate('/checkout', { state: { kit } })}
                    className="w-full bg-[#C19A6B] hover:bg-[#8B5A3C] text-white py-3 rounded-full"
                  >
                    Escolher este ritual
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Por que Xodózin */}
      <section className="container py-16">
        <div className="card max-w-3xl mx-auto">
          <div className="text-center">
            <Leaf className="w-12 h-12 text-[#C19A6B] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#8B5A3C] mb-6">Por que Xodózin?</h2>
            <p className="text-[#6B5244] mb-4 leading-relaxed">
              Acreditamos que o verdadeiro valor de um presente não está no objeto em si, mas na <strong>experiência simbólica</strong> e no <strong>ritual de afeto</strong> que o acompanha.
            </p>
            <p className="text-[#6B5244] leading-relaxed">
              Cada caixa Xodózin é cuidadosamente montada para criar momentos de conexão verdadeira, transformando o ato de presentear em um ritual de magia e significado.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <div className="container">
          <p className="text-[#8B5A3C] text-lg font-medium mb-4 italic">
            "Presentes passam. Rituais ficam."
          </p>
          <p className="text-[#6B5244] text-sm">
            Presente é sentimento embalado em significado 💛
          </p>
          <p className="text-[#A0826D] text-xs mt-4">
            Entregas exclusivas em São Paulo (capital e região metropolitana)
          </p>
        </div>
      </footer>
    </div>
  );
}