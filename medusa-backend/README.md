# Medusa Backend - Xodózin

Backend e-commerce usando Medusa.js para gerenciar produtos, pedidos, pagamentos e estoque.

## Pré-requisitos

- **Node.js >= 20** (obrigatório)
- **PostgreSQL** ou **SQLite** (PostgreSQL recomendado)
- **Redis** (opcional, mas recomendado para cache)

## Instalação Rápida

### 1. Verificar Node.js

```bash
node --version  # Deve ser >= 20
```

Se não tiver Node.js 20+, instale:
```bash
nvm install 20
nvm use 20
```

### 2. Executar Script de Setup

```bash
cd medusa-backend
./scripts/setup.sh
```

O script vai:
- ✅ Verificar Node.js
- ✅ Criar `.env` se não existir
- ✅ Instalar dependências
- ✅ Fazer build
- ✅ Oferecer executar migrações

### 3. Configurar Variáveis de Ambiente

Edite `.env`:

```env
# Database (obrigatório)
DATABASE_URL=postgresql://user:password@localhost:5432/xodozin
# ou para SQLite (desenvolvimento):
# DATABASE_URL=sqlite://./medusa.db

# Redis (opcional)
REDIS_URL=redis://localhost:6379

# JWT (obrigatório - gerado automaticamente pelo setup.sh)
JWT_SECRET=seu-jwt-secret-aqui
COOKIE_SECRET=seu-cookie-secret-aqui

# Server
PORT=9000
NODE_ENV=development

# CORS - URL do frontend
CORS=http://localhost:3000

# MongoDB (para migração de dados)
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/
DB_NAME=xodozin
```

### 4. Executar Migrações

```bash
npx medusa migrations run
```

### 5. Criar Região Brasil

```bash
# Via script (requer token admin)
node scripts/create-region.js

# Ou manualmente via Admin:
# 1. Acesse http://localhost:7001
# 2. Vá em Settings > Regions
# 3. Crie região "Brasil" com moeda BRL
```

### 6. Migrar Dados (Opcional)

Se você já tem produtos no MongoDB:

```bash
# Configure MONGO_URL e DB_NAME no .env
node scripts/migrate-data.js
```

### 7. Iniciar Servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

O servidor estará rodando em: `http://localhost:9000`

---

## Estrutura

```
medusa-backend/
├── src/
│   ├── api/              # Endpoints customizados
│   │   └── store/        # Endpoints públicos (Store API)
│   │       └── quiz/     # Endpoint customizado para Quiz
│   ├── models/           # Modelos customizados
│   └── services/         # Serviços customizados
├── scripts/
│   ├── setup.sh          # Script de setup automático
│   ├── migrate-data.js   # Migração de dados do MongoDB
│   └── create-region.js  # Criar região Brasil
├── medusa-config.js      # Configuração do Medusa
├── .env                  # Variáveis de ambiente
└── package.json
```

---

## API Endpoints

### Store API (Pública)

- `GET /store/products` - Listar produtos
- `GET /store/products/:id` - Buscar produto
- `GET /store/collections` - Listar collections (kits)
- `GET /store/collections/:id` - Buscar collection
- `POST /store/carts` - Criar carrinho
- `POST /store/carts/:id/line-items` - Adicionar item ao carrinho
- `POST /store/carts/:id/complete` - Finalizar pedido
- `POST /store/quiz/suggest` - Sugestão de produtos baseado no quiz (customizado)

### Admin API (Privada)

- `GET /admin/products` - Listar produtos (admin)
- `POST /admin/products` - Criar produto
- `GET /admin/collections` - Listar collections (admin)
- `POST /admin/collections` - Criar collection

---

## Scripts Disponíveis

```bash
# Setup completo
./scripts/setup.sh

# Migrar dados do MongoDB
node scripts/migrate-data.js

# Criar região Brasil
node scripts/create-region.js

# Executar migrações
npx medusa migrations run

# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

---

## Variáveis de Ambiente

Ver `.env.example` para lista completa.

**Principais:**
- `DATABASE_URL` - URL do banco de dados (obrigatório)
- `REDIS_URL` - URL do Redis (opcional)
- `JWT_SECRET` - Secret para JWT (obrigatório)
- `COOKIE_SECRET` - Secret para cookies (obrigatório)
- `CORS` - URL do frontend para CORS
- `MONGO_URL` - URL do MongoDB (para migração)
- `DB_NAME` - Nome do banco MongoDB (para migração)

---

## Troubleshooting

### Erro: "Node.js version must be >= 20"
**Solução:** Atualize Node.js para versão 20 ou superior

### Erro: "Cannot connect to database"
**Solução:**
- Verifique `DATABASE_URL` no `.env`
- Teste conexão: `psql -U usuario -d xodozin`

### Erro: "Redis connection failed"
**Solução:**
- Redis é opcional, pode remover do `medusa-config.js`
- Ou configure `REDIS_URL` corretamente

### Erro: "Port 9000 already in use"
**Solução:**
- Mude `PORT` no `.env` para outra porta
- Ou pare o processo que está usando a porta 9000

---

## Próximos Passos

1. ✅ Configurar banco de dados
2. ✅ Executar migrações
3. ✅ Criar região Brasil
4. ✅ Migrar dados existentes
5. ✅ Configurar pagamentos (Stripe, PIX)
6. ✅ Configurar envio/entrega
7. ✅ Deploy em produção

---

## Referências

- [Documentação oficial do Medusa.js](https://docs.medusajs.com/)
- [Guia de instalação](../INSTALACAO-MEDUSA.md)
- [Guia de migração](../MIGRACAO-MEDUSA.md)
- [Deploy gratuito](../DEPLOY-MEDUSA-GRATUITO.md)
