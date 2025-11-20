/**
 * Funções helper para adaptar dados do formato Medusa para formato usado no frontend
 */

/**
 * Adapta produto do formato Medusa para formato usado no frontend
 * @param {Object} medusaProduct - Produto do Medusa
 * @returns {Object} Produto adaptado
 */
export function adaptProduct(medusaProduct) {
  if (!medusaProduct) return null;
  
  // Pegar primeira variante e primeiro preço
  const variant = medusaProduct.variants?.[0];
  const price = variant?.prices?.[0];
  
  // Converter preço de centavos para reais
  const convertPrice = (amount) => {
    if (typeof amount === 'number') {
      // Se valor é alto (provavelmente em centavos), dividir por 100
      return amount > 1000 ? amount / 100 : amount;
    }
    return 0;
  };
  
  return {
    id: medusaProduct.id,
    name: medusaProduct.title || medusaProduct.name || '',
    description: medusaProduct.description || '',
    category: medusaProduct.metadata?.category || 'outros',
    price: price ? convertPrice(price.amount) : 0,
    image_url: medusaProduct.images?.[0]?.url || medusaProduct.image_url || '',
    variant_id: variant?.id,
    // Dados extras do Medusa
    handle: medusaProduct.handle,
    status: medusaProduct.status
  };
}

/**
 * Adapta collection (kit) do formato Medusa para formato usado no frontend
 * @param {Object} medusaCollection - Collection do Medusa
 * @returns {Object} Kit adaptado
 */
export function adaptCollection(medusaCollection) {
  if (!medusaCollection) return null;
  
  // Pegar primeira imagem do primeiro produto (se disponível)
  const firstProduct = medusaCollection.products?.[0];
  const imageUrl = firstProduct?.images?.[0]?.url || medusaCollection.thumbnail || '';
  
  // Calcular preço mínimo e máximo dos produtos
  let priceMin = 0;
  let priceMax = null;
  
  if (medusaCollection.products && medusaCollection.products.length > 0) {
    const prices = medusaCollection.products
      .flatMap(p => p.variants || [])
      .flatMap(v => v.prices || [])
      .map(p => {
        // Converter de centavos para reais se necessário
        const amount = p.amount || 0;
        return amount > 1000 ? amount / 100 : amount;
      });
    
    if (prices.length > 0) {
      priceMin = Math.min(...prices);
      priceMax = prices.length > 1 ? Math.max(...prices) : null;
    }
  }
  
  // Usar preços do metadata se disponível (prioridade)
  if (medusaCollection.metadata?.price_min !== undefined) {
    priceMin = medusaCollection.metadata.price_min;
  }
  if (medusaCollection.metadata?.price_max !== undefined) {
    priceMax = medusaCollection.metadata.price_max;
  }
  
  // Se não tem preço, usar valores padrão do metadata ou 0
  if (priceMin === 0 && !medusaCollection.metadata?.price_min) {
    priceMin = 50; // Valor padrão
  }
  
  // Mapear handle para tier se metadata não estiver disponível
  let tier = medusaCollection.metadata?.tier || 'outros';
  if (tier === 'outros' && medusaCollection.handle) {
    if (medusaCollection.handle.includes('xodo')) tier = 'xodo';
    else if (medusaCollection.handle.includes('encanto')) tier = 'encanto';
    else if (medusaCollection.handle.includes('completo')) tier = 'completo';
  }

  // Mapear handle para descrição se metadata não estiver disponível
  let description = medusaCollection.metadata?.description || medusaCollection.description || '';
  if (!description && medusaCollection.handle) {
    const descriptions = {
      'kit-xodo': 'Kit completo de autocuidado e reconexão',
      'kit-encanto': 'Kit para conexão romântica',
      'kit-completo': 'Kit completo para amizade e conexão',
    };
    description = descriptions[medusaCollection.handle] || medusaCollection.title || '';
  }

  return {
    id: medusaCollection.id,
    name: medusaCollection.title || medusaCollection.name || 'Kit',
    tier: tier,
    description: description || medusaCollection.title || '',
    price_min: priceMin,
    price_max: priceMax,
    image_url: imageUrl,
    items: medusaCollection.products?.map(p => p.id) || []
  };
}

/**
 * Adapta lista de produtos
 * @param {Array} medusaProducts - Lista de produtos do Medusa
 * @returns {Array} Lista de produtos adaptados
 */
export function adaptProducts(medusaProducts) {
  if (!Array.isArray(medusaProducts)) return [];
  return medusaProducts.map(adaptProduct).filter(p => p !== null);
}

/**
 * Adapta lista de collections
 * @param {Array} medusaCollections - Lista de collections do Medusa
 * @returns {Array} Lista de kits adaptados
 */
export function adaptCollections(medusaCollections) {
  if (!Array.isArray(medusaCollections)) return [];
  return medusaCollections.map(adaptCollection).filter(k => k !== null);
}

/**
 * Adapta resposta de sugestão do quiz
 * @param {Object} quizResponse - Resposta do endpoint /store/quiz/suggest
 * @returns {Object} Dados adaptados
 */
export function adaptQuizSuggestion(quizResponse) {
  return {
    ritual_name: quizResponse.ritual_name || 'Ritual Especial',
    suggested_products: adaptProducts(quizResponse.suggested_products || []),
    categories: quizResponse.categories || {
      sensorial: 0,
      afetivo: 0,
      ritualistico: 0
    }
  };
}

/**
 * Adapta pedido do Medusa para formato usado no frontend
 * @param {Object} medusaOrder - Pedido do Medusa
 * @returns {Object} Pedido adaptado
 */
export function adaptOrder(medusaOrder) {
  if (!medusaOrder) return null;
  
  // Garantir que preços sejam convertidos corretamente (centavos → reais)
  const convertPrice = (price) => {
    if (typeof price === 'number') {
      // Se já está em centavos (valor alto), dividir por 100
      // Se já está em reais (valor baixo), usar direto
      return price > 1000 ? price / 100 : price;
    }
    return 0;
  };
  
  return {
    id: medusaOrder.id,
    order_id: medusaOrder.display_id || medusaOrder.id,
    display_id: medusaOrder.display_id,
    ritual_name: medusaOrder.metadata?.ritual_name || medusaOrder.ritual_name || 'Ritual Especial',
    items: (medusaOrder.items || []).map(item => ({
      id: item.id,
      product_id: item.variant?.product_id || item.product_id,
      product_name: item.title || item.product_name || 'Produto',
      price: convertPrice(item.unit_price || item.price || 0),
      quantity: item.quantity || 1
    })),
    total: convertPrice(medusaOrder.total || 0),
    subtotal: convertPrice(medusaOrder.subtotal || medusaOrder.total || 0),
    tax_total: convertPrice(medusaOrder.tax_total || 0),
    shipping_total: convertPrice(medusaOrder.shipping_total || 0),
    dedication: medusaOrder.metadata?.dedication || medusaOrder.dedication,
    delivery_address: formatAddress(medusaOrder.shipping_address) || medusaOrder.delivery_address || '',
    recipient: {
      name: medusaOrder.recipient?.name || 
            `${medusaOrder.shipping_address?.first_name || ''} ${medusaOrder.shipping_address?.last_name || ''}`.trim() ||
            '',
      phone: medusaOrder.recipient?.phone || medusaOrder.shipping_address?.phone || '',
      email: medusaOrder.recipient?.email || medusaOrder.email || '',
      whatsapp_updates: medusaOrder.metadata?.whatsapp_updates || medusaOrder.recipient?.whatsapp_updates || false
    },
    created_at: medusaOrder.created_at || new Date().toISOString(),
    status: medusaOrder.status || 'pending'
  };
}

/**
 * Formata endereço do Medusa para string
 * @param {Object} address - Endereço do Medusa
 * @returns {string} Endereço formatado
 */
function formatAddress(address) {
  if (!address) return '';
  
  const parts = [
    address.address_1,
    address.address_2,
    address.city,
    address.province,
    address.postal_code,
    address.country_code?.toUpperCase()
  ].filter(Boolean);
  
  return parts.join(', ');
}

