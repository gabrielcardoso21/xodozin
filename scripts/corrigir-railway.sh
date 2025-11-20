#!/bin/bash

# Script para corrigir problemas comuns no Railway
# Este script verifica e corrige configurações

set -e

echo "🔧 Corrigindo configurações do Railway..."
echo ""

# Verificar se .railwayignore existe
if [ ! -f ".railwayignore" ]; then
    echo "❌ .railwayignore não encontrado"
    exit 1
fi

echo "✅ .railwayignore encontrado"

# Verificar se nixpacks.toml existe
if [ ! -f "nixpacks.toml" ]; then
    echo "❌ nixpacks.toml não encontrado"
    exit 1
fi

echo "✅ nixpacks.toml encontrado"

# Verificar se railway.json existe
if [ ! -f "railway.json" ]; then
    echo "❌ railway.json não encontrado"
    exit 1
fi

echo "✅ railway.json encontrado"

# Verificar se xodozin/package.json existe
if [ ! -f "xodozin/package.json" ]; then
    echo "❌ xodozin/package.json não encontrado"
    exit 1
fi

echo "✅ xodozin/package.json encontrado"

echo ""
echo "📋 Configurações verificadas:"
echo "  - Root Directory deve ser: xodozin"
echo "  - Build Command: cd xodozin && yarn install && yarn build"
echo "  - Start Command: cd xodozin && yarn start"
echo ""
echo "⚠️  IMPORTANTE: No Railway Dashboard:"
echo "  1. Vá em Settings → Root Directory"
echo "  2. Configure como: xodozin"
echo "  3. Salve e faça redeploy"
echo ""

