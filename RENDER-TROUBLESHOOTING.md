# 🔧 Troubleshooting Render.com

## ✅ Progresso Atual

- ✅ Build passou com sucesso
- ✅ `medusa-config.js` encontrado
- ✅ Admin build preservado
- ❌ **Problema 1**: Timeout ao conectar ao PostgreSQL
- ❌ **Problema 2**: Porta não detectada pelo Render

## 🔴 Problema 1: Timeout ao Conectar ao PostgreSQL

### Sintomas
```
Pg connection failed to connect to the database. Retrying...
KnexTimeoutError: Knex: Timeout acquiring a connection
```

### Causas Possíveis

1. **Banco de dados não foi criado no Render**
   - O `render.yaml` especifica um banco, mas ele precisa ser criado manualmente

2. **Banco não está "linked" ao serviço**
   - O banco precisa estar conectado ao Web Service

3. **Variável `DATABASE_URL` não configurada**
   - Mesmo com o banco criado, a variável pode não estar sendo passada

### Solução

#### Passo 1: Verificar se o Banco Foi Criado

1. No dashboard do Render, vá em **"Databases"**
2. Verifique se existe um banco chamado **"medusa-postgres"**
3. Se não existir:
   - Clique em **"New +"** → **"PostgreSQL"**
   - Name: `medusa-postgres`
   - Database: `medusa`
   - User: `medusa`
   - Plan: **Free** (se disponível) ou Starter

#### Passo 2: Conectar Banco ao Serviço

1. Vá no serviço **"medusa-backend"**
2. Clique em **"Environment"**
3. Clique em **"Link Resource"**
4. Selecione **"medusa-postgres"**
5. A variável `DATABASE_URL` será criada automaticamente

#### Passo 3: Verificar Variável DATABASE_URL

1. No serviço **"medusa-backend"** → **"Environment"**
2. Verifique se `DATABASE_URL` está presente
3. Deve ter um formato como: `postgresql://medusa:password@host:5432/medusa`

#### Passo 4: Alternativa - Usar SQLite Temporariamente

Se o PostgreSQL não estiver disponível no plano gratuito:

1. Remova a variável `DATABASE_URL` do ambiente
2. O Medusa usará SQLite automaticamente
3. ⚠️ SQLite não é recomendado para produção, mas funciona para testes

## 🔴 Problema 2: Porta Não Detectada

### Sintomas
```
No open ports detected, continuing to scan...
Port scan timeout reached, no open ports detected
```

### Causa

O Medusa precisa se conectar a uma porta específica. O Render detecta automaticamente a porta através da variável `PORT`.

### Solução

A variável `PORT` já foi adicionada ao `render.yaml`. Verifique:

1. No serviço **"medusa-backend"** → **"Environment"**
2. Verifique se `PORT=9000` está configurada
3. Se não estiver, adicione manualmente:
   - Key: `PORT`
   - Value: `9000`

### Verificação

Após configurar, o Medusa deve iniciar e você verá nos logs:
```
Listening on port 9000
```

## 📋 Checklist de Configuração

- [ ] Banco de dados PostgreSQL criado no Render
- [ ] Banco conectado ao serviço Web Service (Link Resource)
- [ ] Variável `DATABASE_URL` presente no ambiente
- [ ] Variável `PORT=9000` configurada
- [ ] Variáveis `JWT_SECRET` e `COOKIE_SECRET` configuradas
- [ ] Variável `NODE_ENV=production` configurada
- [ ] Variáveis `STORE_CORS` e `ADMIN_CORS` ajustadas para o domínio do Render

## 🚀 Próximos Passos

1. **Criar/Verificar Banco de Dados**
   - Siga o Passo 1 acima

2. **Conectar Banco ao Serviço**
   - Siga o Passo 2 acima

3. **Verificar Variáveis de Ambiente**
   - Siga o Passo 3 acima

4. **Fazer Redeploy**
   - No serviço, clique em **"Manual Deploy"** → **"Deploy latest commit"**

5. **Monitorar Logs**
   - Verifique se o Medusa consegue conectar ao banco
   - Verifique se a porta 9000 está sendo usada

## 📞 Se Ainda Não Funcionar

1. Verifique os logs completos no Render
2. Confirme que todas as variáveis de ambiente estão corretas
3. Verifique se o banco de dados está rodando (status no dashboard)
4. Considere usar SQLite temporariamente para testar se o problema é só o banco

