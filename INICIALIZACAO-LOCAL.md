# 🚀 Inicialização Local do Medusa

## Configuração

O Medusa agora roda localmente (fora do Docker), enquanto PostgreSQL e Redis continuam no Docker.

### 1. Iniciar PostgreSQL e Redis

```bash
docker-compose up -d
```

Isso iniciará apenas os serviços PostgreSQL e Redis.

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` no diretório `xodozin/` com as seguintes variáveis:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/xodozin?sslmode=disable
PGSSLMODE=disable

# Redis
REDIS_URL=redis://localhost:6379

# Secrets
JWT_SECRET=change-this-jwt-secret-key-123456789
COOKIE_SECRET=change-this-cookie-secret-key-123456789

# Server
PORT=9000
NODE_ENV=development

# CORS
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:3000,http://localhost:7001
AUTH_CORS=http://localhost:3000,http://localhost:7001
```

### 3. Instalar Dependências

```bash
cd xodozin
yarn install
```

### 4. Setup do Banco de Dados (Primeira Vez)

```bash
cd xodozin
echo 'xodozin' | yarn medusa db:setup
```

### 5. Seed do Banco de Dados (Primeira Vez)

```bash
cd xodozin
yarn medusa exec ./src/scripts/seed.ts
```

### 6. Iniciar o Medusa

```bash
cd xodozin
yarn dev
```

O Medusa estará disponível em:
- **Admin Panel**: http://localhost:9000/app
- **Store API**: http://localhost:9000/store
- **Admin API**: http://localhost:9000/admin
- **Health Check**: http://localhost:9000/health

## ✅ Vantagens

- ✅ HMR (Hot Module Replacement) funciona corretamente
- ✅ Sem erros de WebSocket
- ✅ Desenvolvimento mais rápido
- ✅ Debug mais fácil

## 📝 Notas

- Certifique-se de que o Node.js 20+ está instalado
- O PostgreSQL e Redis devem estar rodando no Docker antes de iniciar o Medusa
- As portas 5432 (PostgreSQL) e 6379 (Redis) devem estar disponíveis

