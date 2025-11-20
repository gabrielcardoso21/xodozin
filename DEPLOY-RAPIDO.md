# ⚡ Deploy Rápido - Passo a Passo

## 🎯 Objetivo: Colocar o site no ar para cadastrar produtos

---

## 📦 PARTE 1: Backend (Railway) - 15 minutos

### 1. Criar Conta e Projeto

1. Acesse: https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione repositório `xodozin`

### 2. Adicionar PostgreSQL

1. No projeto, clique "+ New"
2. "Database" → "Add PostgreSQL"
3. ✅ Pronto! Railway cria automaticamente

### 3. Configurar Variáveis de Ambiente

No serviço do Medusa → "Variables" → Adicione:

```env
# Database (Railway preenche automaticamente - não precisa adicionar)
# DATABASE_URL=${{Postgres.DATABASE_URL}}

# Secrets (GERE NO TERMINAL!)
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)

# Environment
NODE_ENV=production
PORT=9000

# CORS (ajuste depois com URL do frontend)
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*

# Opcional (pode deixar vazio)
REDIS_URL=
```

**⚠️ IMPORTANTE:** Gere os secrets no terminal:
```bash
openssl rand -base64 32  # Copie e cole como JWT_SECRET
openssl rand -base64 32  # Copie e cole como COOKIE_SECRET
```

### 4. Configurar Root Directory (CRÍTICO! ⚠️)

**🚨 AÇÃO OBRIGATÓRIA:** O Railway está analisando a raiz e não detecta Node.js.

**Solução IMEDIATA:**

1. No Railway Dashboard → Seu serviço Medusa
2. Clique em **"Settings"** (⚙️)
3. Role até **"Root Directory"**
4. **Digite:** `xodozin` (exatamente isso, sem barra no final)
5. **Salve**

**Isso faz o Railway:**
- ✅ Analisar apenas o diretório `xodozin/`
- ✅ Encontrar o `package.json` do Medusa
- ✅ Detectar como Node.js automaticamente

**⚠️ SEM ISSO, O DEPLOY NÃO VAI FUNCIONAR!**

**Se não encontrar "Root Directory":**
- Procure em "Settings" → "Build & Deploy"
- Ou em "Settings" → "General"
- Pode estar em diferentes lugares dependendo da versão do Railway

### 5. Deploy Automático

Railway fará deploy automaticamente! Aguarde ~5 minutos.

**Se der erro de Python:**
- Verifique se os arquivos `nixpacks.toml` e `railway.json` estão na raiz
- Force redeploy: "Deployments" → "Redeploy"

### 6. Anotar URL

Após deploy, anote a URL:
- Exemplo: `xodozin-production.up.railway.app`
- Admin Panel: `https://xodozin-production.up.railway.app/app`

### 7. Setup Pós-Deploy (CRÍTICO!)

Após o primeiro deploy, execute o setup:

#### Opção A: Railway CLI (Recomendado)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link ao projeto (selecione o projeto)
railway link

# Executar setup
railway run bash xodozin/scripts/setup-production.sh
```

#### Opção B: Via Dashboard (One-Off Service)

1. No Railway, "+ New" → "Empty Service"
2. Configure:
   - Root Directory: `xodozin`
   - Command: `bash scripts/setup-production.sh`
3. Execute e depois delete o serviço

#### Opção C: Manual (via Railway CLI)

```bash
railway run cd xodozin && yarn medusa migrations run
railway run cd xodozin && yarn medusa exec ./src/scripts/setup-brasil.ts
railway run cd xodozin && yarn medusa exec ./src/scripts/create-users-final.ts
railway run cd xodozin && yarn medusa exec ./src/scripts/create-publishable-key.ts
```

### 8. Verificar

1. Acesse: `https://seu-app.railway.app/health`
2. Deve retornar: `{ status: "ok" }`
3. Acesse Admin: `https://seu-app.railway.app/app`
4. Login com: `gabriel@xodozin.com.br` / `Gabriel123!`

---

## 🎨 PARTE 2: Frontend (Vercel) - 10 minutos

### 1. Criar Conta

1. Acesse: https://vercel.com
2. Login com GitHub

### 2. Importar Projeto

1. "Add New" → "Project"
2. Importe repositório `xodozin`
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build` (ou `npm run build`)
   - **Output Directory:** `build`
   - **Install Command:** `yarn install` (ou `npm install`)

### 3. Variáveis de Ambiente

"Settings" → "Environment Variables":

```env
REACT_APP_MEDUSA_BACKEND_URL=https://seu-app.railway.app
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_...  # Obter do Admin Panel
```

**⚠️ IMPORTANTE:** 
- Substitua `seu-app.railway.app` pela URL real do Railway
- Para obter `PUBLISHABLE_KEY`: Acesse Admin Panel → Settings → API Keys → Copie a chave

### 4. Deploy

Vercel faz deploy automaticamente! Aguarde ~3 minutos.

### 5. Atualizar CORS no Backend

Volte no Railway e atualize:

```env
STORE_CORS=https://seu-app.vercel.app
ADMIN_CORS=https://seu-app.vercel.app
AUTH_CORS=https://seu-app.vercel.app
```

Railway fará redeploy automaticamente.

---

## ✅ Checklist Final

- [ ] Backend deployado no Railway
- [ ] PostgreSQL criado
- [ ] Variáveis de ambiente configuradas
- [ ] Setup executado (migrations, Brasil, usuários)
- [ ] Admin Panel acessível e login funciona
- [ ] Frontend deployado no Vercel
- [ ] Variáveis de ambiente do frontend configuradas
- [ ] CORS atualizado no backend
- [ ] Frontend conecta ao backend

---

## 🎉 Pronto!

Sua amiga pode acessar:
- **Admin Panel:** `https://seu-app.railway.app/app`
- **Site (Frontend):** `https://seu-app.vercel.app`

E começar a cadastrar produtos e kits! 🚀

---

## 🆘 Problemas Comuns

### Backend não inicia
- Verificar logs no Railway
- Verificar se `DATABASE_URL` está configurado
- Verificar se `JWT_SECRET` e `COOKIE_SECRET` estão definidos

### Migrations não executam
```bash
railway run cd xodozin && yarn medusa migrations run
```

### Admin Panel não carrega
- Verificar CORS
- Verificar se usuário foi criado
- Verificar logs

### Frontend não conecta
- Verificar `REACT_APP_MEDUSA_BACKEND_URL` está correto
- Verificar `REACT_APP_MEDUSA_PUBLISHABLE_KEY` está configurado
- Verificar CORS no backend

---

## 📞 Precisa de Ajuda?

Se algo der errado, me avise e eu ajudo a resolver!

