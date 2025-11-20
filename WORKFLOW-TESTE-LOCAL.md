# 🚀 Workflow: Teste Local Antes do Railway

## Visão Geral

Este workflow permite testar o build do Medusa localmente antes de fazer deploy no Railway, acelerando significativamente a iteração.

## ⚡ Benefícios

- **Iteração rápida**: Correções locais são instantâneas (segundos) vs minutos no Railway
- **Debug fácil**: Logs locais são mais fáceis de ver e debugar
- **Economia**: Não gasta recursos do Railway em testes
- **Confiança**: Só faz deploy após testar localmente

## 📋 Workflow Recomendado

### 1. Fazer Alterações no Código

```bash
# Editar arquivos conforme necessário
vim xodozin/src/...
```

### 2. Testar Build Local

```bash
# Executar script de teste
bash scripts/test-build-local.sh
```

**O que o script verifica:**
- ✅ Dependências instaladas
- ✅ Build executa sem erros
- ✅ Admin panel é gerado (`.medusa/admin/index.html`)

### 3. Se Build Passar: Fazer Deploy

```bash
# Commit e push
git add .
git commit -m "fix: descrição da correção"
git push
```

O Railway fará deploy automaticamente após o push.

### 4. (Opcional) Testar Start Local

Se quiser testar o servidor localmente também:

```bash
# Configurar variáveis de ambiente
export DATABASE_URL="postgresql://user:pass@localhost:5432/xodozin"
export JWT_SECRET="seu-jwt-secret"
export COOKIE_SECRET="seu-cookie-secret"
export NODE_ENV=production
export PORT=9000

# Executar start
bash scripts/test-start-local.sh
```

## 🔧 Pré-requisitos

### Node.js 20+

O Medusa requer Node.js 20+. Para instalar:

```bash
# Via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Verificar versão
node --version  # deve ser v20.x.x
```

### Yarn

```bash
# Instalar yarn globalmente
npm install -g yarn

# Ou usar npx yarn (não requer instalação global)
npx yarn --version
```

## 📝 Scripts Disponíveis

### `scripts/test-build-local.sh`

Testa o build local do Medusa simulando o ambiente do Railway.

**Uso:**
```bash
bash scripts/test-build-local.sh
```

**Verifica:**
- Versão do Node.js
- Dependências instaladas
- Build executa corretamente
- Admin panel é gerado

### `scripts/test-start-local.sh`

Testa o start local do Medusa após build.

**Uso:**
```bash
# Configurar variáveis de ambiente primeiro
export DATABASE_URL="..."
export JWT_SECRET="..."
export COOKIE_SECRET="..."

# Executar
bash scripts/test-start-local.sh
```

**Verifica:**
- Build existe
- Variáveis de ambiente configuradas
- Servidor inicia sem erros
- Health check responde

## 🐛 Solução de Problemas

### Node.js versão incorreta

**Erro:** `The engine "node" is incompatible with this module. Expected version ">=20"`

**Solução:**
```bash
# Instalar Node.js 20+
nvm install 20
nvm use 20
```

### Yarn não encontrado

**Erro:** `yarn: comando não encontrado`

**Solução:**
```bash
# Instalar yarn
npm install -g yarn

# Ou usar npx
npx yarn install
```

### Build falha com erro de admin panel

**Erro:** `Could not find index.html in the admin build directory`

**Solução:**
1. Verificar logs do build para erros
2. Limpar e tentar novamente:
   ```bash
   cd xodozin
   rm -rf .medusa
   yarn build
   ```
3. Verificar se há erros de TypeScript
4. Verificar se todas as dependências estão instaladas

### Servidor não inicia

**Verificar:**
1. Variáveis de ambiente configuradas
2. Banco de dados acessível (se usando DATABASE_URL)
3. Porta 9000 disponível
4. Logs do servidor para erros específicos

## 📊 Comparação: Local vs Railway

| Aspecto | Local | Railway |
|---------|-------|---------|
| **Tempo de build** | ~30-60s | ~3-5min |
| **Tempo de iteração** | Instantâneo | ~5-10min |
| **Debug** | Fácil (logs locais) | Mais difícil (logs remotos) |
| **Custo** | Grátis | Usa recursos do plano |
| **Ambiente** | Pode diferir | Ambiente real |

## ✅ Checklist Antes de Deploy

Antes de fazer commit e push:

- [ ] Build local passa: `bash scripts/test-build-local.sh`
- [ ] Admin panel é gerado: `.medusa/admin/index.html` existe
- [ ] Sem erros de TypeScript
- [ ] Código testado localmente (se possível)
- [ ] Commit message descritivo

## 🎯 Resultado Esperado

Após seguir este workflow:

1. ✅ Build local passa rapidamente
2. ✅ Deploy no Railway tem alta chance de sucesso
3. ✅ Menos iterações necessárias
4. ✅ Desenvolvimento mais rápido e eficiente

---

**Documentação completa:** Veja `scripts/TESTE-LOCAL.md` para mais detalhes.

