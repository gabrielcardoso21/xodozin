import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CreditCard, QrCode, FileText, CheckCircle } from 'lucide-react';
import { formatPhone } from '../utils/viaCep';

const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  PIX: 'pix',
  BOLETO: 'boleto'
};

/**
 * Componente de formulário de pagamento (mock)
 * @param {Object} props
 * @param {Object} props.payment - Dados do pagamento
 * @param {Function} props.onChange - Callback quando pagamento muda
 */
export default function PaymentForm({ payment = {}, onChange }) {
  const [selectedMethod, setSelectedMethod] = useState(
    payment.method || PAYMENT_METHODS.CREDIT_CARD
  );
  const [formData, setFormData] = useState({
    method: payment.method || PAYMENT_METHODS.CREDIT_CARD,
    // Cartão de crédito
    cardNumber: payment.cardNumber || '',
    cardName: payment.cardName || '',
    cardExpiry: payment.cardExpiry || '',
    cardCvv: payment.cardCvv || '',
    installments: payment.installments || '1',
    // PIX (gerado mock)
    pixCode: payment.pixCode || '',
    pixQrCode: payment.pixQrCode || '',
    // Boleto (gerado mock)
    boletoCode: payment.boletoCode || '',
    boletoDueDate: payment.boletoDueDate || ''
  });

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    const newData = { ...formData, method };
    
    // Gerar dados mock para PIX e Boleto
    if (method === PAYMENT_METHODS.PIX) {
      newData.pixCode = generateMockPixCode();
      newData.pixQrCode = generateMockPixQrCode();
    } else if (method === PAYMENT_METHODS.BOLETO) {
      newData.boletoCode = generateMockBoletoCode();
      newData.boletoDueDate = generateMockBoletoDueDate();
    }
    
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const handleFieldChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 16) return cleaned.slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 4) return cleaned.slice(0, 4);
    return cleaned.replace(/(\d{2})(?=\d)/g, '$1/');
  };

  const formatCvv = (value) => {
    return value.replace(/\D/g, '').slice(0, 3);
  };

  const generateMockPixCode = () => {
    // Gera código PIX mock (normalmente é uma string longa)
    return '00020126360014BR.GOV.BCB.PIX0114+55119999999990204000053039865802BR5909XODOZIN6009SAO PAULO62070503***6304' + 
           Math.random().toString(36).substring(2, 15).toUpperCase();
  };

  const generateMockPixQrCode = () => {
    // Em produção, seria gerado um QR Code real
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QSVggUXIgQ29kZTwvdGV4dD48L3N2Zz4=';
  };

  const generateMockBoletoCode = () => {
    // Gera código de barras mock (normalmente 44 dígitos)
    return '34191' + '0' + Math.random().toString().slice(2, 16).padStart(15, '0') + 
           Math.random().toString().slice(2, 12).padStart(10, '0') + 
           Math.random().toString().slice(2, 14).padStart(12, '0');
  };

  const generateMockBoletoDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 dias para vencimento
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Título da Seção */}
      <div>
        <h3 className="text-xl font-bold text-[#8B5A3C] mb-4">
          Como deseja pagar?
        </h3>
      </div>

      {/* Opções de Pagamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Cartão de Crédito */}
        <button
          type="button"
          onClick={() => handleMethodChange(PAYMENT_METHODS.CREDIT_CARD)}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedMethod === PAYMENT_METHODS.CREDIT_CARD
              ? 'border-[#C19A6B] bg-[#FFF8F0]'
              : 'border-[#C19A6B]/30 hover:border-[#C19A6B]/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-[#C19A6B]" />
            <span className="font-semibold text-[#8B5A3C]">Cartão de Crédito</span>
          </div>
          {selectedMethod === PAYMENT_METHODS.CREDIT_CARD && (
            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
          )}
        </button>

        {/* PIX */}
        <button
          type="button"
          onClick={() => handleMethodChange(PAYMENT_METHODS.PIX)}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedMethod === PAYMENT_METHODS.PIX
              ? 'border-[#C19A6B] bg-[#FFF8F0]'
              : 'border-[#C19A6B]/30 hover:border-[#C19A6B]/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-5 h-5 text-[#C19A6B]" />
            <span className="font-semibold text-[#8B5A3C]">PIX</span>
          </div>
          {selectedMethod === PAYMENT_METHODS.PIX && (
            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
          )}
        </button>

        {/* Boleto */}
        <button
          type="button"
          onClick={() => handleMethodChange(PAYMENT_METHODS.BOLETO)}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedMethod === PAYMENT_METHODS.BOLETO
              ? 'border-[#C19A6B] bg-[#FFF8F0]'
              : 'border-[#C19A6B]/30 hover:border-[#C19A6B]/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-[#C19A6B]" />
            <span className="font-semibold text-[#8B5A3C]">Boleto</span>
          </div>
          {selectedMethod === PAYMENT_METHODS.BOLETO && (
            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
          )}
        </button>
      </div>

      {/* Formulário de Cartão de Crédito */}
      {selectedMethod === PAYMENT_METHODS.CREDIT_CARD && (
        <div className="space-y-4 p-6 bg-[#FFF8F0] rounded-xl">
          <div>
            <Label htmlFor="cardNumber" className="block text-[#8B5A3C] font-medium mb-2">
              Número do Cartão *
            </Label>
            <Input
              id="cardNumber"
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleFieldChange('cardNumber', formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
              required
            />
          </div>

          <div>
            <Label htmlFor="cardName" className="block text-[#8B5A3C] font-medium mb-2">
              Nome no Cartão *
            </Label>
            <Input
              id="cardName"
              type="text"
              value={formData.cardName}
              onChange={(e) => handleFieldChange('cardName', e.target.value)}
              placeholder="Nome completo"
              className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardExpiry" className="block text-[#8B5A3C] font-medium mb-2">
                Validade (MM/AA) *
              </Label>
              <Input
                id="cardExpiry"
                type="text"
                value={formData.cardExpiry}
                onChange={(e) => handleFieldChange('cardExpiry', formatExpiry(e.target.value))}
                placeholder="MM/AA"
                maxLength={5}
                className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
                required
              />
            </div>
            <div>
              <Label htmlFor="cardCvv" className="block text-[#8B5A3C] font-medium mb-2">
                CVV *
              </Label>
              <Input
                id="cardCvv"
                type="text"
                value={formData.cardCvv}
                onChange={(e) => handleFieldChange('cardCvv', formatCvv(e.target.value))}
                placeholder="123"
                maxLength={3}
                className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="installments" className="block text-[#8B5A3C] font-medium mb-2">
              Parcelas *
            </Label>
            <select
              id="installments"
              value={formData.installments}
              onChange={(e) => handleFieldChange('installments', e.target.value)}
              className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4 bg-white"
              required
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}x {i === 0 ? 'sem juros' : 'com juros'}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* PIX */}
      {selectedMethod === PAYMENT_METHODS.PIX && (
        <div className="space-y-4 p-6 bg-[#FFF8F0] rounded-xl">
          <p className="text-[#6B5244] mb-4 text-center">
            Escaneie o QR Code ou copie o código PIX para pagar
          </p>
          <div className="mb-4 text-center">
            <img 
              src={formData.pixQrCode} 
              alt="QR Code PIX" 
              className="mx-auto max-w-xs border-2 border-[#C19A6B]/30 rounded-xl p-4 bg-white"
            />
          </div>
          <div>
            <Label className="block text-[#8B5A3C] font-medium mb-2">
              Código PIX (copiar)
            </Label>
            <Input
              type="text"
              value={formData.pixCode}
              readOnly
              className="w-full border-[#C19A6B]/30 rounded-xl p-4 bg-white font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(formData.pixCode);
                alert('Código PIX copiado!');
              }}
              className="mt-2 text-sm text-[#C19A6B] hover:text-[#8B5A3C]"
            >
              Copiar código
            </button>
          </div>
          <p className="text-xs text-[#6B5244] mt-4 text-center">
            Válido por 30 minutos
          </p>
        </div>
      )}

      {/* Boleto */}
      {selectedMethod === PAYMENT_METHODS.BOLETO && (
        <div className="space-y-4 p-6 bg-[#FFF8F0] rounded-xl">
          <div>
            <p className="text-[#6B5244] mb-4">
              O boleto será gerado após a confirmação do pedido
            </p>
            <div>
              <Label className="block text-[#8B5A3C] font-medium mb-2">
                Código de Barras
              </Label>
              <Input
                type="text"
                value={formData.boletoCode}
                readOnly
                className="w-full border-[#C19A6B]/30 rounded-xl p-4 bg-white font-mono text-xs"
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#6B5244]">
                <strong>Vencimento:</strong> {formData.boletoDueDate}
              </p>
              <p className="text-xs text-[#6B5244] mt-2">
                O boleto vence em 3 dias úteis após a confirmação do pedido
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

