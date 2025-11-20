# 🔧 Corrigir Deploy Railway - Erro de Detecção Python

## ❌ Problema

Railway está detectando o projeto como Python porque há uma pasta `backend/` com `requirements.txt`.

**Erro:**
```
cd backend && pip install -r requirements.txt
sh: 1: pip: not found
```

## ✅ Solução

Arquivos criados na raiz do projeto para forçar detecção como Node.js:

1. **`nixpacks.toml`** - Força detecção como Node.js
2. **`railway.json`** - Configura build e start commands
3. **`package.json`** - Ajuda na detecção Node.js
4. **`.railwayignore`** - Ignora pasta backend

## 🔧 Passos para Corrigir

### 1. Verificar Arquivos na Raiz

Certifique-se que estes arquivos estão na raiz do repositório:

```
xodozin/
├── nixpacks.toml          ✅ (força Node.js)
├── railway.json            ✅ (configuração Railway)
├── package.json            ✅ (detecção Node.js)
├── .railwayignore          ✅ (ignora backend/)
└── xodozin/                ✅ (código do Medusa)
    └── package.json
```

### 2. No Railway Dashboard

1. Vá no serviço do Medusa
2. **Settings** → **Build & Deploy**
3. Verifique:
   - **Build Command:** `cd xodozin && yarn install && yarn build`
   - **Start Command:** `cd xodozin && yarn start`
   - **Root Directory:** (deixe vazio ou `/`)

### 3. Forçar Redeploy

1. Vá em **Deployments**
2. Clique em **"Redeploy"** ou **"Deploy Latest"**
3. Aguarde o build

### 4. Verificar Logs

Após redeploy, verifique os logs. Deve aparecer:

```
[inf] Detected Node.js project
[inf] Installing dependencies...
[inf] Building...
[inf] Starting...
```

**NÃO deve aparecer:**
```
[inf] Detected Python project
[inf] pip install...
```

## 🆘 Se Ainda Não Funcionar

### Opção 1: Configuração Manual no Railway

1. **Settings** → **Build & Deploy**
2. **Build Command:** `cd xodozin && yarn install && yarn build`
3. **Start Command:** `cd xodozin && yarn start`
4. **Nixpacks Config:** Deixe vazio (usa nixpacks.toml)

### Opção 2: Usar Dockerfile (Alternativa)

Se ainda não funcionar, podemos criar um Dockerfile. Mas primeiro tente as opções acima.

### Opção 3: Mover/Remover Pasta Backend

Como último recurso, você pode:
- Mover `backend/` para outro lugar
- Ou renomear temporariamente para `backend-old/`
- Fazer commit e push
- Railway vai detectar como Node.js

## ✅ Verificação

Após correção, os logs devem mostrar:

```
✅ Node.js detectado
✅ yarn install executando
✅ yarn build executando
✅ yarn start executando
```

**NÃO deve mostrar:**
```
❌ Python detectado
❌ pip install
❌ uvicorn
```

## 📝 Arquivos Criados

Todos os arquivos necessários já foram criados na raiz:
- ✅ `nixpacks.toml`
- ✅ `railway.json`
- ✅ `package.json`
- ✅ `.railwayignore`

Apenas faça commit e push, depois force redeploy no Railway!

