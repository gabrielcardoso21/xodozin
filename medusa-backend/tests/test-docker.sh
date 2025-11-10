#!/bin/bash

# Script de testes para Docker e serviços
# Verifica se todos os containers estão rodando

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🐳 Testando Docker e Serviços"
echo ""

# Contador de testes
passed=0
failed=0

# Função para testar
test_check() {
    local description=$1
    local command=$2
    
    echo -n "Testando: $description... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ OK${NC}"
        ((passed++))
        return 0
    else
        echo -e "${RED}❌ FALHOU${NC}"
        ((failed++))
        return 1
    fi
}

# Teste 1: Docker está instalado
test_check "Docker instalado" "command -v docker"

# Teste 2: Docker Compose está disponível
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null 2>&1; then
    echo -e "Testando: Docker Compose disponível... ${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "Testando: Docker Compose disponível... ${RED}❌ FALHOU${NC}"
    ((failed++))
fi

# Teste 3: Container PostgreSQL está rodando
test_check "PostgreSQL rodando" "docker ps | grep -q xodozin-postgres"

# Teste 4: Container Redis está rodando
test_check "Redis rodando" "docker ps | grep -q xodozin-redis"

# Teste 5: Container Medusa está rodando
test_check "Medusa Backend rodando" "docker ps | grep -q xodozin-medusa-backend"

# Teste 6: PostgreSQL está saudável
echo -n "Testando: PostgreSQL saudável... "
if docker exec xodozin-postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "${RED}❌ FALHOU${NC}"
    ((failed++))
fi

# Teste 7: Redis está respondendo
echo -n "Testando: Redis respondendo... "
if docker exec xodozin-redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "${RED}❌ FALHOU${NC}"
    ((failed++))
fi

# Teste 8: Medusa está respondendo na porta 9000
echo -n "Testando: Medusa respondendo na porta 9000... "
if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "${RED}❌ FALHOU${NC}"
    ((failed++))
fi

# Teste 9: Verificar logs do Medusa (sem erros críticos)
echo -n "Testando: Logs do Medusa sem erros críticos... "
if docker logs xodozin-medusa-backend 2>&1 | grep -q "running on port"; then
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "${YELLOW}⚠️  AVISO${NC} (Verifique os logs manualmente)"
    ((failed++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resultado dos Testes:"
echo "   ${GREEN}✅ Passou: $passed${NC}"
echo "   ${RED}❌ Falhou: $failed${NC}"
echo "   Total: $((passed + failed))"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Alguns testes falharam${NC}"
    exit 1
fi

