# ⚡ Comandos Rápidos - Deploy Xodozin

## 🔐 Gerar Secrets

```bash
bash scripts/generate-secrets.sh
```

## 🚂 Railway CLI

### Instalar Railway CLI
```bash
npm i -g @railway/cli
```

### Login e Link
```bash
railway login
railway link
```

### Setup Pós-Deploy (Completo)
```bash
railway run bash scripts/railway-setup.sh
```

### Setup Pós-Deploy (Individual)
```bash
# Migrations
railway run cd xodozin && yarn medusa migrations run

# Setup Brasil
railway run cd xodozin && yarn medusa exec ./src/scripts/setup-brasil.ts

# Criar usuários
railway run cd xodozin && yarn medusa exec ./src/scripts/create-users-final.ts

# Criar publishable key
railway run cd xodozin && yarn medusa exec ./src/scripts/create-publishable-key.ts
```

### Ver Logs
```bash
railway logs
```

## ✅ Verificar Deploy

```bash
bash scripts/verify-deploy.sh https://seu-app.railway.app
```

## 🔍 Verificações Manuais

### Health Check
```bash
curl https://seu-app.railway.app/health
```

### Admin Panel
```bash
curl -I https://seu-app.railway.app/app
```

## 📝 Variáveis de Ambiente

### Railway (Backend)
```env
JWT_SECRET=<gerar_com_openssl>
COOKIE_SECRET=<gerar_com_openssl>
NODE_ENV=production
PORT=9000
STORE_CORS=*
ADMIN_CORS=*
AUTH_CORS=*
REDIS_URL=
```

### Vercel (Frontend)
```env
REACT_APP_MEDUSA_BACKEND_URL=https://seu-app.railway.app
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_...
```

## 🔗 URLs Importantes

Após deploy, você terá:
- **Backend:** `https://seu-app.railway.app`
- **Admin Panel:** `https://seu-app.railway.app/app`
- **Store API:** `https://seu-app.railway.app/store`
- **Admin API:** `https://seu-app.railway.app/admin`
- **Frontend:** `https://seu-app.vercel.app`

## 👤 Credenciais de Login

- Email: `gabriel@xodozin.com.br`
- Senha: `Gabriel123!`

- Email: `anne@xodozin.com.br`
- Senha: `Anne123!`

