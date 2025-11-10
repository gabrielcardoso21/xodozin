import axios from 'axios';

const MEDUSA_BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL || 'http://localhost:9000';

const medusaApi = axios.create({
  baseURL: `${MEDUSA_BACKEND_URL}`,
  headers: {
    'Content-Type': 'application/json',
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
   * @param {string} regionId - ID da região (Brasil)
   * @returns {Promise<Object>} Dados do carrinho criado
   */
  createCart: async (regionId = 'br') => {
    const response = await medusaApi.post('/store/carts', {
      region_id: regionId
    });
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
   * Sugestão de produtos baseado no quiz (endpoint customizado)
   * @param {Object} answers - Respostas do quiz
   * @param {string} answers.recipient - Destinatário
   * @param {string} answers.moment - Momento
   * @param {string} answers.feeling - Vibe/sentimento
   * @returns {Promise<Object>} Sugestão de ritual com produtos
   */
  getQuizSuggestion: async (answers) => {
    const response = await medusaApi.post('/store/quiz/suggest', answers);
    return response.data;
  }
};

export default storeApi;

