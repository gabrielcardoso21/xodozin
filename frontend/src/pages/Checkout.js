import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Heart, Package, Mail, Calendar, MapPin as MapPinIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import AddressForm from '../components/AddressForm';
import PaymentForm from '../components/PaymentForm';
import { formatPhone, cleanPhone } from '../utils/viaCep';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const kit = location.state?.kit;
  const ritualName = location.state?.ritualName || kit?.name || 'Ritual Especial';
  const selectedProducts = location.state?.selectedProducts || [];
  
  const [dedication, setDedication] = useState('');
  const [address, setAddress] = useState({});
  const [recipient, setRecipient] = useState({
    name: '',
    phone: '',
    email: '',
    whatsappUpdates: false
  });
  const [payment, setPayment] = useState({});
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

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setRecipient({ ...recipient, phone: formatted });
  };

  const validateForm = () => {
    if (!address.cep || !address.logradouro || !address.numero || !address.bairro) {
      toast.error('Por favor, complete o endereço de entrega');
      return false;
    }

    if (!recipient.name || !recipient.phone || !recipient.email) {
      toast.error('Por favor, complete os dados do destinatário');
      return false;
    }

    if (!payment.method) {
      toast.error('Por favor, selecione uma forma de pagamento');
      return false;
    }

    if (payment.method === 'credit_card') {
      if (!payment.cardNumber || !payment.cardName || !payment.cardExpiry || !payment.cardCvv) {
        toast.error('Por favor, complete os dados do cartão de crédito');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
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

      // Formata endereço completo
      const fullAddress = `${address.logradouro}, ${address.numero}${
        address.complemento ? `, ${address.complemento}` : ''
      } - ${address.bairro}, ${address.cidade} - ${address.estado}, CEP: ${address.cep}`;

      const orderData = {
        ritual_name: ritualName,
        items: orderItems,
        dedication: dedication || undefined,
        delivery_address: fullAddress,
        recipient: {
          name: recipient.name,
          phone: cleanPhone(recipient.phone),
          email: recipient.email,
          whatsapp_updates: recipient.whatsappUpdates
        },
        payment: {
          method: payment.method,
          // Não enviar dados sensíveis do cartão em produção real
          installments: payment.installments || '1'
        }
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
      <div className="container max-w-4xl">
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
            <h2 className="text-2xl font-bold text-[#8B5A3C] mb-4">Seu Ritual</h2>
            
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Mensagem Dedicatória */}
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
                maxLength={200}
              />
              <p className="text-xs text-[#6B5244] mt-1">
                {dedication.length}/200 caracteres
              </p>
            </div>

            {/* Endereço de Entrega */}
            <AddressForm 
              address={address}
              onChange={setAddress}
            />

            {/* Dados do Destinatário */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#8B5A3C] mb-4">
                Dados do Destinatário
              </h3>
              
              <div>
                <Label htmlFor="recipientName" className="block text-[#8B5A3C] font-medium mb-2">
                  Nome Completo *
                </Label>
                <Input
                  id="recipientName"
                  type="text"
                  value={recipient.name}
                  onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                  placeholder="Nome completo"
                  className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientPhone" className="block text-[#8B5A3C] font-medium mb-2">
                    Telefone *
                  </Label>
                  <Input
                    id="recipientPhone"
                    type="text"
                    value={recipient.phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="recipientEmail" className="block text-[#8B5A3C] font-medium mb-2">
                    E-mail *
                  </Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    value={recipient.email}
                    onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="whatsappUpdates"
                  checked={recipient.whatsappUpdates}
                  onChange={(e) => setRecipient({ ...recipient, whatsappUpdates: e.target.checked })}
                  className="w-4 h-4 text-[#C19A6B] border-[#C19A6B]/30 rounded focus:ring-[#C19A6B]"
                />
                <Label htmlFor="whatsappUpdates" className="text-[#6B5244] text-sm cursor-pointer">
                  Desejo receber atualizações sobre meu pedido via WhatsApp
                </Label>
              </div>
            </div>

            {/* Pagamento */}
            <PaymentForm 
              payment={payment}
              onChange={setPayment}
            />

            {/* Área de Confirmação - Informações Importantes */}
            <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E0] border-2 border-[#C19A6B] rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-[#8B5A3C] mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-[#C19A6B]" />
                Informações Importantes
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#C19A6B] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#8B5A3C]">Prazo de Entrega</p>
                    <p className="text-[#6B5244] text-sm">5 dias úteis</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-[#C19A6B] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#8B5A3C]">Área de Entrega</p>
                    <p className="text-[#6B5244] text-sm">São Paulo (capital e região metropolitana)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-[#C19A6B] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#8B5A3C]">Envio</p>
                    <p className="text-[#6B5244] text-sm">Embalagem especial para preservar o ritual</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C19A6B] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#8B5A3C]">Confirmação</p>
                    <p className="text-[#6B5244] text-sm">Você receberá um e-mail com o código de rastreamento</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              data-testid="submit-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-6 text-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Pedido e Finalizar Compra ✨'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
