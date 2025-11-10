#!/bin/bash

# Script para iniciar Medusa.js com Docker

set -e

echo "🐳 Iniciando Medusa.js com Docker..."
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado"
    echo "   Instale: sudo apt install docker.io"
    exit 1
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "⚠️  Docker Compose não encontrado"
    echo "   Tentando instalar..."
    ./install-docker-compose.sh
fi

# Usar docker-compose ou docker compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose não está disponível"
    exit 1
fi

echo "✅ Docker e Docker Compose OK"
echo ""

# Parar containers existentes (se houver)
echo "🛑 Parando containers existentes..."
$COMPOSE_CMD -f docker-compose.dev.yml down 2>/dev/null || true

# Build e iniciar
echo "🔨 Fazendo build e iniciando containers..."
$COMPOSE_CMD -f docker-compose.dev.yml up --build -d

echo ""
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verificar status
echo ""
echo "📊 Status dos containers:"
$COMPOSE_CMD -f docker-compose.dev.yml ps

echo ""
echo "📋 Logs (últimas 20 linhas):"
$COMPOSE_CMD -f docker-compose.dev.yml logs --tail=20

echo ""
echo "✅ Serviços iniciados!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Executar migrações:"
echo "      docker exec -it xodozin-medusa-backend npx medusa migrations run"
echo ""
echo "   2. Ver logs:"
echo "      docker-compose -f docker-compose.dev.yml logs -f medusa-backend"
echo ""
echo "   3. Testar API:"
echo "      curl http://localhost:9000/store/products"
echo ""
echo "   4. Parar serviços:"
echo "      docker-compose -f docker-compose.dev.yml down"
echo ""

