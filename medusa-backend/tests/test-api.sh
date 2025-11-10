#!/bin/bash

# Script de testes para API do Medusa
# Testa todos os endpoints básicos

set -e

BASE_URL="${MEDUSA_URL:-http://localhost:9000}"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testando API do Medusa em: $BASE_URL"
echo ""

# Função para testar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -n "Testando: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null || echo -e "\n000")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint" 2>/dev/null || echo -e "\n000")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK${NC} (HTTP $http_code)"
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            echo "   Resposta: $(echo "$body" | head -c 100)..."
        fi
        return 0
    else
        echo -e "${RED}❌ FALHOU${NC} (Esperado: HTTP $expected_status, Recebido: HTTP $http_code)"
        if [ -n "$body" ]; then
            echo "   Resposta: $body"
        fi
        return 1
    fi
}

# Contador de testes
passed=0
failed=0

# Teste 1: Health Check
if test_endpoint "GET" "/health" "" "200" "Health Check"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 2: Products (GET)
if test_endpoint "GET" "/store/products" "" "200" "Listar Produtos"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 3: Collections (GET)
if test_endpoint "GET" "/store/collections" "" "200" "Listar Collections"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 4: Quiz Suggest (POST)
quiz_data='{"recipient":"parceiro","moment":"natal","feeling":"reconectar"}'
if test_endpoint "POST" "/store/quiz/suggest" "$quiz_data" "200" "Quiz Suggest"; then
    ((passed++))
else
    ((failed++))
fi

# Teste 5: Verificar estrutura da resposta de produtos
echo -n "Testando: Estrutura da resposta de produtos... "
products_response=$(curl -s "$BASE_URL/store/products" 2>/dev/null || echo "")
if echo "$products_response" | grep -q "products"; then
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "${YELLOW}⚠️  AVISO${NC} (Resposta não contém 'products')"
    ((failed++))
fi

# Teste 6: Verificar estrutura da resposta do quiz
echo -n "Testando: Estrutura da resposta do quiz... "
quiz_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$quiz_data" "$BASE_URL/store/quiz/suggest" 2>/dev/null || echo "")
if echo "$quiz_response" | grep -q "ritual_name"; then
    echo -e "${GREEN}✅ OK${NC}"
    ((passed++))
else
    echo -e "${YELLOW}⚠️  AVISO${NC} (Resposta não contém 'ritual_name')"
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

