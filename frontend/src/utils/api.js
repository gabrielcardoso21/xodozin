// Normaliza a URL do backend removendo barras duplicadas e finais
const normalizeUrl = (url) => {
  if (!url) return '';
  // Remove espaços, barras finais e normaliza todas as barras duplicadas
  return url.trim().replace(/\/+$/, '').replace(/\/+/g, '/');
};

// Obtém a URL do backend da variável de ambiente
const BACKEND_URL = normalizeUrl(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');

// Cria a URL da API garantindo que não há barras duplicadas
// Remove qualquer barra no final do BACKEND_URL e adiciona /api
const cleanBackendUrl = BACKEND_URL.replace(/\/+$/, '');
export const API_BASE_URL = `${cleanBackendUrl}/api`.replace(/\/+/g, '/');

// Exporta também a URL do backend para uso direto se necessário
export { BACKEND_URL };

