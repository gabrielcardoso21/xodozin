import { validateCep } from './cepValidator';

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 * @param {string} cep - CEP para buscar (com ou sem formatação)
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const fetchAddressByCep = async (cep) => {
  const cleaned = cep?.replace(/\D/g, '') || '';
  
  // Validação básica de formato
  if (cleaned.length !== 8) {
    return { 
      success: false, 
      error: 'CEP deve ter 8 dígitos' 
    };
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    const data = await response.json();
    
    // ViaCEP retorna erro se CEP não existir
    if (data.erro) {
      return { 
        success: false, 
        error: 'CEP não encontrado' 
      };
    }

    // Valida se é São Paulo
    const validation = validateCep(cleaned);
    if (!validation.valid) {
      return { 
        success: false, 
        error: validation.error 
      };
    }

    return {
      success: true,
      data: {
        cep: data.cep,
        logradouro: data.logradouro || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        localidade: data.localidade || '',
        uf: data.uf || '',
        // Campos adicionais para facilitar o uso
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || ''
      }
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return { 
      success: false, 
      error: 'Erro ao buscar endereço. Tente novamente.' 
    };
  }
};

/**
 * Máscara para telefone brasileiro
 * @param {string} phone - Telefone sem formatação
 * @returns {string} - Telefone formatado (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const formatPhone = (phone) => {
  const cleaned = phone?.replace(/\D/g, '') || '';
  
  if (cleaned.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return cleaned
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Celular: (XX) XXXXX-XXXX
    return cleaned
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

/**
 * Remove formatação do telefone
 * @param {string} phone - Telefone com formatação
 * @returns {string} - Telefone apenas com números
 */
export const cleanPhone = (phone) => {
  return phone?.replace(/\D/g, '') || '';
};

