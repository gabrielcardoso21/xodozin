#!/bin/bash
# Script para testar se o admin é preservado após build do backend
# Simula o que acontece no Railway

set -e

echo "🧪 Teste: Verificar se admin é preservado após build do backend"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$(dirname "$0")/../xodozin" || exit 1

echo "📁 Diretório: $(pwd)"
echo ""

# Verificar se admin existe antes
ADMIN_PATH=".medusa/server/public/admin/index.html"
if [ ! -f "$ADMIN_PATH" ]; then
    echo -e "${RED}❌ Admin não encontrado antes do build!${NC}"
    echo "   Execute: bash scripts/test-build-local.sh"
    exit 1
fi

echo -e "${GREEN}✅ Admin encontrado antes do build: $ADMIN_PATH${NC}"
echo "   Tamanho: $(du -h "$ADMIN_PATH" | cut -f1)"
echo ""

# Fazer backup do admin (como no script build-skip-if-exists.sh)
echo "📦 Fazendo backup do admin..."
mkdir -p /tmp/admin-backup-test
cp -r .medusa/server/public/admin /tmp/admin-backup-test/ 2>/dev/null || {
    echo -e "${RED}❌ Erro ao fazer backup do admin!${NC}"
    exit 1
}
echo -e "${GREEN}✅ Backup criado${NC}"
echo ""

# Fazer build do backend (como no Railway)
echo "🔨 Fazendo build do backend (tsc)..."
if npx tsc --project tsconfig.backend.json; then
    echo -e "${GREEN}✅ Build do backend concluído${NC}"
else
    echo -e "${RED}❌ Build do backend falhou!${NC}"
    exit 1
fi
echo ""

# Verificar se admin ainda existe
echo "🔍 Verificando se admin ainda existe após build..."
if [ -f "$ADMIN_PATH" ]; then
    echo -e "${GREEN}✅ Admin ainda existe após build!${NC}"
    echo "   Tamanho: $(du -h "$ADMIN_PATH" | cut -f1)"
else
    echo -e "${YELLOW}⚠️  Admin não existe após build, restaurando...${NC}"
    # Restaurar admin (como no script build-skip-if-exists.sh)
    mkdir -p .medusa/server/public
    if [ -d "/tmp/admin-backup-test/admin" ]; then
        cp -r /tmp/admin-backup-test/admin .medusa/server/public/ 2>/dev/null || {
            echo -e "${RED}❌ Erro ao restaurar admin!${NC}"
            exit 1
        }
        echo -e "${GREEN}✅ Admin restaurado${NC}"
    else
        echo -e "${RED}❌ Backup não encontrado!${NC}"
        exit 1
    fi
fi
echo ""

# Verificar se admin é acessível pelo Node.js
echo "🔍 Verificando se Node.js consegue encontrar admin após build..."
cat > /tmp/test-admin-after-build.js << 'EOF'
const fs = require('fs');
const path = require('path');

const adminPath = path.join(process.cwd(), '.medusa/server/public/admin/index.html');
if (fs.existsSync(adminPath)) {
    console.log('✅ Admin encontrado pelo Node.js após build!');
    process.exit(0);
} else {
    console.log('❌ Admin NÃO encontrado pelo Node.js após build!');
    process.exit(1);
}
EOF

if node /tmp/test-admin-after-build.js; then
    echo -e "${GREEN}✅ Node.js consegue encontrar admin após build!${NC}"
    rm -f /tmp/test-admin-after-build.js
else
    echo -e "${RED}❌ Node.js NÃO consegue encontrar admin após build!${NC}"
    rm -f /tmp/test-admin-after-build.js
    exit 1
fi

# Limpar backup de teste
rm -rf /tmp/admin-backup-test

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ TESTE PASSOU: Admin é preservado após build do backend!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

