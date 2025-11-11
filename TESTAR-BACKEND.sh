#!/bin/bash

# Script para testar e verificar acesso ao backend

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Testando Acesso ao Backend${NC}"
echo "================================"
echo ""

# 1. Verificar containers
echo -e "${YELLOW}1. Verificando containers...${NC}"
if docker ps | grep -q xodozin-medusa-backend; then
    echo -e "${GREEN}✅ Medusa Backend está rodando${NC}"
else
    echo -e "${RED}❌ Medusa Backend não está rodando${NC}"
    echo "   Iniciando..."
    docker start xodozin-medusa-backend
    sleep 5
fi

if docker ps | grep -q xodozin-postgres; then
    echo -e "${GREEN}✅ PostgreSQL está rodando${NC}"
else
    echo -e "${RED}❌ PostgreSQL não está rodando${NC}"
    docker start xodozin-postgres
    sleep 5
fi

if docker ps | grep -q xodozin-redis; then
    echo -e "${GREEN}✅ Redis está rodando${NC}"
else
    echo -e "${RED}❌ Redis não está rodando${NC}"
    docker start xodozin-redis
    sleep 3
fi

echo ""

# 2. Testar Health Check
echo -e "${YELLOW}2. Testando Health Check...${NC}"
HEALTH=$(curl -s http://localhost:9000/health 2>/dev/null)
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✅ Health Check OK${NC}"
    echo "   Resposta: $HEALTH"
else
    echo -e "${RED}❌ Health Check falhou${NC}"
    echo "   Aguardando backend inicializar..."
    sleep 5
    HEALTH=$(curl -s http://localhost:9000/health 2>/dev/null)
    if echo "$HEALTH" | grep -q "ok"; then
        echo -e "${GREEN}✅ Health Check OK (após aguardar)${NC}"
    else
        echo -e "${RED}❌ Health Check ainda falhando${NC}"
        echo "   Verifique os logs: docker logs xodozin-medusa-backend"
    fi
fi

echo ""

# 3. Testar Products API
echo -e "${YELLOW}3. Testando Products API...${NC}"
PRODUCTS=$(curl -s http://localhost:9000/store/products 2>/dev/null)
if echo "$PRODUCTS" | grep -q "products"; then
    COUNT=$(echo "$PRODUCTS" | jq -r '.count' 2>/dev/null || echo "0")
    echo -e "${GREEN}✅ Products API OK (${COUNT} produtos)${NC}"
else
    echo -e "${RED}❌ Products API falhou${NC}"
fi

echo ""

# 4. Testar Quiz API
echo -e "${YELLOW}4. Testando Quiz API...${NC}"
QUIZ=$(curl -s -X POST http://localhost:9000/store/quiz/suggest \
  -H "Content-Type: application/json" \
  -d '{"recipient":"parceiro","moment":"natal","feeling":"pausar"}' 2>/dev/null)
if echo "$QUIZ" | grep -q "ritual_name"; then
    RITUAL=$(echo "$QUIZ" | jq -r '.ritual_name' 2>/dev/null || echo "OK")
    echo -e "${GREEN}✅ Quiz API OK (${RITUAL})${NC}"
else
    echo -e "${RED}❌ Quiz API falhou${NC}"
fi

echo ""

# 5. Testar CORS
echo -e "${YELLOW}5. Testando CORS...${NC}"
CORS=$(curl -s -H "Origin: http://localhost:3000" http://localhost:9000/health -I 2>&1 | grep -i "access-control-allow-origin")
if [ -n "$CORS" ]; then
    echo -e "${GREEN}✅ CORS configurado${NC}"
    echo "   $CORS"
else
    echo -e "${RED}❌ CORS não configurado${NC}"
fi

echo ""

# 6. Testar Admin Panel
echo -e "${YELLOW}6. Testando Admin Panel...${NC}"
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:7001 2>/dev/null)
if [ "$ADMIN_STATUS" = "200" ] || [ "$ADMIN_STATUS" = "302" ] || [ "$ADMIN_STATUS" = "404" ]; then
    echo -e "${GREEN}✅ Admin Panel acessível (HTTP ${ADMIN_STATUS})${NC}"
else
    echo -e "${YELLOW}⚠️  Admin Panel pode não estar configurado (HTTP ${ADMIN_STATUS})${NC}"
fi

echo ""

# Resumo
echo "================================"
echo -e "${BLUE}📊 Resumo:${NC}"
echo ""
echo "🌐 URLs de Acesso:"
echo "   - API Base: http://localhost:9000"
echo "   - Health: http://localhost:9000/health"
echo "   - Products: http://localhost:9000/store/products"
echo "   - Quiz: http://localhost:9000/store/quiz/suggest"
echo "   - Admin Panel: http://localhost:7001"
echo ""
echo "🧪 Teste no navegador:"
echo "   1. Abra: http://localhost:9000/health"
echo "   2. Deve mostrar: {\"status\":\"ok\",\"message\":\"Medusa backend is running\"}"
echo ""
echo "👤 Para criar usuário admin:"
echo "   docker exec -it xodozin-medusa-backend npx medusa user"
echo ""

