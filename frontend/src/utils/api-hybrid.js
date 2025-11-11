/**
 * ⚠️ DEPRECADO: Este arquivo está sendo descontinuado.
 * 
 * Sistema híbrido de API - Detecta automaticamente qual backend usar
 * Tenta Medusa.js primeiro, se falhar usa FastAPI como fallback
 * 
 * MIGRAÇÃO: Use `medusa-only-api.js` ao invés deste arquivo.
 * Todos os componentes foram migrados para usar exclusivamente o Medusa.
 * 
 * Este arquivo será removido em uma versão futura.
 */

import { storeApi } from './medusa-api';
import axios from 'axios';
import { API_BASE_URL as FASTAPI_URL } from './api';
import { adaptProducts, adaptCollections, adaptQuizSuggestion } from './medusa-adapter';

// Flag para controlar qual API usar
let useMedusa = process.env.REACT_APP_USE_MEDUSA === 'true';
let medusaAvailable = null; // null = não testado, true/false = resultado do teste

/**
 * Testa se Medusa está disponível
 * Força novo teste se necessário
 */
async function testMedusaAvailability(force = false) {
  // Se já foi testado e não é forçado, retorna cache
  if (medusaAvailable !== null && !force) {
    console.log('🔍 Medusa já testado anteriormente:', medusaAvailable);
    return medusaAvailable;
  }

  const medusaUrl = process.env.REACT_APP_MEDUSA_BACKEND_URL || 'http://localhost:9000';
  console.log('🔍 Testando disponibilidade do Medusa em:', medusaUrl);
  
  if (!medusaUrl) {
    console.warn('⚠️ REACT_APP_MEDUSA_BACKEND_URL não configurado');
    medusaAvailable = false;
    return false;
  }

  try {
    // Testar health check primeiro (mais rápido e confiável)
    console.log('🔍 Testando /health...');
    const healthResponse = await axios.get(`${medusaUrl}/health`, {
      timeout: 3000,
      validateStatus: () => true
    });
    
    console.log('📊 Health check status:', healthResponse.status);
    console.log('📊 Health check data:', healthResponse.data);
    
    if (healthResponse.status === 200) {
      console.log('✅ Medusa está disponível (health check OK)');
      medusaAvailable = true;
      return true;
    }
    
    // Se health check falhou, tentar products como fallback
    console.log('🔍 Health check falhou, testando /store/products...');
    const productsResponse = await axios.get(`${medusaUrl}/store/products`, {
      timeout: 3000,
      validateStatus: () => true
    });
    
    console.log('📊 Products status:', productsResponse.status);
    
    // Se retornou 200 ou 404 (404 significa que API existe, só não tem produtos)
    medusaAvailable = productsResponse.status === 200 || productsResponse.status === 404;
    console.log(medusaAvailable ? '✅ Medusa está disponível' : '❌ Medusa não está disponível');
    return medusaAvailable;
  } catch (error) {
    console.error('❌ Erro ao testar Medusa:', error.message);
    console.error('❌ Detalhes:', error);
    medusaAvailable = false;
    return false;
  }
}

/**
 * Reseta o cache de disponibilidade do Medusa
 */
export function resetMedusaCache() {
  medusaAvailable = null;
  console.log('🔄 Cache do Medusa resetado');
}

/**
 * API Híbrida - Usa Medusa se disponível, senão usa FastAPI
 */
export const hybridApi = {
  /**
   * Listar kits/collections
   */
  getKits: async () => {
    const useMedusaNow = useMedusa && await testMedusaAvailability();
    
    if (useMedusaNow) {
      try {
        const response = await storeApi.getCollections();
        return adaptCollections(response.collections || []);
      } catch (error) {
        console.warn('Medusa falhou, usando FastAPI como fallback:', error);
        // Fallback para FastAPI
        const response = await axios.get(`${FASTAPI_URL}/kits`);
        return response.data;
      }
    } else {
      // Usa FastAPI diretamente
      const response = await axios.get(`${FASTAPI_URL}/kits`);
      return response.data;
    }
  },

  /**
   * Listar produtos
   */
  getProducts: async (category = null) => {
    const useMedusaNow = useMedusa && await testMedusaAvailability();
    
    if (useMedusaNow) {
      try {
        const params = category ? { 'metadata[category]': category } : {};
        const response = await storeApi.getProducts(params);
        return adaptProducts(response.products || []);
      } catch (error) {
        console.warn('Medusa falhou, usando FastAPI como fallback:', error);
        // Fallback para FastAPI
        const url = category 
          ? `${FASTAPI_URL}/products/category/${category}`
          : `${FASTAPI_URL}/products`;
        const response = await axios.get(url);
        return response.data;
      }
    } else {
      // Usa FastAPI diretamente
      const url = category 
        ? `${FASTAPI_URL}/products/category/${category}`
        : `${FASTAPI_URL}/products`;
      const response = await axios.get(url);
      return response.data;
    }
  },

  /**
   * Sugestão de produtos baseado no quiz
   */
  getQuizSuggestion: async (answers) => {
    console.log('🎯 Iniciando getQuizSuggestion...');
    console.log('📝 useMedusa flag:', useMedusa);
    console.log('📝 REACT_APP_MEDUSA_BACKEND_URL:', process.env.REACT_APP_MEDUSA_BACKEND_URL);
    
    // Força novo teste se o cache está como false (pode ter sido testado antes do backend estar pronto)
    const forceTest = medusaAvailable === false;
    if (forceTest) {
      console.log('🔄 Forçando novo teste do Medusa (cache estava false)...');
    }
    
    const useMedusaNow = useMedusa && await testMedusaAvailability(forceTest);
    console.log('📝 useMedusaNow resultado:', useMedusaNow);
    
    if (useMedusaNow) {
      try {
        console.log('🎯 Usando Medusa para quiz...');
        const response = await storeApi.getQuizSuggestion(answers);
        console.log('✅ Medusa respondeu com sucesso:', response);
        return adaptQuizSuggestion(response);
      } catch (error) {
        console.error('❌ Erro ao usar Medusa:', error.message);
        console.error('❌ Detalhes do erro:', error);
        // Resetar cache para forçar novo teste na próxima vez
        medusaAvailable = null;
        throw new Error(`Erro ao conectar com Medusa: ${error.message}. Verifique se o backend está rodando em http://localhost:9000`);
      }
    } else {
      // Se Medusa não está disponível, mostra erro claro
      console.error('❌ Medusa não está disponível ou não está habilitado');
      console.error('📝 useMedusa:', useMedusa);
      console.error('📝 medusaAvailable:', medusaAvailable);
      throw new Error('Medusa não está disponível. Verifique se REACT_APP_USE_MEDUSA=true e se o backend está rodando em http://localhost:9000');
    }
  },

  /**
   * Criar pedido (checkout)
   * Tenta usar Medusa Cart API, se falhar usa FastAPI
   */
  createOrder: async (orderData) => {
    const useMedusaNow = useMedusa && await testMedusaAvailability();
    
    if (useMedusaNow) {
      try {
        // Criar carrinho no Medusa
        const cart = await storeApi.createCart('br'); // Região Brasil
        
        // Adicionar itens ao carrinho
        for (const item of orderData.items) {
          // Se tiver variant_id, usar; senão buscar primeiro produto
          if (item.variant_id) {
            await storeApi.addToCart(cart.cart.id, item.variant_id, 1);
          } else {
            // Buscar produto e pegar primeira variante
            const product = await storeApi.getProduct(item.product_id);
            if (product.product?.variants?.[0]?.id) {
              await storeApi.addToCart(cart.cart.id, product.product.variants[0].id, 1);
            }
          }
        }
        
        // Atualizar carrinho com dados de entrega e cliente
        await storeApi.updateCart(cart.cart.id, {
          email: orderData.recipient.email,
          shipping_address: {
            first_name: orderData.recipient.name.split(' ')[0] || orderData.recipient.name,
            last_name: orderData.recipient.name.split(' ').slice(1).join(' ') || '',
            address_1: orderData.delivery_address.split(',')[0] || orderData.delivery_address,
            city: 'São Paulo',
            country_code: 'br',
            postal_code: orderData.delivery_address.match(/\d{5}-?\d{3}/)?.[0] || '',
            phone: orderData.recipient.phone,
            metadata: {
              dedication: orderData.dedication,
              whatsapp_updates: orderData.recipient.whatsapp_updates
            }
          }
        });
        
        // Finalizar pedido
        const order = await storeApi.completeCart(cart.cart.id);
        
        // Adaptar resposta para formato esperado pelo frontend
        return {
          id: order.order.id,
          order_id: order.order.display_id || order.order.id,
          ritual_name: order.order.metadata?.ritual_name || orderData.ritual_name,
          items: order.order.items?.map(item => ({
            product_id: item.variant?.product_id,
            product_name: item.title,
            price: item.unit_price / 100
          })) || orderData.items,
          total: order.order.total / 100,
          dedication: order.order.metadata?.dedication || orderData.dedication,
          delivery_address: orderData.delivery_address,
          recipient: orderData.recipient,
          created_at: order.order.created_at
        };
      } catch (error) {
        console.warn('Medusa Cart API falhou, usando FastAPI como fallback:', error);
        // Fallback para FastAPI
        const response = await axios.post(`${FASTAPI_URL}/orders`, orderData);
        return response.data;
      }
    } else {
      // Usa FastAPI diretamente
      const response = await axios.post(`${FASTAPI_URL}/orders`, orderData);
      return response.data;
    }
  },

  /**
   * Buscar pedido
   */
  getOrder: async (orderId) => {
    // Por enquanto sempre usa FastAPI
    const response = await axios.get(`${FASTAPI_URL}/orders/${orderId}`);
    return response.data;
  }
};

export default hybridApi;

