#!/bin/bash
# Script para inicializar o Medusa (fazer apenas uma vez)

set -e

echo "🚀 Inicializando Medusa..."
echo ""

# Verificar se container está rodando
if ! docker ps | grep -q xodozin-medusa; then
    echo "❌ Container xodozin-medusa não está rodando!"
    echo "Inicie primeiro: docker-compose up -d medusa"
    exit 1
fi

echo "📦 Instalando dependências..."
docker exec xodozin-medusa sh -c "cd /app && yarn install"

echo "⏳ Aguardando banco estar pronto..."
sleep 5

echo "🔧 Executando setup do banco..."
docker exec xodozin-medusa sh -c "cd /app && echo 'xodozin' | DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa db:setup"

echo "🇧🇷 Configurando região Brasil..."
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/setup-brasil.ts"

echo "🔑 Criando publishable API key..."
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/create-publishable-key.ts"

echo ""
echo "✅ Inicialização completa!"
echo ""
echo "📝 Próximos passos:"
echo "1. Acesse o Admin Panel: http://localhost:9000/app"
echo "2. Crie um usuário admin (se for primeira vez)"
echo "3. Adicione produtos de demonstração"
echo ""

