# 🚀 Render.com - Passo a Passo Rápido

## ⚠️ Problema Atual

Os logs mostram:
- ❌ `Pg connection failed to connect to the database`
- ❌ `No open ports detected`

Isso significa que o banco **não está conectado ao serviço**.

## ✅ Solução Rápida (5 minutos)

### Passo 1: Conectar Banco ao Serviço (CRÍTICO)

1. No dashboard do Render, vá em **"Services"** (ou clique no serviço **"medusa-backend"**)
2. Clique no serviço **"medusa-backend"**
3. Vá na aba **"Environment"**
4. Role até encontrar a seção **"Linked Resources"** ou **"Add Resource"**
5. Clique em **"Link Resource"** ou **"Add Resource"**
6. Selecione o banco de dados PostgreSQL que você criou
7. Clique em **"Link"** ou **"Save"**

**IMPORTANTE**: Após conectar, a variável `DATABASE_URL` será criada automaticamente!

### Passo 2: Verificar Variável DATABASE_URL

1. Ainda na aba **"Environment"** do serviço
2. Procure por `DATABASE_URL` na lista de variáveis
3. Deve aparecer algo como:
   ```
   postgresql://medusa:tOzJWZA6PRHPengOLrIGX55YMxNBWOL7@dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com/medusa_0p60
   ```
4. Se não aparecer, o banco não foi conectado corretamente

### Passo 3: Verificar Variável PORT

1. Na mesma aba **"Environment"**
2. Procure por `PORT`
3. Se não existir, adicione manualmente:
   - Clique em **"Add Environment Variable"**
   - Key: `PORT`
   - Value: `9000`
   - Clique em **"Save"**

### Passo 4: Verificar Outras Variáveis Essenciais

Certifique-se de que estas variáveis existem:

- ✅ `DATABASE_URL` (criada automaticamente ao conectar banco)
- ✅ `PORT=9000` (adicionar manualmente se não existir)
- ✅ `JWT_SECRET` (adicionar se não existir)
- ✅ `COOKIE_SECRET` (adicionar se não existir)
- ✅ `NODE_ENV=production`
- ✅ `NODE_OPTIONS=--max-old-space-size=2048`

### Passo 5: Fazer Redeploy

1. No serviço **"medusa-backend"**, clique em **"Manual Deploy"**
2. Selecione **"Deploy latest commit"**
3. Aguarde o deploy completar (pode levar 2-3 minutos)

## 🔍 Como Verificar se Funcionou

Após o redeploy, verifique os logs. Você deve ver:

✅ **Sucesso:**
```
Database connection established
Migrations completed
Listening on port 9000
```

❌ **Ainda com erro:**
```
Pg connection failed to connect to the database
```

## 📸 Onde Encontrar "Link Resource"

Se não encontrar a opção "Link Resource":

1. Vá no serviço **"medusa-backend"**
2. Clique em **"Settings"** (Configurações)
3. Role até **"Environment Variables"**
4. Procure por **"Link Resource"** ou **"Add Resource"**
5. OU vá em **"Environment"** e procure por um botão **"Link Resource"** ou **"Add"**

## 🆘 Se Ainda Não Funcionar

### Opção 1: Adicionar DATABASE_URL Manualmente

Se não conseguir conectar o banco automaticamente:

1. No serviço → **"Environment"**
2. Clique em **"Add Environment Variable"**
3. Key: `DATABASE_URL`
4. Value: `postgresql://medusa:tOzJWZA6PRHPengOLrIGX55YMxNBWOL7@dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com/medusa_0p60`
5. Clique em **"Save"**
6. Faça redeploy

### Opção 2: Usar SQLite Temporariamente

Para testar se o problema é só o banco:

1. Remova a variável `DATABASE_URL` (se existir)
2. O Medusa usará SQLite automaticamente
3. ⚠️ SQLite não é recomendado para produção

## 📋 Checklist Final

Antes de fazer redeploy, verifique:

- [ ] Banco de dados PostgreSQL criado ✅
- [ ] Banco conectado ao serviço via "Link Resource" ⏳
- [ ] Variável `DATABASE_URL` presente no ambiente ⏳
- [ ] Variável `PORT=9000` configurada ⏳
- [ ] Variáveis `JWT_SECRET` e `COOKIE_SECRET` configuradas ⏳
- [ ] Variável `NODE_ENV=production` configurada ⏳

## 🎯 Próximo Passo

**O passo mais importante é conectar o banco ao serviço usando "Link Resource"**. Sem isso, o Medusa não conseguirá conectar ao banco.

Após conectar e fazer redeploy, me avise e verificamos os logs juntos!

