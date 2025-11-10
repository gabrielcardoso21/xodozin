# 💰 Hospedagem Gratuita para Medusa.js

## ✅ Sim, é possível hospedar de graça!

Existem várias opções gratuitas para hospedar Medusa.js. Aqui está um guia completo:

---

## 🏗️ Arquitetura Gratuita Recomendada

```
Frontend (React)     →  Vercel (GRÁTIS)
Backend (Medusa.js)  →  Render / Railway (GRÁTIS)
Database (PostgreSQL) →  Supabase / Neon (GRÁTIS)
Redis (Cache)        →  Upstash (GRÁTIS)
```

**Custo total: R$ 0,00** 🎉

---

## 📦 Opção 1: Render (Recomendado)

### Backend Medusa.js no Render

**Plano Gratuito:**
- ✅ 750 horas/mês (suficiente para 24/7)
- ✅ 512 MB RAM
- ✅ 0.1 CPU compartilhada
- ✅ SSL gratuito
- ✅ Deploy automático via GitHub
- ⚠️ Hiberna após 15 min de inatividade (acorda automaticamente)

**Limitações:**
- Primeira requisição após hibernar pode demorar ~30 segundos
- Recursos limitados (pode ser lento com muito tráfego)

**Como configurar:**

1. **Criar conta no Render:**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Criar Web Service:**
   - Clique em "New" > "Web Service"
   - Conecte repositório GitHub
   - Configure:
     ```
     Name: xodozin-medusa-backend
     Environment: Node
     Build Command: cd medusa-backend && npm install && npm run build
     Start Command: cd medusa-backend && npm start
     ```

3. **Variáveis de Ambiente:**
   ```
   DATABASE_URL=postgresql://... (do Supabase/Neon)
   REDIS_URL=redis://... (do Upstash)
   JWT_SECRET=seu-secret-aqui
   COOKIE_SECRET=seu-secret-aqui
   CORS=https://seu-app.vercel.app
   NODE_ENV=production
   ```

**Custo: R$ 0,00**

---

## 📦 Opção 2: Railway

### Backend Medusa.js no Railway

**Plano Gratuito:**
- ✅ $5 créditos/mês (suficiente para ~100 horas)
- ✅ 512 MB RAM
- ✅ Deploy automático via GitHub
- ✅ SSL gratuito
- ⚠️ Créditos limitados (pode acabar antes do fim do mês)

**Como configurar:**

1. **Criar conta:**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório

3. **Configurar:**
   - Railway detecta automaticamente Node.js
   - Configure variáveis de ambiente
   - Railway cria PostgreSQL automaticamente (gratuito)

**Custo: R$ 0,00** (com créditos mensais)

---

## 🗄️ Banco de Dados PostgreSQL Gratuito

### Opção 1: Supabase (Recomendado)

**Plano Gratuito:**
- ✅ 500 MB de armazenamento
- ✅ 2 GB de transferência/mês
- ✅ PostgreSQL completo
- ✅ API REST automática
- ✅ Dashboard web

**Como configurar:**

1. **Criar conta:**
   - Acesse: https://supabase.com
   - Crie projeto gratuito

2. **Obter connection string:**
   - Vá em "Settings" > "Database"
   - Copie "Connection string" (URI)
   - Formato: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

**Custo: R$ 0,00**

---

### Opção 2: Neon

**Plano Gratuito:**
- ✅ 3 GB de armazenamento
- ✅ PostgreSQL serverless
- ✅ Branching de banco de dados
- ✅ Auto-scaling

**Como configurar:**

1. **Criar conta:**
   - Acesse: https://neon.tech
   - Crie projeto gratuito

2. **Obter connection string:**
   - Copie a connection string do dashboard
   - Formato: `postgresql://user:password@ep-xxx.region.neon.tech/dbname`

**Custo: R$ 0,00**

---

## 🔴 Redis Gratuito

### Upstash

**Plano Gratuito:**
- ✅ 10.000 comandos/dia
- ✅ 256 MB de armazenamento
- ✅ Redis serverless
- ✅ Global replication

**Como configurar:**

1. **Criar conta:**
   - Acesse: https://upstash.com
   - Crie database gratuito

2. **Obter URL:**
   - Copie "Redis URL" do dashboard
   - Formato: `redis://default:password@host:port`

**Custo: R$ 0,00**

**Nota:** Redis é opcional no Medusa, mas recomendado para performance.

---

## 🎨 Frontend (React) no Vercel

**Plano Gratuito:**
- ✅ Deploy ilimitado
- ✅ 100 GB bandwidth/mês
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Deploy automático via GitHub

**Como configurar:**

1. **Criar conta:**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Deploy:**
   - Clique em "Add New Project"
   - Conecte repositório
   - Configure:
     ```
     Root Directory: frontend
     Build Command: yarn build
     Output Directory: build
     ```

3. **Variáveis de Ambiente:**
   ```
   REACT_APP_MEDUSA_BACKEND_URL=https://xodozin-medusa.onrender.com
   ```

**Custo: R$ 0,00**

---

## 📊 Comparação de Opções

| Serviço | Backend | Database | Redis | Frontend | Total |
|---------|---------|----------|-------|----------|-------|
| **Render + Supabase + Upstash + Vercel** | ✅ Grátis | ✅ Grátis | ✅ Grátis | ✅ Grátis | **R$ 0,00** |
| **Railway + Neon + Upstash + Vercel** | ✅ Grátis* | ✅ Grátis | ✅ Grátis | ✅ Grátis | **R$ 0,00** |

*Railway: $5 créditos/mês (pode acabar antes do fim do mês)

---

## 🚀 Setup Completo Passo a Passo

### 1. Configurar Banco de Dados (Supabase)

```bash
# 1. Criar conta no Supabase
# 2. Criar novo projeto
# 3. Copiar connection string
# 4. Anotar: DATABASE_URL
```

### 2. Configurar Redis (Upstash)

```bash
# 1. Criar conta no Upstash
# 2. Criar database Redis
# 3. Copiar Redis URL
# 4. Anotar: REDIS_URL
```

### 3. Deploy Backend (Render)

```bash
# 1. Criar conta no Render
# 2. Conectar repositório GitHub
# 3. Criar Web Service:
#    - Build: cd medusa-backend && npm install && npm run build
#    - Start: cd medusa-backend && npm start
# 4. Configurar variáveis:
#    - DATABASE_URL (do Supabase)
#    - REDIS_URL (do Upstash)
#    - JWT_SECRET (gerar aleatório)
#    - COOKIE_SECRET (gerar aleatório)
#    - CORS (URL do Vercel)
# 5. Anotar URL do backend
```

### 4. Deploy Frontend (Vercel)

```bash
# 1. Criar conta no Vercel
# 2. Conectar repositório GitHub
# 3. Configurar:
#    - Root Directory: frontend
#    - Build Command: yarn build
# 4. Variável de ambiente:
#    - REACT_APP_MEDUSA_BACKEND_URL (URL do Render)
# 5. Deploy automático!
```

---

## ⚠️ Limitações dos Planos Gratuitos

### Render (Backend)
- ⚠️ Hiberna após 15 min de inatividade
- ⚠️ Primeira requisição pode demorar ~30 segundos
- ⚠️ Recursos limitados (pode ser lento)

### Supabase (Database)
- ⚠️ 500 MB de armazenamento
- ⚠️ 2 GB de transferência/mês
- ⚠️ Pode ser lento com muito tráfego

### Upstash (Redis)
- ⚠️ 10.000 comandos/dia
- ⚠️ 256 MB de armazenamento

### Vercel (Frontend)
- ⚠️ 100 GB bandwidth/mês
- ⚠️ Build time limitado

---

## 💡 Dicas para Otimizar

1. **Usar Redis:** Melhora performance significativamente
2. **Cache de produtos:** Reduz chamadas ao banco
3. **CDN do Vercel:** Frontend já usa CDN global
4. **Monitorar uso:** Acompanhar limites dos planos gratuitos
5. **Otimizar queries:** Reduzir transferência de dados

---

## 📈 Quando Migrar para Plano Pago?

Considere migrar quando:

- ✅ Tráfego > 10.000 visitas/mês
- ✅ Armazenamento > 500 MB
- ✅ Requisições > 10.000/dia
- ✅ Necessita de uptime 99.9%
- ✅ Performance crítica

**Custo estimado de plano pago:**
- Render: ~$7/mês (Starter)
- Supabase: ~$25/mês (Pro)
- Upstash: ~$10/mês (Pay as you go)
- **Total: ~$42/mês (~R$ 210/mês)**

---

## ✅ Checklist de Deploy Gratuito

- [ ] Conta no Supabase criada
- [ ] Database PostgreSQL criado
- [ ] Connection string copiada
- [ ] Conta no Upstash criada
- [ ] Redis database criado
- [ ] Redis URL copiada
- [ ] Conta no Render criada
- [ ] Backend Medusa deployado
- [ ] Variáveis de ambiente configuradas
- [ ] URL do backend anotada
- [ ] Conta no Vercel criada
- [ ] Frontend deployado
- [ ] Variável de ambiente configurada
- [ ] Testado end-to-end

---

## 🎯 Resumo

**Sim, é totalmente possível hospedar Medusa.js de graça!**

**Stack Gratuita Recomendada:**
- **Backend:** Render (750h/mês grátis)
- **Database:** Supabase (500 MB grátis)
- **Redis:** Upstash (10k comandos/dia grátis)
- **Frontend:** Vercel (ilimitado grátis)

**Custo Total: R$ 0,00** 🎉

**Limitações:**
- Hibernação após inatividade (Render)
- Recursos limitados
- Pode ser lento com muito tráfego

**Ideal para:**
- Projetos em desenvolvimento
- MVP / Protótipos
- E-commerce pequeno/médio
- Testes e validação

---

## 📚 Referências

- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Upstash Docs](https://docs.upstash.com)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Railway Docs](https://docs.railway.app)

