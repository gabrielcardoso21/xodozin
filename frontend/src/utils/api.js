// Normaliza a URL do backend removendo barras duplicadas e finais
const normalizeUrl = (url) => {
  if (!url) return '';
  // Remove espaços
  url = String(url).trim();
  
  // Remove protocolos duplicados (ex: https://https:// ou http://https://)
  // Mantém apenas o primeiro protocolo encontrado
  const protocolMatch = url.match(/^(https?:\/\/)/i);
  if (protocolMatch) {
    // Remove todos os protocolos e mantém apenas o primeiro
    url = url.replace(/^(https?:\/\/)+/i, protocolMatch[0]);
  } else {
    // Se não começar com http:// ou https://, adiciona https://
    url = `https://${url}`;
  }
  
  // Remove barras finais e normaliza todas as barras duplicadas
  return url.replace(/\/+$/, '').replace(/\/+/g, '/');
};

// Função para obter a URL da API (executada em runtime)
const getApiBaseUrl = () => {
  // Obtém a URL do backend da variável de ambiente
  const rawBackendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const BACKEND_URL = normalizeUrl(rawBackendUrl);
  
  // Cria a URL da API garantindo que não há barras duplicadas
  const cleanBackendUrl = BACKEND_URL.replace(/\/+$/, '');
  let apiUrl = `${cleanBackendUrl}/api`.replace(/\/+/g, '/');
  
  // Garante que a URL é absoluta (começa com http:// ou https://)
  if (!apiUrl.match(/^https?:\/\//i)) {
    apiUrl = `https://${apiUrl}`;
  }
  
  return apiUrl;
};

// Exporta função para obter URL em runtime
export const API_BASE_URL = getApiBaseUrl();

// Exporta também a URL do backend para uso direto se necessário
export const BACKEND_URL = normalizeUrl(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');

