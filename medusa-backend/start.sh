#!/bin/sh

# Script de inicialização do Medusa

echo "🚀 Iniciando Medusa.js..."

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
fi

# Instalar ts-node se necessário
if ! command -v ts-node >/dev/null 2>&1; then
    echo "📦 Instalando ts-node..."
    npm install --legacy-peer-deps -g ts-node typescript || npm install --legacy-peer-deps ts-node typescript
fi

# Executar build se necessário
if [ ! -d "dist" ] && [ -f "tsconfig.json" ]; then
    echo "🔨 Fazendo build..."
    npx tsc || echo "⚠️  Build pode falhar se não houver código TypeScript ainda"
fi

# Executar migrações (usando API do Medusa se disponível)
echo "🗄️  Verificando migrações..."
# Migrações serão executadas automaticamente pelo Medusa na primeira inicialização

# Iniciar servidor usando TypeScript diretamente
echo "✅ Iniciando servidor..."
if [ -f "src/index.ts" ]; then
    echo "📝 Usando src/index.ts..."
    npx ts-node src/index.ts
elif [ -f "dist/index.js" ]; then
    echo "📝 Usando dist/index.js..."
    node dist/index.js
else
    echo "❌ Não foi possível encontrar arquivo de inicialização"
    echo "   Procurando arquivos disponíveis..."
    ls -la src/ dist/ 2>/dev/null || true
    exit 1
fi

