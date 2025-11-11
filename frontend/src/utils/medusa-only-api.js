/**
 * API exclusiva do Medusa - Sem fallback para FastAPI
 * Usa apenas storeApi e adaptadores do Medusa
 */

import { storeApi } from './medusa-api';
import { adaptProducts, adaptCollections, adaptQuizSuggestion, adaptOrder } from './medusa-adapter';

/**
 * API exclusiva do Medusa
 */
export const medusaOnlyApi = {
  /**
   * Listar kits/collections
   * @returns {Promise<Array>} Lista de kits adaptados
   */
  getKits: async () => {
    try {
      const response = await storeApi.getCollections();
      return adaptCollections(response.collections || []);
    } catch (error) {
      console.error('Erro ao buscar kits do Medusa:', error);
      throw new Error(`Erro ao conectar com Medusa: ${error.message}. Verifique se o backend está rodando em ${process.env.REACT_APP_MEDUSA_BACKEND_URL || 'http://localhost:9000'}`);
    }
  },

  /**
   * Listar produtos
   * @param {string} category - Categoria opcional (sensorial, afetivo, ritualistico)
   * @returns {Promise<Array>} Lista de produtos adaptados
   */
  getProducts: async (category = null) => {
    try {
      let response;
      if (category) {
        response = await storeApi.getProductsByCategory(category);
      } else {
        response = await storeApi.getProducts();
      }
      return adaptProducts(response.products || []);
    } catch (error) {
      console.error('Erro ao buscar produtos do Medusa:', error);
      throw new Error(`Erro ao conectar com Medusa: ${error.message}. Verifique se o backend está rodando em ${process.env.REACT_APP_MEDUSA_BACKEND_URL || 'http://localhost:9000'}`);
    }
  },

  /**
   * Sugestão de produtos baseado no quiz
   * Lógica movida para o frontend para não precisar de endpoint customizado
   * @param {Object} answers - Respostas do quiz
   * @param {string} answers.recipient - Destinatário
   * @param {string} answers.moment - Momento
   * @param {string} answers.feeling - Vibe/sentimento
   * @returns {Promise<Object>} Sugestão de ritual com produtos
   */
  getQuizSuggestion: async (answers) => {
    try {
      // Buscar todos os produtos do Medusa
      const allProductsResponse = await storeApi.getProducts();
      const allProducts = adaptProducts(allProductsResponse.products || []);
      
      // Determinar categorias baseado nas respostas
      const categories = determineCategories(answers.recipient, answers.moment, answers.feeling);
      
      // Filtrar produtos por categoria
      const suggestedProducts = [];
      for (const category of categories) {
        const categoryProducts = allProducts.filter(p => p.category === category);
        suggestedProducts.push(...categoryProducts.slice(0, 3)); // 3 de cada categoria
      }
      
      // Se não encontrou produtos suficientes, adicionar outros
      if (suggestedProducts.length < 9) {
        const remaining = allProducts
          .filter(p => !suggestedProducts.find(sp => sp.id === p.id))
          .slice(0, 9 - suggestedProducts.length);
        suggestedProducts.push(...remaining);
      }
      
      // Limitar a 9 produtos
      const finalProducts = suggestedProducts.slice(0, 9);
      
      // Contar por categoria
      const categoryCounts = {
        sensorial: finalProducts.filter(p => p.category === 'sensorial').length,
        afetivo: finalProducts.filter(p => p.category === 'afetivo').length,
        ritualistico: finalProducts.filter(p => p.category === 'ritualistico').length
      };
      
      // Nome do ritual baseado no destinatário
      const ritualName = getRitualName(answers.recipient);
      
      return {
        ritual_name: ritualName,
        suggested_products: finalProducts,
        categories: categoryCounts
      };
    } catch (error) {
      console.error('Erro ao buscar sugestão do quiz:', error);
      throw new Error(`Erro ao conectar com Medusa: ${error.message}. Verifique se o backend está rodando em ${process.env.REACT_APP_MEDUSA_BACKEND_URL || 'http://localhost:9000'}`);
    }
  },

  /**
   * Criar pedido (checkout completo)
   * @param {Object} orderData - Dados do pedido
   * @param {string} orderData.ritual_name - Nome do ritual
   * @param {Array} orderData.items - Itens do pedido
   * @param {string} orderData.dedication - Mensagem dedicatória (opcional)
   * @param {string} orderData.delivery_address - Endereço completo de entrega
   * @param {Object} orderData.recipient - Dados do destinatário
   * @returns {Promise<Object>} Pedido criado e adaptado
   */
  createOrder: async (orderData) => {
    try {
      // 1. Criar carrinho no Medusa
      // Tentar encontrar região do Brasil primeiro
      let regionId = null;
      try {
        const regionsResponse = await storeApi.getRegions();
        const regions = regionsResponse.regions || [];
        // Procurar região do Brasil
        const brazilRegion = regions.find(r => 
          r.name?.toLowerCase().includes('brasil') || 
          r.name?.toLowerCase().includes('brazil') ||
          r.currency_code?.toLowerCase() === 'brl'
        );
        if (brazilRegion) {
          regionId = brazilRegion.id;
          console.log('Região Brasil encontrada:', regionId);
        }
      } catch (regionError) {
        console.warn('Erro ao buscar regiões, tentando criar carrinho sem especificar região:', regionError);
      }

      // Criar carrinho com ou sem region_id
      let cart;
      try {
        cart = await storeApi.createCart(regionId);
      } catch (cartError) {
        // Se falhar, tentar sem especificar região (Medusa pode usar padrão)
        console.warn('Erro ao criar carrinho com region_id, tentando sem especificar:', cartError);
        cart = await storeApi.createCart();
      }

      if (!cart?.cart?.id) {
        throw new Error('Falha ao criar carrinho: resposta inválida do Medusa');
      }

      const cartId = cart.cart.id;

      // 2. Adicionar itens ao carrinho
      for (const item of orderData.items) {
        let variantId = item.variant_id;
        
        // Se não tiver variant_id, buscar produto e pegar primeira variante
        if (!variantId && item.product_id) {
          try {
            const productResponse = await storeApi.getProduct(item.product_id);
            const product = productResponse.product;
            
            if (!product?.variants || product.variants.length === 0) {
              console.warn(`Produto ${item.product_id} não tem variantes disponíveis`);
              continue;
            }
            
            variantId = product.variants[0].id;
          } catch (productError) {
            console.error(`Erro ao buscar produto ${item.product_id}:`, productError);
            continue;
          }
        }

        if (variantId) {
          try {
            await storeApi.addToCart(cartId, variantId, item.quantity || 1);
          } catch (addError) {
            console.error(`Erro ao adicionar item ${variantId} ao carrinho:`, addError);
            // Continuar com próximo item mesmo se um falhar
          }
        }
      }

      // 3. Parsear endereço completo para formato do Medusa
      const addressParts = parseAddress(orderData.delivery_address);
      
      // 4. Atualizar carrinho com dados de entrega e cliente
      const nameParts = splitName(orderData.recipient.name);
      
      await storeApi.updateCart(cartId, {
        email: orderData.recipient.email,
        shipping_address: {
          first_name: nameParts.firstName,
          last_name: nameParts.lastName,
          address_1: addressParts.address1 || orderData.delivery_address.split(',')[0] || '',
          address_2: addressParts.address2 || '',
          city: addressParts.city || 'São Paulo',
          country_code: 'br',
          postal_code: addressParts.postalCode || extractCEP(orderData.delivery_address),
          province: addressParts.province || 'SP',
          phone: orderData.recipient.phone
        },
        metadata: {
          ritual_name: orderData.ritual_name,
          dedication: orderData.dedication || '',
          whatsapp_updates: orderData.recipient.whatsapp_updates || false
        }
      });

      // 5. Finalizar pedido
      const orderResponse = await storeApi.completeCart(cartId);
      
      if (!orderResponse?.order) {
        throw new Error('Falha ao finalizar pedido: resposta inválida do Medusa');
      }

      // 6. Adaptar resposta para formato esperado pelo frontend
      const adaptedOrder = adaptOrder(orderResponse.order);
      
      // Garantir que temos todos os campos necessários
      return {
        id: adaptedOrder.id,
        order_id: adaptedOrder.display_id || adaptedOrder.id,
        ritual_name: adaptedOrder.ritual_name || orderData.ritual_name,
        items: adaptedOrder.items || orderData.items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name || item.name,
          price: item.price || 0,
          quantity: item.quantity || 1
        })),
        total: adaptedOrder.total || orderData.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
        dedication: adaptedOrder.dedication || orderData.dedication,
        delivery_address: adaptedOrder.delivery_address || orderData.delivery_address,
        recipient: adaptedOrder.recipient || orderData.recipient,
        created_at: adaptedOrder.created_at || new Date().toISOString(),
        status: adaptedOrder.status || 'pending'
      };
    } catch (error) {
      console.error('Erro ao criar pedido no Medusa:', error);
      throw new Error(`Erro ao processar pedido: ${error.message}. Verifique se o backend está rodando e se todos os dados estão corretos.`);
    }
  },

  /**
   * Buscar pedido por ID
   * Nota: Medusa geralmente não expõe pedidos via Store API por segurança.
   * Esta função pode não funcionar se o endpoint não existir.
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} Pedido adaptado
   */
  getOrder: async (orderId) => {
    // Medusa não expõe pedidos via Store API por padrão
    // Se houver endpoint customizado, adicionar aqui
    // Por enquanto, retornar erro informativo
    throw new Error('Buscar pedidos não está disponível via Store API do Medusa por questões de segurança. Use os dados retornados no momento da criação do pedido.');
  }
};

/**
 * Helper: Divide nome completo em first_name e last_name
 */
function splitName(fullName) {
  if (!fullName) return { firstName: '', lastName: '' };
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

/**
 * Helper: Extrai CEP de string de endereço
 */
function extractCEP(address) {
  if (!address) return '';
  const cepMatch = address.match(/\d{5}-?\d{3}/);
  return cepMatch ? cepMatch[0].replace(/\D/g, '') : '';
}

/**
 * Helper: Determina categorias baseado nas respostas do quiz
 */
function determineCategories(recipient, moment, feeling) {
  const categories = [];
  
  // Sempre incluir pelo menos uma categoria de cada tipo
  categories.push('sensorial', 'afetivo', 'ritualistico');
  
  // Ajustar baseado no feeling
  if (feeling === 'pausar' || feeling === 'reconectar') {
    // Priorizar sensorial e ritualistico
    categories.push('sensorial', 'ritualistico');
  } else if (feeling === 'fortalecer' || feeling === 'celebrar') {
    // Priorizar afetivo e ritualistico
    categories.push('afetivo', 'ritualistico');
  }
  
  return [...new Set(categories)]; // Remover duplicatas
}

/**
 * Helper: Retorna nome do ritual baseado no destinatário
 */
function getRitualName(recipient) {
  const ritualNames = {
    'parceiro': 'Ritual do Amor',
    'amigo': 'Ritual da Amizade',
    'familia': 'Ritual do Aconchego',
    'proprio': 'Ritual do Autocuidado',
    'colega': 'Ritual da Conexão'
  };
  
  return ritualNames[recipient] || 'Ritual Especial';
}

/**
 * Helper: Parseia endereço completo em partes
 */
function parseAddress(fullAddress) {
  if (!fullAddress) {
    return {
      address1: '',
      address2: '',
      city: 'São Paulo',
      province: 'SP',
      postalCode: ''
    };
  }

  // Tentar extrair CEP
  const postalCode = extractCEP(fullAddress);
  
  // Tentar identificar cidade e estado
  const cityMatch = fullAddress.match(/([^,]+)\s*-\s*([A-Z]{2})/i);
  const city = cityMatch ? cityMatch[1].trim() : 'São Paulo';
  const province = cityMatch ? cityMatch[2].toUpperCase() : 'SP';
  
  // Primeira parte geralmente é o endereço principal
  const parts = fullAddress.split(',').map(p => p.trim());
  const address1 = parts[0] || '';
  const address2 = parts.length > 1 ? parts.slice(1, -2).join(', ') : '';
  
  return {
    address1,
    address2,
    city,
    province,
    postalCode
  };
}

export default medusaOnlyApi;

