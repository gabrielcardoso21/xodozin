# 🚀 Deploy Gratuito do Medusa

## ✅ Pré-Requisitos

Antes de fazer deploy, certifique-se de que:
- ✅ Todos os testes passaram
- ✅ Usuários criados
- ✅ Configurações do Brasil aplicadas
- ✅ Banco de dados funcionando

## 📋 Opções de Deploy Gratuito

### 1. Railway (Recomendado) ⭐

**Vantagens:**
- Plano gratuito generoso
- Fácil configuração
- PostgreSQL incluído
- Deploy automático via Git

**Passos:**

1. **Criar conta:** https://railway.app
2. **Criar novo projeto** e conectar ao GitHub
3. **Adicionar PostgreSQL:**
   - Clique em "+ New"
   - Selecione "Database" → "PostgreSQL"
4. **Adicionar serviço do Medusa:**
   - Clique em "+ New" → "GitHub Repo"
   - Selecione seu repositório
   - Railway detectará automaticamente
5. **Configurar variáveis de ambiente:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=redis://default:password@redis:6379
   JWT_SECRET=seu_jwt_secret_aqui
   COOKIE_SECRET=seu_cookie_secret_aqui
   STORE_CORS=https://seu-dominio.com
   ADMIN_CORS=https://seu-dominio.com
   NODE_ENV=production
   ```
6. **Adicionar Redis (opcional):**
   - Pode usar Upstash Redis (gratuito)
   - Ou usar fake redis (não recomendado para produção)

**Arquivo de configuração:** `railway.json` já está criado!

### 2. Render

**Vantagens:**
- Plano gratuito
- PostgreSQL gratuito
- Deploy automático

**Passos:**

1. **Criar conta:** https://render.com
2. **Criar Web Service:**
   - Conecte ao GitHub
   - Build Command: `cd xodozin && yarn install && yarn build`
   - Start Command: `cd xodozin && yarn start`
3. **Criar PostgreSQL:**
   - New → PostgreSQL
   - Copie a connection string
4. **Configurar variáveis de ambiente** (mesmas do Railway)
5. **Adicionar Redis** (Upstash ou Render Redis)

**Arquivo de configuração:** `render.yaml` já está criado!

### 3. Fly.io

**Vantagens:**
- Plano gratuito
- PostgreSQL incluído
- Global edge network

**Passos:**

1. **Instalar Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
2. **Login:**
   ```bash
   fly auth login
   ```
3. **Criar app:**
   ```bash
   cd /home/gabriel/xodozin/xodozin
   fly launch
   ```
4. **Criar PostgreSQL:**
   ```bash
   fly postgres create
   fly postgres attach <postgres-app-name>
   ```
5. **Deploy:**
   ```bash
   fly deploy
   ```

**Arquivo de configuração:** `fly.toml` já está criado!

## 🔧 Configurações Necessárias

### Variáveis de Ambiente

Todas as plataformas precisam dessas variáveis:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379 (ou deixar vazio para fake redis)
JWT_SECRET=seu_jwt_secret_seguro
COOKIE_SECRET=seu_cookie_secret_seguro
STORE_CORS=https://seu-dominio.com
ADMIN_CORS=https://seu-dominio.com,https://admin.seu-dominio.com
AUTH_CORS=https://seu-dominio.com,https://admin.seu-dominio.com
NODE_ENV=production
```

### Após Deploy

1. **Executar migrations:**
   ```bash
   yarn medusa migrations run
   ```

2. **Configurar Brasil:**
   ```bash
   yarn setup:brasil
   ```

3. **Criar usuários:**
   ```bash
   npx medusa user -e gabriel@xodozin.com.br -p Gabriel123!
   npx medusa user -e anne@xodozin.com.br -p Anne123!
   ```

## 📝 Checklist de Deploy

- [ ] Testes locais passaram
- [ ] Código commitado no Git
- [ ] [ ] Plataforma escolhida (Railway/Render/Fly.io)
- [ ] PostgreSQL criado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Migrations executadas
- [ ] Script setup:brasil executado
- [ ] Usuários criados
- [ ] Teste de login funcionando
- [ ] Admin Panel acessível

## 🎯 Recomendação

**Railway** é a opção mais fácil e rápida para começar!

## 📚 Documentação

- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Fly.io: https://fly.io/docs
