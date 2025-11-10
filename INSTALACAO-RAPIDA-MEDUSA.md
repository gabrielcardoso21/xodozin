# ⚡ Instalação Rápida do Medusa.js - Xodózin

## 🚀 Setup em 5 Passos

### 1. Verificar Node.js >= 20

```bash
node --version  # Deve ser >= 20
```

Se não tiver:
```bash
nvm install 20
nvm use 20
```

### 2. Executar Script de Setup

```bash
cd medusa-backend
./scripts/setup.sh
```

O script vai:
- ✅ Verificar Node.js
- ✅ Criar `.env` se não existir
- ✅ Instalar dependências
- ✅ Fazer build
- ✅ Oferecer executar migrações

### 3. Configurar Banco de Dados

**Opção A: SQLite (Desenvolvimento - Mais Fácil)**

No `.env`:
```env
DATABASE_URL=sqlite://./medusa.db
```

**Opção B: PostgreSQL (Produção - Recomendado)**

1. Criar conta no Supabase: https://supabase.com
2. Criar projeto gratuito
3. Copiar connection string
4. Configurar no `.env`:
```env
DATABASE_URL=postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres
```

### 4. Executar Migrações

```bash
cd medusa-backend
npx medusa migrations run
```

### 5. Iniciar Servidor

```bash
npm run dev
```

O servidor estará em: `http://localhost:9000`

---

## ✅ Pronto!

Agora você pode:

1. **Acessar Admin:** `http://localhost:7001` (se configurado)
2. **Testar API:** `http://localhost:9000/store/products`
3. **Migrar dados:** `npm run migrate-data` (se tiver MongoDB)
4. **Criar região Brasil:** `npm run create-region`

---

## 🔧 Configurações Opcionais

### Redis (Cache - Opcional)

1. Criar conta no Upstash: https://upstash.com
2. Criar database Redis gratuito
3. Copiar Redis URL
4. Configurar no `.env`:
```env
REDIS_URL=redis://default:senha@xxx.upstash.io:6379
```

### Stripe (Pagamentos - Opcional)

1. Criar conta no Stripe: https://stripe.com
2. Obter API key (test mode)
3. Configurar no `.env`:
```env
STRIPE_API_KEY=sk_test_...
```

O Medusa vai detectar automaticamente e habilitar o plugin.

---

## 🧪 Testar

### Testar API

```bash
# Listar produtos (deve retornar vazio inicialmente)
curl http://localhost:9000/store/products

# Listar collections (deve retornar vazio inicialmente)
curl http://localhost:9000/store/collections
```

### Testar Quiz Endpoint

```bash
curl -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "parceiro",
    "moment": "natal",
    "feeling": "reconectar"
  }'
```

---

## 📋 Próximos Passos

1. ✅ Medusa instalado e rodando
2. ⏭️ Migrar dados do MongoDB (se tiver)
3. ⏭️ Criar região Brasil
4. ⏭️ Configurar frontend para usar Medusa
5. ⏭️ Testar fluxo completo

---

## 🆘 Problemas?

### Erro: "Node.js version must be >= 20"
**Solução:** Atualize Node.js para versão 20+

### Erro: "Cannot connect to database"
**Solução:** 
- Verifique `DATABASE_URL` no `.env`
- Teste conexão: `psql -U usuario -d xodozin` (PostgreSQL)

### Erro: "Port 9000 already in use"
**Solução:**
- Mude `PORT` no `.env` para outra porta
- Ou pare o processo que está usando a porta 9000

---

## 📚 Documentação Completa

- `INSTALACAO-MEDUSA.md` - Guia detalhado
- `medusa-backend/README.md` - Documentação do backend
- `DEPLOY-MEDUSA-GRATUITO.md` - Deploy gratuito

---

## 🎉 Pronto para Usar!

Seu Medusa.js está instalado e pronto para uso! 🚀

