# 🐳 Medusa.js com Docker - Guia Completo

## ✅ Por que Docker?

- ✅ **Mais rápido** - Não precisa instalar Node.js, PostgreSQL, Redis manualmente
- ✅ **Mais confiável** - Ambiente isolado e consistente
- ✅ **Mais fácil** - Um comando e tudo funciona
- ✅ **Mais portável** - Funciona em qualquer máquina com Docker

---

## 🚀 Setup Rápido com Docker

### 1. Verificar Docker

```bash
docker --version
docker-compose --version
```

Se não tiver instalado:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# macOS
brew install docker docker-compose
```

### 2. Criar arquivo .env (se não existir)

```bash
cd /home/gabriel/xodozin
cat > .env << 'EOF'
JWT_SECRET=change-this-jwt-secret-key-$(date +%s)
COOKIE_SECRET=change-this-cookie-secret-key-$(date +%s)
STRIPE_API_KEY=
MONGO_URL=
DB_NAME=xodozin
EOF
```

### 3. Iniciar tudo com Docker Compose

```bash
# Modo desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up --build

# Ou em background
docker-compose -f docker-compose.dev.yml up -d --build
```

### 4. Executar Migrações

```bash
# Entrar no container
docker exec -it xodozin-medusa-backend sh

# Executar migrações
npx medusa migrations run

# Sair do container
exit
```

Ou em um comando:
```bash
docker exec -it xodozin-medusa-backend npx medusa migrations run
```

### 5. Verificar se está funcionando

```bash
# Ver logs
docker-compose -f docker-compose.dev.yml logs -f medusa-backend

# Testar API
curl http://localhost:9000/store/products
```

---

## 📋 Comandos Úteis

### Iniciar serviços
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Parar serviços
```bash
docker-compose -f docker-compose.dev.yml down
```

### Ver logs
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### Reiniciar um serviço
```bash
docker-compose -f docker-compose.dev.yml restart medusa-backend
```

### Executar comandos no container
```bash
# Executar migrações
docker exec -it xodozin-medusa-backend npx medusa migrations run

# Executar script de migração de dados
docker exec -it xodozin-medusa-backend node scripts/migrate-data.js

# Acessar shell do container
docker exec -it xodozin-medusa-backend sh
```

### Limpar tudo (cuidado!)
```bash
# Parar e remover containers
docker-compose -f docker-compose.dev.yml down

# Remover volumes (apaga dados!)
docker-compose -f docker-compose.dev.yml down -v
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Criar `.env` na raiz do projeto:

```env
# JWT Secrets (gerar aleatórios)
JWT_SECRET=seu-jwt-secret-aqui
COOKIE_SECRET=seu-cookie-secret-aqui

# Stripe (opcional)
STRIPE_API_KEY=sk_test_...

# MongoDB (para migração de dados - opcional)
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/
DB_NAME=xodozin
```

### Portas

- **Medusa Backend:** `http://localhost:9000`
- **PostgreSQL:** `localhost:5432`
- **Redis:** `localhost:6379`

---

## 🗄️ Banco de Dados

### Acessar PostgreSQL

```bash
# Via Docker
docker exec -it xodozin-postgres psql -U postgres -d xodozin

# Ou via cliente externo
psql -h localhost -U postgres -d xodozin
# Senha: postgres
```

### Backup do Banco

```bash
docker exec xodozin-postgres pg_dump -U postgres xodozin > backup.sql
```

### Restaurar Backup

```bash
docker exec -i xodozin-postgres psql -U postgres xodozin < backup.sql
```

---

## 🔴 Redis

### Acessar Redis CLI

```bash
docker exec -it xodozin-redis redis-cli
```

### Limpar Cache

```bash
docker exec -it xodozin-redis redis-cli FLUSHALL
```

---

## 📦 Migração de Dados

### Migrar dados do MongoDB

```bash
# 1. Configurar MONGO_URL no .env
# 2. Executar script de migração
docker exec -it xodozin-medusa-backend node scripts/migrate-data.js
```

---

## 🧪 Testar

### Testar API

```bash
# Listar produtos
curl http://localhost:9000/store/products

# Listar collections
curl http://localhost:9000/store/collections

# Testar quiz endpoint
curl -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "parceiro",
    "moment": "natal",
    "feeling": "reconectar"
  }'
```

---

## 🚀 Deploy com Docker

### Build para Produção

```bash
# Build da imagem
docker build -t xodozin-medusa:latest -f medusa-backend/Dockerfile medusa-backend/

# Ou usar docker-compose
docker-compose build medusa-backend
```

### Executar em Produção

```bash
docker-compose up -d
```

---

## 🆘 Troubleshooting

### Container não inicia

```bash
# Ver logs
docker-compose logs medusa-backend

# Verificar se PostgreSQL está saudável
docker-compose ps
```

### Erro de conexão com banco

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Ver logs do PostgreSQL
docker-compose logs postgres
```

### Rebuild completo

```bash
# Parar tudo
docker-compose down

# Rebuild sem cache
docker-compose build --no-cache

# Iniciar novamente
docker-compose up -d
```

### Limpar e recomeçar

```bash
# Parar e remover tudo
docker-compose down -v

# Remover imagens
docker rmi xodozin-medusa-backend

# Rebuild
docker-compose up --build
```

---

## 📊 Estrutura Docker

```
xodozin/
├── docker-compose.yml          # Produção
├── docker-compose.dev.yml     # Desenvolvimento
├── .env                        # Variáveis de ambiente
└── medusa-backend/
    ├── Dockerfile              # Produção
    ├── Dockerfile.dev          # Desenvolvimento
    └── .dockerignore
```

---

## ✅ Vantagens do Docker

1. **Isolamento** - Cada serviço em seu próprio container
2. **Consistência** - Mesmo ambiente em dev e produção
3. **Facilidade** - Um comando e tudo funciona
4. **Portabilidade** - Funciona em qualquer máquina
5. **Escalabilidade** - Fácil escalar serviços
6. **Manutenção** - Fácil atualizar e gerenciar

---

## 🎯 Próximos Passos

1. ✅ Docker instalado
2. ✅ docker-compose.yml criado
3. ⏭️ Executar `docker-compose up --build`
4. ⏭️ Executar migrações
5. ⏭️ Migrar dados (opcional)
6. ⏭️ Testar API
7. ⏭️ Ativar no frontend

---

## 📚 Referências

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Medusa Docker (Comunidade)](https://github.com/medusajs/docker-medusa)

