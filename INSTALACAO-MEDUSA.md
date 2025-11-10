# 📦 Guia de Instalação do Medusa.js

## Pré-requisitos

### 1. Node.js >= 20

**Verificar versão atual:**
```bash
node --version
```

**Se for menor que 20, atualizar:**

**Usando nvm (recomendado):**
```bash
# Instalar nvm (se não tiver)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Instalar Node.js 20
nvm install 20
nvm use 20

# Verificar
node --version  # Deve mostrar v20.x.x
```

**Ou baixar diretamente:**
- Acessar: https://nodejs.org/
- Baixar versão LTS (20.x ou superior)

### 2. PostgreSQL ou SQLite

**PostgreSQL (recomendado para produção):**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (usando Homebrew)
brew install postgresql
brew services start postgresql

# Criar banco de dados
createdb xodozin
```

**SQLite (para desenvolvimento local):**
- Já vem com Node.js, não precisa instalar nada

### 3. Redis (opcional, mas recomendado)

```bash
# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# macOS (usando Homebrew)
brew install redis
brew services start redis
```

---

## Instalação do Medusa.js

### Passo 1: Criar Projeto

```bash
cd /home/gabriel/xodozin

# Instalar Medusa CLI globalmente (se necessário)
npm install -g @medusajs/medusa-cli

# Criar projeto Medusa
npx create-medusa-app@latest medusa-backend
```

**Durante a instalação, escolher:**
- **Database:** PostgreSQL (recomendado) ou SQLite (para desenvolvimento)
- **Redis:** Sim (recomendado)
- **Stripe:** Sim (para pagamentos)
- **Seed:** Sim (para dados de exemplo)

### Passo 2: Configurar Variáveis de Ambiente

```bash
cd medusa-backend
cp .env.example .env
```

Editar `.env`:

```env
# Database
DATABASE_URL=postgresql://usuario:senha@localhost:5432/xodozin
# ou para SQLite:
# DATABASE_URL=sqlite://./medusa.db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=seu-jwt-secret-aqui-mude-isso
COOKIE_SECRET=seu-cookie-secret-aqui-mude-isso

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

### Passo 3: Instalar Dependências

```bash
cd medusa-backend
npm install
```

### Passo 4: Executar Migrações

```bash
# Build do projeto
npm run build

# Executar migrações do banco de dados
npx medusa migrations run
```

### Passo 5: Iniciar Servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

O servidor estará rodando em: `http://localhost:9000`

---

## Verificar Instalação

### 1. Testar API

```bash
# Listar produtos (deve retornar vazio inicialmente)
curl http://localhost:9000/store/products

# Listar collections (deve retornar vazio inicialmente)
curl http://localhost:9000/store/collections
```

### 2. Acessar Admin (se configurado)

Acessar: `http://localhost:7001` (porta padrão do admin)

---

## Próximos Passos

1. **Migrar dados** do MongoDB para Medusa (usar script `scripts/migrate-data.js`)
2. **Configurar região** Brasil no Medusa
3. **Configurar pagamentos** (Stripe, PIX)
4. **Adaptar frontend** para usar API do Medusa

---

## Troubleshooting

### Erro: "Node.js version must be >= 20"

**Solução:** Atualizar Node.js para versão 20 ou superior (ver pré-requisitos)

### Erro: "Cannot connect to database"

**Solução:**
- Verificar se PostgreSQL está rodando: `sudo systemctl status postgresql`
- Verificar `DATABASE_URL` no `.env`
- Testar conexão: `psql -U usuario -d xodozin`

### Erro: "Redis connection failed"

**Solução:**
- Verificar se Redis está rodando: `redis-cli ping` (deve retornar PONG)
- Verificar `REDIS_URL` no `.env`
- Redis é opcional, pode remover do `medusa-config.js` se não usar

### Erro: "Port 9000 already in use"

**Solução:**
- Mudar `PORT` no `.env` para outra porta (ex: 9001)
- Ou parar processo que está usando a porta 9000

---

## Estrutura do Projeto Após Instalação

```
medusa-backend/
├── src/
│   ├── api/              # Endpoints customizados
│   ├── models/           # Modelos customizados
│   ├── services/         # Serviços customizados
│   └── subscribers/      # Eventos
├── medusa-config.js      # Configuração principal
├── .env                  # Variáveis de ambiente
├── package.json
└── README.md
```

---

## Referências

- [Documentação oficial do Medusa.js](https://docs.medusajs.com/)
- [Guia de instalação](https://docs.medusajs.com/resources/commerce-modules/getting-started)
- [API Reference](https://docs.medusajs.com/api/store)

