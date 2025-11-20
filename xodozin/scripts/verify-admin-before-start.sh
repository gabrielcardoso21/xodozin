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
    # Garantir que o caminho seja absoluto para o Medusa
    ABSOLUTE_PATH=$(realpath "$ADMIN_PATH" 2>/dev/null || echo "$(pwd)/$ADMIN_PATH")
    echo "   Caminho absoluto do admin: $ABSOLUTE_PATH"
    echo "   Verificando se Medusa pode acessar..."
    # Verificar se o diretório .medusa/server/public/admin existe e é acessível
    if [ -d ".medusa/server/public/admin" ] && [ -r ".medusa/server/public/admin/index.html" ]; then
        echo "   ✅ Diretório e arquivo são acessíveis"
    else
        echo "   ❌ Diretório ou arquivo não são acessíveis!"
        exit 1
    fi
    
    # Garantir que o Medusa encontre o admin usando Node.js para simular
    echo "   Testando acesso via Node.js (como Medusa faz)..."
    cat > /tmp/test-medusa-access.js << 'EOF'
const fs = require('fs');
const path = require('path');
const adminPath = path.join(process.cwd(), '.medusa/server/public/admin/index.html');
if (fs.existsSync(adminPath)) {
    console.log('✅ Node.js (Medusa) consegue encontrar admin em:', adminPath);
    process.exit(0);
} else {
    console.log('❌ Node.js (Medusa) NÃO consegue encontrar admin em:', adminPath);
    console.log('   process.cwd():', process.cwd());
    process.exit(1);
}
EOF
    if node /tmp/test-medusa-access.js; then
        echo "   ✅ Node.js consegue acessar o admin (Medusa deve conseguir também)"
        rm -f /tmp/test-medusa-access.js
    else
        echo "   ⚠️  Node.js NÃO consegue acessar o admin - tentando restaurar do backup..."
        rm -f /tmp/test-medusa-access.js
        
        # Tentar restaurar do backup se existir
        if [ -d "/tmp/admin-backup/admin" ]; then
            echo "   Restaurando admin do backup..."
            mkdir -p .medusa/server/public
            cp -r /tmp/admin-backup/admin .medusa/server/public/ 2>/dev/null || true
            if [ -f ".medusa/server/public/admin/index.html" ]; then
                echo "   ✅ Admin restaurado do backup"
            else
                echo "   ❌ Falha ao restaurar admin do backup"
                exit 1
            fi
        else
            echo "   ❌ Backup não encontrado e Node.js não consegue acessar admin"
            exit 1
        fi
    fi
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

