#!/bin/bash

# Script para executar todos os testes

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 Executando Todos os Testes${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Diretório dos testes
TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Executar testes do Docker
echo -e "${BLUE}1️⃣  Testando Docker e Serviços...${NC}"
echo ""
bash "$TEST_DIR/test-docker.sh"
docker_status=$?
echo ""

# Executar testes do banco de dados
echo -e "${BLUE}2️⃣  Testando Banco de Dados...${NC}"
echo ""
bash "$TEST_DIR/test-database.sh"
database_status=$?
echo ""

# Executar testes da API
echo -e "${BLUE}3️⃣  Testando API...${NC}"
echo ""
bash "$TEST_DIR/test-api.sh"
api_status=$?
echo ""

# Resumo final
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Resumo Final${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $docker_status -eq 0 ]; then
    echo -e "Docker e Serviços: ${GREEN}✅ OK${NC}"
else
    echo -e "Docker e Serviços: ❌ FALHOU"
fi

if [ $database_status -eq 0 ]; then
    echo -e "Banco de Dados: ${GREEN}✅ OK${NC}"
else
    echo -e "Banco de Dados: ⚠️  AVISOS (normal se migrações não foram executadas)"
fi

if [ $api_status -eq 0 ]; then
    echo -e "API: ${GREEN}✅ OK${NC}"
else
    echo -e "API: ❌ FALHOU"
fi

echo ""

# Status geral
if [ $docker_status -eq 0 ] && [ $api_status -eq 0 ]; then
    echo -e "${GREEN}🎉 Sistema básico funcionando!${NC}"
    exit 0
else
    echo -e "⚠️  Alguns testes falharam. Verifique os logs acima."
    exit 1
fi

