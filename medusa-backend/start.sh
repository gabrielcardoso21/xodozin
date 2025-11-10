#!/bin/sh

# Script de inicialização do Medusa

echo "🚀 Iniciando Medusa.js..."

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
fi

# Executar build se necessário
if [ ! -d "dist" ]; then
    echo "🔨 Fazendo build..."
    npm run build
fi

# Executar migrações
echo "🗄️  Executando migrações..."
npx medusa migrations run || echo "⚠️  Migrações já executadas ou erro"

# Iniciar servidor
echo "✅ Iniciando servidor..."
npm run dev

