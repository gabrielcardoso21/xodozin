# 🚀 Guia de Migração para Medusa.js

## Pré-requisitos

- **Node.js >= 20** (atual requer Node 18, precisa atualizar)
- **PostgreSQL** ou **SQLite** (Medusa não usa MongoDB diretamente)
- **Redis** (opcional, mas recomendado para cache)

## Estrutura do Projeto

Após a migração, a estrutura será:

```
xodozin/
├── medusa-backend/          # Backend Medusa.js (novo)
│   ├── src/
│   │   ├── api/            # Endpoints customizados
│   │   ├── models/         # Modelos customizados
│   │   └── services/       # Serviços customizados
│   ├── medusa-config.js    # Configuração do Medusa
│   └── package.json
├── frontend/                # Frontend React (mantém)
│   └── src/
│       └── utils/
│           └── medusa-api.js  # Cliente API do Medusa (novo)
└── backend/                 # Backend FastAPI antigo (pode ser removido depois)
```

---

## Fase 1: Setup Medusa

### 1.1 Instalar Medusa.js

**Requisito:** Node.js >= 20

```bash
# Atualizar Node.js para versão 20 ou superior
# Usando nvm (recomendado):
nvm install 20
nvm use 20

# Criar projeto Medusa
cd /home/gabriel/xodozin
npx create-medusa-app@latest medusa-backend
```

Durante a instalação, escolher:
- **Database:** PostgreSQL (recomendado) ou SQLite (para desenvolvimento)
- **Redis:** Sim (recomendado)
- **Stripe:** Sim (para pagamentos)
- **Seed:** Sim (para dados de exemplo)

### 1.2 Configurar Variáveis de Ambiente

Criar `medusa-backend/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/xodozin
# ou para SQLite:
# DATABASE_URL=sqlite://./medusa.db

# Redis (opcional)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-key
COOKIE_SECRET=your-cookie-secret-key

# Server
PORT=9000
NODE_ENV=development

# CORS
CORS=http://localhost:3000

# Admin
MEDUSA_ADMIN_ONBOARDING_TYPE=default
MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=../admin

# Stripe (opcional)
STRIPE_API_KEY=sk_test_...
```

### 1.3 Executar Migrações

```bash
cd medusa-backend
npm run build
npx medusa migrations run
```

---

## Fase 2: Migrar Dados

### 2.1 Estrutura de Dados no Medusa

**Produtos (Products):**
- `id` (UUID)
- `title` (nome do produto)
- `description`
- `handle` (slug único)
- `is_giftcard` (false)
- `status` (published/draft)
- `images` (array de URLs)
- `options` (variantes: tamanho, cor, etc.)
- `variants` (combinações de opções com preço)
- `metadata` (dados customizados: category, etc.)

**Kits (Collections):**
- Medusa usa **Collections** para agrupar produtos
- Cada kit será uma Collection
- Produtos podem pertencer a múltiplas Collections

### 2.2 Script de Migração

Criar `medusa-backend/scripts/migrate-data.js`:

```javascript
const { Medusa } = require("@medusajs/medusa");

async function migrateProducts() {
  // Conectar ao MongoDB antigo
  const { MongoClient } = require('mongodb');
  const mongoClient = new MongoClient(process.env.MONGO_URL);
  await mongoClient.connect();
  const db = mongoClient.db(process.env.DB_NAME);
  
  // Buscar produtos do MongoDB
  const products = await db.collection('products').find({}).toArray();
  
  // Inicializar Medusa
  const medusa = new Medusa({
    database_url: process.env.DATABASE_URL,
  });
  
  // Migrar cada produto
  for (const product of products) {
    await medusa.products.create({
      title: product.name,
      description: product.description,
      handle: product.id.toLowerCase().replace(/\s+/g, '-'),
      status: 'published',
      images: [{ url: product.image_url }],
      metadata: {
        category: product.category, // sensorial, afetivo, ritualistico
        original_id: product.id
      },
      variants: [{
        title: 'Default',
        prices: [{
          amount: product.price * 100, // Medusa usa centavos
          currency_code: 'brl'
        }],
        inventory_quantity: 100 // Ajustar conforme necessário
      }]
    });
  }
  
  await mongoClient.close();
}

async function migrateKits() {
  // Similar ao migrateProducts, mas cria Collections
  // ...
}

migrateProducts().then(() => {
  console.log('Migração concluída!');
  process.exit(0);
}).catch(err => {
  console.error('Erro na migração:', err);
  process.exit(1);
});
```

---

## Fase 3: Adaptar Frontend

### 3.1 Criar Cliente API do Medusa

Criar `frontend/src/utils/medusa-api.js`:

```javascript
import axios from 'axios';

const MEDUSA_BACKEND_URL = process.env.REACT_APP_MEDUSA_BACKEND_URL || 'http://localhost:9000';

const medusaApi = axios.create({
  baseURL: `${MEDUSA_BACKEND_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store API (pública)
export const storeApi = {
  // Listar produtos
  getProducts: async (params = {}) => {
    const response = await medusaApi.get('/store/products', { params });
    return response.data;
  },
  
  // Buscar produto por ID
  getProduct: async (id) => {
    const response = await medusaApi.get(`/store/products/${id}`);
    return response.data;
  },
  
  // Buscar produtos por categoria (usando metadata)
  getProductsByCategory: async (category) => {
    const response = await medusaApi.get('/store/products', {
      params: {
        'metadata[category]': category
      }
    });
    return response.data;
  },
  
  // Listar collections (kits)
  getCollections: async () => {
    const response = await medusaApi.get('/store/collections');
    return response.data;
  },
  
  // Buscar collection por ID
  getCollection: async (id) => {
    const response = await medusaApi.get(`/store/collections/${id}`);
    return response.data;
  },
  
  // Criar cart
  createCart: async (region_id) => {
    const response = await medusaApi.post('/store/carts', {
      region_id
    });
    return response.data;
  },
  
  // Adicionar item ao cart
  addToCart: async (cartId, variantId, quantity) => {
    const response = await medusaApi.post(`/store/carts/${cartId}/line-items`, {
      variant_id: variantId,
      quantity
    });
    return response.data;
  },
  
  // Criar checkout
  createCheckout: async (cartId, email) => {
    const response = await medusaApi.post(`/store/carts/${cartId}`, {
      email
    });
    return response.data;
  },
  
  // Criar pedido
  completeCart: async (cartId) => {
    const response = await medusaApi.post(`/store/carts/${cartId}/complete`);
    return response.data;
  }
};

export default storeApi;
```

### 3.2 Adaptar Componentes

**Home.js:**
- Substituir `axios.get(\`${API}/kits\`)` por `storeApi.getCollections()`
- Adaptar estrutura de dados (Medusa retorna `collections` ao invés de `kits`)

**CustomRitual.js:**
- Substituir `axios.get(\`${API}/products\`)` por `storeApi.getProducts()`
- Adaptar estrutura de produtos

**Checkout.js:**
- Usar `storeApi.createCart()` e `storeApi.addToCart()`
- Usar `storeApi.completeCart()` para finalizar pedido

---

## Fase 4: Funcionalidades Customizadas

### 4.1 Endpoint Customizado para Quiz

Criar `medusa-backend/src/api/store/quiz/route.ts`:

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { recipient, moment, feeling } = req.body;
  
  // Lógica de sugestão baseada no quiz
  // Buscar produtos por categoria usando metadata
  const productService = req.scope.resolve("productService");
  
  const products = await productService.listAndCount({
    metadata: {
      category: determineCategory(recipient, moment, feeling)
    }
  });
  
  res.json({
    ritual_name: getRitualName(recipient),
    suggested_products: products[0],
    categories: {
      sensorial: products[0].filter(p => p.metadata?.category === 'sensorial').length,
      afetivo: products[0].filter(p => p.metadata?.category === 'afetivo').length,
      ritualistico: products[0].filter(p => p.metadata?.category === 'ritualistico').length
    }
  });
}
```

### 4.2 Configurar Pagamentos

**Stripe:**
```bash
cd medusa-backend
npx medusa plugins install stripe
```

Configurar no `medusa-config.js`:
```javascript
{
  resolve: "@medusajs/payment-stripe",
  options: {
    apiKey: process.env.STRIPE_API_KEY,
  },
}
```

**PIX (Brasil):**
- Usar plugin customizado ou gateway de pagamento brasileiro
- Integrar com Asaas, Mercado Pago, ou similar

---

## Fase 5: Deploy

### 5.1 Backend Medusa (Render/Railway)

**Render:**
1. Criar novo Web Service
2. Build Command: `cd medusa-backend && npm install && npm run build`
3. Start Command: `cd medusa-backend && npm start`
4. Variáveis de ambiente:
   - `DATABASE_URL` (PostgreSQL)
   - `REDIS_URL` (opcional)
   - `JWT_SECRET`
   - `COOKIE_SECRET`
   - `CORS` (URL do frontend)

### 5.2 Frontend (Vercel)

Atualizar variável de ambiente:
- `REACT_APP_MEDUSA_BACKEND_URL` = URL do backend Medusa

---

## Checklist de Migração

### Fase 1: Setup
- [ ] Instalar Node.js >= 20
- [ ] Criar projeto Medusa
- [ ] Configurar banco de dados (PostgreSQL/SQLite)
- [ ] Configurar variáveis de ambiente
- [ ] Executar migrações

### Fase 2: Migração de Dados
- [ ] Criar script de migração de produtos
- [ ] Migrar produtos do MongoDB para Medusa
- [ ] Criar Collections (kits) no Medusa
- [ ] Validar dados migrados

### Fase 3: Adaptação Frontend
- [ ] Criar cliente API do Medusa
- [ ] Adaptar Home.js para usar Collections
- [ ] Adaptar CustomRitual.js para usar Products
- [ ] Adaptar Checkout.js para usar Cart API
- [ ] Testar fluxo completo

### Fase 4: Funcionalidades Customizadas
- [ ] Criar endpoint customizado para Quiz
- [ ] Configurar pagamentos (Stripe)
- [ ] Configurar PIX (se necessário)
- [ ] Configurar envio/entrega

### Fase 5: Deploy
- [ ] Deploy backend Medusa
- [ ] Atualizar variáveis de ambiente do frontend
- [ ] Testar em produção
- [ ] Remover backend FastAPI antigo (opcional)

---

## Notas Importantes

1. **Node.js 20+:** Medusa.js requer Node.js >= 20. Atualizar antes de começar.

2. **PostgreSQL vs SQLite:**
   - **SQLite:** Para desenvolvimento local (mais simples)
   - **PostgreSQL:** Para produção (recomendado)

3. **MongoDB:** Medusa não usa MongoDB nativamente. Dados precisam ser migrados para PostgreSQL/SQLite.

4. **Estrutura de Dados:**
   - Produtos no Medusa têm estrutura diferente (variants, options, etc.)
   - Kits viram Collections
   - Categorias viram metadata

5. **API do Medusa:**
   - Store API: `/store/*` (pública, para frontend)
   - Admin API: `/admin/*` (privada, para gestão)

6. **Fluxo de Personalização:**
   - Manter lógica de Quiz no frontend
   - Usar endpoint customizado para buscar produtos sugeridos
   - Criar cart e adicionar produtos selecionados

---

## Próximos Passos

1. **Atualizar Node.js para versão 20+**
2. **Instalar e configurar Medusa.js**
3. **Migrar dados existentes**
4. **Adaptar frontend**
5. **Testar e fazer deploy**

