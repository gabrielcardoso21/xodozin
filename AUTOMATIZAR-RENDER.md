# 🤖 Automatizar Correção no Render

Criei scripts para diagnosticar e corrigir automaticamente os problemas no Render!

## ✅ O que foi instalado

- ✅ Render CLI instalado (`render` versão 0.3.2)
- ✅ Scripts de diagnóstico e correção criados

## 🚀 Como usar

### Opção 1: Autenticação Interativa (Recomendado)

```bash
bash scripts/setup-render-auth.sh
```

Escolha opção 1 - isso abrirá seu navegador para fazer login no Render.

### Opção 2: Usar Token de API

1. Obtenha o token:
   - Acesse: https://dashboard.render.com/account/api-keys
   - Clique em "Create API Key"
   - Copie o token

2. Execute:
```bash
bash scripts/setup-render-auth.sh
```

Escolha opção 2 e cole o token.

### Opção 3: Configurar Token Manualmente

```bash
export RENDER_API_KEY="seu_token_aqui"
```

## 🔧 Corrigir Problemas Automaticamente

Após autenticar, execute:

```bash
bash scripts/fix-render-auto.sh
```

Este script irá:
- ✅ Verificar se DATABASE_URL está configurada
- ✅ Adicionar DATABASE_URL se não existir
- ✅ Verificar e adicionar PORT=9000
- ✅ Verificar e adicionar JWT_SECRET, COOKIE_SECRET, etc.
- ✅ Listar serviços e identificar problemas

## 📋 Comandos Úteis do Render CLI

```bash
# Ver serviços
render services:list

# Ver variáveis de ambiente
render env:list <service-id>

# Adicionar variável
render env:set <service-id> KEY="value"

# Ver logs
render logs <service-id>

# Fazer deploy
render services:deploy <service-id>
```

## 🎯 Próximos Passos

1. **Autenticar no Render CLI**
   ```bash
   bash scripts/setup-render-auth.sh
   ```

2. **Corrigir problemas automaticamente**
   ```bash
   bash scripts/fix-render-auto.sh
   ```

3. **Fazer redeploy**
   - No dashboard do Render, ou
   - Via CLI: `render services:deploy <service-id>`

## 🔍 Diagnóstico

Para apenas diagnosticar (sem corrigir):

```bash
bash scripts/diagnose-render.sh
```

## ⚠️ Nota

O script `fix-render-auto.sh` tentará adicionar automaticamente:
- `DATABASE_URL` com a connection string do banco criado
- `PORT=9000`
- `JWT_SECRET` e `COOKIE_SECRET` (valores gerados anteriormente)
- `NODE_ENV=production`
- `NODE_OPTIONS=--max-old-space-size=2048`

Se alguma variável já existir, ela não será sobrescrita.

