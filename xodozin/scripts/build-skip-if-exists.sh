#!/bin/bash
# Script para fazer build apenas se admin não existir
# Se admin já existe, faz apenas build do backend (sem admin)

set -e

echo "🔍 DEBUG: Verificando se admin build existe..."
echo "   Diretório atual: $(pwd)"
echo "   Listando arquivos .medusa (se existir):"
find .medusa -type f -name "index.html" 2>/dev/null | head -5 || echo "   Nenhum index.html encontrado"
echo "   Verificando: .medusa/server/public/admin"
if [ -d ".medusa/server/public/admin" ]; then
    echo "   ✅ Diretório existe"
    ls -la .medusa/server/public/admin 2>/dev/null | head -5
    echo "   Verificando index.html:"
    if [ -f ".medusa/server/public/admin/index.html" ]; then
        echo "   ✅ index.html existe"
        ls -lh .medusa/server/public/admin/index.html
    else
        echo "   ❌ index.html NÃO existe no diretório!"
    fi
else
    echo "   ❌ Diretório não encontrado"
    echo "   Estrutura de .medusa (se existir):"
    find .medusa -type d 2>/dev/null | head -10 || echo "   .medusa não existe"
    echo "   Verificando se .medusa existe:"
    if [ -d ".medusa" ]; then
        echo "   ✅ .medusa existe"
        echo "   Conteúdo de .medusa:"
        ls -la .medusa/ | head -10
    else
        echo "   ❌ .medusa NÃO existe - arquivos não foram copiados do Git!"
    fi
fi
echo ""

if [ -d ".medusa/server/public/admin" ] && [ -f ".medusa/server/public/admin/index.html" ]; then
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
    echo "🔍 DEBUG: Verificando admin após build..."
    if [ -f ".medusa/server/public/admin/index.html" ]; then
        echo "✅ Admin existe após build: .medusa/server/public/admin/index.html"
        ls -lh .medusa/server/public/admin/index.html
    else
        echo "❌ ERRO: Admin NÃO existe após build!"
        echo "   Estrutura de .medusa:"
        find .medusa -type d 2>/dev/null | head -10 || echo "   .medusa não existe"
    fi
else
    echo "⚠️  Admin build not found, doing full build..."
    echo "🔍 DEBUG: Listando arquivos .medusa antes do build:"
    find .medusa -type f -name "*.html" 2>/dev/null | head -5 || echo "   Nenhum arquivo HTML encontrado"
    node --max-old-space-size=2048 node_modules/.bin/medusa build
    echo "✅ Full build completed"
    echo "🔍 DEBUG: Verificando admin após build completo..."
    if [ -f ".medusa/server/public/admin/index.html" ]; then
        echo "✅ Admin gerado: .medusa/server/public/admin/index.html"
    else
        echo "❌ ERRO: Admin NÃO foi gerado!"
    fi
fi

