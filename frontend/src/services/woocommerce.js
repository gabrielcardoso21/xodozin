import axios from 'axios';
import { WOOCOMMERCE_API_URL, WOOCOMMERCE_CONFIG, isWooCommerceConfigured } from '../config/woocommerce';

// Criar instância do axios com autenticação básica para WooCommerce
const woocommerceApi = axios.create({
  baseURL: WOOCOMMERCE_API_URL,
  auth: {
    username: WOOCOMMERCE_CONFIG.consumerKey,
    password: WOOCOMMERCE_CONFIG.consumerSecret,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * WooCommerce REST API Service
 * Documentação: https://woocommerce.github.io/woocommerce-rest-api-docs/
 */
export const woocommerceService = {
  /**
   * Verificar se API está configurada
   */
  isConfigured: () => isWooCommerceConfigured(),

  /**
   * Listar produtos
   * @param {Object} params - Parâmetros de busca (per_page, page, search, category, etc.)
   * @returns {Promise<Array>} Lista de produtos
   */
  getProducts: async (params = {}) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado. Configure as variáveis de ambiente.');
    }
    
    const response = await woocommerceApi.get('/products', { params });
    return response.data;
  },

  /**
   * Buscar produto por ID
   * @param {number|string} id - ID do produto
   * @returns {Promise<Object>} Dados do produto
   */
  getProduct: async (id) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Buscar produtos por categoria
   * @param {number|string} categoryId - ID da categoria
   * @param {Object} params - Parâmetros adicionais
   * @returns {Promise<Array>} Lista de produtos
   */
  getProductsByCategory: async (categoryId, params = {}) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.get('/products', {
      params: {
        category: categoryId,
        ...params,
      },
    });
    return response.data;
  },

  /**
   * Listar categorias
   * @param {Object} params - Parâmetros de busca
   * @returns {Promise<Array>} Lista de categorias
   */
  getCategories: async (params = {}) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.get('/products/categories', { params });
    return response.data;
  },

  /**
   * Criar carrinho (WooCommerce usa sessão, mas podemos criar order como rascunho)
   * @param {Object} data - Dados do carrinho (line_items, billing, shipping, etc.)
   * @returns {Promise<Object>} Dados do pedido/carrinho criado
   */
  createCart: async (data = {}) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    // WooCommerce não tem endpoint de carrinho separado, usamos orders como rascunho
    const orderData = {
      status: 'pending',
      set_paid: false,
      ...data,
    };
    
    const response = await woocommerceApi.post('/orders', orderData);
    return response.data;
  },

  /**
   * Atualizar carrinho/pedido
   * @param {number|string} orderId - ID do pedido
   * @param {Object} data - Dados para atualizar
   * @returns {Promise<Object>} Pedido atualizado
   */
  updateCart: async (orderId, data) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.put(`/orders/${orderId}`, data);
    return response.data;
  },

  /**
   * Adicionar item ao carrinho
   * @param {number|string} orderId - ID do pedido/carrinho
   * @param {Object} item - Item a adicionar { product_id, quantity, variation_id (opcional) }
   * @returns {Promise<Object>} Pedido atualizado
   */
  addToCart: async (orderId, item) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    // Buscar pedido atual
    const order = await woocommerceApi.get(`/orders/${orderId}`);
    const currentItems = order.data.line_items || [];
    
    // Adicionar novo item
    const updatedItems = [...currentItems, item];
    
    // Atualizar pedido
    const response = await woocommerceApi.put(`/orders/${orderId}`, {
      line_items: updatedItems,
    });
    
    return response.data;
  },

  /**
   * Buscar carrinho/pedido por ID
   * @param {number|string} orderId - ID do pedido
   * @returns {Promise<Object>} Dados do pedido
   */
  getCart: async (orderId) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Finalizar pedido (completar checkout)
   * @param {number|string} orderId - ID do pedido
   * @param {Object} data - Dados finais (payment_method, set_paid, etc.)
   * @returns {Promise<Object>} Pedido finalizado
   */
  completeOrder: async (orderId, data = {}) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.put(`/orders/${orderId}`, {
      status: 'processing',
      set_paid: true,
      ...data,
    });
    
    return response.data;
  },

  /**
   * Buscar pedido por ID
   * @param {number|string} orderId - ID do pedido
   * @returns {Promise<Object>} Dados do pedido
   */
  getOrder: async (orderId) => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Listar métodos de pagamento disponíveis
   * @returns {Promise<Array>} Lista de métodos de pagamento
   */
  getPaymentMethods: async () => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.get('/payment_gateways');
    return response.data;
  },

  /**
   * Listar métodos de envio disponíveis
   * @returns {Promise<Array>} Lista de métodos de envio
   */
  getShippingMethods: async () => {
    if (!isWooCommerceConfigured()) {
      throw new Error('WooCommerce não está configurado.');
    }
    
    const response = await woocommerceApi.get('/shipping_methods');
    return response.data;
  },
};

export default woocommerceService;

