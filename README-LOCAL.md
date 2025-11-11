# 🚀 Guia de Uso Local - Xodózin

Guia rápido para rodar tudo localmente.

---

## 🎯 Início Rápido

### Opção 1: Script Automático (Recomendado)

```bash
./start-local.sh
```

Este script:
- ✅ Inicia containers Docker (PostgreSQL, Redis, Medusa)
- ✅ Verifica se serviços estão rodando
- ✅ Inicia frontend React
- ✅ Mostra URLs de acesso

### Opção 2: Manual

#### 1. Iniciar Backend (Medusa)

```bash
# Iniciar containers
docker start xodozin-postgres xodozin-redis xodozin-medusa-backend

# Ou usar docker-compose
docker-compose -f docker-compose.dev.yml up -d
```

#### 2. Iniciar Frontend

```bash
cd frontend
npm install  # Se ainda não instalou
npm start
```

---

## 📍 URLs de Acesso

Após iniciar tudo:

- **Frontend:** http://localhost:3000
- **Medusa API:** http://localhost:9000
- **Medusa Admin:** http://localhost:7001 (após criar usuário)
- **FastAPI:** http://localhost:8000 (se estiver rodando)

---

## ✅ Verificar se Está Tudo Rodando

### Verificar Containers

```bash
docker ps | grep xodozin
```

Deve mostrar:
- `xodozin-postgres` (Up)
- `xodozin-redis` (Up)
- `xodozin-medusa-backend` (Up)

### Verificar APIs

```bash
# Medusa Health Check
curl http://localhost:9000/health

# Medusa Products
curl http://localhost:9000/store/products

# Frontend
curl http://localhost:3000
```

---

## 🔧 Configuração

### Frontend (.env)

O arquivo `frontend/.env` está configurado para:

- ✅ Usar Medusa se disponível (`REACT_APP_USE_MEDUSA=true`)
- ✅ Fallback para FastAPI se Medusa não estiver disponível
- ✅ Backend FastAPI em `http://localhost:8000`

### Para usar apenas FastAPI (original)

Edite `frontend/.env`:

```env
REACT_APP_USE_MEDUSA=false
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Para usar apenas Medusa

Edite `frontend/.env`:

```env
REACT_APP_USE_MEDUSA=true
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 🧪 Testar Funcionalidades

### 1. Testar Home (Listar Kits)

1. Acesse: http://localhost:3000
2. Deve mostrar kits (mesmo que vazio)
3. Console do navegador mostra qual backend está sendo usado

### 2. Testar Quiz

1. Acesse: http://localhost:3000
2. Clique em "Começar Quiz"
3. Responda as perguntas
4. Deve sugerir produtos

### 3. Testar Checkout

1. Complete o quiz ou selecione um kit
2. Preencha dados de entrega
3. Teste criação de pedido

---

## 🛑 Parar Tudo

### Parar Frontend

```bash
# Encontrar processo
lsof -ti :3000 | xargs kill

# Ou se iniciou com npm start, usar Ctrl+C
```

### Parar Containers

```bash
docker stop xodozin-postgres xodozin-redis xodozin-medusa-backend

# Ou
docker-compose -f docker-compose.dev.yml down
```

---

## 🆘 Troubleshooting

### Frontend não inicia

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Containers não iniciam

```bash
# Ver logs
docker logs xodozin-medusa-backend
docker logs xodozin-postgres
docker logs xodozin-redis

# Reiniciar
docker restart xodozin-postgres xodozin-redis xodozin-medusa-backend
```

### Porta já em uso

```bash
# Ver o que está usando a porta
lsof -i :3000
lsof -i :9000
lsof -i :8000

# Matar processo
kill -9 <PID>
```

### Erro de CORS

- Verificar se backend está rodando
- Verificar URLs no `.env` do frontend
- Verificar CORS configurado no backend

---

## 📊 Status dos Serviços

Use este comando para verificar tudo:

```bash
echo "=== Containers ===" && \
docker ps --format "table {{.Names}}\t{{.Status}}" | grep xodozin && \
echo "" && \
echo "=== APIs ===" && \
echo "Medusa: $(curl -s http://localhost:9000/health | jq -r '.status' 2>/dev/null || echo 'não responde')" && \
echo "Frontend: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo 'não responde')"
```

---

## 🎯 Próximos Passos

1. ✅ **Rodar localmente** (você está aqui!)
2. ⏭️ **Criar testes automatizados**
3. ⏭️ **Deploy na nuvem (gratuito)**

---

**Última atualização:** $(date)

