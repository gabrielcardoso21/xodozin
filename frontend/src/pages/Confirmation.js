import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Sparkles, CheckCircle, Heart } from 'lucide-react';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="container max-w-2xl">
        <div className="card text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#C19A6B]/20 rounded-full animate-ping"></div>
              <CheckCircle className="w-24 h-24 text-[#C19A6B] relative z-10 fade-in-up" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#8B5A3C] mb-4 fade-in-up">
            Seu ritual foi recebido!
          </h1>
          
          <p className="text-lg text-[#6B5244] mb-8 max-w-xl mx-auto fade-in-up">
            Estamos preparando tudo com o mesmo carinho que você sente.
          </p>

          {/* Order Details */}
          <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E0] rounded-2xl p-6 mb-8 text-left fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#8B5A3C]">{order.ritual_name}</h2>
              <Sparkles className="w-6 h-6 text-[#C19A6B]" />
            </div>
            
            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-[#6B5244]">{item.product_name}</span>
                  <span className="font-medium text-[#8B5A3C]">R${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#C19A6B]/20 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#8B5A3C]">Total</span>
                <span className="text-xl font-bold text-[#C19A6B]">R${order.total.toFixed(2)}</span>
              </div>
            </div>

            {order.dedication && (
              <div className="mt-4 pt-4 border-t border-[#C19A6B]/20">
                <p className="text-xs text-[#8B5A3C] font-medium mb-1">Sua mensagem:</p>
                <p className="text-sm text-[#6B5244] italic">"{order.dedication}"</p>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="mb-8 fade-in-up">
            <Heart className="w-8 h-8 text-[#C19A6B] mx-auto mb-3" />
            <p className="text-[#6B5244] italic">
              "O presente não é o objeto, é a experiência de amor que o acompanha."
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-testid="back-to-home-btn"
              onClick={() => navigate('/')}
              className="btn-primary px-8 py-4"
            >
              Voltar ao início
            </Button>
            <Button
              data-testid="create-another-ritual-btn"
              onClick={() => navigate('/quiz')}
              className="btn-secondary px-8 py-4"
            >
              Criar outro ritual
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}