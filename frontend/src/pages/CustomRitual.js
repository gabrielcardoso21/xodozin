import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Sparkles, Leaf, Heart, BookOpen, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomRitual() {
  const location = useLocation();
  const navigate = useNavigate();
  const ritualData = location.state?.ritualData;
  
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (!ritualData) {
      navigate('/quiz');
    }
  }, [ritualData, navigate]);

  if (!ritualData) return null;

  const categoryIcons = {
    sensorial: Leaf,
    afetivo: Heart,
    ritualistico: BookOpen
  };

  const categoryLabels = {
    sensorial: 'Elemento Sensorial',
    afetivo: 'Símbolo Afetivo',
    ritualistico: 'Guia Ritualístico'
  };

  const productsByCategory = ritualData.suggested_products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const handleToggleProduct = (product) => {
    const isSelected = selectedProducts.find(p => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleProceedToCheckout = () => {
    if (selectedProducts.length === 0) {
      toast.error('Selecione pelo menos um item para continuar');
      return;
    }
    navigate('/checkout', { 
      state: { 
        ritualName: ritualData.ritual_name, 
        selectedProducts 
      } 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container py-6">
        <button 
          data-testid="back-to-home-btn"
          onClick={() => navigate('/')}
          className="text-[#8B5A3C] hover:text-[#6B5244] font-medium"
        >
          ← Voltar ao início
        </button>
      </div>

      {/* Ritual Name */}
      <div className="container py-8 text-center">
        <div className="flex justify-center mb-4">
          <Sparkles className="w-12 h-12 text-[#C19A6B]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#8B5A3C] mb-4 fade-in-up">
          {ritualData.ritual_name}
        </h1>
        <p className="text-[#6B5244] max-w-2xl mx-auto">
          Escolha os itens que farão parte deste ritual especial
        </p>
      </div>

      {/* Products by Category */}
      <div className="container py-8">
        {Object.entries(productsByCategory).map(([category, products], catIndex) => {
          const Icon = categoryIcons[category] || Sparkles;
          return (
            <div key={category} className="mb-12 fade-in-up" style={{ animationDelay: `${catIndex * 0.1}s` }}>
              <div className="flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-[#C19A6B] mr-2" />
                <h2 className="text-2xl font-bold text-[#8B5A3C]">
                  {categoryLabels[category]}
                </h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const isSelected = selectedProducts.find(p => p.id === product.id);
                  return (
                    <div 
                      key={product.id}
                      data-testid={`product-card-${product.id}`}
                      onClick={() => handleToggleProduct(product)}
                      className={`product-card cursor-pointer ${
                        isSelected ? 'ring-4 ring-[#C19A6B] shadow-2xl' : ''
                      }`}
                    >
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="product-image"
                      />
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[#8B5A3C] mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#6B5244] mb-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#C19A6B]">
                            R${product.price.toFixed(2)}
                          </span>
                          <Button
                            data-testid={`select-product-${product.id}-btn`}
                            className={`${
                              isSelected 
                                ? 'bg-[#8B5A3C] hover:bg-[#6B5244]' 
                                : 'bg-[#C19A6B] hover:bg-[#8B5A3C]'
                            } text-white px-4 py-2 rounded-full text-sm`}
                          >
                            {isSelected ? 'Selecionado' : 'Selecionar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#C19A6B]/20 shadow-lg">
          <div className="container py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div>
                <p className="text-sm text-[#6B5244]">
                  {selectedProducts.length} {selectedProducts.length === 1 ? 'item selecionado' : 'itens selecionados'}
                </p>
                <p className="text-2xl font-bold text-[#8B5A3C]">
                  R${totalPrice.toFixed(2)}
                </p>
              </div>
              <Button
                data-testid="proceed-to-checkout-btn"
                onClick={handleProceedToCheckout}
                className="btn-primary px-8 py-6 text-lg flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Finalizar ritual
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-32"></div>
    </div>
  );
}