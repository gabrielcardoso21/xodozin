# 🔧 Comandos de Setup Manual

## ⚠️ Problema com Railway CLI

O Railway CLI não está autenticado corretamente com o token. Execute os comandos manualmente:

## 📋 Comandos para Executar

### 1. Verificar Conexão com Banco

```bash
railway variables | grep DATABASE_URL
```

### 2. Executar Migrations

```bash
railway run yarn medusa migrations run
```

### 3. Configurar Brasil

```bash
railway run yarn medusa exec ./src/scripts/setup-brasil.ts
```

### 4. Criar Usuários

```bash
railway run yarn medusa exec ./src/scripts/create-users-final.ts
```

### 5. Criar Publishable Key

```bash
railway run yarn medusa exec ./src/scripts/create-publishable-key.ts
```

## 🔍 Verificar Logs

```bash
railway logs --tail 50
```

Deve mostrar:
- ✅ "Server listening on port 9000"
- ✅ Sem erros de conexão com banco
- ✅ Migrations executadas

## 🌐 Acessar Admin Panel

Após setup completo:
1. Acesse: `https://seu-app.railway.app/app`
2. Login com:
   - Email: `gabriel@xodozin.com.br`
   - Senha: `Gabriel123!`
3. Vá em Settings → API Keys
4. Copie a Publishable Key (começa com `pk_`)

