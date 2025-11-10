# ⚠️ Problema com Docker e Medusa.js

## Problema Identificado

O Medusa.js está instalado no container, mas o comando `medusa` não está disponível no PATH. O erro é:

```
npm error could not determine executable to run
```

## Causa

O Medusa 2.x pode ter uma estrutura diferente do Medusa 1.x, e o comando `medusa` pode não estar sendo instalado corretamente no `node_modules/.bin/`.

## Soluções

### Solução 1: Usar Medusa 1.x (Mais Estável)

O Medusa 1.x é mais estável e tem melhor suporte. Atualizar `package.json`:

```json
{
  "dependencies": {
    "@medusajs/medusa": "^1.20.0",
    "@medusajs/admin": "^1.8.0",
    "@medusajs/payment-stripe": "^1.8.0"
  }
}
```

### Solução 2: Usar create-medusa-app

O `create-medusa-app` cria a estrutura correta automaticamente:

```bash
cd /home/gabriel/xodozin
rm -rf medusa-backend
npx create-medusa-app@latest medusa-backend
```

### Solução 3: Instalar Localmente (Sem Docker)

Se o Docker estiver causando problemas, pode instalar localmente:

```bash
cd medusa-backend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20
npm install --legacy-peer-deps
npm run build
npm run dev
```

### Solução 4: Verificar Instalação no Container

Verificar se o Medusa está instalado corretamente:

```bash
docker exec xodozin-medusa-backend ls -la /app/node_modules/.bin/ | grep medusa
docker exec xodozin-medusa-backend cat /app/node_modules/@medusajs/medusa/package.json | grep bin
```

## Status Atual

- ✅ Docker instalado
- ✅ Docker Compose instalado
- ✅ Containers criados (PostgreSQL, Redis, Medusa)
- ✅ Medusa instalado no container
- ❌ Comando `medusa` não disponível no PATH
- ❌ Servidor não está iniciando

## Próximos Passos

1. **Escolher uma solução acima**
2. **Reinstalar Medusa com versão compatível**
3. **Testar servidor**
4. **Executar migrações**

## Nota

O frontend continua funcionando normalmente com FastAPI. O sistema híbrido detecta automaticamente qual backend usar.

