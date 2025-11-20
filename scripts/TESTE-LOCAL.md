# 🧪 Teste Local Antes do Railway

## Pré-requisitos

- **Node.js 20+** (requerido pelo Medusa)
- **yarn** ou **npm** instalado
- Banco de dados PostgreSQL (opcional para teste de build)

## Como Usar

### 1. Testar Build Local

```bash
# Executar script de teste
bash scripts/test-build-local.sh
```

O script irá:
- ✅ Verificar dependências
- ✅ Instalar dependências se necessário
- ✅ Executar build em modo produção
- ✅ Verificar se admin panel foi gerado (`.medusa/server/public/admin/index.html` - Medusa v2)

### 2. Testar Start Local (Opcional)

Após build passar, você pode testar o start:

```bash
cd xodozin

# Configurar variáveis de ambiente (ajuste conforme necessário)
export NODE_ENV=production
export DATABASE_URL="postgresql://user:pass@localhost:5432/xodozin"
export JWT_SECRET="seu-jwt-secret"
export COOKIE_SECRET="seu-cookie-secret"
export PORT=9000

# Executar start
yarn start
```

### 3. Verificar Health Check

```bash
curl http://localhost:9000/health
```

Deve retornar: `{"status":"ok"}`

## Workflow Recomendado

1. **Fazer alterações no código**
2. **Testar build local**: `bash scripts/test-build-local.sh`
3. **Se build passar**: fazer commit e push
4. **Railway faz deploy automaticamente**

## Solução de Problemas

### Node.js versão incorreta

Se você tem Node.js < 20:

```bash
# Opção 1: Instalar Node.js 20+
# Via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Opção 2: Via snap (Ubuntu)
sudo snap install node --classic --channel=20

# Opção 3: Baixar de https://nodejs.org/
```

### Yarn não encontrado

```bash
# Instalar yarn globalmente
npm install -g yarn

# Ou usar npx yarn (não requer instalação global)
npx yarn install
```

### Build falha com erro de admin panel

Se o build passar mas `index.html` não for gerado:

1. Verificar logs do build
2. Verificar se há erros de TypeScript
3. Verificar se todas as dependências estão instaladas
4. Limpar e tentar novamente: `rm -rf .medusa && yarn build`

## Benefícios

- ⚡ **Iteração rápida**: Correções locais são instantâneas
- 🔍 **Debug fácil**: Logs locais são mais fáceis de ver
- 💰 **Economia**: Não gasta recursos do Railway em testes
- ✅ **Confiança**: Só faz deploy após testar localmente

