# 🔧 Como Executar o Setup

## ❌ Problema: Shell não encontrado no Railway Dashboard

O Railway Dashboard não tem um shell/terminal visível em todas as versões. Aqui estão as alternativas:

## ✅ Opção 1: Railway CLI Local (Recomendado)

### Passo 1: Autenticar no Railway CLI

Execute no seu terminal local:

```bash
railway login
```

Isso abrirá o navegador para autenticação. Após autenticar, volte ao terminal.

### Passo 2: Linkar ao Projeto

```bash
railway link
```

Selecione o projeto "kind-harmony" quando solicitado.

### Passo 3: Executar Setup

```bash
bash scripts/setup-railway-local.sh
```

**OU execute os comandos manualmente:**

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

## ✅ Opção 2: Via Railway Dashboard (Se disponível)

### Onde encontrar o Shell/Terminal:

1. **Railway Dashboard** → Projeto "kind-harmony"
2. **Serviço "xodozin"**
3. Procure por:
   - **"Shell"** (aba ou botão)
   - **"Terminal"** (aba ou botão)
   - **"Console"** (aba ou botão)
   - **"Run Command"** (botão)
   - **"Execute"** (botão)

### Se não encontrar:

Algumas versões do Railway não têm shell. Use a **Opção 1** (CLI local).

## ✅ Opção 3: Verificar se Já Está Funcionando

Antes de executar o setup, verifique se a aplicação já está funcionando:

1. **Acesse:** `https://seu-app.railway.app/health`
   - Se retornar `{"status":"ok"}`, a aplicação está rodando!

2. **Acesse:** `https://seu-app.railway.app/app`
   - Se carregar a tela de login, pode tentar fazer login:
     - Email: `gabriel@xodozin.com.br`
     - Senha: `Gabriel123!`

3. **Se conseguir fazer login:**
   - O setup pode já ter sido executado automaticamente!
   - Vá em Settings → API Keys e copie a Publishable Key

## 🔍 Verificar Logs

Para ver os logs sem shell:

1. Railway Dashboard → Serviço "xodozin"
2. "Deployments" → Clique no deployment mais recente
3. "View Logs"

Deve mostrar:
- ✅ "Server listening on port 9000"
- ✅ Sem erros de conexão com banco

## 📝 Resumo Rápido

**Mais fácil:** Use Railway CLI local:
```bash
railway login
railway link
bash scripts/setup-railway-local.sh
```

