#!/bin/bash
# Script para verificar se admin existe antes de iniciar servidor

set -e

echo "🔍 Verificando se admin build existe antes de iniciar servidor..."
echo "   Diretório atual: $(pwd)"

ADMIN_PATH=".medusa/server/public/admin/index.html"

if [ -f "$ADMIN_PATH" ]; then
    echo "✅ Admin build encontrado: $ADMIN_PATH"
    echo "   Tamanho: $(du -h "$ADMIN_PATH" | cut -f1)"
    echo "   Estrutura:"
    ls -lh .medusa/server/public/admin/ | head -5 | sed 's/^/     /'
    echo ""
else
    echo "❌ ERRO: Admin build NÃO encontrado em $ADMIN_PATH"
    echo "   Estrutura de .medusa:"
    find .medusa -type d 2>/dev/null | head -10 || echo "   .medusa não existe"
    echo ""
    echo "⚠️  Tentando fazer build do admin..."
    # Se admin não existe, fazer build completo
    node --max-old-space-size=2048 node_modules/.bin/medusa build || {
        echo "❌ ERRO: Build falhou!"
        exit 1
    }
    if [ -f "$ADMIN_PATH" ]; then
        echo "✅ Admin build gerado com sucesso"
    else
        echo "❌ ERRO: Admin ainda não existe após build!"
        exit 1
    fi
fi

