/**
 * Sistema híbrido de API - Detecta automaticamente qual backend usar
 * Tenta Medusa.js primeiro, se falhar usa FastAPI como fallback
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
 */
async function testMedusaAvailability() {
  if (medusaAvailable !== null) {
    return medusaAvailable;
  }

  const medusaUrl = process.env.REACT_APP_MEDUSA_BACKEND_URL;
  if (!medusaUrl) {
    medusaAvailable = false;
    return false;
  }

  try {
    const response = await axios.get(`${medusaUrl}/store/products`, {
      timeout: 3000,
      validateStatus: () => true // Aceita qualquer status
    });
    
    // Se retornou 200 ou 404 (404 significa que API existe, só não tem produtos)
    medusaAvailable = response.status === 200 || response.status === 404;
    return medusaAvailable;
  } catch (error) {
    medusaAvailable = false;
    return false;
  }
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
    const useMedusaNow = useMedusa && await testMedusaAvailability();
    
    if (useMedusaNow) {
      try {
        const response = await storeApi.getQuizSuggestion(answers);
        return adaptQuizSuggestion(response);
      } catch (error) {
        console.warn('Medusa falhou, usando FastAPI como fallback:', error);
        // Fallback para FastAPI
        const response = await axios.post(`${FASTAPI_URL}/quiz/suggest`, answers);
        return response.data;
      }
    } else {
      // Usa FastAPI diretamente
      const response = await axios.post(`${FASTAPI_URL}/quiz/suggest`, answers);
      return response.data;
    }
  },

  /**
   * Criar pedido (checkout)
   * Por enquanto usa FastAPI, depois migra para Medusa Cart API
   */
  createOrder: async (orderData) => {
    // Por enquanto sempre usa FastAPI
    // TODO: Migrar para Medusa Cart API quando estiver pronto
    const response = await axios.post(`${FASTAPI_URL}/orders`, orderData);
    return response.data;
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

