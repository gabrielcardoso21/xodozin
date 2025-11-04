/**
 * Validação de CEP para São Paulo (capital e região metropolitana)
 * 
 * Faixas de CEP aceitas:
 * - Capital: 01000-000 a 05999-999
 * - Região Metropolitana: 06000-000 a 09999-999
 */

/**
 * Remove caracteres não numéricos do CEP
 * @param {string} cep - CEP com ou sem formatação
 * @returns {string} - CEP apenas com números
 */
export const cleanCep = (cep) => {
  return cep?.replace(/\D/g, '') || '';
};

/**
 * Formata CEP com máscara 00000-000
 * @param {string} cep - CEP sem formatação
 * @returns {string} - CEP formatado
 */
export const formatCep = (cep) => {
  const cleaned = cleanCep(cep);
  if (cleaned.length !== 8) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};

/**
 * Valida se o CEP tem formato válido (8 dígitos)
 * @param {string} cep - CEP para validar
 * @returns {boolean} - true se formato válido
 */
export const isValidCepFormat = (cep) => {
  const cleaned = cleanCep(cep);
  return cleaned.length === 8 && /^\d{8}$/.test(cleaned);
};

/**
 * Valida se o CEP pertence a São Paulo (capital ou região metropolitana)
 * @param {string} cep - CEP para validar
 * @returns {boolean} - true se pertence a SP
 */
export const isSaoPauloCep = (cep) => {
  const cleaned = cleanCep(cep);
  
  if (!isValidCepFormat(cleaned)) {
    return false;
  }

  const cepNumber = parseInt(cleaned, 10);
  
  // Capital: 01000-000 a 05999-999
  // Região Metropolitana: 06000-000 a 09999-999
  return (cepNumber >= 1000000 && cepNumber <= 5999999) || 
         (cepNumber >= 6000000 && cepNumber <= 9999999);
};

/**
 * Valida CEP completo (formato e localização)
 * @param {string} cep - CEP para validar
 * @returns {{ valid: boolean, error?: string }} - Resultado da validação
 */
export const validateCep = (cep) => {
  const cleaned = cleanCep(cep);
  
  if (!cleaned) {
    return { valid: false, error: 'CEP é obrigatório' };
  }
  
  if (!isValidCepFormat(cleaned)) {
    return { valid: false, error: 'CEP deve ter 8 dígitos' };
  }
  
  if (!isSaoPauloCep(cleaned)) {
    return { 
      valid: false, 
      error: 'Por enquanto, entregamos apenas em São Paulo (capital e região metropolitana)' 
    };
  }
  
  return { valid: true };
};

