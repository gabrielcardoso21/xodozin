# 🔄 Guia de Adaptação do Frontend para Medusa.js

Este documento explica como adaptar os componentes do frontend React para usar a API do Medusa.js ao invés do FastAPI.

---

## Mudanças Principais

### 1. Substituir `api.js` por `medusa-api.js`

**Antes:**
```javascript
import { API_BASE_URL as API } from '../utils/api';
```

**Depois:**
```javascript
import { storeApi } from '../utils/medusa-api';
```

### 2. Estrutura de Dados

**Medusa retorna dados em formato diferente:**

**Produtos:**
- `product.title` (ao invés de `product.name`)
- `product.variants[0].prices[0].amount` (em centavos)
- `product.images[0].url` (ao invés de `product.image_url`)
- `product.metadata.category` (ao invés de `product.category`)

**Collections (Kits):**
- `collection.title` (ao invés de `kit.name`)
- `collection.products` (array de produtos)
- `collection.metadata.tier` (ao invés de `kit.tier`)

---

## Adaptação por Componente

### Home.js

**Antes:**
```javascript
const fetchKits = async () => {
  try {
    const response = await axios.get(`${API}/kits`);
    setKits(response.data);
  } catch (error) {
    console.error('Error fetching kits:', error);
  }
};
```

**Depois:**
```javascript
import { storeApi } from '../utils/medusa-api';

const fetchKits = async () => {
  try {
    const response = await storeApi.getCollections();
    // Adaptar estrutura de dados
    const adaptedKits = response.collections.map(collection => ({
      id: collection.id,
      name: collection.title,
      tier: collection.metadata?.tier || 'outros',
      description: collection.metadata?.description || '',
      price_min: collection.metadata?.price_min || 0,
      price_max: collection.metadata?.price_max || null,
      image_url: collection.products?.[0]?.images?.[0]?.url || '',
      items: collection.products?.map(p => p.id) || []
    }));
    setKits(adaptedKits);
  } catch (error) {
    console.error('Error fetching kits:', error);
  }
};
```

### CustomRitual.js

**Antes:**
```javascript
const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API}/products`);
    setProducts(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

**Depois:**
```javascript
import { storeApi } from '../utils/medusa-api';

const fetchProducts = async () => {
  try {
    const response = await storeApi.getProducts();
    // Adaptar estrutura de dados
    const adaptedProducts = response.products.map(product => ({
      id: product.id,
      name: product.title,
      description: product.description,
      category: product.metadata?.category || 'outros',
      price: product.variants?.[0]?.prices?.[0]?.amount / 100 || 0,
      image_url: product.images?.[0]?.url || '',
      variant_id: product.variants?.[0]?.id
    }));
    setProducts(adaptedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

### Quiz.js

**Antes:**
```javascript
const handleSubmit = async () => {
  try {
    const response = await axios.post(`${API}/quiz/suggest`, {
      recipient: answers.recipient,
      moment: answers.moment,
      feeling: answers.vibe
    });
    navigate('/custom-ritual', { 
      state: { 
        ritualData: response.data,
        personalization: answers
      } 
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
```

**Depois:**
```javascript
import { storeApi } from '../utils/medusa-api';

const handleSubmit = async () => {
  try {
    const response = await storeApi.getQuizSuggestion({
      recipient: answers.recipient,
      moment: answers.moment,
      feeling: answers.vibe
    });
    // Adaptar estrutura de dados se necessário
    navigate('/custom-ritual', { 
      state: { 
        ritualData: response,
        personalization: answers
      } 
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
```

### Checkout.js

**Antes:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const orderData = {
    ritual_name: ritualName,
    items: orderItems,
    dedication: dedication || undefined,
    delivery_address: fullAddress,
    recipient: {
      name: recipient.name,
      phone: cleanPhone(recipient.phone),
      email: recipient.email,
      whatsapp_updates: recipient.whatsappUpdates
    },
    payment: {
      method: payment.method,
      installments: payment.installments || '1'
    }
  };
  
  const response = await axios.post(`${API}/orders`, orderData);
  navigate('/confirmation', { state: { order: response.data } });
};
```

**Depois:**
```javascript
import { storeApi } from '../utils/medusa-api';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // 1. Criar carrinho
    const cart = await storeApi.createCart('br'); // Região Brasil
    
    // 2. Adicionar itens ao carrinho
    for (const item of orderItems) {
      await storeApi.addToCart(cart.cart.id, item.variant_id, 1);
    }
    
    // 3. Atualizar carrinho com dados de entrega e cliente
    await storeApi.updateCart(cart.cart.id, {
      email: recipient.email,
      shipping_address: {
        first_name: recipient.name.split(' ')[0],
        last_name: recipient.name.split(' ').slice(1).join(' '),
        address_1: address.logradouro,
        address_2: address.complemento || '',
        city: address.cidade,
        country_code: 'br',
        postal_code: address.cep.replace(/\D/g, ''),
        phone: cleanPhone(recipient.phone),
        metadata: {
          dedication: dedication,
          whatsapp_updates: recipient.whatsappUpdates
        }
      }
    });
    
    // 4. Finalizar pedido
    const order = await storeApi.completeCart(cart.cart.id);
    
    navigate('/confirmation', { state: { order: order.order } });
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Erro ao processar pedido. Tente novamente.');
  }
};
```

---

## Função Helper para Adaptar Dados

Criar `frontend/src/utils/medusa-adapter.js`:

```javascript
/**
 * Adapta produtos do formato Medusa para formato usado no frontend
 */
export function adaptProduct(medusaProduct) {
  return {
    id: medusaProduct.id,
    name: medusaProduct.title,
    description: medusaProduct.description,
    category: medusaProduct.metadata?.category || 'outros',
    price: medusaProduct.variants?.[0]?.prices?.[0]?.amount / 100 || 0,
    image_url: medusaProduct.images?.[0]?.url || '',
    variant_id: medusaProduct.variants?.[0]?.id
  };
}

/**
 * Adapta collections (kits) do formato Medusa para formato usado no frontend
 */
export function adaptCollection(medusaCollection) {
  return {
    id: medusaCollection.id,
    name: medusaCollection.title,
    tier: medusaCollection.metadata?.tier || 'outros',
    description: medusaCollection.metadata?.description || '',
    price_min: medusaCollection.metadata?.price_min || 0,
    price_max: medusaCollection.metadata?.price_max || null,
    image_url: medusaCollection.products?.[0]?.images?.[0]?.url || '',
    items: medusaCollection.products?.map(p => p.id) || []
  };
}

/**
 * Adapta lista de produtos
 */
export function adaptProducts(medusaProducts) {
  return medusaProducts.map(adaptProduct);
}

/**
 * Adapta lista de collections
 */
export function adaptCollections(medusaCollections) {
  return medusaCollections.map(adaptCollection);
}
```

**Uso:**
```javascript
import { adaptProducts, adaptCollections } from '../utils/medusa-adapter';

const response = await storeApi.getProducts();
const products = adaptProducts(response.products);
```

---

## Variáveis de Ambiente

Atualizar `.env` do frontend:

```env
# Antes
REACT_APP_BACKEND_URL=http://localhost:8000

# Depois
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
```

---

## Checklist de Adaptação

- [ ] Substituir imports de `api.js` por `medusa-api.js`
- [ ] Adaptar `Home.js` para usar `storeApi.getCollections()`
- [ ] Adaptar `CustomRitual.js` para usar `storeApi.getProducts()`
- [ ] Adaptar `Quiz.js` para usar `storeApi.getQuizSuggestion()`
- [ ] Adaptar `Checkout.js` para usar Cart API do Medusa
- [ ] Criar função helper `medusa-adapter.js`
- [ ] Atualizar variáveis de ambiente
- [ ] Testar fluxo completo
- [ ] Remover código antigo do FastAPI (opcional)

---

## Testes

Após adaptar, testar:

1. **Home:** Listar kits (collections)
2. **Quiz:** Sugestão de produtos
3. **CustomRitual:** Listar e selecionar produtos
4. **Checkout:** Criar carrinho, adicionar itens, finalizar pedido
5. **Confirmation:** Exibir pedido criado

---

## Notas Importantes

1. **Carrinho:** Medusa usa sistema de carrinho. Cada sessão precisa criar um carrinho antes de adicionar itens.

2. **Região:** Medusa requer uma região (region_id). Para Brasil, criar região 'br' no Medusa.

3. **Preços:** Medusa armazena preços em centavos. Converter para reais dividindo por 100.

4. **Variantes:** Cada produto precisa ter pelo menos uma variante. Se não tiver variantes, criar uma variante "Default".

5. **Metadata:** Usar `metadata` para armazenar dados customizados (categoria, tier, etc.).

