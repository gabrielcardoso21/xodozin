#!/bin/bash
# Script para testar se Medusa encontra o admin buildado localmente
# Simula o que acontece no Railway

set -e

echo "🧪 Teste: Verificar se Medusa encontra admin buildado"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$(dirname "$0")/../xodozin" || exit 1

echo "📁 Diretório: $(pwd)"
echo ""

# Verificar se admin existe
ADMIN_PATH=".medusa/server/public/admin/index.html"
if [ ! -f "$ADMIN_PATH" ]; then
    echo -e "${RED}❌ Admin não encontrado!${NC}"
    echo "   Execute: bash scripts/test-build-local.sh"
    exit 1
fi

echo -e "${GREEN}✅ Admin encontrado: $ADMIN_PATH${NC}"
echo ""

# Simular o que o Medusa faz: verificar se consegue acessar o admin
echo "🔍 Simulando verificação do Medusa..."
echo ""

# Verificar se o caminho relativo funciona
if [ -f ".medusa/server/public/admin/index.html" ]; then
    echo -e "${GREEN}✅ Caminho relativo funciona${NC}"
else
    echo -e "${RED}❌ Caminho relativo não funciona!${NC}"
    exit 1
fi

# Verificar se o caminho absoluto funciona
ABSOLUTE_PATH=$(realpath "$ADMIN_PATH" 2>/dev/null || echo "$(pwd)/$ADMIN_PATH")
if [ -f "$ABSOLUTE_PATH" ]; then
    echo -e "${GREEN}✅ Caminho absoluto funciona: $ABSOLUTE_PATH${NC}"
else
    echo -e "${RED}❌ Caminho absoluto não funciona!${NC}"
    exit 1
fi

# Verificar permissões
if [ -r "$ADMIN_PATH" ]; then
    echo -e "${GREEN}✅ Arquivo é legível${NC}"
else
    echo -e "${RED}❌ Arquivo não é legível!${NC}"
    exit 1
fi

# Verificar se o diretório .medusa/server existe e é acessível
if [ -d ".medusa/server" ]; then
    echo -e "${GREEN}✅ Diretório .medusa/server existe${NC}"
else
    echo -e "${RED}❌ Diretório .medusa/server não existe!${NC}"
    exit 1
fi

if [ -d ".medusa/server/public" ]; then
    echo -e "${GREEN}✅ Diretório .medusa/server/public existe${NC}"
else
    echo -e "${RED}❌ Diretório .medusa/server/public não existe!${NC}"
    exit 1
fi

if [ -d ".medusa/server/public/admin" ]; then
    echo -e "${GREEN}✅ Diretório .medusa/server/public/admin existe${NC}"
else
    echo -e "${RED}❌ Diretório .medusa/server/public/admin não existe!${NC}"
    exit 1
fi

echo ""
echo "🔍 Testando se Medusa consegue encontrar usando Node.js..."
echo ""

# Criar script Node.js temporário para testar
cat > /tmp/test-medusa-admin.js << 'EOF'
const fs = require('fs');
const path = require('path');

const adminPath = path.join(process.cwd(), '.medusa/server/public/admin/index.html');
console.log('Procurando admin em:', adminPath);

if (fs.existsSync(adminPath)) {
    console.log('✅ Admin encontrado pelo Node.js!');
    const stats = fs.statSync(adminPath);
    console.log('   Tamanho:', stats.size, 'bytes');
    console.log('   Legível:', fs.accessSync(adminPath, fs.constants.R_OK) === undefined ? 'Sim' : 'Não');
} else {
    console.log('❌ Admin NÃO encontrado pelo Node.js!');
    console.log('   Diretório atual:', process.cwd());
    console.log('   Tentando listar .medusa:');
    try {
        const medusaPath = path.join(process.cwd(), '.medusa');
        if (fs.existsSync(medusaPath)) {
            console.log('   .medusa existe');
            const serverPath = path.join(medusaPath, 'server');
            if (fs.existsSync(serverPath)) {
                console.log('   .medusa/server existe');
                const publicPath = path.join(serverPath, 'public');
                if (fs.existsSync(publicPath)) {
                    console.log('   .medusa/server/public existe');
                    const adminDir = path.join(publicPath, 'admin');
                    if (fs.existsSync(adminDir)) {
                        console.log('   .medusa/server/public/admin existe');
                        const files = fs.readdirSync(adminDir);
                        console.log('   Arquivos em admin:', files);
                    } else {
                        console.log('   .medusa/server/public/admin NÃO existe');
                    }
                } else {
                    console.log('   .medusa/server/public NÃO existe');
                }
            } else {
                console.log('   .medusa/server NÃO existe');
            }
        } else {
            console.log('   .medusa NÃO existe');
        }
    } catch (e) {
        console.log('   Erro ao listar:', e.message);
    }
    process.exit(1);
}
EOF

if node /tmp/test-medusa-admin.js; then
    echo -e "${GREEN}✅ Node.js consegue encontrar o admin!${NC}"
    echo ""
    rm -f /tmp/test-medusa-admin.js
else
    echo -e "${RED}❌ Node.js NÃO consegue encontrar o admin!${NC}"
    echo ""
    rm -f /tmp/test-medusa-admin.js
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ TESTE PASSOU: Medusa deve conseguir encontrar o admin!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

