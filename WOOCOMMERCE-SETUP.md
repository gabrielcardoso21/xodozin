# 🛒 Setup WooCommerce Automatizado

## 📋 Visão Geral

Este guia explica como configurar automaticamente o WooCommerce no Render.com e integrar com o frontend React existente.

## 🚀 Setup Automatizado

### Pré-requisitos

- Conta no Render.com
- API Key do Render (já configurada: `rnd_uZd6hv7quW4fyZK1g1CgUcrDZpNI`)
- Repositório GitHub conectado

### Passo 1: Executar Script de Automação

```bash
# Na raiz do projeto
bash scripts/setup-woocommerce-render.sh
```

O script irá:
1. ✅ Criar banco de dados PostgreSQL no Render
2. ✅ Criar serviço web WordPress + WooCommerce
3. ✅ Configurar variáveis de ambiente
4. ✅ Fazer deploy automático
5. ✅ Aguardar serviço ficar online
6. ✅ Retornar URL e informações de acesso

### Passo 2: Obter Credenciais REST API

Após o deploy completar, siga o guia detalhado:

📖 **Guia Completo**: Veja `GUIA-GERAR-API-KEY-WOOCOMMERCE.md` para instruções passo a passo com screenshots descritivos.

**Resumo rápido:**
1. Acesse: `https://seu-servico.onrender.com/wp-admin`
2. Faça login (credenciais padrão: `admin` / senha gerada automaticamente)
3. Vá em: **WooCommerce > Configurações > Avançado > REST API**
4. Clique em **"Adicionar chave"**
5. Preencha:
   - **Descrição**: Frontend API
   - **Usuário**: admin
   - **Permissões**: Leitura/Gravação
6. Clique em **"Gerar chave de API"**
7. **IMPORTANTE**: Copie o **Consumer Key** e **Consumer Secret** imediatamente (só aparecem uma vez!)

### Passo 3: Configurar Frontend

1. Copie `.env.example` para `.env` no diretório `frontend/`:

```bash
cd frontend
cp .env.example .env
```

2. Edite `.env` e configure:

```env
REACT_APP_WOOCOMMERCE_API_URL=https://seu-servico.onrender.com
REACT_APP_WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Reinicie o servidor de desenvolvimento:

```bash
npm start
```

## 📚 Estrutura de Arquivos

```
woocommerce/
├── Dockerfile              # Imagem WordPress + WooCommerce
├── docker-entrypoint.sh   # Script de inicialização
├── install-woocommerce.sh  # Instalação automática do WooCommerce
└── render.yaml            # Configuração Render.com

frontend/
├── .env.example           # Exemplo de variáveis de ambiente
├── src/
│   ├── config/
│   │   └── woocommerce.js # Configuração da API
│   └── services/
│       └── woocommerce.js # Serviços da API WooCommerce

scripts/
└── setup-woocommerce-render.sh  # Script de automação
```

## 🔌 Uso da API WooCommerce no Frontend

### Importar Serviço

```javascript
import { woocommerceService } from '@/services/woocommerce';
```

### Exemplos de Uso

#### Listar Produtos

```javascript
// Listar todos os produtos
const products = await woocommerceService.getProducts({
  per_page: 20,
  page: 1,
});

// Buscar produto por ID
const product = await woocommerceService.getProduct(123);

// Buscar produtos por categoria
const products = await woocommerceService.getProductsByCategory(5);
```

#### Gerenciar Carrinho

```javascript
// Criar carrinho (pedido como rascunho)
const cart = await woocommerceService.createCart({
  line_items: [
    {
      product_id: 123,
      quantity: 2,
    },
  ],
});

// Adicionar item ao carrinho
await woocommerceService.addToCart(cartId, {
  product_id: 456,
  quantity: 1,
});

// Atualizar carrinho
await woocommerceService.updateCart(cartId, {
  billing: {
    first_name: 'João',
    last_name: 'Silva',
    email: 'joao@example.com',
  },
});

// Finalizar pedido
const order = await woocommerceService.completeOrder(cartId, {
  payment_method: 'bacs',
  payment_method_title: 'Transferência Bancária',
});
```

#### Buscar Categorias

```javascript
const categories = await woocommerceService.getCategories();
```

## 🔄 Migração do Medusa para WooCommerce

### Diferenças Principais

| Medusa | WooCommerce |
|--------|-------------|
| `storeApi.getProducts()` | `woocommerceService.getProducts()` |
| `storeApi.createCart()` | `woocommerceService.createCart()` |
| `storeApi.addToCart(cartId, variantId, qty)` | `woocommerceService.addToCart(orderId, {product_id, quantity})` |
| `storeApi.completeCart(cartId)` | `woocommerceService.completeOrder(orderId)` |
| `storeApi.getCollections()` | `woocommerceService.getCategories()` |

### Atualizar Código

1. **Substituir imports:**

```javascript
// Antes
import { storeApi } from '@/utils/medusa-api';

// Depois
import { woocommerceService } from '@/services/woocommerce';
```

2. **Atualizar chamadas de API:**

```javascript
// Antes
const products = await storeApi.getProducts();

// Depois
const products = await woocommerceService.getProducts();
```

3. **Ajustar estrutura de dados:**

WooCommerce retorna dados em formato diferente. Ajuste conforme necessário:

```javascript
// Medusa retorna: { products: [...] }
// WooCommerce retorna: [...] (array direto)
```

## 🛠️ Troubleshooting

### Erro: "WooCommerce não está configurado"

**Solução:**
1. Verifique se `.env` existe em `frontend/`
2. Verifique se variáveis estão configuradas corretamente
3. Reinicie o servidor de desenvolvimento

### Erro: "401 Unauthorized"

**Solução:**
1. Verifique se Consumer Key e Secret estão corretos
2. Verifique se a chave tem permissões de Leitura/Gravação
3. Verifique se a URL da API está correta

### Erro: "CORS"

**Solução:**
1. No WordPress, instale plugin "CORS Headers"
2. Ou configure CORS manualmente no `.htaccess`

### Serviço não inicia no Render

**Solução:**
1. Verifique logs no dashboard do Render
2. Verifique se banco de dados está linked
3. Verifique variáveis de ambiente

## 📖 Documentação

- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Render.com Docs](https://render.com/docs)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

## ✅ Checklist de Setup

- [ ] Script de automação executado
- [ ] Serviço criado no Render
- [ ] Deploy completado com sucesso
- [ ] Credenciais REST API geradas
- [ ] Frontend configurado com variáveis de ambiente
- [ ] Teste de listagem de produtos funcionando
- [ ] Teste de criação de carrinho funcionando
- [ ] Teste de checkout funcionando

## 🎯 Próximos Passos

1. **Configurar Pagamentos Brasileiros:**
   - Instalar plugin Mercado Pago
   - Instalar plugin PagSeguro
   - Configurar PIX

2. **Configurar Envio:**
   - Configurar Correios
   - Configurar frete grátis para SP

3. **Personalizar Loja:**
   - Instalar tema
   - Configurar páginas
   - Adicionar produtos

4. **Otimizar Performance:**
   - Configurar cache
   - Otimizar imagens
   - Configurar CDN

## 💡 Dicas

- Use o plugin "WooCommerce REST API Authentication" se tiver problemas de autenticação
- Configure SSL no Render (automático)
- Use variáveis de ambiente para diferentes ambientes (dev/prod)
- Faça backup regular do banco de dados

