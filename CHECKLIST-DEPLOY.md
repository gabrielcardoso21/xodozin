# ✅ Checklist Rápido - Deploy Xodozin

Use este checklist para acompanhar o progresso do deploy.

## Backend (Railway)

### Configuração Inicial
- [ ] Projeto criado no Railway
- [ ] Repositório conectado ao Railway
- [ ] Root Directory configurado como `xodozin`
- [ ] PostgreSQL adicionado ao projeto
- [ ] Secrets gerados (`JWT_SECRET` e `COOKIE_SECRET`)

### Variáveis de Ambiente
- [ ] `JWT_SECRET` configurado
- [ ] `COOKIE_SECRET` configurado
- [ ] `NODE_ENV=production` configurado
- [ ] `PORT=9000` configurado
- [ ] `STORE_CORS=*` configurado (atualizar depois)
- [ ] `ADMIN_CORS=*` configurado (atualizar depois)
- [ ] `AUTH_CORS=*` configurado (atualizar depois)
- [ ] `REDIS_URL=` configurado (pode ficar vazio)

### Deploy
- [ ] Deploy inicial executado
- [ ] Build completou com sucesso
- [ ] URL do Railway anotada: `________________________`

### Setup Pós-Deploy
- [ ] Migrations executadas
- [ ] Setup Brasil executado
- [ ] Usuários criados
- [ ] Publishable Key criada

### Verificação
- [ ] Health check funciona: `/health`
- [ ] Admin Panel acessível: `/app`
- [ ] Login funciona
- [ ] Publishable Key copiada: `pk_...`

---

## Frontend (Vercel)

### Configuração Inicial
- [ ] Projeto criado no Vercel
- [ ] Repositório conectado ao Vercel
- [ ] Root Directory configurado como `frontend`
- [ ] Build settings configurados:
  - [ ] Framework: Create React App
  - [ ] Build Command: `yarn build`
  - [ ] Output Directory: `build`

### Variáveis de Ambiente
- [ ] `REACT_APP_MEDUSA_BACKEND_URL` configurado
- [ ] `REACT_APP_MEDUSA_PUBLISHABLE_KEY` configurado

### Deploy
- [ ] Deploy executado
- [ ] Build completou com sucesso
- [ ] URL do Vercel anotada: `________________________`

---

## Integração Final

### CORS
- [ ] `STORE_CORS` atualizado com URL do Vercel
- [ ] `ADMIN_CORS` atualizado com URL do Vercel
- [ ] `AUTH_CORS` atualizado com URL do Vercel
- [ ] Railway fez redeploy automático

### Validação
- [ ] Backend health check OK
- [ ] Admin Panel funciona
- [ ] Frontend carrega sem erros
- [ ] Frontend conecta ao backend
- [ ] CORS funcionando corretamente
- [ ] Fluxo completo testado

---

## URLs Finais

- **Backend:** `https://________________________`
- **Admin Panel:** `https://________________________/app`
- **Frontend:** `https://________________________`

---

## Comandos Úteis

### Gerar Secrets
```bash
bash scripts/generate-secrets.sh
```

### Setup Railway (após deploy)
```bash
railway run bash scripts/railway-setup.sh
```

### Verificar Deploy
```bash
bash scripts/verify-deploy.sh https://seu-app.railway.app
```

