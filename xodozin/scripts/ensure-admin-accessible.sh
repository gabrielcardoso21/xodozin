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
        path.join(cwd, '.medusa/admin/index.html'), // Medusa pode procurar aqui também
    ];
    
    for (const alt of alternatives) {
        if (fs.existsSync(alt)) {
            console.log('   ✅ Encontrado em:', alt);
            // Copiar para o local esperado
            const targetDir = path.join(cwd, '.medusa/server/public/admin');
            const targetFile = path.join(targetDir, 'index.html');
            fs.mkdirSync(targetDir, { recursive: true });
            
            // Copiar todo o diretório admin, não apenas index.html
            const sourceDir = path.dirname(alt);
            const targetAdminDir = path.join(cwd, '.medusa/server/public/admin');
            
            // Copiar recursivamente
            function copyRecursiveSync(src, dest) {
                const exists = fs.existsSync(src);
                const stats = exists && fs.statSync(src);
                const isDirectory = exists && stats.isDirectory();
                if (isDirectory) {
                    fs.mkdirSync(dest, { recursive: true });
                    fs.readdirSync(src).forEach(childItemName => {
                        copyRecursiveSync(
                            path.join(src, childItemName),
                            path.join(dest, childItemName)
                        );
                    });
                } else {
                    fs.copyFileSync(src, dest);
                }
            }
            
            copyRecursiveSync(sourceDir, targetAdminDir);
            console.log('   ✅ Copiado para:', targetAdminDir);
            process.exit(0);
        }
    }
    
    // Se não encontrou, criar symlink de .medusa/admin para .medusa/server/public/admin
    // (caso Medusa procure em .medusa/admin)
    const adminAltPath = path.join(cwd, '.medusa/admin');
    const adminTargetPath = path.join(cwd, '.medusa/server/public/admin');
    if (fs.existsSync(adminTargetPath) && !fs.existsSync(adminAltPath)) {
        console.log('   Tentando criar symlink de .medusa/admin para .medusa/server/public/admin...');
        try {
            fs.mkdirSync(path.join(cwd, '.medusa'), { recursive: true });
            fs.symlinkSync(adminTargetPath, adminAltPath, 'dir');
            console.log('   ✅ Symlink criado:', adminAltPath, '->', adminTargetPath);
            process.exit(0);
        } catch (err) {
            console.log('   ⚠️  Não foi possível criar symlink:', err.message);
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

# Criar symlink adicional: .medusa/admin -> .medusa/server/public/admin
# (caso Medusa procure em .medusa/admin)
if [ -d ".medusa/server/public/admin" ] && [ ! -e ".medusa/admin" ]; then
    echo "   Criando symlink .medusa/admin -> .medusa/server/public/admin..."
    mkdir -p .medusa
    if ln -sf server/public/admin .medusa/admin 2>/dev/null; then
        echo "   ✅ Symlink criado: .medusa/admin -> .medusa/server/public/admin"
        # Verificar se symlink funciona
        if [ -f ".medusa/admin/index.html" ]; then
            echo "   ✅ Symlink funciona! Admin acessível via .medusa/admin/index.html"
        else
            echo "   ⚠️  Symlink criado mas não funciona, copiando..."
            rm -f .medusa/admin
            cp -r .medusa/server/public/admin .medusa/admin 2>/dev/null || true
        fi
    else
        # Se symlink falhar, copiar
        echo "   Symlink falhou, copiando..."
        cp -r .medusa/server/public/admin .medusa/admin 2>/dev/null || true
        echo "   ✅ Cópia criada: .medusa/admin"
    fi
fi

# Verificar todos os caminhos possíveis onde Medusa pode procurar
echo "   Verificando todos os caminhos possíveis..."
for path in ".medusa/server/public/admin/index.html" ".medusa/admin/index.html" ".medusa/server/public/admin" ".medusa/admin"; do
    if [ -e "$path" ]; then
        echo "   ✅ Existe: $path"
    else
        echo "   ❌ Não existe: $path"
    fi
done

echo "✅ Verificação concluída"


