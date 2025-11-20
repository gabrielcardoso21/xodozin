# 🔧 Solução: Frontend não Conecta ao Backend

## ⚠️ Erro: `ERR_CONNECTION_REFUSED`

O erro indica que o frontend não consegue alcançar o backend em `http://localhost:9000`.

## ✅ Verificações

### 1. Backend está rodando?

```bash
curl http://localhost:9000/health
```

Deve retornar: `OK`

### 2. Backend está escutando na porta correta?

```bash
netstat -tlnp | grep :9000
# ou
ss -tlnp | grep :9000
```

Deve mostrar que está escutando em `:::9000` ou `0.0.0.0:9000`

### 3. Frontend tem as variáveis corretas?

Verifique `/home/gabriel/xodozin/frontend/.env`:
```env
REACT_APP_MEDUSA_BACKEND_URL=http://localhost:9000
REACT_APP_MEDUSA_PUBLISHABLE_KEY=pk_0ba002ffa69054ee2df829b155a257a4e428ca72add0b97de299987391566d40
```

### 4. CORS está configurado?

No `medusa-config.ts`, deve ter:
```typescript
storeCors: "http://localhost:3000"
```

## 🔧 Soluções

### Solução 1: Reiniciar Backend

```bash
cd /home/gabriel/xodozin/xodozin
# Matar processos antigos
pkill -f "yarn dev|medusa develop"

# Iniciar novamente
yarn dev
```

Aguarde até ver: `Server is ready on port: 9000`

### Solução 2: Reiniciar Frontend

```bash
cd /home/gabriel/xodozin/frontend
# Matar processos antigos
pkill -f "react-scripts|craco|yarn start"

# Iniciar novamente
yarn start
```

**IMPORTANTE**: Variáveis de ambiente do React só são carregadas na inicialização. Se você mudou o `.env`, precisa reiniciar!

### Solução 3: Verificar no Navegador

1. Abra: http://localhost:9000/store/collections
2. Deve retornar JSON com collections
3. Se não retornar, o backend não está acessível

### Solução 4: Limpar Cache do Navegador

1. Pressione `Ctrl+Shift+Delete` (ou `Cmd+Shift+Delete` no Mac)
2. Limpe cache e cookies
3. Recarregue a página com `Ctrl+F5` (ou `Cmd+Shift+R`)

### Solução 5: Verificar Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba "Console"
3. Veja os erros específicos
4. Vá na aba "Network"
5. Tente fazer a requisição e veja o que acontece

## 📋 Checklist

- [ ] Backend rodando (`curl http://localhost:9000/health`)
- [ ] Frontend rodando (`curl http://localhost:3000`)
- [ ] `.env` do frontend configurado corretamente
- [ ] CORS configurado no `medusa-config.ts`
- [ ] Cache do navegador limpo
- [ ] Console do navegador verificado

## 🎯 Teste Rápido

```bash
# Terminal 1: Backend
cd /home/gabriel/xodozin/xodozin
yarn dev

# Terminal 2: Frontend (em outro terminal)
cd /home/gabriel/xodozin/frontend
yarn start

# Terminal 3: Teste
curl -H "x-publishable-api-key: pk_0ba002ffa69054ee2df829b155a257a4e428ca72add0b97de299987391566d40" http://localhost:9000/store/collections
```

## 💡 Dica

Se o problema persistir, verifique os logs:
- Backend: `/tmp/medusa-dev.log` ou saída do terminal
- Frontend: `/tmp/frontend.log` ou saída do terminal

