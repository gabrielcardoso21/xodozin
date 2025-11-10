# 🧪 Guia de Testes - Medusa.js

Este guia te ajuda a testar o Medusa.js antes da migração completa estar finalizada.

---

## 📋 Índice

1. [Testes Automatizados](#testes-automatizados)
2. [Testes Manuais](#testes-manuais)
3. [Verificação de Serviços](#verificação-de-serviços)
4. [Testes de API](#testes-de-api)
5. [Testes de Banco de Dados](#testes-de-banco-de-dados)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Testes Automatizados

### Executar Todos os Testes

```bash
cd /home/gabriel/xodozin/medusa-backend
chmod +x tests/*.sh
./tests/run-all-tests.sh
```

### Executar Testes Individuais

```bash
# Testes do Docker
./tests/test-docker.sh

# Testes do Banco de Dados
./tests/test-database.sh

# Testes da API
./tests/test-api.sh
```

---

## 🔍 Testes Manuais

### 1. Verificar Containers Docker

```bash
# Ver status dos containers
docker-compose -f docker-compose.dev.yml ps

# Ver logs do Medusa
docker-compose -f docker-compose.dev.yml logs -f medusa-backend

# Ver logs de todos os serviços
docker-compose -f docker-compose.dev.yml logs -f
```

**Resultado esperado:**
- ✅ `xodozin-postgres` - Status: Up (healthy)
- ✅ `xodozin-redis` - Status: Up (healthy)
- ✅ `xodozin-medusa-backend` - Status: Up

---

### 2. Testar Health Check

```bash
curl http://localhost:9000/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "message": "Medusa backend is running"
}
```

---

### 3. Testar Endpoint de Produtos

```bash
curl http://localhost:9000/store/products
```

**Resultado esperado:**
```json
{
  "products": [],
  "count": 0
}
```

**Nota:** A lista estará vazia até que os produtos sejam migrados ou criados.

---

### 4. Testar Endpoint de Collections

```bash
curl http://localhost:9000/store/collections
```

**Resultado esperado:**
```json
{
  "collections": [],
  "count": 0
}
```

---

### 5. Testar Endpoint de Quiz

```bash
curl -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "parceiro",
    "moment": "natal",
    "feeling": "reconectar"
  }'
```

**Resultado esperado:**
```json
{
  "ritual_name": "Ritual Especial",
  "suggested_products": [],
  "categories": {
    "sensorial": 0,
    "afetivo": 0,
    "ritualistico": 0
  }
}
```

---

### 6. Verificar Banco de Dados

```bash
# Conectar ao PostgreSQL
docker exec -it xodozin-postgres psql -U postgres -d xodozin

# Dentro do psql, verificar tabelas
\dt

# Verificar se há dados
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

# Sair
\q
```

**Resultado esperado:**
- Conexão bem-sucedida
- Tabelas do Medusa (se migrações foram executadas)

---

### 7. Verificar Redis

```bash
# Conectar ao Redis
docker exec -it xodozin-redis redis-cli

# Testar ping
PING

# Verificar chaves (se houver)
KEYS *

# Sair
exit
```

**Resultado esperado:**
```
PONG
```

---

## 🔧 Verificação de Serviços

### Verificar se Todos os Serviços Estão Rodando

```bash
# Ver status
docker-compose -f docker-compose.dev.yml ps

# Ver uso de recursos
docker stats --no-stream

# Verificar portas
netstat -tuln | grep -E "(5433|6379|9000)"
```

---

## 📡 Testes de API

### Teste Completo com curl

```bash
# Health Check
curl -v http://localhost:9000/health

# Produtos
curl -v http://localhost:9000/store/products

# Collections
curl -v http://localhost:9000/store/collections

# Quiz
curl -v -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "parceiro",
    "moment": "natal",
    "feeling": "reconectar"
  }'
```

### Teste com httpie (se instalado)

```bash
# Health Check
http GET http://localhost:9000/health

# Produtos
http GET http://localhost:9000/store/products

# Quiz
http POST http://localhost:9000/store/quiz/suggest \
  recipient=parceiro \
  moment=natal \
  feeling=reconectar
```

---

## 🗄️ Testes de Banco de Dados

### Verificar Conexão

```bash
# Testar conexão
docker exec xodozin-postgres psql -U postgres -d xodozin -c "SELECT version();"
```

### Verificar Tabelas

```bash
# Listar tabelas
docker exec xodozin-postgres psql -U postgres -d xodozin -c "\dt"

# Contar tabelas
docker exec xodozin-postgres psql -U postgres -d xodozin -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

### Verificar Dados (se existirem)

```bash
# Ver produtos (se tabela existir)
docker exec xodozin-postgres psql -U postgres -d xodozin -c "SELECT COUNT(*) FROM product;" 2>/dev/null || echo "Tabela product não existe ainda"

# Ver collections (se tabela existir)
docker exec xodozin-postgres psql -U postgres -d xodozin -c "SELECT COUNT(*) FROM product_collection;" 2>/dev/null || echo "Tabela product_collection não existe ainda"
```

---

## 🆘 Troubleshooting

### Problema: Container não inicia

**Solução:**
```bash
# Ver logs
docker-compose -f docker-compose.dev.yml logs medusa-backend

# Rebuild
docker-compose -f docker-compose.dev.yml build --no-cache medusa-backend

# Reiniciar
docker-compose -f docker-compose.dev.yml up -d medusa-backend
```

---

### Problema: API não responde

**Solução:**
```bash
# Verificar se container está rodando
docker ps | grep medusa-backend

# Ver logs
docker logs xodozin-medusa-backend

# Verificar porta
netstat -tuln | grep 9000

# Reiniciar container
docker-compose -f docker-compose.dev.yml restart medusa-backend
```

---

### Problema: Banco de dados não conecta

**Solução:**
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Ver logs
docker logs xodozin-postgres

# Testar conexão
docker exec xodozin-postgres pg_isready -U postgres

# Reiniciar
docker-compose -f docker-compose.dev.yml restart postgres
```

---

### Problema: Redis não responde

**Solução:**
```bash
# Verificar se Redis está rodando
docker ps | grep redis

# Testar conexão
docker exec xodozin-redis redis-cli ping

# Reiniciar
docker-compose -f docker-compose.dev.yml restart redis
```

---

## ✅ Checklist de Testes

Antes de considerar a migração completa, verifique:

- [ ] Todos os containers estão rodando
- [ ] Health check responde corretamente
- [ ] Endpoint de produtos responde
- [ ] Endpoint de collections responde
- [ ] Endpoint de quiz responde
- [ ] PostgreSQL está acessível
- [ ] Redis está acessível
- [ ] Logs não mostram erros críticos
- [ ] Testes automatizados passam

---

## 📊 Status Atual

### ✅ Funcionando

- ✅ Docker Compose configurado
- ✅ PostgreSQL rodando
- ✅ Redis rodando
- ✅ Medusa Backend rodando
- ✅ Health check funcionando
- ✅ Endpoints básicos respondendo

### ⏳ Pendente

- ⏳ Migrações do banco de dados
- ⏳ Integração completa do Medusa
- ⏳ Migração de dados do MongoDB
- ⏳ Configuração de produtos
- ⏳ Configuração de collections
- ⏳ Integração com frontend

---

## 🎯 Próximos Passos

1. **Executar migrações:**
   ```bash
   docker exec -it xodozin-medusa-backend npx medusa migrations run
   ```

2. **Migrar dados (opcional):**
   ```bash
   docker exec -it xodozin-medusa-backend node scripts/migrate-data.js
   ```

3. **Testar novamente:**
   ```bash
   ./tests/run-all-tests.sh
   ```

4. **Ativar no frontend:**
   - Configurar `.env` do frontend
   - Testar integração

---

## 📚 Documentação Relacionada

- `DOCKER-MEDUSA.md` - Guia completo do Docker
- `INSTALACAO-DOCKER-MEDUSA.md` - Instalação rápida
- `STATUS-INSTALACAO-MEDUSA.md` - Status da instalação

---

## 💡 Dicas

1. **Execute os testes regularmente** para garantir que tudo está funcionando
2. **Verifique os logs** se algo não estiver funcionando
3. **Use os scripts de teste** para validação rápida
4. **Documente problemas** encontrados para referência futura

---

**Última atualização:** $(date)

