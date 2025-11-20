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
    echo "   Admin backed up to /tmp/admin-backup/admin"
    echo "🔨 Building backend only (excluding admin directory)..."
    # Compilar apenas backend usando tsconfig específico que exclui src/admin
    tsc --project tsconfig.backend.json
    # Garantir que estrutura existe e restaurar admin após build
    mkdir -p .medusa/server/public
    if [ -d "/tmp/admin-backup/admin" ]; then
        cp -r /tmp/admin-backup/admin .medusa/server/public/ 2>/dev/null || true
        echo "✅ Admin build restored to .medusa/server/public/admin"
        # Verificar se foi restaurado corretamente
        if [ -f ".medusa/server/public/admin/index.html" ]; then
            echo "✅ Verified: index.html exists"
        else
            echo "⚠️  Warning: index.html not found after restore"
        fi
    else
        echo "⚠️  Warning: Admin backup not found in /tmp/admin-backup/admin"
    fi
    echo "✅ Backend build completed"
else
    echo "⚠️  Admin build not found, doing full build..."
    node --max-old-space-size=2048 node_modules/.bin/medusa build
    echo "✅ Full build completed"
fi

