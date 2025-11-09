// Normaliza a URL do backend removendo barras duplicadas e garantindo protocolo
const normalizeUrl = (url) => {
  if (!url) return '';
  
  // Remove espaços e converte para string
  url = String(url).trim();
  
  // Garante que a URL começa com http:// ou https://
  if (!url.match(/^https?:\/\//i)) {
    // Se não começar com protocolo, adiciona http://
    url = `http://${url}`;
  }
  
  // Separa o protocolo do resto da URL
  const protocolMatch = url.match(/^(https?:\/\/)/i);
  if (protocolMatch) {
    const protocol = protocolMatch[0]; // http:// ou https://
    const rest = url.substring(protocol.length);
    // Normaliza o resto (remove barras duplicadas e finais)
    const normalized = rest.replace(/\/+$/, '').replace(/\/+/g, '/');
    return `${protocol}${normalized}`;
  }
  
  // Fallback: remove barras finais e normaliza
  return url.replace(/\/+$/, '').replace(/\/+/g, '/');
};

// Obtém a URL do backend da variável de ambiente
const BACKEND_URL = normalizeUrl(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000');

// Cria a URL da API garantindo que não há barras duplicadas e que é absoluta
let API_BASE_URL;
const protocolMatch = BACKEND_URL.match(/^(https?:\/\/)/i);
if (protocolMatch) {
  const protocol = protocolMatch[0];
  const rest = BACKEND_URL.substring(protocol.length);
  const normalized = rest.replace(/\/+$/, '').replace(/\/+/g, '/');
  API_BASE_URL = `${protocol}${normalized}/api`;
} else {
  API_BASE_URL = `${BACKEND_URL}/api`;
}

// Log para debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('=== API URL Debug ===');
  console.log('REACT_APP_BACKEND_URL (raw):', process.env.REACT_APP_BACKEND_URL);
  console.log('BACKEND_URL (normalized):', BACKEND_URL);
  console.log('API_BASE_URL (final):', API_BASE_URL);
  console.log('====================');
}

// Exporta a URL da API
export { API_BASE_URL };

// Exporta também a URL do backend para uso direto se necessário
export { BACKEND_URL };

