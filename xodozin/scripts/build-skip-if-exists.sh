#!/bin/bash
# Script para fazer build apenas se admin não existir
# Se admin já existe, faz apenas build do backend (sem admin)

set -e

if [ -d ".medusa/server/public/admin" ]; then
    echo "✅ Admin build exists, skipping frontend build"
    echo "📦 Preserving admin build..."
    # Fazer backup do admin antes de qualquer operação
    mkdir -p /tmp/admin-backup
    cp -r .medusa/server/public/admin /tmp/admin-backup/ 2>/dev/null || true
    echo "🔨 Building backend only (excluding admin directory)..."
    # Compilar apenas backend usando tsconfig específico que exclui src/admin
    tsc --project tsconfig.backend.json
    # Restaurar admin após build
    if [ -d "/tmp/admin-backup/admin" ]; then
        mkdir -p .medusa/server/public
        cp -r /tmp/admin-backup/admin .medusa/server/public/ 2>/dev/null || true
        echo "✅ Admin build restored"
    fi
    echo "✅ Backend build completed"
else
    echo "⚠️  Admin build not found, doing full build..."
    node --max-old-space-size=2048 node_modules/.bin/medusa build
    echo "✅ Full build completed"
fi

