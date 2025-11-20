# 🔗 Teste de Integração Frontend ↔ Backend

## ✅ Configuração

### Backend (Medusa)
- **URL:** http://localhost:9000
- **Status:** ✅ Rodando
- **Health Check:** ✅ OK

### Frontend (React)
- **URL:** http://localhost:3000 (padrão)
- **Status:** ⏳ Iniciando
- **Configuração:** ✅ .env configurado

### Publishable API Key
- **Key:** `pk_0ba002ffa69054ee2df829b155a257a4e428ca72add0b97de299987391566d40`
- **Status:** ✅ Criada e configurada no frontend

## 🧪 Testes de Integração

### 1. Testar Store API com Publishable Key

```bash
curl -H "x-publishable-api-key: pk_0ba002ffa69054ee2df829b155a257a4e428ca72add0b97de299987391566d40" \
  http://localhost:9000/store/products
```

### 2. Testar Regiões

```bash
curl -H "x-publishable-api-key: pk_0ba002ffa69054ee2df829b155a257a4e428ca72add0b97de299987391566d40" \
  http://localhost:9000/store/regions
```

### 3. Testar Collections

```bash
curl -H "x-publishable-api-key: pk_0ba002ffa69054ee2df829b155a257a4e428ca72add0b97de299987391566d40" \
  http://localhost:9000/store/collections
```

## 🔧 Verificar CORS

O Medusa precisa permitir requisições do frontend. Verifique em `medusa-config.ts`:

```typescript
storeCors: "http://localhost:3000"  // Porta do frontend
```

## 📋 Checklist de Integração

- [x] Publishable API Key criada
- [x] Frontend .env configurado
- [x] Backend rodando
- [ ] Frontend rodando
- [ ] Teste de conexão frontend → backend
- [ ] Teste de listar produtos
- [ ] Teste de criar carrinho
- [ ] Teste de adicionar item ao carrinho

## 🐛 Troubleshooting

### Frontend não conecta ao backend

1. Verificar CORS no `medusa-config.ts`
2. Verificar se publishable key está correta
3. Verificar se backend está rodando
4. Verificar console do navegador para erros

### Erro 401 na Store API

- Verificar se publishable key está no header
- Verificar se a key está ativa no banco
- Verificar se está vinculada a um sales channel

### CORS Error

- Adicionar `http://localhost:3000` ao `STORE_CORS` no `medusa-config.ts`
- Reiniciar o backend após mudanças

