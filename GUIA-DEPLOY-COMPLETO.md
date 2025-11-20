# 🚀 Guia Completo de Deploy - Xodózin

## 🎯 Objetivo

Fazer deploy do backend (Medusa) e frontend para que sua amiga possa cadastrar produtos e kits via Admin Panel.

## 📋 Pré-Requisitos

- [x] Código commitado no Git (GitHub/GitLab)
- [ ] Conta no Railway (gratuito)
- [ ] Conta no Vercel/Netlify para frontend (gratuito)

---

## 🎯 Opção 1: Railway (Recomendado - Mais Fácil) ⭐

### Passo 1: Criar Conta no Railway

1. Acesse: https://railway.app
2. Clique em "Login" → "Start a New Project"
3. Faça login com GitHub

### Passo 2: Criar Projeto

1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório `xodozin`
4. Railway detectará automaticamente o projeto

### Passo 3: Adicionar PostgreSQL

1. No projeto, clique em "+ New"
2. Selecione "Database" → "Add PostgreSQL"
3. Railway criará automaticamente o banco

### Passo 4: Configurar Variáveis de Ambiente

No serviço do Medusa, vá em "Variables" e adicione:

```env
# Database (Railway preenche automaticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (opcional - pode deixar vazio para usar fake redis)
REDIS_URL=

# Secrets (GERE VALORES SEGUROS!)
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_123456789
COOKIE_SECRET=seu_cookie_secret_super_seguro_aqui_123456789

# Environment
NODE_ENV=production
PORT=9000

# CORS (ajuste com seu domínio depois)
STORE_CORS=https://xodozin.vercel.app
ADMIN_CORS=https://xodozin.vercel.app
AUTH_CORS=https://xodozin.vercel.app

# Opcional: Resend (para emails)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=vendas@xodozin.com.br

# Opcional: Focus NFe (para notas fiscais)
FOCUS_NFE_TOKEN=seu_token_aqui
FOCUS_NFE_ENVIRONMENT=sandbox
COMPANY_CNPJ=12345678000190
COMPANY_NAME=Xodózin
COMPANY_ADDRESS=Rua Exemplo, 123 - São Paulo - SP
```

**⚠️ IMPORTANTE:** Gere secrets seguros:
```bash
# No terminal, gere secrets:
openssl rand -base64 32  # Para JWT_SECRET
openssl rand -base64 32  # Para COOKIE_SECRET
```

### Passo 5: Configurar Build

Railway deve detectar automaticamente, mas verifique:

- **Root Directory:** `xodozin` (se o projeto está na raiz, deixe vazio)
- **Build Command:** `yarn install && yarn build`
- **Start Command:** `yarn start`

### Passo 6: Deploy

1. Railway fará deploy automaticamente
2. Aguarde o build completar
3. Anote a URL gerada (ex: `xodozin-production.up.railway.app`)

### Passo 7: Pós-Deploy (IMPORTANTE!)

Após o deploy, você precisa executar scripts de setup. Use o Railway CLI ou um terminal one-off:

#### Opção A: Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Executar migrations
railway run yarn medusa migrations run

# Configurar Brasil
railway run yarn medusa exec ./src/scripts/setup-brasil.ts

# Criar usuário admin
railway run yarn medusa exec ./src/scripts/create-users-final.ts
```

#### Opção B: Terminal One-Off no Railway Dashboard

1. No Railway, vá em seu serviço
2. Clique em "Deployments" → "View Logs"
3. Use o terminal integrado ou crie um "One-Off" service

#### Opção C: Script via API (mais fácil)

Crie um endpoint temporário para executar setup (remova depois!):

```typescript
// src/api/admin/setup/route.ts (TEMPORÁRIO - REMOVER DEPOIS!)
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Executar setup
  // ...
}
```

### Passo 8: Verificar Deploy

1. Acesse: `https://seu-app.railway.app/health`
2. Deve retornar: `{ status: "ok" }`
3. Acesse Admin Panel: `https://seu-app.railway.app/app`
4. Faça login com usuário criado

---

## 🎨 Deploy do Frontend (Vercel - Gratuito)

### Passo 1: Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub

### Passo 2: Importar Projeto

1. Clique em "Add New" → "Project"
2. Importe o repositório `xodozin`
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`

### Passo 3: Configurar Variáveis de Ambiente

No Vercel, vá em "Settings" → "Environment Variables" e adicione:

```env
REACT_APP_MEDUSA_BACKEND_URL=https://seu-app.railway.app
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_...  # Obter do Admin Panel após deploy
```

### Passo 4: Deploy

1. Vercel fará deploy automaticamente
2. Anote a URL (ex: `xodozin.vercel.app`)

### Passo 5: Atualizar CORS no Backend

Volte no Railway e atualize as variáveis:

```env
STORE_CORS=https://xodozin.vercel.app
ADMIN_CORS=https://xodozin.vercel.app
AUTH_CORS=https://xodozin.vercel.app
```

Railway fará redeploy automaticamente.

---

## 🔧 Script de Setup Automático (Pós-Deploy)

Crie este script para facilitar o setup após deploy:

```bash
#!/bin/bash
# setup-production.sh

echo "🚀 Configurando produção..."

# Executar migrations
echo "📦 Executando migrations..."
yarn medusa migrations run

# Configurar Brasil
echo "🇧🇷 Configurando região Brasil..."
yarn medusa exec ./src/scripts/setup-brasil.ts

# Criar usuários
echo "👤 Criando usuários..."
yarn medusa exec ./src/scripts/create-users-final.ts

# Criar publishable key
echo "🔑 Criando publishable key..."
yarn medusa exec ./src/scripts/create-publishable-key.ts

echo "✅ Setup completo!"
```

---

## 📝 Checklist de Deploy

### Backend (Railway)
- [ ] Conta criada no Railway
- [ ] Projeto conectado ao GitHub
- [ ] PostgreSQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Migrations executadas
- [ ] Setup Brasil executado
- [ ] Usuários criados
- [ ] Health check funcionando
- [ ] Admin Panel acessível

### Frontend (Vercel)
- [ ] Conta criada no Vercel
- [ ] Projeto importado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] CORS atualizado no backend
- [ ] Frontend conectado ao backend

### Testes
- [ ] Login no Admin Panel funciona
- [ ] Cadastro de produto funciona
- [ ] Cadastro de kit funciona
- [ ] Frontend carrega produtos

---

## 🆘 Troubleshooting

### Backend não inicia

1. **Verificar logs no Railway:**
   - Vá em "Deployments" → "View Logs"
   - Procure por erros

2. **Verificar variáveis de ambiente:**
   - Certifique-se que `DATABASE_URL` está configurado
   - Verifique se `JWT_SECRET` e `COOKIE_SECRET` estão definidos

3. **Verificar build:**
   - Certifique-se que `yarn build` completa sem erros

### Migrations não executam

Execute manualmente:
```bash
railway run yarn medusa migrations run
```

### Admin Panel não carrega

1. Verificar CORS está configurado corretamente
2. Verificar se usuário foi criado
3. Verificar logs para erros

### Frontend não conecta ao backend

1. Verificar `REACT_APP_MEDUSA_BACKEND_URL` está correto
2. Verificar `REACT_APP_MEDUSA_PUBLISHABLE_KEY` está configurado
3. Verificar CORS no backend permite o domínio do frontend

---

## 🔗 URLs Importantes

Após deploy, você terá:

- **Backend API:** `https://seu-app.railway.app`
- **Admin Panel:** `https://seu-app.railway.app/app`
- **Store API:** `https://seu-app.railway.app/store`
- **Frontend:** `https://xodozin.vercel.app`

---

## 💰 Custos

- **Railway:** R$ 0,00 (plano gratuito generoso)
- **Vercel:** R$ 0,00 (plano gratuito)
- **Total:** R$ 0,00 ✅

---

## 📚 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Acessar Admin Panel
2. ✅ Criar produtos
3. ✅ Criar kits (collections)
4. ✅ Testar fluxo completo
5. ✅ Configurar domínio customizado (opcional)

---

## 🎉 Pronto!

Sua amiga já pode cadastrar produtos e kits via Admin Panel!

