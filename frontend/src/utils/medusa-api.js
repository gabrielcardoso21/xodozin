import axios from 'axios';

const MEDUSA_BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.REACT_APP_MEDUSA_PUBLISHABLE_KEY || '';

const medusaApi = axios.create({
  baseURL: `${MEDUSA_BACKEND_URL}`,
  headers: {
    'Content-Type': 'application/json',
    ...(PUBLISHABLE_API_KEY && { 'x-publishable-api-key': PUBLISHABLE_API_KEY }),
  },
});

/**
 * Store API - Endpoints públicos do Medusa
 */
export const storeApi = {
  /**
   * Listar produtos
   * @param {Object} params - Parâmetros de busca (limit, offset, etc.)
   * @returns {Promise<Object>} Lista de produtos
   */
  getProducts: async (params = {}) => {
    const response = await medusaApi.get('/store/products', { params });
    return response.data;
  },
  
  /**
   * Buscar produto por ID
   * @param {string} id - ID do produto
   * @returns {Promise<Object>} Dados do produto
   */
  getProduct: async (id) => {
    const response = await medusaApi.get(`/store/products/${id}`);
    return response.data;
  },
  
  /**
   * Buscar produtos por categoria (usando metadata)
   * @param {string} category - Categoria (sensorial, afetivo, ritualistico)
   * @returns {Promise<Object>} Lista de produtos filtrados
   */
  getProductsByCategory: async (category) => {
    const response = await medusaApi.get('/store/products', {
      params: {
        'metadata[category]': category
      }
    });
    return response.data;
  },
  
  /**
   * Listar collections (kits)
   * @returns {Promise<Object>} Lista de collections
   */
  getCollections: async () => {
    const response = await medusaApi.get('/store/collections');
    return response.data;
  },
  
  /**
   * Buscar collection por ID
   * @param {string} id - ID da collection
   * @returns {Promise<Object>} Dados da collection
   */
  getCollection: async (id) => {
    const response = await medusaApi.get(`/store/collections/${id}`);
    return response.data;
  },
  
  /**
   * Criar carrinho
   * @param {string|number} regionId - ID da região (pode ser string 'br' ou ID numérico)
   * @returns {Promise<Object>} Dados do carrinho criado
   */
  createCart: async (regionId = null) => {
    const payload = regionId ? { region_id: regionId } : {};
    const response = await medusaApi.post('/store/carts', payload);
    return response.data;
  },

  /**
   * Listar regiões disponíveis
   * @returns {Promise<Object>} Lista de regiões
   */
  getRegions: async () => {
    const response = await medusaApi.get('/store/regions');
    return response.data;
  },
  
  /**
   * Adicionar item ao carrinho
   * @param {string} cartId - ID do carrinho
   * @param {string} variantId - ID da variante do produto
   * @param {number} quantity - Quantidade
   * @returns {Promise<Object>} Carrinho atualizado
   */
  addToCart: async (cartId, variantId, quantity = 1) => {
    const response = await medusaApi.post(`/store/carts/${cartId}/line-items`, {
      variant_id: variantId,
      quantity
    });
    return response.data;
  },
  
  /**
   * Atualizar carrinho (adicionar email, endereço, etc.)
   * @param {string} cartId - ID do carrinho
   * @param {Object} data - Dados para atualizar (email, shipping_address, etc.)
   * @returns {Promise<Object>} Carrinho atualizado
   */
  updateCart: async (cartId, data) => {
    const response = await medusaApi.post(`/store/carts/${cartId}`, data);
    return response.data;
  },
  
  /**
   * Criar payment session para um carrinho
   * @param {string} cartId - ID do carrinho
   * @param {string} providerId - ID do payment provider (ex: "pp_stripe", "pp_system_default")
   * @returns {Promise<Object>} Payment session criada
   */
  createPaymentSession: async (cartId, providerId) => {
    const response = await medusaApi.post(`/store/carts/${cartId}/payment-sessions`, {
      provider_id: providerId
    });
    return response.data;
  },

  /**
   * Autorizar pagamento (completar payment session)
   * @param {string} cartId - ID do carrinho
   * @param {string} sessionId - ID da payment session
   * @returns {Promise<Object>} Payment session autorizada
   */
  authorizePayment: async (cartId, sessionId) => {
    const response = await medusaApi.post(`/store/carts/${cartId}/payment-sessions/${sessionId}`, {});
    return response.data;
  },

  /**
   * Listar payment sessions disponíveis para um carrinho
   * @param {string} cartId - ID do carrinho
   * @returns {Promise<Object>} Lista de payment sessions
   */
  listPaymentSessions: async (cartId) => {
    const response = await medusaApi.get(`/store/carts/${cartId}/payment-sessions`);
    return response.data;
  },

  /**
   * Finalizar pedido (completar carrinho)
   * @param {string} cartId - ID do carrinho
   * @returns {Promise<Object>} Pedido criado
   */
  completeCart: async (cartId) => {
    const response = await medusaApi.post(`/store/carts/${cartId}/complete`);
    return response.data;
  },
  
  /**
   * Buscar carrinho por ID
   * @param {string} cartId - ID do carrinho
   * @returns {Promise<Object>} Dados do carrinho
   */
  getCart: async (cartId) => {
    const response = await medusaApi.get(`/store/carts/${cartId}`);
    return response.data;
  },
  

  /**
   * Buscar pedido por ID
   * NOTA: Medusa geralmente não expõe pedidos via Store API por questões de segurança.
   * Esta função pode não funcionar se o endpoint não existir ou se não houver autenticação.
   * Alternativa: Usar os dados retornados no momento da criação do pedido (completeCart).
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} Dados do pedido
   */
  getOrder: async (orderId) => {
    // Tentar buscar via Store API (pode não estar disponível)
    try {
      const response = await medusaApi.get(`/store/orders/${orderId}`);
      return response.data;
    } catch (error) {
      // Se não existir endpoint público, retornar erro informativo
      if (error.response?.status === 404 || error.response?.status === 403) {
        throw new Error('Buscar pedidos não está disponível via Store API do Medusa por questões de segurança. Use os dados retornados no momento da criação do pedido.');
      }
      throw error;
    }
  }
};

export default storeApi;

