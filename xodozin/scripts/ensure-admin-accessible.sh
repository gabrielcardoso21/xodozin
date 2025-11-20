#!/bin/bash
# Script para garantir que o admin esteja acessível quando o Medusa iniciar
# Resolve problemas de caminho ou timing

set -e

echo "🔧 Garantindo que admin esteja acessível para Medusa..."
echo "   Diretório atual: $(pwd)"

ADMIN_PATH=".medusa/server/public/admin/index.html"

# Verificar se admin existe
if [ ! -f "$ADMIN_PATH" ]; then
    echo "❌ ERRO: Admin não encontrado em $ADMIN_PATH"
    exit 1
fi

# Garantir que todas as permissões estejam corretas
echo "   Ajustando permissões..."
chmod -R a+r .medusa/server/public/admin/ 2>/dev/null || true
chmod a+x .medusa/server/public/admin/ 2>/dev/null || true

# Verificar se Node.js consegue acessar (como Medusa faz)
echo "   Verificando acesso via Node.js..."
cat > /tmp/verify-admin-access.js << 'EOF'
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const adminPath = path.join(cwd, '.medusa/server/public/admin/index.html');

console.log('Verificando admin em:', adminPath);
console.log('process.cwd():', cwd);

if (fs.existsSync(adminPath)) {
    const stats = fs.statSync(adminPath);
    console.log('✅ Admin encontrado!');
    console.log('   Tamanho:', stats.size, 'bytes');
    console.log('   Legível:', fs.accessSync(adminPath, fs.constants.R_OK) === undefined ? 'Sim' : 'Não');
    
    // Verificar se o diretório também existe
    const adminDir = path.dirname(adminPath);
    if (fs.existsSync(adminDir)) {
        console.log('✅ Diretório admin existe:', adminDir);
    } else {
        console.log('❌ Diretório admin NÃO existe:', adminDir);
        process.exit(1);
    }
    
    process.exit(0);
} else {
    console.log('❌ Admin NÃO encontrado!');
    console.log('   Tentando encontrar em outros locais...');
    
    // Tentar encontrar em locais alternativos
    const alternatives = [
        path.join(cwd, 'xodozin/.medusa/server/public/admin/index.html'),
        path.join(cwd, '../.medusa/server/public/admin/index.html'),
        '/app/.medusa/server/public/admin/index.html',
    ];
    
    for (const alt of alternatives) {
        if (fs.existsSync(alt)) {
            console.log('   ✅ Encontrado em:', alt);
            // Copiar para o local esperado
            const targetDir = path.join(cwd, '.medusa/server/public/admin');
            const targetFile = path.join(targetDir, 'index.html');
            fs.mkdirSync(targetDir, { recursive: true });
            fs.copyFileSync(alt, targetFile);
            console.log('   ✅ Copiado para:', targetFile);
            process.exit(0);
        }
    }
    
    process.exit(1);
}
EOF

if node /tmp/verify-admin-access.js; then
    echo "✅ Admin está acessível para Medusa"
    rm -f /tmp/verify-admin-access.js
else
    echo "⚠️  Aviso: Verificação Node.js falhou, mas continuando..."
    rm -f /tmp/verify-admin-access.js
    # Não falhar aqui, apenas avisar
fi

echo "✅ Verificação concluída"

