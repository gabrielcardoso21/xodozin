# 🔧 Solução para Instalação do Medusa.js

## Problema Identificado

O `npm install` está demorando muito (mais de 5 minutos) e há conflitos de versões entre os pacotes do Medusa.

## Solução: Instalar em Background

Como o `npm install` demora muito, a melhor solução é executar em background e verificar depois:

### Passo 1: Carregar Node.js 20

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20
```

### Passo 2: Instalar em Background

```bash
cd /home/gabriel/xodozin/medusa-backend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps > /tmp/medusa-install.log 2>&1 &
```

### Passo 3: Verificar Progresso

```bash
# Ver últimas linhas do log
tail -f /tmp/medusa-install.log

# Verificar se terminou
ps aux | grep "npm install" | grep -v grep
```

### Passo 4: Verificar Instalação

```bash
# Verificar se Medusa foi instalado
cd /home/gabriel/xodozin/medusa-backend
test -f node_modules/@medusajs/medusa/package.json && echo "✅ Medusa instalado" || echo "❌ Ainda instalando..."
```

## Alternativa: Usar create-medusa-app Manualmente

Se o `npm install` continuar falhando, use o `create-medusa-app` manualmente:

1. Abra um terminal
2. Execute:
   ```bash
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
   nvm use 20
   cd /home/gabriel/xodozin
   rm -rf medusa-backend
   npx create-medusa-app@latest medusa-backend
   ```
3. Responda às perguntas:
   - Next.js Storefront? **N**
   - Database? **SQLite** (ou PostgreSQL se tiver)
   - Redis? **N** (opcional)
   - Stripe? **N** (pode adicionar depois)
   - Seed? **N**

4. Depois, copie os arquivos customizados:
   - `src/api/store/quiz/route.ts`
   - `scripts/migrate-data.js`
   - `scripts/create-region.js`
   - Ajuste `medusa-config.js` se necessário

## Status Atual

- ✅ Node.js 20 instalado via nvm
- ✅ `.env` criado com configurações básicas
- ⏳ `npm install` em andamento (pode demorar 5-10 minutos)
- ⏳ Medusa ainda não instalado completamente

## Próximos Passos (Após Instalação)

1. **Verificar instalação:**
   ```bash
   cd medusa-backend
   test -f node_modules/@medusajs/medusa/package.json && echo "✅ OK" || echo "❌ Falhou"
   ```

2. **Executar build:**
   ```bash
   npm run build
   ```

3. **Executar migrações:**
   ```bash
   npx medusa migrations run
   ```

4. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

## Nota Importante

O frontend continua funcionando normalmente com FastAPI enquanto o Medusa não estiver instalado. O sistema híbrido detecta automaticamente qual backend usar.

