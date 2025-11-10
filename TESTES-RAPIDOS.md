# ⚡ Testes Rápidos - Medusa.js

Guia rápido para testar o Medusa.js em 5 minutos.

---

## 🚀 Teste Rápido (1 comando)

```bash
cd /home/gabriel/xodozin/medusa-backend
./tests/run-all-tests.sh
```

Isso executa todos os testes automaticamente!

---

## 📋 Testes Individuais

### 1. Testar Docker (30 segundos)

```bash
./tests/test-docker.sh
```

**O que testa:**
- ✅ Docker instalado
- ✅ Docker Compose disponível
- ✅ Containers rodando
- ✅ Serviços saudáveis

---

### 2. Testar API (30 segundos)

```bash
./tests/test-api.sh
```

**O que testa:**
- ✅ Health check
- ✅ Endpoint de produtos
- ✅ Endpoint de collections
- ✅ Endpoint de quiz

---

### 3. Testar Banco de Dados (30 segundos)

```bash
./tests/test-database.sh
```

**O que testa:**
- ✅ Conexão com PostgreSQL
- ✅ Banco de dados existe
- ✅ Tabelas (se existirem)

---

## 🔍 Testes Manuais Rápidos

### Health Check

```bash
curl http://localhost:9000/health
```

**Esperado:**
```json
{"status":"ok","message":"Medusa backend is running"}
```

---

### Produtos

```bash
curl http://localhost:9000/store/products
```

**Esperado:**
```json
{"products":[],"count":0}
```

---

### Quiz

```bash
curl -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{"recipient":"parceiro","moment":"natal","feeling":"reconectar"}'
```

**Esperado:**
```json
{
  "ritual_name": "Ritual Especial",
  "suggested_products": [],
  "categories": {"sensorial": 0, "afetivo": 0, "ritualistico": 0}
}
```

---

## ✅ Checklist Rápido

- [ ] Containers rodando: `docker-compose -f docker-compose.dev.yml ps`
- [ ] Health check OK: `curl http://localhost:9000/health`
- [ ] Produtos respondendo: `curl http://localhost:9000/store/products`
- [ ] Quiz respondendo: `curl -X POST http://localhost:9000/store/quiz/suggest ...`

---

## 🆘 Problemas Comuns

### Container não inicia

```bash
docker-compose -f docker-compose.dev.yml logs medusa-backend
docker-compose -f docker-compose.dev.yml restart medusa-backend
```

### API não responde

```bash
docker ps | grep medusa-backend
docker logs xodozin-medusa-backend
```

### Porta ocupada

```bash
netstat -tuln | grep 9000
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

---

## 📚 Documentação Completa

Para testes mais detalhados, consulte:
- `GUIA-TESTES-MEDUSA.md` - Guia completo
- `DOCKER-MEDUSA.md` - Guia do Docker

---

**Tempo estimado:** 5 minutos

