# 🚀 Guia Completo: Migração para Render.com

Este guia te ajudará a migrar do Railway para o Render.com de forma automatizada.

## 📋 Pré-requisitos

- Conta no GitHub (com o repositório já configurado)
- Acesso ao repositório: `gabrielcardoso21/xodozin`

## 🎯 Opção 1: Blueprint (Mais Fácil - Recomendado)

O Render pode detectar automaticamente o arquivo `render.yaml` e criar todos os serviços.

### Passo 1: Criar Conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started for Free"**
3. Faça login com **GitHub** (recomendado para integração automática)

### Passo 2: Criar Blueprint

1. No dashboard do Render, clique em **"New +"** → **"Blueprint"**
2. Selecione **"Connect GitHub"**
3. Autorize o Render a acessar seus repositórios
4. Selecione o repositório: **`gabrielcardoso21/xodozin`**
5. Selecione a branch: **`main`**
6. Clique em **"Apply"**

O Render irá:
- ✅ Detectar automaticamente o `render.yaml` em `xodozin/render.yaml`
- ✅ Criar o serviço Web Service
- ✅ Criar o banco de dados PostgreSQL
- ✅ Criar o Redis (se configurado)
- ✅ Configurar todas as variáveis de ambiente
- ✅ Conectar os recursos automaticamente

### Passo 3: Ajustar Variáveis de Ambiente

Após o Blueprint criar tudo, você precisa ajustar algumas variáveis:

1. Vá no serviço **"medusa-backend"**
2. Clique em **"Environment"**
3. Ajuste as seguintes variáveis:

```
STORE_CORS=https://seu-app.onrender.com
ADMIN_CORS=https://seu-app.onrender.com
```

(Substitua `seu-app.onrender.com` pelo domínio real que o Render gerar)

4. Clique em **"Save Changes"**

### Passo 4: Fazer Deploy

1. No serviço **"medusa-backend"**, clique em **"Manual Deploy"**
2. Selecione **"Deploy latest commit"**
3. Aguarde o deploy completar

## 🎯 Opção 2: Configuração Manual (Mais Controle)

Se preferir configurar manualmente ou se o Blueprint não funcionar:

### Passo 1: Criar Banco de Dados PostgreSQL

1. No dashboard do Render, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `medusa-postgres`
   - **Database**: `medusa`
   - **User**: `medusa`
   - **Plan**: Free (se disponível) ou Starter
3. Clique em **"Create Database"**
4. **Anote a connection string** que será exibida

### Passo 2: Criar Redis (Opcional mas Recomendado)

1. No dashboard do Render, clique em **"New +"** → **"Redis"**
2. Configure:
   - **Name**: `medusa-redis`
   - **Plan**: Free (se disponível) ou Starter
3. Clique em **"Create Redis"**

### Passo 3: Criar Web Service

1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Selecione **"Connect GitHub"**
3. Autorize e selecione o repositório: **`gabrielcardoso21/xodozin`**
4. Configure o serviço:
   - **Name**: `medusa-backend`
   - **Environment**: `Node`
   - **Region**: Escolha a mais próxima (ex: `Oregon (US West)`)
   - **Branch**: `main`
   - **Root Directory**: `xodozin`
   - **Build Command**: `yarn install && yarn build:skip-if-exists`
   - **Start Command**: `bash scripts/ensure-admin-accessible.sh && bash scripts/verify-admin-before-start.sh && yarn start:skip-build`
   - **Plan**: Free (se disponível) ou Starter

### Passo 4: Configurar Variáveis de Ambiente

No serviço criado, vá em **"Environment"** e adicione:

#### Variáveis Obrigatórias:

```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=2048
```

#### Variáveis de Segurança (Gerar valores aleatórios):

Para gerar valores seguros, execute no terminal:

```bash
openssl rand -base64 32  # Para JWT_SECRET
openssl rand -base64 32  # Para COOKIE_SECRET
```

Adicione no Render:

```
JWT_SECRET=<valor_gerado_1>
COOKIE_SECRET=<valor_gerado_2>
```

#### Variáveis de CORS (Ajustar após deploy):

```
STORE_CORS=https://medusa-backend-xxxx.onrender.com
ADMIN_CORS=https://medusa-backend-xxxx.onrender.com
```

(Substitua `xxxx` pelo ID real do seu serviço)

### Passo 5: Conectar Banco de Dados

1. No serviço **"medusa-backend"**, vá em **"Environment"**
2. Clique em **"Link Resource"**
3. Selecione **"medusa-postgres"**
4. A variável `DATABASE_URL` será criada automaticamente

### Passo 6: Conectar Redis

1. No serviço **"medusa-backend"**, vá em **"Environment"**
2. Clique em **"Link Resource"**
3. Selecione **"medusa-redis"**
4. A variável `REDIS_URL` será criada automaticamente

### Passo 7: Fazer Deploy

1. No serviço **"medusa-backend"**, clique em **"Manual Deploy"**
2. Selecione **"Deploy latest commit"**
3. Aguarde o deploy completar (pode levar 5-10 minutos)

## 🔍 Verificar Deploy

Após o deploy:

1. Vá em **"Logs"** no serviço
2. Verifique se não há erros
3. Procure por mensagens como:
   - ✅ `Admin build encontrado`
   - ✅ `Server started`
   - ✅ `Listening on port`

## 🐛 Troubleshooting

### Erro: "Could not find index.html"

Se ainda aparecer este erro:
1. Verifique os logs do build
2. Confirme que o admin está commitado no Git
3. Verifique se o `build:skip-if-exists` está funcionando

### Erro: "Out of Memory"

O Render Free tier tem limites de memória. Se ocorrer:
1. Aumente o plano para Starter ($7/mês)
2. OU otimize o build (já estamos fazendo isso com `build:skip-if-exists`)

### Erro: "Database connection failed"

1. Verifique se o PostgreSQL está rodando
2. Confirme que `DATABASE_URL` está configurada corretamente
3. Verifique se os recursos estão "linked"

## 📊 Comparação: Railway vs Render

| Recurso | Railway | Render |
|---------|---------|--------|
| Plano Gratuito | $5 crédito/mês | 750 horas/mês |
| PostgreSQL | ✅ | ✅ |
| Redis | ✅ | ✅ |
| Auto-Deploy | ✅ | ✅ |
| SSL | ✅ | ✅ |
| Logs | ✅ | ✅ |
| CLI | ✅ | ❌ |

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Teste o admin panel: `https://seu-app.onrender.com/app`
2. ✅ Configure domínio customizado (opcional)
3. ✅ Configure backups do banco de dados
4. ✅ Monitore os logs regularmente

## 📞 Suporte

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- Render Community: https://community.render.com

