# 🚂 Voltar para Railway - Configuração Completa

## ✅ Arquivos Já Configurados

Os arquivos de configuração do Railway já estão prontos:

- ✅ `xodozin/railway.json` - Configuração do Railway
- ✅ `xodozin/nixpacks.toml` - Configuração do Nixpacks
- ✅ `xodozin/instrumentation.ts` - Corrigido (export default {})
- ✅ `xodozin/medusa-config.ts` - Porta convertida para número (parseInt)

## 🚨 AÇÃO NECESSÁRIA NO RAILWAY DASHBOARD

### 1. Configurar Root Directory (CRÍTICO!)

1. Acesse: https://railway.app
2. Vá no seu projeto → Serviço do Medusa
3. **Settings** (⚙️) → **Root Directory**
4. Configure como: **`xodozin`**
5. **Salve**

### 2. Verificar Build & Deploy Settings

1. **Settings** → **Build & Deploy**
2. Verifique:
   - **Build Command:** `yarn install && yarn build:skip-if-exists`
   - **Start Command:** `bash scripts/ensure-admin-accessible.sh && bash scripts/verify-admin-before-start.sh && yarn start:skip-build`
   - **Root Directory:** `xodozin`

### 3. Verificar Variáveis de Ambiente

No serviço → **Variables**, verifique se estão configuradas:

- ✅ `DATABASE_URL` (automático do PostgreSQL)
- ✅ `PORT=9000`
- ✅ `JWT_SECRET` (gerar se não tiver)
- ✅ `COOKIE_SECRET` (gerar se não tiver)
- ✅ `NODE_ENV=production`
- ✅ `NODE_OPTIONS=--max-old-space-size=2048`
- ✅ `STORE_CORS=*` (ou URL específica)
- ✅ `ADMIN_CORS=*` (ou URL específica)
- ✅ `AUTH_CORS=*` (ou URL específica)

### 4. Adicionar PostgreSQL (se não tiver)

1. No projeto Railway → **"+ New"**
2. **"Database"** → **"Add PostgreSQL"**
3. Railway criará automaticamente e injetará `DATABASE_URL`

### 5. Redeploy

1. **Deployments** → **"Redeploy"** ou **"Deploy Latest"**
2. Aguarde o build completar (~5 minutos)

## ✅ Correções Aplicadas

### 1. Instrumentation.ts
- ✅ Exporta `default {}` para evitar erro "Cannot find module"

### 2. Medusa Config
- ✅ Porta convertida para número: `parseInt(process.env.PORT || "9000", 10)`

### 3. Build Scripts
- ✅ `build:skip-if-exists` - Preserva admin build
- ✅ Scripts de verificação antes do start

## 🔍 Verificar Logs

Após redeploy, os logs devem mostrar:

```
✅ Node.js detected
✅ Installing dependencies...
✅ Building...
✅ Admin build encontrado
✅ Starting Medusa...
✅ Server listening on port 9000
```

**NÃO deve aparecer:**
```
❌ Python detected
❌ Cannot find module 'instrumentation'
❌ No open ports detected
```

## 📋 Checklist Rápido

- [ ] Root Directory configurado como `xodozin`
- [ ] Build Command: `yarn install && yarn build:skip-if-exists`
- [ ] Start Command: `bash scripts/ensure-admin-accessible.sh && bash scripts/verify-admin-before-start.sh && yarn start:skip-build`
- [ ] PostgreSQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Redeploy feito

## 🆘 Se Ainda Não Funcionar

1. Verifique os logs completos no Railway Dashboard
2. Confirme que Root Directory está como `xodozin`
3. Verifique se todas as variáveis estão configuradas
4. Tente deletar e recriar o serviço se necessário

