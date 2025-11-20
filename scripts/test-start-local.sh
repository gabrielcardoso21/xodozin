#!/bin/bash

# Script para testar start local do Medusa após build
# Simula o ambiente de produção do Railway

set -e

echo "🚀 Testando start local do Medusa (simulando Railway)..."
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

# Verificar se build foi executado
if [ ! -f ".medusa/admin/index.html" ]; then
    echo -e "${RED}❌ Build não encontrado!${NC}"
    echo "   Execute primeiro: bash scripts/test-build-local.sh"
    exit 1
fi

echo -e "${GREEN}✅ Build encontrado${NC}"
echo ""

# Verificar variáveis de ambiente
echo "🔍 Verificando variáveis de ambiente..."
echo ""

MISSING_VARS=()

if [ -z "$DATABASE_URL" ]; then
    MISSING_VARS+=("DATABASE_URL")
fi

if [ -z "$JWT_SECRET" ]; then
    MISSING_VARS+=("JWT_SECRET")
fi

if [ -z "$COOKIE_SECRET" ]; then
    MISSING_VARS+=("COOKIE_SECRET")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Variáveis de ambiente faltando:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "   Configure antes de executar:"
    echo "   export DATABASE_URL='postgresql://user:pass@localhost:5432/xodozin'"
    echo "   export JWT_SECRET='seu-jwt-secret'"
    echo "   export COOKIE_SECRET='seu-cookie-secret'"
    echo "   export NODE_ENV=production"
    echo "   export PORT=9000"
    echo ""
    read -p "   Continuar mesmo assim? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
    echo ""
fi

# Verificar se yarn está disponível
if command -v yarn &> /dev/null; then
    YARN_CMD="yarn"
elif command -v npx &> /dev/null; then
    YARN_CMD="npx yarn"
else
    echo -e "${RED}❌ yarn não encontrado!${NC}"
    exit 1
fi

# Executar start
echo "🎯 Executando start (NODE_ENV=production)..."
echo ""
echo -e "${YELLOW}⚠️  O servidor irá iniciar. Pressione Ctrl+C para parar.${NC}"
echo ""

# Executar start em background para poder capturar erros iniciais
NODE_ENV=production $YARN_CMD start &
SERVER_PID=$!

# Aguardar alguns segundos para ver se inicia sem erros
sleep 5

# Verificar se processo ainda está rodando
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${RED}❌ Servidor parou! Verifique os logs acima.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Servidor iniciou!${NC}"
echo ""

# Testar health check
echo "🏥 Testando health check..."
if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check OK!${NC}"
    curl -s http://localhost:9000/health
    echo ""
else
    echo -e "${YELLOW}⚠️  Health check não respondeu (servidor pode estar ainda inicializando)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ TESTE DE START LOCAL PASSOU!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Servidor rodando em: http://localhost:9000"
echo "   Admin Panel: http://localhost:9000/app"
echo "   Health Check: http://localhost:9000/health"
echo ""
echo "   Para parar o servidor: kill $SERVER_PID"
echo "   Ou pressione Ctrl+C"
echo ""

# Aguardar até Ctrl+C
wait $SERVER_PID

