/**
 * API Híbrida - Usa Odoo como backend principal
 * Mantém compatibilidade com interface anterior
 */

import odooApi from './odoo-api';
import { adaptProducts, adaptCollections, adaptQuizSuggestion, adaptCart } from './odoo-adapter';
import axios from 'axios';

let odooAvailable = null; // null = não testado, true/false = resultado do teste

/**
 * Testa se Odoo está disponível
 * @param {boolean} force - Força novo teste
 * @returns {Promise<boolean>}
 */
async function testOdooAvailability(force = false) {
  if (odooAvailable !== null && !force) {
    return odooAvailable;
  }

  // Use window.location.origin to go through Nginx proxy (avoids CORS)
  // Nginx proxy at /jsonrpc adds CORS headers
  // IMPORTANT: Always use window.location.origin in runtime, never hardcode localhost:8069
  let odooUrl;
  if (typeof window !== 'undefined' && window.location) {
    odooUrl = window.location.origin;
  } else {
    // Fallback only for SSR or tests
    const envUrl = process.env.REACT_APP_ODOO_URL;
    // If env URL points to localhost:8069, ignore it and use localhost (via Nginx)
    if (envUrl && envUrl.includes('localhost:8069')) {
      odooUrl = 'http://localhost';
    } else {
      odooUrl = envUrl || 'http://localhost';
    }
  }
  
  if (!odooUrl) {
    console.warn('⚠️ REACT_APP_ODOO_URL não configurado');
    odooAvailable = false;
    return false;
  }

  try {
    // Testar se Odoo está respondendo via JSON-RPC (mais confiável)
    const jsonrpcUrl = odooUrl.includes('://') ? `${odooUrl}/jsonrpc` : `${odooUrl}/jsonrpc`;
    const response = await axios.post(jsonrpcUrl, {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'common',
        method: 'login',
        args: [process.env.REACT_APP_ODOO_DATABASE || 'xodozin', process.env.REACT_APP_ODOO_USERNAME || 'admin', process.env.REACT_APP_ODOO_PASSWORD || 'admin'],
      },
      id: 1,
    }, {
      timeout: 3000,
      validateStatus: () => true,
    });
    
    odooAvailable = response.status === 200 && response.data && response.data.result;
    console.log(odooAvailable ? '✅ Odoo está disponível' : '❌ Odoo não está disponível');
    return odooAvailable;
  } catch (error) {
    console.error('❌ Erro ao testar Odoo:', error.message);
    odooAvailable = false;
    return false;
  }
}

/**
 * Reseta o cache de disponibilidade do Odoo
 */
export function resetOdooCache() {
  odooAvailable = null;
  console.log('🔄 Cache do Odoo resetado');
}

/**
 * API Híbrida - Usa Odoo como backend
 */
export const hybridApi = {
  /**
   * Listar kits/collections
   */
  getKits: async () => {
    const useOdoo = await testOdooAvailability();
    
    if (useOdoo) {
      try {
        const response = await odooApi.getCollections();
        return adaptCollections(response.collections || []);
      } catch (error) {
        console.error('Erro ao buscar collections do Odoo:', error);
        throw error;
      }
    } else {
      throw new Error('Odoo não está disponível. Verifique se REACT_APP_ODOO_URL está configurado e se o servidor está rodando.');
    }
  },

  /**
   * Listar produtos
   */
  getProducts: async (category = null) => {
    const useOdoo = await testOdooAvailability();
    
    if (useOdoo) {
      try {
        if (category) {
          const response = await odooApi.getProductsByCategory(category);
          return adaptProducts(response.products || []);
        } else {
          const response = await odooApi.getProducts();
          return adaptProducts(response.products || []);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos do Odoo:', error);
        throw error;
      }
    } else {
      throw new Error('Odoo não está disponível. Verifique se REACT_APP_ODOO_URL está configurado e se o servidor está rodando.');
    }
  },

  /**
   * Sugestão de produtos baseado no quiz
   */
  getQuizSuggestion: async (answers) => {
    console.log('🎯 Iniciando getQuizSuggestion com Odoo...');
    
    const forceTest = odooAvailable === false;
    const useOdoo = await testOdooAvailability(forceTest);
    
    if (useOdoo) {
      try {
        console.log('🎯 Usando Odoo para quiz...');
        const response = await odooApi.getQuizSuggestions(answers);
        console.log('✅ Odoo respondeu com sucesso:', response);
        return adaptQuizSuggestion(response);
      } catch (error) {
        console.error('❌ Erro ao usar Odoo:', error.message);
        odooAvailable = null;
        throw new Error(`Erro ao conectar com Odoo: ${error.message}. Verifique se o backend está rodando.`);
      }
    } else {
      console.error('❌ Odoo não está disponível');
      throw new Error('Odoo não está disponível. Verifique se REACT_APP_ODOO_URL está configurado e se o servidor está rodando.');
    }
  },

  /**
   * Criar pedido (checkout)
   * Usa Odoo Cart API
   */
  createOrder: async (orderData) => {
    const useOdoo = await testOdooAvailability();
    
    if (useOdoo) {
      try {
        // Criar carrinho no Odoo
        const cart = await odooApi.createCart();
        const cartId = cart.id;
        
        // Adicionar itens ao carrinho
        for (const item of orderData.items) {
          const productId = item.variant_id || item.product_id;
          if (productId) {
            await odooApi.addToCart(cartId, productId, item.quantity || 1);
          }
        }
        
        // Preparar dados do cliente
        const customerData = {
          email: orderData.recipient?.email || orderData.email,
          shipping_address: {
            first_name: (orderData.recipient?.name || '').split(' ')[0] || orderData.recipient?.name || '',
            last_name: (orderData.recipient?.name || '').split(' ').slice(1).join(' ') || '',
            address_1: orderData.delivery_address || '',
            city: 'São Paulo', // TODO: Extrair da delivery_address
            country_code: 'br',
            postal_code: (orderData.delivery_address || '').match(/\d{5}-?\d{3}/)?.[0] || '',
            phone: orderData.recipient?.phone || '',
          },
        };
        
        // Completar pedido
        const order = await odooApi.completeCart(cartId, customerData);
        const adaptedCart = adaptCart(order);
        
        // Adaptar resposta para formato esperado pelo frontend
        return {
          id: adaptedCart.id,
          order_id: adaptedCart.id,
          ritual_name: orderData.ritual_name || '',
          items: adaptedCart.items?.map(item => ({
            product_id: item.variant?.id || item.variant?.product?.id,
            product_name: item.title,
            price: item.unit_price / 100,
            quantity: item.quantity,
          })) || orderData.items,
          total: adaptedCart.total / 100,
          dedication: orderData.dedication || '',
          delivery_address: orderData.delivery_address || '',
          recipient: orderData.recipient || {},
          created_at: adaptedCart.created_at,
        };
      } catch (error) {
        console.error('Erro ao criar pedido no Odoo:', error);
        throw error;
      }
    } else {
      throw new Error('Odoo não está disponível. Verifique se REACT_APP_ODOO_URL está configurado e se o servidor está rodando.');
    }
  },

  /**
   * Buscar pedido
   */
  getOrder: async (orderId) => {
    const useOdoo = await testOdooAvailability();
    
    if (useOdoo) {
      try {
        const order = await odooApi.getCart(orderId);
        const adaptedCart = adaptCart(order);
        
        return {
          id: adaptedCart.id,
          order_id: adaptedCart.id,
          items: adaptedCart.items?.map(item => ({
            product_id: item.variant?.id || item.variant?.product?.id,
            product_name: item.title,
            price: item.unit_price / 100,
            quantity: item.quantity,
          })) || [],
          total: adaptedCart.total / 100,
          created_at: adaptedCart.created_at,
        };
      } catch (error) {
        console.error('Erro ao buscar pedido no Odoo:', error);
        throw error;
      }
    } else {
      throw new Error('Odoo não está disponível. Verifique se REACT_APP_ODOO_URL está configurado e se o servidor está rodando.');
    }
  },
};

export default hybridApi;
