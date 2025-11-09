// Normaliza a URL do backend removendo barras duplicadas
const normalizeUrl = (url) => {
  if (!url) return '';
  // Remove barras finais e normaliza
  return url.replace(/\/+$/, '').replace(/\/+/g, '/');
};

// Obtém a URL do backend da variável de ambiente
const BACKEND_URL = normalizeUrl(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');

// Cria a URL da API garantindo que não há barras duplicadas
export const API_BASE_URL = `${BACKEND_URL}/api`.replace(/\/+/g, '/');

// Exporta também a URL do backend para uso direto se necessário
export { BACKEND_URL };

