# 🚀 Guia de Execução - Deploy Gratuito Xodozin

Este guia contém os passos EXATOS para executar o deploy do projeto Xodozin de forma gratuita.

## 📋 Pré-requisitos

- [x] Conta no Railway (já tem)
- [x] Conta no Vercel (criar se necessário)
- [x] Repositório no GitHub/GitLab (já está)
- [x] Railway CLI instalado (opcional, mas recomendado)

---

## PARTE 1: Backend no Railway

### Passo 1: Gerar Secrets

Execute no terminal:

```bash
bash scripts/generate-secrets.sh
```

Anote os valores gerados para `JWT_SECRET` e `COOKIE_SECRET`.

### Passo 2: Criar Projeto no Railway

1. Acesse: https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório `xodozin`
5. Railway criará automaticamente um serviço

### Passo 3: Configurar Root Directory (CRÍTICO ⚠️)

**IMPORTANTE:** O Railway precisa saber que o código Node.js está em `xodozin/`

1. No Railway Dashboard, clique no serviço criado
2. Vá em **"Settings"** (⚙️)
3. Role até **"Root Directory"**
4. Digite: `xodozin` (sem barra no final)
5. Clique em **"Save"**

### Passo 4: Adicionar PostgreSQL

1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Railway criará automaticamente o banco
4. O Railway automaticamente injetará `DATABASE_URL` no serviço do Medusa

### Passo 5: Configurar Variáveis de Ambiente

No serviço do Medusa, vá em **"Variables"** e adicione:

```env
# Database (Railway preenche automaticamente - não precisa adicionar manualmente)
# DATABASE_URL=${{Postgres.DATABASE_URL}}

# Secrets (use os valores gerados no Passo 1)
JWT_SECRET=<valor_gerado_no_passo_1>
COOKIE_SECRET=<valor_gerado_no_passo_1>

# Environment
NODE_ENV=production
PORT=9000

# CORS (atualizar depois com URL do frontend)
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*

# Redis (opcional - pode deixar vazio)
REDIS_URL=
```

**Nota:** O Railway automaticamente conecta o PostgreSQL ao serviço via `${{Postgres.DATABASE_URL}}`. Você pode verificar isso nas variáveis de ambiente.

### Passo 6: Deploy Automático

1. Railway fará deploy automaticamente após salvar as variáveis
2. Aguarde o build completar (~5 minutos)
3. Anote a URL gerada (ex: `xodozin-production.up.railway.app`)
4. Verifique os logs em **"Deployments"** → **"View Logs"**

### Passo 7: Setup Pós-Deploy (CRÍTICO ⚠️)

Após o deploy bem-sucedido, execute o setup:

#### Opção A: Railway CLI (Recomendado)

```bash
# Instalar Railway CLI (se ainda não tiver)
npm i -g @railway/cli

# Login
railway login

# Link ao projeto (selecione o projeto correto)
railway link

# Executar setup completo
railway run bash xodozin/scripts/setup-production.sh
```

#### Opção B: Comandos Individuais

```bash
railway run cd xodozin && yarn medusa migrations run
railway run cd xodozin && yarn medusa exec ./src/scripts/setup-brasil.ts
railway run cd xodozin && yarn medusa exec ./src/scripts/create-users-final.ts
railway run cd xodozin && yarn medusa exec ./src/scripts/create-publishable-key.ts
```

### Passo 8: Verificar Backend

1. Acesse: `https://seu-app.railway.app/health`
   - Deve retornar: `{ status: "ok" }`

2. Acesse Admin Panel: `https://seu-app.railway.app/app`
   - Deve carregar a tela de login

3. Faça login com:
   - Email: `gabriel@xodozin.com.br`
   - Senha: `Gabriel123!`

4. No Admin Panel, vá em **Settings** → **API Keys**
   - Copie a **Publishable Key** (começa com `pk_`)
   - Anote para usar no frontend

---

## PARTE 2: Frontend no Vercel

### Passo 1: Criar Conta no Vercel (se necessário)

1. Acesse: https://vercel.com
2. Faça login com GitHub

### Passo 2: Importar Projeto

1. Clique em **"Add New"** → **"Project"**
2. Importe o repositório `xodozin`
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`
   - **Install Command:** `yarn install`

### Passo 3: Configurar Variáveis de Ambiente

No Vercel, vá em **"Settings"** → **"Environment Variables"** e adicione:

```env
REACT_APP_MEDUSA_BACKEND_URL=https://seu-app.railway.app
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_...  # Obter do Admin Panel (Passo 8 da Parte 1)
```

**⚠️ IMPORTANTE:**
- Substitua `seu-app.railway.app` pela URL real do Railway
- Use a Publishable Key copiada do Admin Panel

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Vercel fará deploy automaticamente
3. Aguarde build completar (~3 minutos)
4. Anote a URL gerada (ex: `xodozin.vercel.app`)

---

## PARTE 3: Integração Final

### Passo 1: Atualizar CORS no Backend

Volte no Railway e atualize as variáveis de ambiente:

1. No serviço do Medusa, vá em **"Variables"**
2. Atualize:
   ```env
   STORE_CORS=https://seu-app.vercel.app
   ADMIN_CORS=https://seu-app.vercel.app
   AUTH_CORS=https://seu-app.vercel.app
   ```
3. Substitua `seu-app.vercel.app` pela URL real do Vercel
4. Railway fará redeploy automaticamente

### Passo 2: Validar Integração

1. **Backend:**
   - [ ] Health check: `https://seu-app.railway.app/health` retorna `{ status: "ok" }`
   - [ ] Admin Panel: `https://seu-app.railway.app/app` carrega e login funciona

2. **Frontend:**
   - [ ] Frontend carrega: `https://seu-app.vercel.app`
   - [ ] Sem erros no console do navegador
   - [ ] Frontend conecta ao backend (verificar Network tab)

3. **Integração:**
   - [ ] CORS configurado corretamente
   - [ ] Frontend pode fazer requisições ao backend
   - [ ] Produtos podem ser listados (se houver)

---

## 🆘 Troubleshooting

### Backend não inicia

1. Verificar logs no Railway: **"Deployments"** → **"View Logs"**
2. Verificar se `DATABASE_URL` está configurado
3. Verificar se `JWT_SECRET` e `COOKIE_SECRET` estão definidos
4. Verificar se Root Directory está como `xodozin`

### Migrations não executam

```bash
railway run cd xodozin && yarn medusa migrations run
```

### Admin Panel não carrega

1. Verificar CORS está configurado
2. Verificar se usuário foi criado
3. Verificar logs para erros

### Frontend não conecta ao backend

1. Verificar `REACT_APP_MEDUSA_BACKEND_URL` está correto
2. Verificar `REACT_APP_MEDUSA_PUBLISHABLE_KEY` está configurado
3. Verificar CORS no backend permite o domínio do frontend
4. Verificar console do navegador para erros

---

## ✅ Checklist Final

### Backend (Railway)
- [ ] Projeto criado no Railway
- [ ] Root Directory configurado como `xodozin`
- [ ] PostgreSQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Setup pós-deploy executado
- [ ] Health check funcionando
- [ ] Admin Panel acessível
- [ ] Login funciona
- [ ] Publishable Key obtida

### Frontend (Vercel)
- [ ] Projeto criado no Vercel
- [ ] Root Directory configurado como `frontend`
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Frontend carrega sem erros

### Integração
- [ ] CORS atualizado no backend
- [ ] Frontend conecta ao backend
- [ ] Fluxo completo testado

---

## 🎉 Pronto!

Agora você tem:
- **Backend:** `https://seu-app.railway.app`
- **Admin Panel:** `https://seu-app.railway.app/app`
- **Frontend:** `https://seu-app.vercel.app`

Tudo funcionando e integrado! 🚀

