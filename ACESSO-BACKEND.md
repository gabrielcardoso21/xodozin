# 🔧 Como Acessar o Backend

## 📍 URLs dos Backends

### Medusa Backend (Recomendado)
- **URL:** http://localhost:9000
- **Health Check:** http://localhost:9000/health
- **Products API:** http://localhost:9000/store/products
- **Quiz API:** http://localhost:9000/store/quiz/suggest (POST)
- **Admin Panel:** http://localhost:7001 (após criar usuário)

### FastAPI Backend (Opcional)
- **URL:** http://localhost:8000
- **Status:** Não está rodando atualmente
- **Nota:** O sistema híbrido usa Medusa primeiro, FastAPI como fallback

---

## 🧪 Testar APIs

### Testar Medusa Health

```bash
curl http://localhost:9000/health
```

**Esperado:**
```json
{"status":"ok","message":"Medusa backend is running"}
```

### Testar Medusa Products

```bash
curl http://localhost:9000/store/products
```

**Esperado:**
```json
{"products":[],"count":0}
```

### Testar Medusa Quiz

```bash
curl -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{"recipient":"parceiro","moment":"natal","feeling":"pausar"}'
```

**Esperado:**
```json
{
  "ritual_name": "Ritual do Amor",
  "suggested_products": [],
  "categories": {
    "sensorial": 0,
    "afetivo": 0,
    "ritualistico": 0
  }
}
```

---

## 🔍 Verificar Status

### Verificar se Medusa está rodando

```bash
# Ver containers
docker ps | grep xodozin-medusa-backend

# Testar API
curl http://localhost:9000/health

# Ver logs
docker logs xodozin-medusa-backend
```

### Verificar se Frontend está usando Medusa

1. Abra o console do navegador (F12)
2. Procure por logs:
   - `🎯 Tentando usar Medusa para quiz...`
   - `✅ Medusa respondeu:`
3. Network tab deve mostrar requisições para `localhost:9000`

---

## 🆘 Troubleshooting

### Erro: "ERR_CONNECTION_REFUSED" na porta 8000

**Causa:** Frontend está tentando usar FastAPI que não está rodando.

**Solução:**
1. Verifique se Medusa está rodando: `curl http://localhost:9000/health`
2. Verifique `.env` do frontend:
   ```env
   REACT_APP_USE_MEDUSA=true
   REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
   ```
3. Reinicie o frontend

### Erro: "Network Error" no Quiz

**Causa:** Backend não está respondendo ou CORS bloqueado.

**Solução:**
1. Verifique se Medusa está rodando
2. Teste o endpoint diretamente:
   ```bash
   curl -X POST http://localhost:9000/store/quiz/suggest \
     -H "Content-Type: application/json" \
     -d '{"recipient":"parceiro","moment":"natal","feeling":"pausar"}'
   ```
3. Verifique console do navegador para logs detalhados

### Medusa não está sendo detectado

**Causa:** Sistema híbrido não consegue conectar ao Medusa.

**Solução:**
1. Verifique se Medusa está rodando: `docker ps | grep medusa`
2. Teste conectividade: `curl http://localhost:9000/health`
3. Verifique `.env` do frontend
4. Reinicie o frontend

---

## 📝 Configuração do Frontend

O arquivo `frontend/.env` deve ter:

```env
# Medusa Backend (principal)
REACT_APP_USE_MEDUSA=true
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000

# FastAPI Backend (fallback - opcional)
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## ✅ Checklist

- [ ] Medusa está rodando (`docker ps | grep medusa`)
- [ ] Medusa responde (`curl http://localhost:9000/health`)
- [ ] Frontend `.env` configurado corretamente
- [ ] Frontend reiniciado após mudanças no `.env`
- [ ] Console do navegador mostra logs do sistema híbrido
- [ ] Network tab mostra requisições para `localhost:9000`

---

**Última atualização:** $(date)

