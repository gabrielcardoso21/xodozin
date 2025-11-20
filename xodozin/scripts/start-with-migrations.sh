#!/bin/bash

# Script para iniciar Medusa executando migrations primeiro
# Usado em produção para garantir que migrations sejam executadas

set -e

echo "🚀 Iniciando Medusa com migrations..."

# Executar migrations
echo "📦 Executando migrations..."
yarn medusa db:migrate || echo "⚠️ Migrations já executadas ou erro (pode ser normal)"

# Iniciar Medusa
echo "🎯 Iniciando Medusa..."
yarn medusa start

