import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Heart, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const kit = location.state?.kit;
  const ritualName = location.state?.ritualName || kit?.name || 'Ritual Especial';
  const selectedProducts = location.state?.selectedProducts || [];
  
  const [dedication, setDedication] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!kit && selectedProducts.length === 0) {
      navigate('/');
    }
  }, [kit, selectedProducts, navigate]);

  const calculateTotal = () => {
    if (kit) {
      return kit.price_min;
    }
    return selectedProducts.reduce((sum, p) => sum + p.price, 0);
  };

  const total = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim()) {
      toast.error('Por favor, informe o endereço de entrega');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = selectedProducts.length > 0 
        ? selectedProducts.map(p => ({
            product_id: p.id,
            product_name: p.name,
            price: p.price
          }))
        : [{
            product_id: kit.id,
            product_name: kit.name,
            price: kit.price_min
          }];

      const orderData = {
        ritual_name: ritualName,
        items: orderItems,
        dedication: dedication || undefined,
        delivery_address: deliveryAddress
      };

      const response = await axios.post(`${API}/orders`, orderData);
      toast.success('Pedido realizado com sucesso!');
      navigate('/confirmation', { state: { order: response.data } });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-3xl">
        {/* Header */}
        <button 
          data-testid="back-btn"
          onClick={() => navigate(-1)}
          className="text-[#8B5A3C] hover:text-[#6B5244] font-medium mb-8"
        >
          ← Voltar
        </button>

        <div className="card">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-[#C19A6B] mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#8B5A3C] mb-2">
              Seu ritual está sendo preparado com amor
            </h1>
            <p className="text-[#6B5244]">
              Complete os detalhes para finalizar
            </p>
          </div>

          {/* Ritual Summary */}
          <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E0] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#8B5A3C] mb-4">{ritualName}</h2>
            
            <div className="space-y-3 mb-4">
              {selectedProducts.length > 0 ? (
                selectedProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-[#6B5244]">{product.name}</span>
                    <span className="font-semibold text-[#8B5A3C]">R${product.price.toFixed(2)}</span>
                  </div>
                ))
              ) : kit ? (
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5244]">{kit.name}</span>
                  <span className="font-semibold text-[#8B5A3C]">R${kit.price_min.toFixed(2)}</span>
                </div>
              ) : null}
            </div>

            <div className="border-t border-[#C19A6B]/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-[#8B5A3C]">Total</span>
                <span className="text-2xl font-bold text-[#C19A6B]">R${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#8B5A3C] font-medium mb-2" htmlFor="dedication">
                Mensagem dedicatória (opcional)
              </label>
              <Textarea
                id="dedication"
                data-testid="dedication-input"
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                placeholder="Escreva uma mensagem especial para acompanhar o ritual..."
                className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4 min-h-32"
                maxLength={500}
              />
              <p className="text-xs text-[#6B5244] mt-1">
                {dedication.length}/500 caracteres
              </p>
            </div>

            <div>
              <label className="block text-[#8B5A3C] font-medium mb-2" htmlFor="address">
                <MapPin className="inline w-5 h-5 mr-1" />
                Endereço de entrega em São Paulo
              </label>
              <Input
                id="address"
                data-testid="address-input"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Rua, número, bairro, CEP"
                className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
                required
              />
            </div>

            <Button
              data-testid="submit-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-6 text-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Processando...' : 'Confirmar ritual ✨'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}