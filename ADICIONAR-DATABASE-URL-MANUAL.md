# 🔧 Adicionar DATABASE_URL Manualmente

## 📋 Método: Adicionar Variável com Referência

### No Railway Dashboard:

1. **Acesse:** https://railway.app
2. **Projeto "kind-harmony"**
3. **Clique no serviço "xodozin"**
4. **Vá em "Variables"** (ou "Environment Variables")
5. **Clique em "+ New Variable"** ou **"+ Add Variable"**
6. **Nome da variável:** `DATABASE_URL`
7. **Valor:** 
   - Procure por um botão **"Reference"** ou **"Select from Service"** ou **"Link Variable"**
   - OU digite manualmente: `${{Postgres.DATABASE_URL}}`
   - OU digite: `${{Postgres.POSTGRES_URL}}`
   - OU digite: `${{Postgres.PGDATABASE_URL}}`

### Se Não Tiver Opção de Referência:

1. **Vá no serviço PostgreSQL** (o banco de dados)
2. **Vá em "Variables"**
3. **Copie o valor de `DATABASE_URL`** ou `POSTGRES_URL`
4. **Volte no serviço "xodozin"**
5. **Adicione nova variável:**
   - Nome: `DATABASE_URL`
   - Valor: Cole o valor copiado

## 🔍 Onde Está a Connection String do PostgreSQL?

No Railway Dashboard:
1. **Serviço PostgreSQL**
2. **"Variables"** ou **"Settings"**
3. Procure por:
   - `DATABASE_URL`
   - `POSTGRES_URL`
   - `PGDATABASE_URL`
   - `POSTGRES_CONNECTION_STRING`

## ✅ Formato Esperado

A connection string deve ser algo como:
```
postgresql://postgres:senha@host:5432/railway
```

Ou:
```
postgres://postgres:senha@host:5432/railway
```

## 🎯 Depois de Adicionar

1. O Railway fará redeploy automaticamente
2. A aplicação deve conectar ao banco
3. Os erros `KnexTimeoutError` devem desaparecer

## 📝 Verificar

Após adicionar, execute:
```bash
railway variables --service xodozin | grep DATABASE_URL
```

Deve mostrar a connection string.

