import { X, ShoppingCart, Sparkles, Heart, Leaf, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

const categoryIcons = {
  sensorial: Leaf,
  afetivo: Heart,
  ritualistico: BookOpen
};

const categoryLabels = {
  sensorial: 'Sensorial',
  afetivo: 'Afetivo',
  ritualistico: 'Ritualístico'
};

/**
 * Painel lateral fixo com resumo do kit personalizado
 * @param {Object} props
 * @param {string} props.ritualName - Nome do ritual
 * @param {Array} props.selectedProducts - Lista de produtos selecionados
 * @param {Function} props.onRemoveProduct - Callback para remover produto
 * @param {Function} props.onProceedToCheckout - Callback para finalizar
 * @param {boolean} props.isMobile - Se está em mobile (vira drawer)
 */
export default function SummaryPanel({
  ritualName,
  selectedProducts = [],
  onRemoveProduct,
  onProceedToCheckout,
  isMobile = false
}) {
  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  // Contar produtos por categoria
  const categoryCounts = selectedProducts.reduce((acc, product) => {
    const category = product.category || 'outros';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Calcular categorias balanceadas
  const categories = Object.keys(categoryCounts);
  const isBalanced = categories.length >= 2;

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#da2c38]/20 shadow-lg z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <p className="text-sm text-[#ff595e]">
                {selectedProducts.length} {selectedProducts.length === 1 ? 'item' : 'itens'}
              </p>
              <p className="text-2xl font-bold text-[#Da2c38]">
                R${totalPrice.toFixed(2)}
              </p>
            </div>
            <Button
              onClick={onProceedToCheckout}
              disabled={selectedProducts.length === 0}
              className="btn-primary px-8 py-6 text-lg flex items-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              Finalizar ritual
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-4 h-fit">
      <div className="bg-gradient-to-br from-[#F2cc8f] to-[#F2cc8f] rounded-2xl p-6 border border-[#da2c38]/30 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#da2c38]" />
          <h3 className="text-xl font-bold text-[#Da2c38]">{ritualName}</h3>
        </div>

        {/* Itens Selecionados */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#Da2c38] mb-3">
            Itens Selecionados ({selectedProducts.length})
          </h4>
          
          {selectedProducts.length === 0 ? (
            <p className="text-sm text-[#ff595e] italic">
              Nenhum item selecionado ainda
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedProducts.map((product) => {
                const CategoryIcon = categoryIcons[product.category] || Sparkles;
                return (
                  <div
                    key={product.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                  >
                    <CategoryIcon className="w-4 h-4 text-[#da2c38] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#Da2c38] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#ff595e]">
                        R${product.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="text-[#ff595e] hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Remover item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Categorias Balanceadas */}
        {selectedProducts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[#Da2c38] mb-3">
              Categorias
            </h4>
            <div className="space-y-2">
              {Object.entries(categoryCounts).map(([category, count]) => {
                const CategoryIcon = categoryIcons[category] || Sparkles;
                const label = categoryLabels[category] || category;
                return (
                  <div
                    key={category}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/50"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4 text-[#da2c38]" />
                      <span className="text-xs text-[#ff595e]">{label}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#Da2c38]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            {isBalanced && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Kit balanceado entre categorias
              </p>
            )}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-[#da2c38]/20 pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-[#Da2c38]">Total</span>
            <span className="text-2xl font-bold text-[#da2c38]">
              R${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={onProceedToCheckout}
          disabled={selectedProducts.length === 0}
          className="w-full btn-primary py-6 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          Finalizar Ritual
        </Button>

        {selectedProducts.length === 0 && (
          <p className="text-xs text-center text-[#ff595e] mt-2">
            Selecione pelo menos um item para continuar
          </p>
        )}
      </div>
    </div>
  );
}

