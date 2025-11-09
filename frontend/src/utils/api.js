// Normaliza a URL do backend removendo barras duplicadas e finais
const normalizeUrl = (url) => {
  if (!url) return '';
  // Remove espaços e converte para string
  url = String(url).trim();
  
  // Se não começar com http:// ou https://, adiciona https://
  if (!url.match(/^https?:\/\//i)) {
    url = `https://${url}`;
  }
  
  // Remove barras finais e normaliza todas as barras duplicadas (mas mantém o protocolo)
  // Primeiro separa o protocolo do resto da URL
  const protocolMatch = url.match(/^(https?:\/\/)/i);
  if (protocolMatch) {
    const protocol = protocolMatch[0];
    const restOfUrl = url.substring(protocol.length);
    // Normaliza o resto da URL (remove barras duplicadas e finais)
    const normalizedRest = restOfUrl.replace(/\/+$/, '').replace(/\/+/g, '/');
    return `${protocol}${normalizedRest}`;
  }
  
  // Fallback: remove barras finais e normaliza
  return url.replace(/\/+$/, '').replace(/\/+/g, '/');
};

// Função para obter a URL da API (executada em runtime)
const getApiBaseUrl = () => {
  // Obtém a URL do backend da variável de ambiente
  const rawBackendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  
  // Normaliza a URL do backend (remove protocolos duplicados, etc)
  const BACKEND_URL = normalizeUrl(rawBackendUrl);
  
  // Cria a URL da API garantindo que não há barras duplicadas
  const cleanBackendUrl = BACKEND_URL.replace(/\/+$/, '');
  let apiUrl = `${cleanBackendUrl}/api`.replace(/\/+/g, '/');
  
  // Garante que a URL é absoluta (começa com http:// ou https://)
  // Mas NÃO adiciona se já tiver (para evitar duplicação)
  if (!apiUrl.match(/^https?:\/\//i)) {
    apiUrl = `https://${apiUrl}`;
  }
  
  // Verificação final: remove protocolos duplicados que possam ter sido criados
  apiUrl = normalizeUrl(apiUrl);
  
  return apiUrl;
};

// Exporta função para obter URL em runtime
export const API_BASE_URL = getApiBaseUrl();

// Exporta também a URL do backend para uso direto se necessário
export const BACKEND_URL = normalizeUrl(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');

