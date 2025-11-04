import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Sparkles, Leaf, Heart, BookOpen, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import SummaryPanel from '../components/SummaryPanel';

const CATEGORIES = {
  sensorial: { label: 'Elemento Sensorial', icon: Leaf, color: 'text-green-600' },
  afetivo: { label: 'Símbolo Afetivo', icon: Heart, color: 'text-red-600' },
  ritualistico: { label: 'Guia Ritualístico', icon: BookOpen, color: 'text-purple-600' }
};

export default function CustomRitual() {
  const location = useLocation();
  const navigate = useNavigate();
  const ritualData = location.state?.ritualData;
  
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!ritualData) {
      navigate('/quiz');
    }
  }, [ritualData, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!ritualData) return null;

  // Organizar produtos por categoria
  const productsByCategory = ritualData.suggested_products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Filtrar produtos por categoria selecionada
  const getFilteredProducts = () => {
    if (selectedCategories.length === 0) {
      return productsByCategory;
    }
    const filtered = {};
    selectedCategories.forEach(category => {
      if (productsByCategory[category]) {
        filtered[category] = productsByCategory[category];
      }
    });
    return filtered;
  };

  const filteredProductsByCategory = getFilteredProducts();

  const handleToggleProduct = (product) => {
    const isSelected = selectedProducts.find(p => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
      toast.success(`${product.name} removido do ritual`);
    } else {
      setSelectedProducts([...selectedProducts, product]);
      toast.success(`${product.name} adicionado ao ritual`);
    }
  };

  const handleRemoveProduct = (productId) => {
    const product = selectedProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
      toast.success(`${product.name} removido do ritual`);
    }
  };

  const handleToggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

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

      {/* Layout Principal - Desktop com Sidebar, Mobile sem */}
      <div className={`container py-8 ${!isMobile ? 'grid grid-cols-12 gap-8' : ''}`}>
        {/* Conteúdo Principal */}
        <div className={!isMobile ? 'col-span-8' : ''}>
          {/* Filtros por Categoria */}
          <div className="mb-8 fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#C19A6B]" />
              <h3 className="text-lg font-semibold text-[#8B5A3C]">Filtros por Categoria</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(CATEGORIES).map(([category, info]) => {
                const Icon = info.icon;
                const isSelected = selectedCategories.includes(category);
                const hasProducts = productsByCategory[category]?.length > 0;
                
                if (!hasProducts) return null;
                
                return (
                  <button
                    key={category}
                    onClick={() => handleToggleCategory(category)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-[#C19A6B] bg-[#FFF8F0] text-[#8B5A3C]'
                        : 'border-[#C19A6B]/30 text-[#6B5244] hover:border-[#C19A6B]/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${info.color}`} />
                    <span className="text-sm font-medium">{info.label}</span>
                    {isSelected && (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                );
              })}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-4 py-2 rounded-full border-2 border-[#C19A6B]/30 text-[#6B5244] hover:border-[#C19A6B]/50 text-sm font-medium"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Products by Category */}
          <div className="space-y-12">
            {Object.entries(filteredProductsByCategory).map(([category, products], catIndex) => {
              const categoryInfo = CATEGORIES[category] || { label: category, icon: Sparkles };
              const Icon = categoryInfo.icon;
              
              return (
                <div key={category} className="fade-in-up" style={{ animationDelay: `${catIndex * 0.1}s` }}>
                  <div className="flex items-center justify-center mb-6">
                    <Icon className={`w-6 h-6 ${categoryInfo.color} mr-2`} />
                    <h2 className="text-2xl font-bold text-[#8B5A3C]">
                      {categoryInfo.label}
                    </h2>
                    <span className="ml-2 text-sm text-[#6B5244]">
                      ({products.length} {products.length === 1 ? 'item' : 'itens'})
                    </span>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                      const isSelected = selectedProducts.find(p => p.id === product.id);
                      return (
                        <div 
                          key={product.id}
                          data-testid={`product-card-${product.id}`}
                          onClick={() => handleToggleProduct(product)}
                          className={`product-card cursor-pointer transition-all ${
                            isSelected 
                              ? 'ring-4 ring-[#C19A6B] shadow-2xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E0]' 
                              : 'hover:ring-2 hover:ring-[#C19A6B]/50 hover:shadow-lg'
                          }`}
                        >
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="product-image"
                          />
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-[#8B5A3C]">
                                {product.name}
                              </h3>
                              <Icon className={`w-5 h-5 ${categoryInfo.color}`} />
                            </div>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleProduct(product);
                                }}
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
        </div>

        {/* Painel Lateral - Desktop */}
        {!isMobile && (
          <div className="col-span-4">
            <SummaryPanel
              ritualName={ritualData.ritual_name}
              selectedProducts={selectedProducts}
              onRemoveProduct={handleRemoveProduct}
              onProceedToCheckout={handleProceedToCheckout}
              isMobile={false}
            />
          </div>
        )}
      </div>

      {/* Painel Inferior - Mobile */}
      {isMobile && (
        <SummaryPanel
          ritualName={ritualData.ritual_name}
          selectedProducts={selectedProducts}
          onRemoveProduct={handleRemoveProduct}
          onProceedToCheckout={handleProceedToCheckout}
          isMobile={true}
        />
      )}

      {/* Bottom spacing para mobile */}
      {isMobile && selectedProducts.length > 0 && (
        <div className="h-32"></div>
      )}
    </div>
  );
}
