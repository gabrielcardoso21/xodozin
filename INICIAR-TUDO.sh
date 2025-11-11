#!/bin/bash

# Script para iniciar tudo (Backend + Frontend)
# Uso: ./INICIAR-TUDO.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Iniciando Xodózin - Backend + Frontend${NC}"
echo "=========================================="
echo ""

# 1. Iniciar Backend
echo -e "${YELLOW}📦 Passo 1: Iniciando Backend (Docker)...${NC}"
docker start xodozin-postgres xodozin-redis xodozin-medusa-backend 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Containers não existem. Criando...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
}

sleep 5

# Verificar backend
if curl -s http://localhost:9000/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend Medusa rodando${NC}"
else
    echo -e "${YELLOW}⚠️  Backend ainda inicializando...${NC}"
fi

echo ""

# 2. Verificar Frontend
echo -e "${YELLOW}⚛️  Passo 2: Verificando Frontend...${NC}"

if lsof -ti :3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend já está rodando${NC}"
    echo ""
    echo "=========================================="
    echo -e "${GREEN}✅ Tudo pronto!${NC}"
    echo ""
    echo "📍 URLs:"
    echo "   Frontend:    http://localhost:3000"
    echo "   Medusa API: http://localhost:9000"
    echo ""
    exit 0
fi

# 3. Verificar dependências do frontend
echo -e "${YELLOW}📦 Passo 3: Verificando dependências do frontend...${NC}"

cd frontend

if [ ! -d "node_modules" ]; then
    echo "   Instalando dependências..."
    npm install --legacy-peer-deps
    npm install ajv@^8.0.0 --legacy-peer-deps
fi

# 4. Iniciar Frontend
echo -e "${YELLOW}⚛️  Passo 4: Iniciando Frontend...${NC}"
echo ""

npm start > /tmp/frontend-xodozin.log 2>&1 &
FRONTEND_PID=$!

echo "   Frontend iniciando em background (PID: $FRONTEND_PID)"
echo "   Aguardando inicialização..."

# Aguardar frontend iniciar (máximo 30 segundos)
MAX_WAIT=30
WAIT_COUNT=0

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo ""
        echo "=========================================="
        echo -e "${GREEN}✅ Tudo pronto!${NC}"
        echo ""
        echo "📍 URLs:"
        echo "   Frontend:    http://localhost:3000"
        echo "   Medusa API:  http://localhost:9000"
        echo "   Medusa Admin: http://localhost:7001"
        echo ""
        echo "📝 Logs do frontend: tail -f /tmp/frontend-xodozin.log"
        echo "🛑 Para parar frontend: kill $FRONTEND_PID"
        echo ""
        exit 0
    fi
    WAIT_COUNT=$((WAIT_COUNT + 1))
    sleep 1
    echo -n "."
done

echo ""
echo -e "${YELLOW}⚠️  Frontend demorou para iniciar${NC}"
echo "   Verifique os logs: tail -f /tmp/frontend-xodozin.log"
echo "   Ou acesse: http://localhost:3000"
echo ""

