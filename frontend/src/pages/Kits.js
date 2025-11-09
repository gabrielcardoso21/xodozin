import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Gift, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL as API } from '../utils/api';

const kitCategories = {
  'autocuidado': { label: 'Autocuidado & Reconexão', icon: Heart, color: 'text-pink-600' },
  'romantico': { label: 'Conexão Romântica', icon: Sparkles, color: 'text-red-600' },
  'amizade': { label: 'Amizade & Conexão Platônica', icon: Gift, color: 'text-blue-600' },
  'planejamento': { label: 'Planejamento & Manifestação', icon: Leaf, color: 'text-green-600' },
  'celebracao': { label: 'Celebração & Gratidão', icon: Sparkles, color: 'text-yellow-600' },
};

export default function Kits() {
  const navigate = useNavigate();
  const [kits, setKits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const filteredKits = selectedCategory
    ? kits.filter(kit => {
        // Mapear kits para categorias baseado no tier
        const categoryMap = {
          'xodo': 'autocuidado',
          'encanto': 'romantico',
          'completo': 'amizade'
        };
        return categoryMap[kit.tier] === selectedCategory;
      })
    : kits;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2cc8f] to-[#F2cc8f] pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#Da2c38] mb-4 font-serif">
            Kits Pré-Prontos
          </h1>
          <p className="text-lg text-[#ff595e] max-w-2xl mx-auto leading-relaxed">
            Cada caixa é um portal - você entrega, a pessoa atravessa sozinha. 
            Rituais prontos pra transformar presentes em momentos de conexão verdadeira.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="bg-[#da2c38] text-white hover:bg-[#da2c38] border-none"
          >
            Todos
          </Button>
          {Object.entries(kitCategories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key)}
                className={selectedCategory === key 
                  ? "bg-[#da2c38] text-white hover:bg-[#da2c38] border-none"
                  : "border-[#da2c38] text-[#Da2c38] hover:bg-white/50"
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Kits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredKits.map((kit) => {
            const Icon = kitIcons[kit.tier] || Gift;
            const price = kit.price_max || kit.price_min;
            
            return (
              <div
                key={kit.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gradient-to-br from-[#F2cc8f] to-[#F2cc8f]">
                  {kit.image_url && (
                    <img
                      src={kit.image_url}
                      alt={kit.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Icon className="h-5 w-5 text-[#da2c38]" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#Da2c38] mb-2 font-serif">
                    {kit.name}
                  </h3>
                  <p className="text-[#ff595e] mb-4 leading-relaxed">
                    {kit.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-[#da2c38]">
                        R$ {price.toFixed(2)}
                      </span>
                      {kit.price_max && (
                        <span className="text-sm text-[#ff595e]/60 ml-2">
                          (R$ {kit.price_min.toFixed(2)} - R$ {kit.price_max.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/quiz', { state: { selectedKit: kit } })}
                    className="w-full bg-[#da2c38] text-white hover:bg-[#c02530]"
                  >
                    Criar Ritual Personalizado
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredKits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#ff595e] text-lg">
              Nenhum kit encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

