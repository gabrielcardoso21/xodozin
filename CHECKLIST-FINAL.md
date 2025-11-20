# ✅ Checklist Final - O Que Falta Para Aplicação Funcionar

## 🔴 STATUS ATUAL

### Backend (Railway)
- ❌ **NÃO FUNCIONANDO** - Erro 502 (Application failed to respond)
- ✅ Build otimizado e deployado
- ✅ PostgreSQL adicionado
- ❌ Migrations não executadas (tabelas não existem)
- ❌ Setup não executado (Brasil, usuários, publishable key)

### Frontend (Vercel)
- ❌ **NÃO DEPLOYADO**
- ❌ Variáveis de ambiente não configuradas

---

## 🎯 O QUE FALTA FAZER

### 📦 BACKEND (Railway) - PRIORIDADE ALTA

#### 1. ✅ Verificar Build Completo
- [x] Build otimizado (já feito)
- [ ] Aguardar build atual terminar
- [ ] Verificar se aplicação inicia sem erros

#### 2. 🔴 CRÍTICO: Executar Migrations
**Problema**: Tabelas não existem no banco (erro "relation does not exist")

**Solução**: O comando `medusa db:migrate` já está no `start`, mas precisa verificar se está funcionando.

**Verificar**:
```bash
railway logs --service xodozin --tail 100 | grep -E "(migration|db:migrate|relation|table)"
```

**Se não executar automaticamente, executar manualmente**:
```bash
railway run yarn medusa db:migrate
```

#### 3. 🔴 CRÍTICO: Executar Setup Inicial
Após migrations, executar:

```bash
# 1. Configurar Brasil
railway run yarn medusa exec ./src/scripts/setup-brasil.ts

# 2. Criar usuários
railway run yarn medusa exec ./src/scripts/create-users-final.ts

# 3. Criar Publishable Key
railway run yarn medusa exec ./src/scripts/create-publishable-key.ts
```

#### 4. ✅ Verificar Variáveis de Ambiente
Confirmar que estão configuradas no Railway:
- [x] `DATABASE_URL` (automático do PostgreSQL)
- [ ] `JWT_SECRET` (gerar se não tiver)
- [ ] `COOKIE_SECRET` (gerar se não tiver)
- [ ] `NODE_ENV=production`
- [ ] `PORT=9000`
- [ ] `STORE_CORS` (ajustar depois com URL do frontend)
- [ ] `ADMIN_CORS` (ajustar depois com URL do frontend)
- [ ] `AUTH_CORS` (ajustar depois com URL do frontend)

**Gerar secrets**:
```bash
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # COOKIE_SECRET
```

#### 5. ✅ Verificar Health Check
Após tudo configurado:
```bash
curl https://xodozin-production.up.railway.app/health
```
Deve retornar: `{"status":"ok"}`

#### 6. ✅ Testar Admin Panel
- Acessar: `https://xodozin-production.up.railway.app/app`
- Login: `gabriel@xodozin.com.br` / `Gabriel123!`
- Copiar **Publishable API Key** (Settings → API Keys)

---

### 🎨 FRONTEND (Vercel) - PRIORIDADE ALTA

#### 1. 🔴 Deploy no Vercel
- [ ] Criar conta/login no Vercel
- [ ] Importar repositório `xodozin`
- [ ] Configurar:
  - **Framework Preset:** Create React App
  - **Root Directory:** `frontend`
  - **Build Command:** `yarn build`
  - **Output Directory:** `build`
  - **Install Command:** `yarn install`

#### 2. 🔴 Configurar Variáveis de Ambiente
No Vercel → Settings → Environment Variables:

```env
REACT_APP_MEDUSA_BACKEND_URL=https://xodozin-production.up.railway.app
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_...  # Obter do Admin Panel após setup
```

**⚠️ IMPORTANTE:**
- Substituir URL do Railway pela real
- Obter `PUBLISHABLE_KEY` do Admin Panel (após executar setup)

#### 3. ✅ Deploy e Obter URL
- [ ] Aguardar deploy completar
- [ ] Anotar URL do Vercel (ex: `xodozin.vercel.app`)

#### 4. ✅ Atualizar CORS no Backend
Voltar no Railway e atualizar variáveis:

```env
STORE_CORS=https://xodozin.vercel.app
ADMIN_CORS=https://xodozin.vercel.app
AUTH_CORS=https://xodozin.vercel.app
```

Railway fará redeploy automaticamente.

---

## 🚀 ORDEM DE EXECUÇÃO

### Fase 1: Backend Funcionando (AGORA)
1. ✅ Aguardar build atual terminar
2. 🔴 Verificar se migrations executaram automaticamente
3. 🔴 Se não, executar `railway run yarn medusa db:migrate`
4. 🔴 Executar setup (Brasil, usuários, publishable key)
5. ✅ Verificar health check
6. ✅ Testar Admin Panel
7. ✅ Copiar Publishable Key

### Fase 2: Frontend Funcionando (DEPOIS)
1. 🔴 Deploy no Vercel
2. 🔴 Configurar variáveis de ambiente
3. ✅ Obter URL do Vercel
4. ✅ Atualizar CORS no Railway
5. ✅ Testar frontend conectando ao backend

---

## 📋 COMANDOS RÁPIDOS

### Verificar Status Backend
```bash
railway logs --service xodozin --tail 50
curl https://xodozin-production.up.railway.app/health
```

### Executar Setup Completo
```bash
# Migrations (já deve executar automaticamente no start)
railway run yarn medusa db:migrate

# Setup Brasil
railway run yarn medusa exec ./src/scripts/setup-brasil.ts

# Criar usuários
railway run yarn medusa exec ./src/scripts/create-users-final.ts

# Criar Publishable Key
railway run yarn medusa exec ./src/scripts/create-publishable-key.ts
```

### Gerar Secrets
```bash
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # COOKIE_SECRET
```

---

## ✅ CHECKLIST FINAL

### Backend
- [ ] Build completo sem erros
- [ ] Migrations executadas (tabelas criadas)
- [ ] Setup Brasil executado
- [ ] Usuários criados
- [ ] Publishable Key criada
- [ ] Health check retorna OK
- [ ] Admin Panel acessível
- [ ] Login funciona

### Frontend
- [ ] Deploy no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build completo sem erros
- [ ] Site acessível
- [ ] Conecta ao backend
- [ ] CORS configurado

---

## 🎉 RESULTADO ESPERADO

Após completar tudo:
- ✅ **Backend**: `https://xodozin-production.up.railway.app`
- ✅ **Admin Panel**: `https://xodozin-production.up.railway.app/app`
- ✅ **Frontend**: `https://xodozin.vercel.app` (ou URL do Vercel)
- ✅ **Site funcionando**: Frontend conectado ao backend, produtos podem ser cadastrados

---

## 🆘 PROBLEMAS COMUNS

### Backend 502
- Verificar logs: `railway logs --service xodozin --tail 100`
- Verificar se migrations executaram
- Verificar se `DATABASE_URL` está configurado

### Migrations não executam
- Verificar se comando está no `start` (já está: `medusa db:migrate && medusa start`)
- Executar manualmente: `railway run yarn medusa db:migrate`

### Frontend não conecta
- Verificar `REACT_APP_MEDUSA_BACKEND_URL` está correto
- Verificar `REACT_APP_MEDUSA_PUBLISHABLE_KEY` está configurado
- Verificar CORS no backend

