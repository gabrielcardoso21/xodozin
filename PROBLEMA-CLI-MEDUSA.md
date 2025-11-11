# 🔧 Problema do CLI do Medusa - Análise e Solução

## ❌ Problema Identificado

O CLI do Medusa não está funcionando. Erro:

```
Error: Cannot find module '@medusajs/framework/utils'
TypeError: cmd is not a function
```

---

## 🔍 Causa Raiz

O Medusa 2.x requer o pacote `@medusajs/framework`, mas ele **não está instalado** no container.

### Dependências Faltando:

1. **@medusajs/framework** - Pacote principal do framework
   - O Medusa 2.x depende deste pacote
   - Não estava no `package.json` original
   - Foi adicionado, mas não foi instalado no container

---

## ✅ Solução

### 1. Adicionar ao package.json ✅

```json
{
  "dependencies": {
    "@medusajs/framework": "^2.0.0"
  }
}
```

**Status:** ✅ Já adicionado

### 2. Instalar no Container

```bash
# Dentro do container
docker exec -it xodozin-medusa-backend npm install @medusajs/framework --legacy-peer-deps

# Ou rebuild da imagem
docker-compose -f docker-compose.dev.yml build --no-cache medusa-backend
```

**Status:** ⏳ Em progresso

### 3. Verificar Instalação

```bash
docker exec xodozin-medusa-backend npm list @medusajs/framework
```

---

## 📋 Checklist para CLI Funcionar

- [x] Adicionar `@medusajs/framework` ao `package.json`
- [ ] Instalar `@medusajs/framework` no container
- [ ] Verificar se todas as dependências estão instaladas
- [ ] Testar comando `medusa start`
- [ ] Testar comando `medusa migrations run`

---

## 🔧 Comandos para Testar

### Testar CLI

```bash
# Entrar no container
docker exec -it xodozin-medusa-backend sh

# Testar medusa start
node node_modules/@medusajs/medusa/dist/commands/start.js --port 9000

# Ou via npx
npx medusa start
```

### Verificar Dependências

```bash
# Verificar framework
docker exec xodozin-medusa-backend npm list @medusajs/framework

# Verificar medusa
docker exec xodozin-medusa-backend npm list @medusajs/medusa

# Ver todas as dependências
docker exec xodozin-medusa-backend npm list --depth=0
```

---

## 🎯 Próximos Passos

1. **Instalar @medusajs/framework no container**
2. **Rebuild da imagem** (para incluir na imagem)
3. **Testar CLI do Medusa**
4. **Executar migrações**
5. **Integrar Medusa completo**

---

## 💡 Nota

O servidor atual (Express) está funcionando perfeitamente. O CLI do Medusa é necessário apenas para:
- Executar migrações
- Usar funcionalidades completas do Medusa
- Acessar Admin Panel

O sistema básico funciona sem o CLI.

---

**Última atualização:** $(date)

