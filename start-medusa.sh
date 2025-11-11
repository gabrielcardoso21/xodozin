#!/bin/bash

# Script simples para iniciar Medusa com Docker
# Uso: ./start-medusa.sh

set -e

echo "🚀 Iniciando Medusa com Docker..."
echo ""

# Verificar se containers já existem
if docker ps -a | grep -q xodozin-postgres; then
    echo "📦 Containers já existem, iniciando..."
    docker start xodozin-postgres xodozin-redis 2>/dev/null || true
else
    echo "📦 Criando containers..."
    
    # Criar rede se não existir
    docker network create xodozin-network 2>/dev/null || true
    
    # PostgreSQL
    docker run -d \
        --name xodozin-postgres \
        --network xodozin-network \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=xodozin \
        -p 5432:5432 \
        -v xodozin_postgres_data:/var/lib/postgresql/data \
        postgres:15-alpine
    
    # Redis
    docker run -d \
        --name xodozin-redis \
        --network xodozin-network \
        -p 6379:6379 \
        -v xodozin_redis_data:/data \
        redis:7-alpine
fi

# Aguardar banco estar pronto
echo "⏳ Aguardando banco estar pronto..."
for i in {1..30}; do
    if docker exec xodozin-postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo "✅ Banco pronto!"
        break
    fi
    sleep 1
done

# Medusa Backend
echo "🔨 Fazendo build da imagem Medusa..."
docker build -t xodozin-medusa:latest ./medusa-backend

if docker ps -a | grep -q xodozin-medusa; then
    echo "🔄 Recriando container Medusa..."
    docker stop xodozin-medusa 2>/dev/null || true
    docker rm xodozin-medusa 2>/dev/null || true
fi

echo "📦 Criando container Medusa..."
docker run -d \
    --name xodozin-medusa \
    --network xodozin-network \
    -e DATABASE_URL=postgresql://postgres:postgres@xodozin-postgres:5432/xodozin \
    -e REDIS_URL=redis://xodozin-redis:6379 \
    -e JWT_SECRET=change-this-jwt-secret-key-123456789 \
    -e COOKIE_SECRET=change-this-cookie-secret-key-123456789 \
    -e PORT=9000 \
    -e NODE_ENV=development \
    -e CORS=http://localhost:3000 \
    -e ADMIN_CORS=http://localhost:3000,http://localhost:7001 \
    -p 9000:9000 \
    -v "$(pwd)/medusa-backend:/app" \
    -v xodozin_medusa_node_modules:/app/node_modules \
    --entrypoint sh \
    xodozin-medusa:latest \
    -c "cd /app && sleep 10 && npx medusa develop"

echo ""
echo "✅ Medusa iniciado!"
echo ""
echo "🌐 Acesse: http://localhost:9000/app"
echo ""
echo "📋 Ver logs: docker logs -f xodozin-medusa"
echo "🛑 Parar: docker stop xodozin-medusa xodozin-postgres xodozin-redis"

