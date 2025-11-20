# ✅ Solução Final - Render.com

## 🎯 O Problema

O Medusa não consegue conectar ao banco de dados porque:
- ❌ `DATABASE_URL` não está configurada no serviço
- ❌ `PORT=9000` pode não estar configurada

## 🔧 Solução (5 minutos)

### Passo 1: Acessar o Dashboard

1. Acesse: https://dashboard.render.com
2. Faça login

### Passo 2: Ir no Serviço

1. Clique em **"Services"** (ou vá direto no serviço **"medusa-backend"**)
2. Clique no serviço **"medusa-backend"**

### Passo 3: Configurar Variáveis de Ambiente

1. Clique na aba **"Environment"** (ou **"Env"**)
2. Você verá uma lista de variáveis de ambiente

#### Adicionar DATABASE_URL

1. Clique em **"Add Environment Variable"** (ou **"+"**)
2. **Key**: `DATABASE_URL`
3. **Value**: Cole este valor:
   ```
   postgresql://medusa:tOzJWZA6PRHPengOLrIGX55YMxNBWOL7@dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com/medusa_0p60
   ```
4. Clique em **"Save"**

#### Adicionar PORT

1. Clique em **"Add Environment Variable"** novamente
2. **Key**: `PORT`
3. **Value**: `9000`
4. Clique em **"Save"**

#### Verificar/Adicionar Outras Variáveis

Verifique se estas variáveis existem. Se não existirem, adicione:

- **JWT_SECRET**: `BjDkFtmmnvHg0K27gMnhSA+X+4doi0M7GlOY9G+haqo=`
- **COOKIE_SECRET**: `/x8ADNgnuElv3GzN3djgLSnVlt9GKGFLaOT9t4Xx57o=`
- **NODE_ENV**: `production`
- **NODE_OPTIONS**: `--max-old-space-size=2048`

### Passo 4: Conectar Banco ao Serviço (Alternativa)

Se preferir usar o "Link Resource" (recomendado):

1. Na mesma página **"Environment"**
2. Procure por **"Link Resource"** ou **"Add Resource"**
3. Selecione o banco de dados PostgreSQL
4. Isso criará automaticamente a `DATABASE_URL`

**Nota**: Se usar "Link Resource", você não precisa adicionar `DATABASE_URL` manualmente!

### Passo 5: Fazer Redeploy

1. Volte para a página principal do serviço
2. Clique em **"Manual Deploy"**
3. Selecione **"Deploy latest commit"**
4. Aguarde o deploy completar (2-3 minutos)

## ✅ Verificar se Funcionou

Após o deploy, verifique os logs. Você deve ver:

```
✅ Database connection established
✅ Migrations completed
✅ Listening on port 9000
```

Se ainda houver erro:
- Verifique se `DATABASE_URL` está correta
- Verifique se o banco está rodando (status no dashboard)
- Verifique se `PORT=9000` está configurada

## 📋 Checklist Rápido

- [ ] Acessei o dashboard do Render
- [ ] Fui no serviço "medusa-backend"
- [ ] Cliquei em "Environment"
- [ ] Adicionei `DATABASE_URL` (ou usei "Link Resource")
- [ ] Adicionei `PORT=9000`
- [ ] Verifiquei outras variáveis (JWT_SECRET, etc.)
- [ ] Fiz redeploy
- [ ] Verifiquei os logs

## 🆘 Se Ainda Não Funcionar

1. **Verifique se o banco está rodando**
   - Vá em "Databases" no dashboard
   - Verifique o status do banco

2. **Teste a connection string**
   - Use o comando psql fornecido anteriormente
   - Se não conectar, o problema é no banco

3. **Verifique os logs completos**
   - No serviço, vá em "Logs"
   - Procure por mensagens de erro específicas

## 🎉 Próximos Passos Após Funcionar

1. Ajustar `STORE_CORS` e `ADMIN_CORS` para o domínio do Render
2. Configurar domínio customizado (opcional)
3. Configurar backups do banco de dados

