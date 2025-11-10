# 🔄 Migração para Medusa.js - Em Andamento

## ✅ O que já foi feito

1. **Checkpoint criado:**
   - Commit: `7aa21a9`
   - Tag: `pre-medusa-migration`
   - **Para voltar:** `git reset --hard pre-medusa-migration`

2. **Sistema híbrido implementado:**
   - `frontend/src/utils/api-hybrid.js` - Detecta automaticamente qual backend usar
   - Tenta Medusa primeiro, se falhar usa FastAPI como fallback
   - **Frontend continua funcionando normalmente!**

3. **Componentes adaptados:**
   - ✅ `Home.js` - Usa `hybridApi.getKits()`
   - ✅ `Quiz.js` - Usa `hybridApi.getQuizSuggestion()`
   - ✅ `Checkout.js` - Usa `hybridApi.createOrder()`
   - ✅ `Kits.js` - Usa `hybridApi.getKits()`

4. **Estrutura Medusa criada:**
   - ✅ `medusa-backend/` - Estrutura básica
   - ✅ `medusa-api.js` - Cliente API do Medusa
   - ✅ `medusa-adapter.js` - Funções para adaptar dados
   - ✅ Endpoint customizado para Quiz

---

## ⚠️ Estado Atual

**Frontend está funcionando normalmente com FastAPI!**

O sistema híbrido permite:
- ✅ Continuar usando FastAPI (padrão)
- ✅ Migrar gradualmente para Medusa
- ✅ Testar Medusa sem quebrar nada
- ✅ Voltar para FastAPI a qualquer momento

---

## 📋 Próximos Passos

### 1. Instalar Medusa.js (Requer Node.js >= 20)

```bash
# Atualizar Node.js
nvm install 20
nvm use 20

# Instalar Medusa
cd medusa-backend
npm install
```

### 2. Configurar Banco de Dados

- Criar PostgreSQL no Supabase (gratuito)
- Configurar `DATABASE_URL` no `.env`

### 3. Configurar Redis (Opcional)

- Criar Redis no Upstash (gratuito)
- Configurar `REDIS_URL` no `.env`

### 4. Executar Migrações

```bash
cd medusa-backend
npm run build
npx medusa migrations run
```

### 5. Migrar Dados

```bash
# Configurar MONGO_URL e DB_NAME no .env
node scripts/migrate-data.js
```

### 6. Ativar Medusa no Frontend

No `.env` do frontend:
```env
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
REACT_APP_USE_MEDUSA=true
```

---

## 🔄 Como Funciona o Sistema Híbrido

1. **Frontend tenta Medusa primeiro** (se `REACT_APP_USE_MEDUSA=true`)
2. **Se Medusa não estiver disponível**, usa FastAPI automaticamente
3. **Sem interrupção** para o usuário
4. **Logs no console** mostram qual backend está sendo usado

---

## 🧪 Testar

### Testar com FastAPI (padrão):
```bash
# Frontend já está funcionando normalmente
cd frontend
yarn start
```

### Testar com Medusa:
```bash
# 1. Iniciar Medusa
cd medusa-backend
npm run dev

# 2. Configurar frontend
# No .env do frontend:
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
REACT_APP_USE_MEDUSA=true

# 3. Iniciar frontend
cd frontend
yarn start
```

---

## ⚠️ Importante

- **Frontend continua funcionando** com FastAPI
- **Nada foi quebrado** - tudo tem fallback
- **Pode voltar a qualquer momento** usando o checkpoint
- **Migração é gradual** - não precisa fazer tudo de uma vez

---

## 📝 Checklist

- [x] Checkpoint criado
- [x] Sistema híbrido implementado
- [x] Componentes adaptados
- [x] Estrutura Medusa criada
- [ ] Node.js >= 20 instalado
- [ ] Medusa.js instalado
- [ ] Banco de dados configurado
- [ ] Migrações executadas
- [ ] Dados migrados
- [ ] Medusa testado e funcionando
- [ ] Frontend usando Medusa
- [ ] FastAPI removido (opcional)

---

## 🆘 Problemas?

### Voltar ao estado anterior:
```bash
git reset --hard pre-medusa-migration
```

### Ver logs do sistema híbrido:
- Abra DevTools > Console
- Veja qual backend está sendo usado
- Logs mostram: "Fetching kits (híbrido: Medusa ou FastAPI)..."

### Medusa não está respondendo:
- Sistema automaticamente usa FastAPI
- Nada quebra, apenas usa fallback

---

## 📚 Documentação

- `MIGRACAO-MEDUSA.md` - Guia completo de migração
- `INSTALACAO-MEDUSA.md` - Como instalar Medusa
- `ADAPTACAO-FRONTEND-MEDUSA.md` - Como adaptar frontend
- `DEPLOY-MEDUSA-GRATUITO.md` - Deploy gratuito
- `HOSPEDAGEM-GRATUITA-MEDUSA.md` - Opções de hospedagem

