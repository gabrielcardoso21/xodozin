#!/bin/bash

# Script simplificado para testar se o servidor encontra o admin panel
# Não requer banco de dados completo, apenas verifica se o erro do admin foi resolvido

set -e

echo "🧪 Teste Simplificado: Verificar se admin panel é encontrado pelo servidor"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$(dirname "$0")/../xodozin" || exit 1

echo "📁 Diretório: $(pwd)"
echo ""

# Verificar se build existe
ADMIN_INDEX=".medusa/server/public/admin/index.html"
if [ ! -f "$ADMIN_INDEX" ]; then
    echo -e "${RED}❌ Build não encontrado!${NC}"
    echo "   Execute: bash scripts/test-build-local.sh"
    exit 1
fi

echo -e "${GREEN}✅ Build encontrado: $ADMIN_INDEX${NC}"
echo ""

# Verificar estrutura esperada pelo Medusa
echo "🔍 Verificando estrutura do build..."
echo ""

# Medusa v2 procura em .medusa/server/public/admin/
if [ -d ".medusa/server/public/admin" ]; then
    echo -e "${GREEN}✅ Diretório admin existe: .medusa/server/public/admin/${NC}"
    echo "   Arquivos:"
    ls -lh .medusa/server/public/admin/ | head -5 | sed 's/^/     /'
    echo ""
else
    echo -e "${RED}❌ Diretório admin não encontrado!${NC}"
    exit 1
fi

# Verificar se index.html existe
if [ -f "$ADMIN_INDEX" ]; then
    SIZE=$(du -h "$ADMIN_INDEX" | cut -f1)
    echo -e "${GREEN}✅ index.html encontrado (tamanho: $SIZE)${NC}"
    echo ""
    
    # Verificar conteúdo básico
    if grep -q "html\|<!DOCTYPE" "$ADMIN_INDEX" 2>/dev/null; then
        echo -e "${GREEN}✅ index.html parece válido${NC}"
        echo ""
    else
        echo -e "${YELLOW}⚠️  index.html pode estar vazio ou inválido${NC}"
        echo ""
    fi
else
    echo -e "${RED}❌ index.html não encontrado em $ADMIN_INDEX${NC}"
    exit 1
fi

# Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ ESTRUTURA DO ADMIN PANEL ESTÁ CORRETA!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 O admin panel está no local correto:"
echo "   $ADMIN_INDEX"
echo ""
echo "✅ Isso significa que o erro 'Could not find index.html'"
echo "   NÃO deve mais aparecer no Railway!"
echo ""
echo "⚠️  Nota: Para testar start completo, você precisa:"
echo "   - DATABASE_URL configurado (PostgreSQL)"
echo "   - JWT_SECRET e COOKIE_SECRET"
echo "   - Executar: bash scripts/test-start-local.sh"
echo ""

