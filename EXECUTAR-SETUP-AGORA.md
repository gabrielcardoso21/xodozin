# 🚀 Executar Setup Agora - Passo a Passo

## ✅ Você já tem Railway CLI instalado!

Execute estes comandos no seu terminal:

### Passo 1: Autenticar (1 vez)

```bash
railway login
```

Isso abrirá o navegador. Faça login e volte ao terminal.

### Passo 2: Linkar ao Projeto

```bash
railway link
```

Quando perguntar, selecione:
- Projeto: **kind-harmony**
- Serviço: **xodozin**

### Passo 3: Executar Setup Automático

```bash
bash scripts/setup-railway-local.sh
```

**OU execute manualmente:**

```bash
# 1. Migrations
railway run yarn medusa migrations run

# 2. Configurar Brasil
railway run yarn medusa exec ./src/scripts/setup-brasil.ts

# 3. Criar usuários
railway run yarn medusa exec ./src/scripts/create-users-final.ts

# 4. Criar publishable key
railway run yarn medusa exec ./src/scripts/create-publishable-key.ts
```

## ✅ Verificar se Funcionou

### 1. Ver Logs

```bash
railway logs --tail 50
```

Deve mostrar:
- ✅ "Server listening on port 9000"
- ✅ Sem erros de conexão

### 2. Health Check

Acesse no navegador:
```
https://seu-app.railway.app/health
```

Deve retornar: `{"status":"ok"}`

### 3. Admin Panel

Acesse:
```
https://seu-app.railway.app/app
```

Deve carregar a tela de login.

**Login:**
- Email: `gabriel@xodozin.com.br`
- Senha: `Gabriel123!`

## 🎯 Resumo Rápido

```bash
railway login
railway link
bash scripts/setup-railway-local.sh
```

Pronto! 🎉

