import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Loader2, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { formatCep, cleanCep, validateCep } from '../utils/cepValidator';
import { fetchAddressByCep } from '../utils/viaCep';

/**
 * Componente de input de CEP com validação e busca automática
 * @param {Object} props
 * @param {string} props.value - Valor do CEP
 * @param {Function} props.onChange - Callback quando o CEP muda
 * @param {Function} props.onAddressFound - Callback quando endereço é encontrado
 * @param {Function} props.onError - Callback quando há erro
 * @param {boolean} props.required - Se o campo é obrigatório
 * @param {string} props.className - Classes CSS adicionais
 */
export default function CEPInput({ 
  value = '', 
  onChange, 
  onAddressFound, 
  onError,
  required = false,
  className = ''
}) {
  const [cep, setCep] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState({ valid: null, error: null });
  const [hasBlurred, setHasBlurred] = useState(false);

  useEffect(() => {
    setCep(value);
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const cleaned = cleanCep(rawValue);
    
    // Limita a 8 dígitos
    if (cleaned.length > 8) return;
    
    // Formata enquanto digita
    const formatted = formatCep(cleaned);
    setCep(formatted);
    
    if (onChange) {
      onChange(formatted);
    }

    // Limpa validação anterior enquanto digita
    if (validation.error) {
      setValidation({ valid: null, error: null });
    }
  };

  const handleBlur = async () => {
    setHasBlurred(true);
    const cleaned = cleanCep(cep);
    
    if (!cleaned) {
      if (required) {
        setValidation({ valid: false, error: 'CEP é obrigatório' });
        if (onError) onError('CEP é obrigatório');
      }
      return;
    }

    // Valida formato
    const formatValidation = validateCep(cleaned);
    if (!formatValidation.valid) {
      setValidation(formatValidation);
      if (onError) onError(formatValidation.error);
      return;
    }

    // Busca endereço
    setIsLoading(true);
    setValidation({ valid: null, error: null });

    try {
      const result = await fetchAddressByCep(cleaned);
      
      if (result.success) {
        setValidation({ valid: true, error: null });
        if (onAddressFound) {
          onAddressFound(result.data);
        }
      } else {
        setValidation({ valid: false, error: result.error });
        if (onError) onError(result.error);
      }
    } catch (error) {
      const errorMsg = 'Erro ao buscar endereço. Tente novamente.';
      setValidation({ valid: false, error: errorMsg });
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = () => {
    let baseClasses = `w-full border-[#C19A6B]/30 focus:border-[#8B5A3C] rounded-xl p-4 ${className}`;
    
    if (hasBlurred && validation.valid === false) {
      baseClasses += ' border-red-500 focus:border-red-500';
    } else if (validation.valid === true) {
      baseClasses += ' border-green-500 focus:border-green-500';
    }
    
    return baseClasses;
  };

  return (
    <div className="w-full">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C19A6B]" />
        <Input
          type="text"
          value={cep}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="00000-000"
          maxLength={9}
          className={getInputClassName()}
          style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }}
          required={required}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-[#C19A6B] animate-spin" />
          ) : validation.valid === true ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : validation.valid === false ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : null}
        </div>
      </div>
      
      {hasBlurred && validation.error && (
        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          {validation.error}
        </p>
      )}
      
      {validation.valid === true && (
        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          CEP válido para São Paulo
        </p>
      )}
    </div>
  );
}

