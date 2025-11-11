#!/bin/sh

# Script de inicialização do Medusa
# Simplesmente usa o Medusa completo como ele é

echo "🚀 Iniciando Medusa.js completo..."

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
fi

# Usar medusa develop (comando oficial do Medusa)
# Isso inicia tudo: backend, Admin Panel, APIs
echo "✅ Iniciando Medusa completo com Admin Panel..."
exec npx medusa develop

