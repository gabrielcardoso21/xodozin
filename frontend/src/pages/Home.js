import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Gift, Leaf } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL as API } from '../utils/api';

export default function Home() {
  const navigate = useNavigate();
  const [kits, setKits] = useState([]);

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      console.log('Fetching kits from:', `${API}/kits`);
      const response = await axios.get(`${API}/kits`);
      console.log('Kits response:', response.data);
      setKits(response.data);
    } catch (error) {
      console.error('Error fetching kits:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
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
              <Sparkles className="w-16 h-16 text-[#da2c38]" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#Da2c38] mb-6 leading-tight font-serif">
            O xodó que conecta<br />
            gente de verdade
          </h1>
          
          <p className="text-base sm:text-lg text-[#ff595e] mb-8 max-w-2xl mx-auto leading-relaxed">
            A Xodózin é aquele presente que faz a pessoa pensar "caramba, fulano me conhece MESMO". 
            É pra quem tá cansado de dar (e receber) presente genérico e quer criar um momento especial de verdade. 
            Cada caixa é um portal - você entrega, a pessoa atravessa sozinha.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              data-testid="monte-seu-ritual-btn"
              onClick={() => navigate('/quiz')}
              className="btn-primary text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl"
              size="lg"
            >
              Criar meu ritual personalizado ✨
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
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#Da2c38] mb-12">
          Como funciona
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card text-center fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#da2c38] to-[#da2c38] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#Da2c38] mb-3">① Escolha o ritual</h3>
            <p className="text-[#ff595e] text-sm leading-relaxed">Selecione entre nossos kits prontos ou crie um ritual personalizado</p>
          </div>
          
          <div className="card text-center fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#da2c38] to-[#da2c38] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#Da2c38] mb-3">② Personalize o presente</h3>
            <p className="text-[#ff595e] text-sm leading-relaxed">Escolha cada item com carinho e adicione uma mensagem especial</p>
          </div>
          
          <div className="card text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#da2c38] to-[#da2c38] rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#Da2c38] mb-3">③ Receba com chamego</h3>
            <p className="text-[#ff595e] text-sm leading-relaxed">Entregamos em São Paulo com todo cuidado e afeto</p>
          </div>
        </div>
      </section>

      {/* Kits Prontos */}
      <section className="container py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#Da2c38] mb-4 font-serif">
          Kits Pré-Prontos
        </h2>
        <p className="text-center text-[#ff595e] mb-12 max-w-2xl mx-auto leading-relaxed">
          Cada caixa é um convite para atravessar: um momento de pausa, de reconexão, de reencontro com o que há de mais humano em nós. 
          Não é sobre ter mais uma coisa bonita - é sobre viver uma experiência que transfere significado, que cria vínculo, que marca a memória afetiva.
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
                    <Icon className="w-6 h-6 text-[#da2c38] mr-2" />
                    <h3 className="text-2xl font-bold text-[#Da2c38]">{kit.name}</h3>
                  </div>
                  <p className="text-[#ff595e] mb-4 text-sm text-center">{kit.description}</p>
                  <p className="text-3xl font-bold text-[#da2c38] text-center mb-4">{priceDisplay}</p>
                  <div className="flex flex-col gap-2">
                    <Button 
                      data-testid={`add-kit-${kit.tier}-btn`}
                      onClick={() => navigate('/checkout', { state: { kit } })}
                      className="w-full bg-[#da2c38] hover:bg-[#Da2c38] text-white py-3 rounded-full"
                    >
                      Escolher Kit Pronto
                    </Button>
                    <Button 
                      data-testid={`personalize-kit-${kit.tier}-btn`}
                      onClick={() => navigate('/quiz')}
                      className="w-full bg-transparent border-2 border-[#da2c38] text-[#da2c38] hover:bg-[#da2c38]/10 py-3 rounded-full"
                    >
                      Personalizar Meu Ritual
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* O que é um Ritual de Presente? */}
      <section className="container py-16">
        <div className="card max-w-3xl mx-auto">
          <div className="text-center">
            <Leaf className="w-12 h-12 text-[#da2c38] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#Da2c38] mb-6 font-serif">Por que Xodózin?</h2>
            <p className="text-[#ff595e] mb-4 leading-relaxed">
              <strong>Não é só um presente</strong> - é uma experiência de reconexão. 
              <strong> Não é genérico</strong> - cada elemento tem significado específico. 
              <strong> Não é raso</strong> - tem profundidade teórica com leveza na entrega. 
              <strong> Não é solitário</strong> - mesmo sozinha, a pessoa sente que alguém a viu de verdade.
            </p>
            <p className="text-[#ff595e] mb-4 leading-relaxed">
              Cada elemento aqui foi escolhido pra transferir um significado específico. É ciência + afeto. 
              Rituais transferem significados do mundo cultural para os objetos, e dos objetos para as pessoas.
            </p>
            <p className="text-[#ff595e] leading-relaxed italic">
              A gente te dá colo (e algumas perguntas que vão cutucar com carinho). 
              Porque você merece esse chamego todo - e uns questionamentos saudáveis também.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <div className="container">
          <p className="text-[#Da2c38] text-lg font-medium mb-4 italic">
            Feito com escuta afetuosa, provocação gentil e muito xodó 💜
          </p>
          <p className="text-[#ff595e] text-sm">
            Portal não tem validade. Atravessa no seu tempo.
          </p>
          <p className="text-[#ff595e] text-xs mt-4">
            Entregas exclusivas em São Paulo (capital e região metropolitana)
          </p>
        </div>
      </footer>
    </div>
  );
}