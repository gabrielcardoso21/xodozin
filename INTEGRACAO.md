# 🔗 Integração Frontend com Medusa

## 📋 Status

- ✅ Frontend adaptado para usar Medusa Store API
- ✅ Publishable API Key configurada
- ✅ Endpoints customizados funcionando

## 🔧 Configuração

### Variáveis de Ambiente

Configure no `frontend/.env`:

```env
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_...
```

### Arquivo de API

O frontend usa `frontend/src/utils/medusa-api.js` que inclui automaticamente o header `x-publishable-api-key`.

## 📡 Endpoints Disponíveis

### Store API

- `GET /store/products` - Listar produtos
- `GET /store/collections` - Listar collections
- `GET /store/collections/:id` - Detalhes da collection
- `POST /store/carts` - Criar carrinho
- `GET /store/carts/:id` - Buscar carrinho
- `POST /store/carts/:id/line-items` - Adicionar item ao carrinho
- `POST /store/carts/:id/payment-sessions` - Criar sessão de pagamento
- `POST /store/carts/:id/complete` - Finalizar pedido

### Endpoint Customizado

- `POST /store/quiz/suggest` - Sugestão de produtos baseado em quiz

## 🧪 Testar Integração

```bash
# Testar Store API
curl http://localhost:9000/store/products

# Testar com publishable key
curl -H "x-publishable-api-key: pk_..." http://localhost:9000/store/products
```

## 📝 Próximos Passos

1. ⏳ Migrar dados do MongoDB para PostgreSQL
2. ⏳ Testar fluxo completo de checkout
3. ⏳ Configurar métodos de pagamento
4. ⏳ Configurar métodos de envio

