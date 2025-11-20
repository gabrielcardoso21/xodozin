#!/bin/bash
# Script para verificar se admin existe antes de iniciar servidor

set -e

echo "🔍 Verificando se admin build existe antes de iniciar servidor..."
echo "   Diretório atual: $(pwd)"

ADMIN_PATH=".medusa/server/public/admin/index.html"

if [ -f "$ADMIN_PATH" ]; then
    echo "✅ Admin build encontrado: $ADMIN_PATH"
    echo "   Tamanho: $(du -h "$ADMIN_PATH" | cut -f1)"
    echo "   Caminho absoluto: $(realpath "$ADMIN_PATH" 2>/dev/null || echo "$(pwd)/$ADMIN_PATH")"
    echo "   Estrutura:"
    ls -lh .medusa/server/public/admin/ | head -5 | sed 's/^/     /'
    echo ""
    echo "🔍 Verificando permissões e conteúdo..."
    if [ -r "$ADMIN_PATH" ]; then
        echo "   ✅ Arquivo é legível"
        # Verificar se arquivo não está vazio
        if [ -s "$ADMIN_PATH" ]; then
            echo "   ✅ Arquivo não está vazio"
            # Verificar se contém HTML
            if grep -q -i "html\|<!DOCTYPE" "$ADMIN_PATH" 2>/dev/null; then
                echo "   ✅ Arquivo contém HTML válido"
            else
                echo "   ⚠️  Arquivo pode não ser HTML válido"
            fi
        else
            echo "   ⚠️  Arquivo está vazio!"
        fi
    else
        echo "   ❌ Arquivo não é legível!"
    fi
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

