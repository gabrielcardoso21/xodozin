// Normaliza a URL do backend removendo barras duplicadas e finais
const normalizeUrl = (url) => {
  if (!url) return '';
  // Remove espaços
  url = url.trim();
  
  // Se não começar com http:// ou https://, adiciona https://
  if (!url.match(/^https?:\/\//i)) {
    url = `https://${url}`;
  }
  
  // Remove barras finais e normaliza todas as barras duplicadas
  return url.replace(/\/+$/, '').replace(/\/+/g, '/');
};

// Obtém a URL do backend da variável de ambiente
const rawBackendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const BACKEND_URL = normalizeUrl(rawBackendUrl);

// Cria a URL da API garantindo que não há barras duplicadas
// Remove qualquer barra no final do BACKEND_URL e adiciona /api
const cleanBackendUrl = BACKEND_URL.replace(/\/+$/, '');
const API_BASE_URL_RAW = `${cleanBackendUrl}/api`.replace(/\/+/g, '/');

// Garante que a URL é absoluta (começa com http:// ou https://)
export const API_BASE_URL = API_BASE_URL_RAW.startsWith('http://') || API_BASE_URL_RAW.startsWith('https://') 
  ? API_BASE_URL_RAW 
  : `https://${API_BASE_URL_RAW}`;

// Exporta também a URL do backend para uso direto se necessário
export { BACKEND_URL };

