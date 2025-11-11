#!/bin/bash

# Script para iniciar tudo localmente (Frontend + Backend)
# Uso: ./start-local.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Iniciando Xodózin Localmente"
echo "=================================="
echo ""

# Função para verificar se porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# 1. Verificar Docker
echo "📦 Passo 1: Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker encontrado${NC}"
echo ""

# 2. Iniciar containers Docker
echo "🐳 Passo 2: Iniciando containers Docker..."
docker start xodozin-postgres xodozin-redis xodozin-medusa-backend 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Containers não existem. Criando...${NC}"
    cd /home/gabriel/xodozin
    docker-compose -f docker-compose.dev.yml up -d 2>/dev/null || {
        echo -e "${RED}❌ Erro ao iniciar containers${NC}"
        exit 1
    }
}

# Aguardar containers estarem prontos
echo "⏳ Aguardando containers estarem prontos..."
sleep 5

# Verificar se estão rodando
if docker ps | grep -q xodozin-postgres && docker ps | grep -q xodozin-redis && docker ps | grep -q xodozin-medusa-backend; then
    echo -e "${GREEN}✅ Containers Docker rodando${NC}"
else
    echo -e "${RED}❌ Erro: Containers não estão rodando${NC}"
    exit 1
fi
echo ""

# 3. Verificar Medusa Backend
echo "🧪 Passo 3: Verificando Medusa Backend..."
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:9000/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Medusa Backend respondendo${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo "   Aguardando... ($RETRY_COUNT/$MAX_RETRIES)"
        sleep 2
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${YELLOW}⚠️  Medusa Backend não está respondendo (pode estar inicializando)${NC}"
fi
echo ""

# 4. Verificar FastAPI (opcional)
echo "🐍 Passo 4: Verificando FastAPI Backend (opcional)..."
if check_port 8000; then
    echo -e "${GREEN}✅ FastAPI rodando na porta 8000${NC}"
else
    echo -e "${YELLOW}⚠️  FastAPI não está rodando (opcional - frontend tem fallback)${NC}"
fi
echo ""

# 5. Verificar Frontend
echo "⚛️  Passo 5: Verificando Frontend..."
if check_port 3000; then
    echo -e "${GREEN}✅ Frontend já está rodando na porta 3000${NC}"
    echo ""
    echo "=================================="
    echo -e "${GREEN}✅ Tudo pronto!${NC}"
    echo ""
    echo "📍 URLs:"
    echo "   Frontend:    http://localhost:3000"
    echo "   Medusa API:  http://localhost:9000"
    echo "   FastAPI:     http://localhost:8000 (se estiver rodando)"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  Frontend não está rodando${NC}"
    echo ""
    echo "🚀 Iniciando Frontend..."
    echo ""
    
    cd /home/gabriel/xodozin/frontend
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências do frontend..."
        npm install
    fi
    
    # Iniciar frontend em background
    echo "⚛️  Iniciando React..."
    npm start > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    echo "⏳ Aguardando frontend iniciar..."
    sleep 10
    
    # Verificar se iniciou
    if check_port 3000; then
        echo -e "${GREEN}✅ Frontend iniciado com sucesso!${NC}"
        echo ""
        echo "=================================="
        echo -e "${GREEN}✅ Tudo pronto!${NC}"
        echo ""
        echo "📍 URLs:"
        echo "   Frontend:    http://localhost:3000"
        echo "   Medusa API:  http://localhost:9000"
        echo "   FastAPI:     http://localhost:8000 (se estiver rodando)"
        echo ""
        echo "📝 Logs do frontend: tail -f /tmp/frontend.log"
        echo "🛑 Para parar: kill $FRONTEND_PID"
        echo ""
    else
        echo -e "${RED}❌ Erro ao iniciar frontend${NC}"
        echo "   Verifique os logs: tail -f /tmp/frontend.log"
        exit 1
    fi
fi

