# 🆓 Render.com Sem Cartão de Crédito

O Render está pedindo informações de pagamento porque o `render.yaml` original incluía Redis, que pode não estar disponível no plano gratuito.

## ✅ Solução: Versão Atualizada do render.yaml

Atualizei o `render.yaml` para:
- ✅ Especificar `plan: free` explicitamente
- ✅ Remover Redis (opcional - Medusa funciona sem ele)
- ✅ Usar apenas PostgreSQL (disponível no plano gratuito)

## 🎯 Opção 1: Criar Manualmente (Recomendado - Sem Cartão)

Em vez de usar o Blueprint, crie os serviços manualmente:

### Passo 1: Criar Web Service

1. No Render, clique em **"New +"** → **"Web Service"**
2. Conecte GitHub → Selecione repositório
3. Configure:
   - **Name**: `medusa-backend`
   - **Environment**: `Node`
   - **Region**: Escolha a mais próxima
   - **Branch**: `main`
   - **Root Directory**: `xodozin`
   - **Build Command**: `yarn install && yarn build:skip-if-exists`
   - **Start Command**: `bash scripts/ensure-admin-accessible.sh && bash scripts/verify-admin-before-start.sh && yarn start:skip-build`
   - **Plan**: Selecione **"Free"** explicitamente

### Passo 2: Criar PostgreSQL (Gratuito)

1. Clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `medusa-postgres`
   - **Database**: `medusa`
   - **User**: `medusa`
   - **Plan**: Selecione **"Free"** (se disponível)
   - ⚠️ Se não houver opção "Free", o PostgreSQL pode não estar disponível no plano gratuito

### Passo 3: Conectar Banco de Dados

1. No serviço `medusa-backend`, vá em **"Environment"**
2. Clique em **"Link Resource"**
3. Selecione `medusa-postgres`
4. A variável `DATABASE_URL` será criada automaticamente

### Passo 4: Adicionar Variáveis de Ambiente

No serviço `medusa-backend` → **"Environment"**, adicione:

```
JWT_SECRET=<gerar_valor>
COOKIE_SECRET=<gerar_valor>
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=2048
STORE_CORS=https://medusa-backend-xxxx.onrender.com
ADMIN_CORS=https://medusa-backend-xxxx.onrender.com
```

Para gerar valores seguros:
```bash
openssl rand -base64 32  # Para JWT_SECRET
openssl rand -base64 32  # Para COOKIE_SECRET
```

### Passo 5: Fazer Deploy

1. Clique em **"Manual Deploy"** → **"Deploy latest commit"**
2. Aguarde o deploy

## 🎯 Opção 2: Usar SQLite (100% Gratuito)

Se o PostgreSQL também exigir cartão, você pode usar SQLite (já configurado no Medusa):

1. Crie apenas o **Web Service** (sem banco de dados)
2. O Medusa usará SQLite automaticamente
3. ⚠️ SQLite não é recomendado para produção, mas funciona para testes

## 🔍 Por que está pedindo cartão?

O Render pode pedir cartão de crédito para:
- Recursos que não estão no plano gratuito
- Verificação de identidade (alguns planos gratuitos exigem)
- Recursos adicionais como Redis

## ✅ Alternativas Completamente Gratuitas

Se o Render continuar pedindo cartão:

1. **Fly.io** - Plano gratuito generoso, sem cartão
2. **Railway** - Já estávamos usando (mas tinha problemas)
3. **Heroku** - Não tem mais plano gratuito
4. **Vercel** - Apenas para frontend/edge functions

## 📝 Nota sobre Redis

O Medusa **funciona sem Redis** no modo desenvolvimento/teste. Ele usa:
- In-memory event bus (local)
- In-memory locking (local)

Para produção, Redis é recomendado, mas não obrigatório para começar.

## 🚀 Próximos Passos

1. Tente criar manualmente (Opção 1)
2. Se ainda pedir cartão, use SQLite temporariamente
3. Ou considere Fly.io como alternativa

