/**
 * Configuração WooCommerce REST API
 */

// Normaliza URL removendo barras duplicadas
const normalizeUrl = (url) => {
  if (!url) return '';
  
  url = String(url).trim();
  
  if (!url.match(/^https?:\/\//i)) {
    url = `https://${url}`;
  }
  
  const protocolMatch = url.match(/^(https?:\/\/)/i);
  if (protocolMatch) {
    const protocol = protocolMatch[0];
    const rest = url.substring(protocol.length);
    const normalized = rest.replace(/\/+$/, '').replace(/\/+/g, '/');
    return `${protocol}${normalized}`;
  }
  
  return url.replace(/\/+$/, '').replace(/\/+/g, '/');
};

// Configuração da API WooCommerce
export const WOOCOMMERCE_CONFIG = {
  baseURL: normalizeUrl(process.env.REACT_APP_WOOCOMMERCE_API_URL || ''),
  consumerKey: process.env.REACT_APP_WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.REACT_APP_WOOCOMMERCE_CONSUMER_SECRET || '',
  apiVersion: 'wc/v3', // Versão da API WooCommerce
};

// URL base da API REST
export const WOOCOMMERCE_API_URL = WOOCOMMERCE_CONFIG.baseURL 
  ? `${WOOCOMMERCE_CONFIG.baseURL}/wp-json/${WOOCOMMERCE_CONFIG.apiVersion}`
  : '';

// Verificar se configuração está completa
export const isWooCommerceConfigured = () => {
  return !!(
    WOOCOMMERCE_CONFIG.baseURL &&
    WOOCOMMERCE_CONFIG.consumerKey &&
    WOOCOMMERCE_CONFIG.consumerSecret
  );
};

// Log de debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('=== WooCommerce Config Debug ===');
  console.log('Base URL:', WOOCOMMERCE_CONFIG.baseURL);
  console.log('API URL:', WOOCOMMERCE_API_URL);
  console.log('Consumer Key:', WOOCOMMERCE_CONFIG.consumerKey ? '***configurado***' : 'não configurado');
  console.log('Consumer Secret:', WOOCOMMERCE_CONFIG.consumerSecret ? '***configurado***' : 'não configurado');
  console.log('Configurado:', isWooCommerceConfigured());
  console.log('================================');
}

export default WOOCOMMERCE_CONFIG;

