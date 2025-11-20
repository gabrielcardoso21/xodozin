# 🔧 Solução: Configurar Root Directory no Railway

## ❌ Problema

Railway não está detectando Node.js porque está analisando a raiz do projeto que tem múltiplas pastas (backend/, frontend/, xodozin/).

## ✅ Solução: Configurar Root Directory

### No Railway Dashboard:

1. Vá no serviço do Medusa
2. Clique em **"Settings"**
3. Role até **"Root Directory"**
4. Configure: **`xodozin`**
5. Salve

### Isso fará com que:

- Railway analise apenas o diretório `xodozin/`
- Encontre o `package.json` do Medusa
- Detecte como Node.js automaticamente
- Execute os comandos dentro de `xodozin/`

### Depois:

1. Vá em **"Deployments"**
2. Clique em **"Redeploy"**
3. Aguarde o build

## 📝 Alternativa: Se Root Directory não funcionar

Se mesmo configurando Root Directory não funcionar, use estas configurações manuais:

### Build & Deploy Settings:

1. **Settings** → **Build & Deploy**
2. Configure:
   - **Build Command:** `yarn install && yarn build`
   - **Start Command:** `yarn start`
   - **Root Directory:** `xodozin`

Isso força o Railway a usar os comandos corretos no diretório correto.

## ✅ Verificação

Após configurar, os logs devem mostrar:

```
✅ Node.js detected
✅ Installing dependencies...
✅ Building...
✅ Starting Medusa...
```

**NÃO deve mostrar:**
```
❌ Railpack could not determine how to build
❌ Python detected
```

