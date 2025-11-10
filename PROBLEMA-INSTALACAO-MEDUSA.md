# ⚠️ Problema na Instalação do Medusa.js

## Problema Identificado

O `npm install` está demorando muito e há conflitos de versões entre:
- `@medusajs/medusa@^2.0.0`
- `@medusajs/admin@^2.0.0` (requer `@medusajs/medusa@1.8.2`)

## Solução Recomendada

### Opção 1: Usar Medusa 1.x (Mais Estável)

O Medusa 1.x é mais estável e tem melhor compatibilidade. Atualize o `package.json`:

```json
{
  "dependencies": {
    "@medusajs/medusa": "^1.20.0",
    "@medusajs/admin": "^1.10.0",
    "@medusajs/payment-stripe": "^1.10.0",
    "pg": "^8.11.0",
    "better-sqlite3": "^11.0.0",
    "dotenv": "^16.3.1",
    "mongodb": "^6.0.0",
    "axios": "^1.6.0"
  }
}
```

### Opção 2: Usar create-medusa-app (Recomendado)

O `create-medusa-app` cria a estrutura correta automaticamente:

```bash
# Carregar Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

# Criar projeto Medusa
cd /home/gabriel/xodozin
rm -rf medusa-backend
npx create-medusa-app@latest medusa-backend

# Durante a instalação, escolher:
# - Database: SQLite (para desenvolvimento)
# - Redis: Não (opcional)
# - Stripe: Não (pode adicionar depois)
# - Seed: Não
```

Depois, copiar os arquivos customizados:
- `src/api/store/quiz/route.ts`
- `scripts/migrate-data.js`
- `scripts/create-region.js`
- `medusa-config.js` (ajustar se necessário)

### Opção 3: Instalar em Background

Se o `npm install` está demorando, pode executar em background:

```bash
cd medusa-backend
npm install --legacy-peer-deps > /tmp/npm-install.log 2>&1 &
```

E verificar depois:
```bash
tail -f /tmp/npm-install.log
```

## Status Atual

- ✅ Node.js 20 instalado via nvm
- ✅ `.env` criado com configurações básicas
- ❌ `npm install` não completou (timeout/conflitos)
- ❌ Medusa não instalado ainda

## Próximos Passos

1. **Escolher uma opção acima**
2. **Instalar dependências**
3. **Executar migrações**
4. **Testar servidor**

## Nota

O sistema híbrido já está implementado no frontend, então mesmo que o Medusa não esteja instalado ainda, o frontend continua funcionando normalmente com FastAPI.

