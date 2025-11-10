# 🚀 Deploy Gratuito do Medusa.js - Guia Rápido

## Stack Gratuita Completa

```
Frontend (React)     →  Vercel (GRÁTIS)
Backend (Medusa.js)  →  Render (GRÁTIS)
Database (PostgreSQL) →  Supabase (GRÁTIS)
Redis (Cache)        →  Upstash (GRÁTIS)
```

**Custo: R$ 0,00** 🎉

---

## Passo 1: Configurar PostgreSQL (Supabase) - 5 minutos

1. Acesse: https://supabase.com
2. Crie conta gratuita
3. Clique em "New Project"
4. Preencha:
   - **Name:** `xodozin-db`
   - **Database Password:** (anote essa senha!)
   - **Region:** Escolha mais próxima (South America)
5. Aguarde criação do projeto (~2 minutos)
6. Vá em **Settings** > **Database**
7. Copie a **Connection string** (URI)
   - Formato: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`
   - Substitua `[PASSWORD]` pela senha que você criou
8. **Anote essa URL completa** - você vai precisar!

---

## Passo 2: Configurar Redis (Upstash) - 3 minutos

1. Acesse: https://upstash.com
2. Crie conta gratuita (pode usar GitHub)
3. Clique em "Create Database"
4. Preencha:
   - **Name:** `xodozin-redis`
   - **Type:** Regional (escolha região mais próxima)
   - **Plan:** Free
5. Clique em "Create"
6. Copie a **Redis URL**
   - Formato: `redis://default:password@host:port`
7. **Anote essa URL** - você vai precisar!

---

## Passo 3: Deploy Backend Medusa (Render) - 10 minutos

1. Acesse: https://render.com
2. Faça login com GitHub
3. Clique em **"New"** > **"Web Service"**
4. Conecte seu repositório GitHub
5. Selecione o repositório `xodozin`
6. Configure o serviço:

   **Basic Settings:**
   - **Name:** `xodozin-medusa-backend`
   - **Environment:** `Node`
   - **Region:** Escolha mais próxima
   - **Branch:** `main`

   **Build & Deploy:**
   - **Root Directory:** `medusa-backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

7. Clique em **"Advanced"** e adicione variáveis de ambiente:

   ```
   DATABASE_URL=postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres
   REDIS_URL=redis://default:senha@xxx.upstash.io:6379
   JWT_SECRET=seu-jwt-secret-aleatorio-aqui
   COOKIE_SECRET=seu-cookie-secret-aleatorio-aqui
   NODE_ENV=production
   CORS=https://seu-app.vercel.app
   ```

   **Importante:**
   - Substitua `DATABASE_URL` pela URL do Supabase (Passo 1)
   - Substitua `REDIS_URL` pela URL do Upstash (Passo 2)
   - Gere secrets aleatórios para `JWT_SECRET` e `COOKIE_SECRET`
   - Deixe `CORS` vazio por enquanto (vamos atualizar depois)

8. Clique em **"Create Web Service"**
9. Aguarde o deploy (~5-10 minutos)
10. **Anote a URL do backend** (ex: `https://xodozin-medusa-backend.onrender.com`)

---

## Passo 4: Executar Migrações do Banco

1. No Render, vá para o dashboard do seu serviço
2. Clique em **"Shell"** (no menu lateral)
3. Execute:
   ```bash
   cd medusa-backend
   npx medusa migrations run
   ```
4. Aguarde as migrações terminarem

---

## Passo 5: Deploy Frontend (Vercel) - 5 minutos

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New..."** > **"Project"**
4. Importe repositório `xodozin`
5. Configure:

   **Project Settings:**
   - **Framework Preset:** Other
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build` (ou `npm run build`)
   - **Output Directory:** `build`
   - **Install Command:** `yarn install` (ou `npm install`)

6. Clique em **"Environment Variables"**
7. Adicione:
   ```
   REACT_APP_MEDUSA_BACKEND_URL=https://xodozin-medusa-backend.onrender.com
   ```
   (Substitua pela URL do seu backend do Render)

8. Clique em **"Deploy"**
9. Aguarde o deploy (~3-5 minutos)
10. **Anote a URL do frontend** (ex: `https://xodozin.vercel.app`)

---

## Passo 6: Atualizar CORS no Backend

1. Volte ao Render
2. Vá em **"Environment"** > **"Environment Variables"**
3. Atualize `CORS` com a URL do Vercel:
   ```
   CORS=https://xodozin.vercel.app
   ```
4. Salve (Render vai reiniciar automaticamente)

---

## Passo 7: Migrar Dados (Opcional)

Se você já tem produtos no MongoDB, migre para Medusa:

1. No Render, vá para **"Shell"**
2. Execute o script de migração:
   ```bash
   cd medusa-backend
   node scripts/migrate-data.js
   ```

**Nota:** Você precisa configurar `MONGO_URL` e `DB_NAME` nas variáveis de ambiente do Render antes de executar.

---

## ✅ Testar

1. Acesse a URL do frontend no Vercel
2. Teste:
   - ✅ Home carrega
   - ✅ Lista de kits (collections)
   - ✅ Quiz funciona
   - ✅ Seleção de produtos
   - ✅ Checkout funciona

---

## 🆘 Troubleshooting

### Backend não inicia

**Erro:** "Cannot connect to database"
- Verifique `DATABASE_URL` no Render
- Teste a connection string do Supabase

**Erro:** "Redis connection failed"
- Verifique `REDIS_URL` no Render
- Redis é opcional, pode remover do `medusa-config.js` se não usar

### Frontend não encontra backend

**Erro:** CORS error
- Verifique `CORS` no Render (deve ser URL exata do Vercel)
- Verifique `REACT_APP_MEDUSA_BACKEND_URL` no Vercel

**Erro:** 404 Not Found
- Verifique se backend está rodando no Render
- Verifique URL no Vercel

### Backend hibernado

**Sintoma:** Primeira requisição demora ~30 segundos
- **Normal!** Render hiberna após 15 min de inatividade
- Aguarde ~30 segundos na primeira requisição
- Requisições seguintes são rápidas

---

## 📊 Custos

| Serviço | Plano | Custo |
|---------|-------|-------|
| Render | Free | R$ 0,00 |
| Supabase | Free | R$ 0,00 |
| Upstash | Free | R$ 0,00 |
| Vercel | Free | R$ 0,00 |
| **TOTAL** | | **R$ 0,00** |

---

## 🎉 Pronto!

Seu e-commerce Medusa.js está no ar de graça! 🚀

**URLs:**
- Frontend: `https://seu-app.vercel.app`
- Backend: `https://seu-backend.onrender.com`
- Admin: `https://seu-backend.onrender.com/app` (se configurado)

---

## 📚 Próximos Passos

1. Configurar domínio customizado (opcional)
2. Configurar pagamentos (Stripe, PIX)
3. Migrar dados existentes
4. Configurar envio/entrega
5. Monitorar uso dos planos gratuitos

