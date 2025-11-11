# 🚀 Guia de Configuração - Medusa.js

Guia passo a passo para configurar o Medusa.js completamente.

---

## 📋 Pré-requisitos

- ✅ Docker e Docker Compose instalados
- ✅ Containers rodando (PostgreSQL, Redis, Medusa)
- ✅ CLI do Medusa funcionando

---

## 🎯 Passo 1: Verificar Status dos Containers

```bash
docker-compose -f docker-compose.dev.yml ps
```

**Resultado esperado:**
```
✅ xodozin-postgres         Up (healthy)
✅ xodozin-redis            Up (healthy)
✅ xodozin-medusa-backend   Up
```

---

## 🗄️ Passo 2: Executar Migrações do Banco de Dados (Opcional)

> **Nota:** As migrações são executadas automaticamente quando o Medusa inicia pela primeira vez. Se preferir executar manualmente:

```bash
docker exec -it xodozin-medusa-backend npx medusa db:migrate
```

**O que faz:**
- Cria todas as tabelas do Medusa
- Configura relacionamentos
- Prepara estrutura do banco

**Resultado esperado:**
```
✅ Migrations completed successfully
```

> **Dica:** Se der erro de conexão, aguarde alguns segundos e tente novamente. O PostgreSQL pode estar ainda inicializando.

---

## 👤 Passo 3: Criar Usuário Administrador

Crie o primeiro usuário admin para acessar o painel administrativo.

```bash
docker exec -it xodozin-medusa-backend npx medusa user
```

**Siga as instruções:**
1. Email: `admin@xodozin.com.br` (ou seu email)
2. Senha: (escolha uma senha segura)
3. Confirme a senha

**Resultado esperado:**
```
✅ User created successfully
```

---

## 🌍 Passo 4: Criar Região (Brasil)

O Medusa precisa de uma região configurada para vendas.

### Opção A: Via Script (Recomendado)

```bash
docker exec -it xodozin-medusa-backend node scripts/create-region.js
```

### Opção B: Via Admin Panel

1. Acesse: `http://localhost:7001`
2. Faça login com o usuário criado
3. Vá em **Settings > Regions**
4. Clique em **Create Region**
5. Configure:
   - **Name:** Brasil
   - **Currency:** BRL (Real Brasileiro)
   - **Countries:** Brazil
   - **Payment Providers:** (configure depois)
   - **Shipping Options:** (configure depois)

---

## 💳 Passo 5: Configurar Métodos de Pagamento

### Via Admin Panel

1. Acesse: `http://localhost:7001`
2. Vá em **Settings > Payment Providers**
3. Configure os métodos desejados:
   - **Stripe** (se tiver chave API)
   - **Manual Payment** (para testes)
   - **PIX** (via plugin customizado)

### Via Script (Stripe)

Se você tem chave do Stripe, adicione no `.env`:

```env
STRIPE_API_KEY=sk_test_...
```

E reinicie o container:

```bash
docker-compose -f docker-compose.dev.yml restart medusa-backend
```

---

## 🚚 Passo 6: Configurar Métodos de Envio

### Via Admin Panel

1. Acesse: `http://localhost:7001`
2. Vá em **Settings > Shipping Options**
3. Clique em **Create Shipping Option**
4. Configure:
   - **Name:** Entrega Padrão
   - **Price:** R$ 10,00 (ou valor desejado)
   - **Regions:** Brasil
   - **Fulfillment Provider:** Manual

---

## 📦 Passo 7: Adicionar Produtos Manualmente

Você pode adicionar produtos diretamente pelo Admin Panel - não precisa migrar dados!

### Via Admin Panel (Recomendado)

1. Acesse: `http://localhost:7001`
2. Faça login com o usuário admin criado
3. Vá em **Products**
4. Clique em **Create Product**
5. Preencha:
   - **Title:** Nome do produto
   - **Description:** Descrição
   - **Images:** Adicione imagens
   - **Variants:** Configure variações (tamanho, cor, etc.)
   - **Price:** Preço em BRL
   - **Inventory:** Quantidade em estoque
6. Clique em **Save**

### Criar Collections (Kits)

1. Vá em **Collections**
2. Clique em **Create Collection**
3. Preencha:
   - **Title:** Nome do kit (ex: "Kit Sensorial")
   - **Description:** Descrição do kit
   - **Products:** Selecione os produtos que fazem parte do kit
4. Clique em **Save**

> **Dica:** Você pode criar quantos produtos e kits quiser diretamente pelo Admin Panel!

### Migrar Dados (Opcional)

Se você tem muitos produtos no MongoDB e prefere migrar automaticamente:

1. Configure `MONGO_URL` e `DB_NAME` no `.env`
2. Execute: `docker exec -it xodozin-medusa-backend node scripts/migrate-data.js`

---

## 🧪 Passo 8: Testar API

### Health Check

```bash
curl http://localhost:9000/health
```

**Esperado:**
```json
{"status":"ok","message":"Medusa backend is running"}
```

### Produtos

```bash
curl http://localhost:9000/store/products
```

**Esperado:**
```json
{
  "products": [...],
  "count": 0
}
```

### Admin Panel

Acesse: `http://localhost:7001`

Faça login com o usuário criado.

---

## 🔧 Passo 9: Configurar Frontend

### 1. Atualizar `.env` do Frontend

Edite `frontend/.env`:

```env
REACT_APP_USE_MEDUSA=true
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 2. Reiniciar Frontend

```bash
cd frontend
npm start
```

O frontend vai usar o Medusa automaticamente!

---

## 📊 Passo 10: Verificar Tudo Funcionando

### Checklist

- [ ] Containers rodando
- [ ] Migrações executadas
- [ ] Usuário admin criado
- [ ] Região Brasil criada
- [ ] Métodos de pagamento configurados
- [ ] Métodos de envio configurados
- [ ] API respondendo
- [ ] Admin Panel acessível
- [ ] Frontend conectado

---

## 🆘 Troubleshooting

### Erro: "Cannot connect to database"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Verificar conexão
docker exec xodozin-postgres pg_isready -U postgres

# Verificar variável DATABASE_URL no .env
```

### Erro: "Redis connection failed"

**Solução:**
```bash
# Verificar se Redis está rodando
docker ps | grep redis

# Testar conexão
docker exec xodozin-redis redis-cli ping
```

### Erro: "Migrations failed"

**Solução:**
```bash
# Verificar logs
docker logs xodozin-medusa-backend

# Tentar novamente
docker exec xodozin-medusa-backend npx medusa db:migrate
```

---

## 📚 Comandos Úteis

### Ver Logs

```bash
# Logs do Medusa
docker-compose -f docker-compose.dev.yml logs -f medusa-backend

# Logs de todos os serviços
docker-compose -f docker-compose.dev.yml logs -f
```

### Reiniciar Serviços

```bash
# Reiniciar Medusa
docker-compose -f docker-compose.dev.yml restart medusa-backend

# Reiniciar tudo
docker-compose -f docker-compose.dev.yml restart
```

### Acessar Container

```bash
# Shell do container
docker exec -it xodozin-medusa-backend sh

# Executar comandos
docker exec xodozin-medusa-backend npx medusa --help
```

---

## 🎯 Próximos Passos Após Configuração

1. **✅ Adicionar Produtos** (Via Admin Panel)
   - Acesse `http://localhost:7001`
   - Vá em **Products > Create Product**
   - Configure produtos com preços, imagens e estoque

2. **✅ Configurar Coleções (Kits)**
   - Vá em **Collections > Create Collection**
   - Associe produtos aos kits

3. **✅ Testar Checkout**
   - Acesse o frontend: `http://localhost:3000`
   - Adicione produtos ao carrinho
   - Teste o fluxo de checkout

4. **✅ Configurar Produção** (Quando estiver pronto)
   - Variáveis de ambiente
   - SSL/HTTPS
   - Domínio customizado

---

## ✅ Status da Configuração

Use este checklist para acompanhar o progresso:

- [ ] Containers rodando (PostgreSQL, Redis, Medusa)
- [ ] Usuário admin criado
- [ ] Região Brasil configurada
- [ ] Métodos de pagamento configurados
- [ ] Métodos de envio configurados
- [ ] Produtos adicionados (via Admin Panel)
- [ ] Collections (Kits) criadas
- [ ] Frontend conectado e testado

---

**Última atualização:** $(date)


