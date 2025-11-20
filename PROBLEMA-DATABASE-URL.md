# ⚠️ Problema: DATABASE_URL Não Está Configurado

## ❌ Situação

O PostgreSQL foi adicionado, mas o `DATABASE_URL` não está aparecendo nas variáveis de ambiente do serviço `xodozin`.

## 🔍 Verificação

Execute:
```bash
railway variables --service xodozin | grep DATABASE_URL
```

Se não aparecer, o PostgreSQL não está conectado ao serviço.

## ✅ Solução: Conectar PostgreSQL ao Serviço

### No Railway Dashboard:

1. Acesse: https://railway.app
2. Projeto "kind-harmony"
3. Clique no serviço **PostgreSQL** (não no xodozin)
4. Vá em **"Settings"** ou **"Variables"**
5. Procure por **"Connect to Service"** ou **"Add to Service"**
6. Selecione o serviço **"xodozin"**
7. O Railway injetará `DATABASE_URL` automaticamente

### OU:

1. Railway Dashboard → Projeto "kind-harmony"
2. Clique no serviço **"xodozin"**
3. Vá em **"Variables"**
4. Clique em **"+ New Variable"**
5. Nome: `DATABASE_URL`
6. Valor: Clique em **"Reference"** ou **"Connect"**
7. Selecione o serviço PostgreSQL
8. Selecione a variável `DATABASE_URL` do PostgreSQL

## 🔄 Após Conectar

O Railway fará redeploy automaticamente e a aplicação deve conectar ao banco.

## 📋 Verificar

Após conectar, execute:
```bash
railway variables --service xodozin | grep DATABASE_URL
```

Deve mostrar a connection string do PostgreSQL.

