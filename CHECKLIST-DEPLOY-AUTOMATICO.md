# ✅ Checklist - Deploy Automático Completo

## 🎯 Status Atual

- ✅ Build TypeScript passando
- ✅ Aplicação iniciando
- ❌ Conexão com banco de dados falhando (KnexTimeoutError)
- ⏳ Variáveis de ambiente precisam ser configuradas
- ⏳ Setup pós-deploy precisa ser executado

---

## 📋 O QUE FALTA PARA DEPLOY AUTOMÁTICO

### 1. ✅ Build e Deploy ✅
- [x] Build TypeScript passando
- [x] Comandos corrigidos (sem `cd xodozin`)
- [x] Root Directory configurado
- [x] Aplicação iniciando

### 2. ⚠️ Banco de Dados PostgreSQL (URGENTE)
- [ ] **Adicionar PostgreSQL no Railway**
  - No projeto Railway → "+ New" → "Database" → "Add PostgreSQL"
  - Railway criará automaticamente e injetará `DATABASE_URL`
  
- [ ] **Verificar conexão**
  - Após adicionar PostgreSQL, a aplicação deve conectar automaticamente
  - Verificar logs: não deve mais aparecer `KnexTimeoutError`

### 3. ⚠️ Variáveis de Ambiente (OBRIGATÓRIAS)
No Railway Dashboard → Serviço xodozin → "Variables":

**Obrigatórias:**
- [ ] `JWT_SECRET` - Gerar com: `openssl rand -base64 32`
- [ ] `COOKIE_SECRET` - Gerar com: `openssl rand -base64 32`
- [ ] `NODE_ENV=production`
- [ ] `PORT=9000`

**CORS (atualizar depois com URL do frontend):**
- [ ] `STORE_CORS=*` (temporário, depois colocar URL do frontend)
- [ ] `ADMIN_CORS=*` (temporário, depois colocar URL do frontend)
- [ ] `AUTH_CORS=*` (temporário, depois colocar URL do frontend)

**Opcionais (mas recomendadas):**
- [ ] `REDIS_URL=` (pode deixar vazio por enquanto)
- [ ] `RESEND_API_KEY` (para envio de emails)
- [ ] `RESEND_FROM_EMAIL` (email remetente)
- [ ] `FOCUS_NFE_TOKEN` (para emissão de NFe)
- [ ] `FOCUS_NFE_ENVIRONMENT=production` ou `sandbox`
- [ ] `COMPANY_CNPJ` (CNPJ da empresa)
- [ ] `COMPANY_NAME` (Nome da empresa)
- [ ] `COMPANY_ADDRESS` (Endereço completo)

**Nota:** `DATABASE_URL` será injetado automaticamente pelo Railway quando você adicionar PostgreSQL.

### 4. ⚠️ Setup Pós-Deploy (CRÍTICO)
Após o deploy e configuração das variáveis, executar:

```bash
# Via Railway CLI
railway run yarn medusa migrations run
railway run yarn medusa exec ./src/scripts/setup-brasil.ts
railway run yarn medusa exec ./src/scripts/create-users-final.ts
railway run yarn medusa exec ./src/scripts/create-publishable-key.ts
```

**OU usar o script automatizado:**
```bash
railway run bash scripts/setup-production.sh
```

### 5. ⏳ Frontend (Vercel)
- [ ] Criar projeto no Vercel
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente do frontend
- [ ] Deploy automático

---

## 🚀 PASSOS IMEDIATOS (FAZER AGORA)

### Passo 1: Adicionar PostgreSQL (5 minutos)
1. Railway Dashboard → Projeto → "+ New"
2. "Database" → "Add PostgreSQL"
3. Aguardar criação (Railway injeta `DATABASE_URL` automaticamente)

### Passo 2: Gerar Secrets (2 minutos)
```bash
# No terminal local
openssl rand -base64 32  # Copie para JWT_SECRET
openssl rand -base64 32  # Copie para COOKIE_SECRET
```

### Passo 3: Configurar Variáveis (5 minutos)
Railway Dashboard → Serviço xodozin → "Variables" → Adicionar:
- `JWT_SECRET` (valor gerado)
- `COOKIE_SECRET` (valor gerado)
- `NODE_ENV=production`
- `PORT=9000`
- `STORE_CORS=*`
- `ADMIN_CORS=*`
- `AUTH_CORS=*`

### Passo 4: Aguardar Redeploy Automático
Railway fará redeploy automaticamente após salvar variáveis.

### Passo 5: Executar Setup (5 minutos)
```bash
railway run yarn medusa migrations run
railway run yarn medusa exec ./src/scripts/setup-brasil.ts
railway run yarn medusa exec ./src/scripts/create-users-final.ts
```

---

## ✅ Verificação Final

Após completar os passos, verificar:

1. **Logs do Railway:**
   ```bash
   railway logs --tail 50
   ```
   Deve mostrar:
   - ✅ "Server listening on port 9000"
   - ✅ Sem erros de conexão com banco
   - ✅ Migrations executadas

2. **Health Check:**
   - Acessar: `https://seu-app.railway.app/health`
   - Deve retornar status 200

3. **Admin Panel:**
   - Acessar: `https://seu-app.railway.app/app`
   - Deve carregar a tela de login

---

## 📝 Próximos Passos (Depois)

1. Configurar domínio customizado (opcional)
2. Configurar variáveis de email (Resend)
3. Configurar variáveis de NFe (Focus NFe)
4. Fazer deploy do frontend no Vercel
5. Atualizar CORS com URL do frontend
6. Testar fluxo completo

---

## 🆘 Troubleshooting

**Erro: KnexTimeoutError**
- ✅ Adicionar PostgreSQL no Railway
- ✅ Verificar se `DATABASE_URL` está nas variáveis

**Erro: JWT_SECRET não configurado**
- ✅ Adicionar `JWT_SECRET` nas variáveis

**Erro: Migrations não executadas**
- ✅ Executar: `railway run yarn medusa migrations run`

**Build falhando**
- ✅ Verificar Root Directory = `xodozin`
- ✅ Verificar logs completos

