#!/bin/bash

# Script para testar build local do Medusa antes de fazer deploy no Railway
# Simula o ambiente de produção do Railway

set -e

echo "🧪 Testando build local do Medusa (simulando Railway)..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ir para o diretório do Medusa
cd "$(dirname "$0")/../xodozin" || exit 1

echo "📁 Diretório: $(pwd)"
echo ""

# Verificar versão do Node.js
NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)
REQUIRED_NODE=20

if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt "$REQUIRED_NODE" ]; then
    echo -e "${YELLOW}⚠️  Node.js versão $REQUIRED_NODE+ requerida${NC}"
    echo "   Versão atual: $(node --version 2>/dev/null || echo 'não encontrada')"
    echo ""
    echo "   Opções:"
    echo "   1. Instalar Node.js 20+: https://nodejs.org/"
    echo "   2. Usar nvm: nvm install 20 && nvm use 20"
    echo "   3. Continuar mesmo assim (pode falhar):"
    read -p "   Continuar? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
    echo ""
fi

# Verificar se package.json existe
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json não encontrado!${NC}"
    exit 1
fi

echo "✅ package.json encontrado"
echo ""

# 1. Instalar dependências (se necessário)
echo "📦 Verificando dependências..."

# Verificar se yarn está disponível
if command -v yarn &> /dev/null; then
    YARN_CMD="yarn"
elif command -v npx &> /dev/null; then
    YARN_CMD="npx yarn"
else
    echo -e "${RED}❌ yarn não encontrado! Instale com: npm install -g yarn${NC}"
    exit 1
fi

if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "   Instalando dependências com $YARN_CMD..."
    $YARN_CMD install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi
echo ""

# 2. Limpar build anterior (opcional, mas recomendado)
echo "🧹 Limpando build anterior..."
rm -rf .medusa
echo -e "${GREEN}✅ Build anterior removido${NC}"
echo ""

# 3. Testar build (simula Railway com NODE_ENV=production)
echo "🔨 Executando build (NODE_ENV=production)..."
echo ""

if NODE_ENV=production $YARN_CMD build; then
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
    echo ""
else
    echo -e "${RED}❌ Build falhou!${NC}"
    exit 1
fi

# 4. Verificar se admin foi gerado
echo "🔍 Verificando se admin panel foi gerado..."
echo ""

# Medusa v2 gera admin em .medusa/server/public/admin/index.html
ADMIN_INDEX=".medusa/server/public/admin/index.html"
if [ -f "$ADMIN_INDEX" ]; then
    echo -e "${GREEN}✅ Admin panel gerado: $ADMIN_INDEX${NC}"
    echo "   Tamanho: $(du -h "$ADMIN_INDEX" | cut -f1)"
    echo ""
else
    echo -e "${RED}❌ ERRO: Admin panel NÃO foi gerado!${NC}"
    echo "   Arquivo esperado: $ADMIN_INDEX"
    echo ""
    echo "📂 Estrutura de .medusa (se existir):"
    find .medusa -type f -name "*.html" 2>/dev/null | head -10 || echo "   Nenhum arquivo HTML encontrado"
    exit 1
fi

# 5. Verificar estrutura do build
echo "📂 Estrutura do build gerado:"
echo ""
if [ -d ".medusa/server/public/admin" ]; then
    echo "   .medusa/server/public/admin/"
    ls -lh .medusa/server/public/admin/ | head -10 | sed 's/^/     /'
    echo ""
fi

if [ -d ".medusa/server" ]; then
    echo "   .medusa/server/ (existe)"
    echo ""
fi

# 6. Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ TESTE DE BUILD LOCAL PASSOU!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos passos:"
echo "   1. Se build passou, pode fazer commit e push"
echo "   2. Railway fará deploy automaticamente"
echo "   3. Para testar start local, execute:"
echo "      cd xodozin && NODE_ENV=production yarn start"
echo ""

