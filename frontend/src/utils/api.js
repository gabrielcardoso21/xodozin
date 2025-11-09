// Normaliza a URL do backend removendo barras duplicadas e finais
const normalizeUrl = (url) => {
  if (!url) return '';
  // Remove espaços
  url = url.trim();
  
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

// Obtém a URL do backend da variável de ambiente
const rawBackendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const BACKEND_URL = normalizeUrl(rawBackendUrl);

// Cria a URL da API garantindo que não há barras duplicadas
// Remove qualquer barra no final do BACKEND_URL e adiciona /api
const cleanBackendUrl = BACKEND_URL.replace(/\/+$/, '');
export const API_BASE_URL = `${cleanBackendUrl}/api`.replace(/\/+/g, '/');

// Exporta também a URL do backend para uso direto se necessário
export { BACKEND_URL };

