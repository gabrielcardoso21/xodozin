import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import CEPInput from './CEPInput';
import { MapPin } from 'lucide-react';

/**
 * Componente de formulário de endereço completo com autocompletar via CEP
 * @param {Object} props
 * @param {Object} props.address - Objeto com dados do endereço
 * @param {Function} props.onChange - Callback quando endereço muda
 * @param {boolean} props.showLabel - Se deve mostrar labels
 */
export default function AddressForm({ 
  address = {}, 
  onChange,
  showLabel = true 
}) {
  const [formData, setFormData] = useState({
    cep: address.cep || '',
    logradouro: address.logradouro || address.street || '',
    numero: address.numero || '',
    complemento: address.complemento || '',
    bairro: address.bairro || address.neighborhood || '',
    cidade: address.cidade || address.city || 'São Paulo',
    estado: address.estado || address.state || 'SP',
    referencia: address.referencia || ''
  });

  const handleFieldChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const handleCepFound = (addressData) => {
    const newData = {
      ...formData,
      cep: addressData.cep,
      logradouro: addressData.logradouro || addressData.street || '',
      bairro: addressData.bairro || addressData.neighborhood || '',
      cidade: addressData.localidade || addressData.city || 'São Paulo',
      estado: addressData.uf || addressData.state || 'SP',
      complemento: addressData.complemento || ''
    };
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const handleCepError = (error) => {
    // Erro já é exibido pelo componente CEPInput
    console.error('CEP Error:', error);
  };

  return (
    <div className="space-y-4">
      {/* Título da Seção */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-[#C19A6B]" />
        <h3 className="text-xl font-bold text-[#8B5A3C]">
          Onde entregar seu ritual?
        </h3>
      </div>

      {/* CEP */}
      <div>
        {showLabel && (
          <Label htmlFor="cep" className="block text-[#8B5A3C] font-medium mb-2">
            CEP *
          </Label>
        )}
        <CEPInput
          value={formData.cep}
          onChange={(value) => handleFieldChange('cep', value)}
          onAddressFound={handleCepFound}
          onError={handleCepError}
          required
        />
      </div>

      {/* Logradouro */}
      <div>
        {showLabel && (
          <Label htmlFor="logradouro" className="block text-[#8B5A3C] font-medium mb-2">
            Rua/Logradouro *
          </Label>
        )}
        <Input
          id="logradouro"
          value={formData.logradouro}
          onChange={(e) => handleFieldChange('logradouro', e.target.value)}
          placeholder="Rua, Avenida, etc."
          className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
          required
        />
      </div>

      {/* Número e Complemento - lado a lado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {showLabel && (
            <Label htmlFor="numero" className="block text-[#8B5A3C] font-medium mb-2">
              Número *
            </Label>
          )}
          <Input
            id="numero"
            type="text"
            value={formData.numero}
            onChange={(e) => handleFieldChange('numero', e.target.value)}
            placeholder="123"
            className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
            required
          />
        </div>
        <div>
          {showLabel && (
            <Label htmlFor="complemento" className="block text-[#8B5A3C] font-medium mb-2">
              Complemento
            </Label>
          )}
          <Input
            id="complemento"
            type="text"
            value={formData.complemento}
            onChange={(e) => handleFieldChange('complemento', e.target.value)}
            placeholder="Apto, bloco, etc."
            className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
          />
        </div>
      </div>

      {/* Bairro */}
      <div>
        {showLabel && (
          <Label htmlFor="bairro" className="block text-[#8B5A3C] font-medium mb-2">
            Bairro *
          </Label>
        )}
        <Input
          id="bairro"
          value={formData.bairro}
          onChange={(e) => handleFieldChange('bairro', e.target.value)}
          placeholder="Bairro"
          className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
          required
        />
      </div>

      {/* Cidade e Estado - lado a lado (fixos para SP) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {showLabel && (
            <Label htmlFor="cidade" className="block text-[#8B5A3C] font-medium mb-2">
              Cidade *
            </Label>
          )}
          <Input
            id="cidade"
            value={formData.cidade}
            className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4 bg-gray-50"
            readOnly
            required
          />
        </div>
        <div>
          {showLabel && (
            <Label htmlFor="estado" className="block text-[#8B5A3C] font-medium mb-2">
              Estado *
            </Label>
          )}
          <Input
            id="estado"
            value={formData.estado}
            className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4 bg-gray-50"
            readOnly
            required
          />
        </div>
      </div>

      {/* Referência (opcional) */}
      <div>
        {showLabel && (
          <Label htmlFor="referencia" className="block text-[#8B5A3C] font-medium mb-2">
            Ponto de referência
          </Label>
        )}
        <Input
          id="referencia"
          value={formData.referencia}
          onChange={(e) => handleFieldChange('referencia', e.target.value)}
          placeholder="Ex: Próximo ao mercado, próximo ao ponto de ônibus..."
          className="w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4"
        />
      </div>
    </div>
  );
}

