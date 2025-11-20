# ⚙️ Configuração do Medusa

## 🇧🇷 Configurar Brasil

### Script Automático

```bash
./INICIALIZAR-MEDUSA.sh
```

Este script executa:
1. Instalação de dependências
2. Setup do banco de dados
3. Configuração da região Brasil
4. Criação de publishable API key

### Configuração Manual

#### 1. Configurar Região Brasil

```bash
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/setup-brasil.ts"
```

#### 2. Criar Publishable API Key

```bash
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/create-publishable-key.ts"
```

## 🌐 Variáveis de Ambiente

As variáveis estão configuradas no `docker-compose.yml`:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret para JWT tokens
- `COOKIE_SECRET`: Secret para cookies
- `STORE_CORS`: CORS para Store API (http://localhost:3000)
- `ADMIN_CORS`: CORS para Admin Panel
- `AUTH_CORS`: CORS para autenticação

## 🔑 Publishable API Key

A publishable API key é necessária para o frontend acessar a Store API do Medusa v2.

Após criar a chave, configure no frontend:

```bash
# frontend/.env
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_...
```

## 📝 Próximos Passos

1. ✅ Configurar região Brasil
2. ⏳ Configurar métodos de pagamento (Mercado Pago, Pix)
3. ⏳ Configurar métodos de envio
4. ⏳ Integrar API de NF (Focus NFe ou NFe.io)

