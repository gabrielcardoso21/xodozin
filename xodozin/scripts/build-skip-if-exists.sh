#!/bin/bash
# Script para fazer build apenas se admin não existir
# Se admin já existe, faz apenas build do backend

set -e

if [ -d ".medusa/server/public/admin" ]; then
    echo "✅ Admin build exists, skipping frontend build"
    echo "🔨 Building backend only..."
    tsc --build
    echo "✅ Backend build completed"
else
    echo "⚠️  Admin build not found, doing full build..."
    node --max-old-space-size=2048 node_modules/.bin/medusa build
    echo "✅ Full build completed"
fi

