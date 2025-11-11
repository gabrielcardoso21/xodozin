# 🔧 Como Acessar o Backend

Guia completo de acesso ao backend Medusa.

---

## 📍 URLs de Acesso

### Medusa Backend (Principal)

- **API Base:** http://localhost:9000
- **Health Check:** http://localhost:9000/health
- **Store API (Pública):** http://localhost:9000/store
- **Admin API (Privada):** http://localhost:9000/admin
- **Admin Panel (Interface Web):** http://localhost:7001

### FastAPI Backend (Opcional - Não está rodando)

- **API Base:** http://localhost:8000
- **Status:** Não está rodando atualmente

---

## 🧪 Testar APIs via Terminal

### 1. Health Check

```bash
curl http://localhost:9000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "Medusa backend is running"
}
```

### 2. Listar Produtos

```bash
curl http://localhost:9000/store/products
```

**Resposta esperada:**
```json
{
  "products": [],
  "count": 0
}
```

### 3. Listar Collections (Kits)

```bash
curl http://localhost:9000/store/collections
```

**Resposta esperada:**
```json
{
  "collections": [],
  "count": 0
}
```

### 4. Quiz - Sugestão de Produtos

```bash
curl -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "parceiro",
    "moment": "natal",
    "feeling": "pausar"
  }'
```

**Resposta esperada:**
```json
{
  "ritual_name": "Ritual do Amor",
  "suggested_products": [],
  "categories": {
    "sensorial": 0,
    "afetivo": 0,
    "ritualistico": 0
  }
}
```

---

## 🌐 Acessar via Navegador

### Health Check

Abra no navegador:
```
http://localhost:9000/health
```

Deve mostrar:
```json
{"status":"ok","message":"Medusa backend is running"}
```

### Store API - Products

```
http://localhost:9000/store/products
```

### Store API - Collections

```
http://localhost:9000/store/collections
```

---

## 👤 Admin Panel (Interface Web)

### Acessar Admin Panel

1. **URL:** http://localhost:7001
2. **Primeiro acesso:** Precisa criar usuário admin primeiro

### Criar Usuário Admin

```bash
docker exec -it xodozin-medusa-backend npx medusa user
```

**Siga as instruções:**
- Email: `admin@xodozin.com.br` (ou seu email)
- Senha: (escolha uma senha segura)

### Depois de criar usuário

1. Acesse: http://localhost:7001
2. Faça login com o usuário criado
3. Você terá acesso a:
   - **Products** - Gerenciar produtos
   - **Collections** - Gerenciar kits
   - **Orders** - Ver pedidos
   - **Settings** - Configurações (regiões, pagamentos, envios)

---

## 🔍 Verificar Status

### Verificar se está rodando

```bash
# Ver containers
docker ps | grep xodozin-medusa-backend

# Ver logs
docker logs xodozin-medusa-backend

# Testar API
curl http://localhost:9000/health
```

### Verificar CORS

```bash
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS \
  http://localhost:9000/health -v
```

Deve retornar headers CORS:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

## 📚 Endpoints Disponíveis

### Store API (Pública - Sem autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check |
| GET | `/store/products` | Listar produtos |
| GET | `/store/products/:id` | Buscar produto |
| GET | `/store/collections` | Listar collections (kits) |
| GET | `/store/collections/:id` | Buscar collection |
| POST | `/store/quiz/suggest` | Sugestão de produtos (quiz) |
| POST | `/store/carts` | Criar carrinho |
| POST | `/store/carts/:id/line-items` | Adicionar item ao carrinho |
| POST | `/store/carts/:id/complete` | Finalizar pedido |

### Admin API (Privada - Requer autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/admin/products` | Listar produtos (admin) |
| POST | `/admin/products` | Criar produto |
| GET | `/admin/collections` | Listar collections (admin) |
| POST | `/admin/collections` | Criar collection |
| GET | `/admin/regions` | Listar regiões |
| POST | `/admin/regions` | Criar região |

---

## 🧪 Testar com cURL (Exemplos)

### Testar Health

```bash
curl http://localhost:9000/health
```

### Testar Products

```bash
curl http://localhost:9000/store/products | jq .
```

### Testar Quiz

```bash
curl -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "parceiro",
    "moment": "natal",
    "feeling": "pausar"
  }' | jq .
```

### Testar com CORS (simulando frontend)

```bash
curl -H "Origin: http://localhost:3000" \
  http://localhost:9000/health -v
```

---

## 🛠️ Ferramentas Úteis

### Postman / Insomnia

Configure:
- **Base URL:** `http://localhost:9000`
- **Headers:** 
  - `Content-Type: application/json`
  - `Origin: http://localhost:3000` (para testar CORS)

### Browser DevTools

1. Abra o navegador
2. F12 (DevTools)
3. Aba **Network**
4. Faça requisições e veja as respostas

### cURL (Terminal)

```bash
# Health check
curl http://localhost:9000/health

# Products
curl http://localhost:9000/store/products

# Quiz
curl -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{"recipient":"parceiro","moment":"natal","feeling":"pausar"}'
```

---

## 🔧 Troubleshooting

### Backend não responde

```bash
# Verificar se está rodando
docker ps | grep medusa

# Ver logs
docker logs xodozin-medusa-backend

# Reiniciar
docker restart xodozin-medusa-backend
```

### Erro de CORS

- ✅ CORS já está configurado
- Verifique se o frontend está em `http://localhost:3000`
- Recarregue a página (F5)

### Admin Panel não abre

1. Verifique se o container está rodando
2. Acesse: http://localhost:7001
3. Se não abrir, crie usuário admin primeiro:
   ```bash
   docker exec -it xodozin-medusa-backend npx medusa user
   ```

---

## 📊 Status Rápido

```bash
# Verificar tudo de uma vez
echo "=== Containers ===" && \
docker ps --format "{{.Names}}: {{.Status}}" | grep xodozin && \
echo "" && \
echo "=== APIs ===" && \
echo "Medusa Health: $(curl -s http://localhost:9000/health | jq -r '.status' 2>/dev/null || echo 'não responde')" && \
echo "Medusa Products: $(curl -s http://localhost:9000/store/products | jq -r '.count' 2>/dev/null || echo 'erro') produtos"
```

---

## 🎯 Próximos Passos

1. ✅ **Acessar backend** ← Você está aqui!
2. ⏭️ **Criar usuário admin** → `docker exec -it xodozin-medusa-backend npx medusa user`
3. ⏭️ **Acessar Admin Panel** → http://localhost:7001
4. ⏭️ **Adicionar produtos** → Via Admin Panel
5. ⏭️ **Testar no frontend** → http://localhost:3000

---

**Última atualização:** $(date)

