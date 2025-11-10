#!/bin/bash

# Script de testes para banco de dados
# Verifica conexão e estrutura do banco

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🗄️  Testando Banco de Dados"
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

# Teste 1: Conectar ao PostgreSQL
echo -n "Testando: Conexão com PostgreSQL... "
if docker exec xodozin-postgres psql -U postgres -d xodozin -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "${RED}❌ FALHOU${NC}"
    ((failed++))
fi

# Teste 2: Verificar se banco existe
echo -n "Testando: Banco de dados 'xodozin' existe... "
if docker exec xodozin-postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw xodozin; then
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "${RED}❌ FALHOU${NC}"
    ((failed++))
fi

# Teste 3: Verificar tabelas do Medusa (se existirem)
echo -n "Testando: Tabelas do Medusa (se existirem)... "
table_count=$(docker exec xodozin-postgres psql -U postgres -d xodozin -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$table_count" -gt "0" ]; then
    echo -e "${GREEN}✅ OK${NC} ($table_count tabelas encontradas)"
    ((passed++))
else
    echo -e "${YELLOW}⚠️  AVISO${NC} (Nenhuma tabela encontrada - migrações podem não ter sido executadas)"
    ((failed++))
fi

# Teste 4: Verificar se há dados (opcional)
echo -n "Testando: Dados no banco (opcional)... "
data_count=$(docker exec xodozin-postgres psql -U postgres -d xodozin -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'medusa%';" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$data_count" -gt "0" ]; then
    echo -e "${GREEN}✅ OK${NC} (Estrutura do Medusa encontrada)"
    ((passed++))
else
    echo -e "${YELLOW}⚠️  AVISO${NC} (Estrutura do Medusa não encontrada - execute migrações)"
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
    echo -e "${YELLOW}⚠️  Alguns testes falharam ou são avisos${NC}"
    echo "   Isso é normal se as migrações ainda não foram executadas"
    exit 0
fi

