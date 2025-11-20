# 🚀 Comandos Rápidos para Deploy

## ⚡ Deploy Backend (Railway)

### 1. Gerar Secrets (Execute no terminal)

```bash
# Gerar JWT_SECRET
openssl rand -base64 32

# Gerar COOKIE_SECRET  
openssl rand -base64 32
```

Copie os valores gerados para usar nas variáveis de ambiente.

### 2. Variáveis de Ambiente no Railway

```env
JWT_SECRET=<cole_o_valor_gerado>
COOKIE_SECRET=<cole_o_valor_gerado>
NODE_ENV=production
PORT=9000
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*
```

### 3. Setup Pós-Deploy (Railway CLI)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Executar setup completo
railway run bash xodozin/scripts/setup-production.sh
```

### 4. Ou Setup Manual (passo a passo)

```bash
# Migrations
railway run cd xodozin && yarn medusa migrations run

# Configurar Brasil
railway run cd xodozin && yarn medusa exec ./src/scripts/setup-brasil.ts

# Criar usuários
railway run cd xodozin && yarn medusa exec ./src/scripts/create-users-final.ts

# Criar publishable key
railway run cd xodozin && yarn medusa exec ./src/scripts/create-publishable-key.ts
```

---

## 🎨 Deploy Frontend (Vercel)

### Variáveis de Ambiente

```env
REACT_APP_MEDUSA_BACKEND_URL=https://seu-app.railway.app
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_...
```

**Obter Publishable Key:**
1. Acesse Admin Panel: `https://seu-app.railway.app/app`
2. Login
3. Settings → API Keys
4. Copie a chave que começa com `pk_`

---

## ✅ Verificação Rápida

```bash
# Health check
curl https://seu-app.railway.app/health

# Deve retornar: {"status":"ok"}
```

---

## 🔗 URLs Finais

- **Backend:** `https://seu-app.railway.app`
- **Admin Panel:** `https://seu-app.railway.app/app`
- **Frontend:** `https://seu-app.vercel.app`

---

## 👤 Credenciais de Login

Após executar `create-users-final.ts`:

- **Email:** `gabriel@xodozin.com.br`
- **Senha:** `Gabriel123!`

Ou

- **Email:** `anne@xodozin.com.br`  
- **Senha:** `Anne123!`

