# ✅ Configurar Banco de Dados no Render

## 📋 Informações do Banco Criado

- **Host**: `dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com`
- **Database**: `medusa_0p60`
- **User**: `medusa`
- **Password**: `tOzJWZA6PRHPengOLrIGX55YMxNBWOL7`

## 🔗 Connection Strings

### Para uso no Render (variável DATABASE_URL):
```
postgresql://medusa:tOzJWZA6PRHPengOLrIGX55YMxNBWOL7@dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com/medusa_0p60
```

### Para conexão via psql:
```bash
PGPASSWORD=tOzJWZA6PRHPengOLrIGX55YMxNBWOL7 psql -h dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com -U medusa medusa_0p60
```

## ✅ Passos para Configurar

### 1. Conectar Banco ao Serviço (Importante!)

1. No dashboard do Render, vá no serviço **"medusa-backend"**
2. Clique em **"Environment"**
3. Clique em **"Link Resource"** (ou "Add Resource")
4. Selecione o banco de dados que você criou
5. A variável `DATABASE_URL` será criada automaticamente

### 2. Verificar Variável DATABASE_URL

1. No serviço **"medusa-backend"** → **"Environment"**
2. Verifique se `DATABASE_URL` está presente
3. Deve conter a connection string completa

### 3. Verificar Outras Variáveis

Certifique-se de que estas variáveis estão configuradas:

- ✅ `DATABASE_URL` (será criada automaticamente ao conectar o banco)
- ✅ `PORT=9000` (já configurada no código)
- ✅ `JWT_SECRET` (gerar valor aleatório)
- ✅ `COOKIE_SECRET` (gerar valor aleatório)
- ✅ `NODE_ENV=production`
- ✅ `NODE_OPTIONS=--max-old-space-size=2048`
- ✅ `STORE_CORS` (ajustar para o domínio do Render)
- ✅ `ADMIN_CORS` (ajustar para o domínio do Render)

### 4. Gerar Valores para JWT_SECRET e COOKIE_SECRET

Se ainda não tiver esses valores, gere com:

```bash
openssl rand -base64 32  # Para JWT_SECRET
openssl rand -base64 32  # Para COOKIE_SECRET
```

Ou use estes valores gerados anteriormente:
- `JWT_SECRET`: `BjDkFtmmnvHg0K27gMnhSA+X+4doi0M7GlOY9G+haqo=`
- `COOKIE_SECRET`: `/x8ADNgnuElv3GzN3djgLSnVlt9GKGFLaOT9t4Xx57o=`

### 5. Ajustar CORS

Após o primeiro deploy, você receberá um domínio do Render (ex: `medusa-backend-xxxx.onrender.com`). Ajuste:

- `STORE_CORS`: `https://medusa-backend-xxxx.onrender.com`
- `ADMIN_CORS`: `https://medusa-backend-xxxx.onrender.com`

### 6. Fazer Redeploy

1. No serviço **"medusa-backend"**, clique em **"Manual Deploy"**
2. Selecione **"Deploy latest commit"**
3. Aguarde o deploy completar

## 🔍 Verificar se Funcionou

Após o deploy, verifique os logs. Você deve ver:

✅ **Sucesso:**
```
Database connection established
Migrations completed
Listening on port 9000
```

❌ **Erro (se ainda houver):**
```
Pg connection failed to connect to the database
```

Se ainda houver erro de conexão:
1. Verifique se o banco está "linked" ao serviço
2. Verifique se a variável `DATABASE_URL` está correta
3. Verifique se o banco está rodando (status no dashboard)

## 📝 Nota sobre o Nome do Banco

O Render criou o banco com o nome `medusa_0p60` (não `medusa`). Isso está correto e a connection string já está usando o nome correto.

## 🚀 Próximos Passos

1. ✅ Banco criado
2. ⏳ Conectar banco ao serviço (Link Resource)
3. ⏳ Verificar variáveis de ambiente
4. ⏳ Fazer redeploy
5. ⏳ Verificar logs

