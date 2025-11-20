#!/bin/bash

# Script de setup para produção após deploy
# Execute via: railway run bash xodozin/scripts/setup-production.sh
# OU se já estiver no diretório xodozin: railway run bash scripts/setup-production.sh

set -e

echo "🚀 Iniciando setup de produção..."

# Navegar para o diretório correto (se necessário)
if [ -d "xodozin" ]; then
  cd xodozin
  echo "📁 Entrando no diretório xodozin..."
fi

# Verificar se DATABASE_URL está configurado
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Erro: DATABASE_URL não está configurado"
  exit 1
fi

echo "📦 Executando migrations..."
yarn medusa migrations run || echo "⚠️ Migrations já executadas ou erro (pode ser normal)"

echo "🇧🇷 Configurando região Brasil..."
yarn medusa exec ./src/scripts/setup-brasil.ts || echo "⚠️ Brasil já configurado ou erro"

echo "👤 Criando usuários..."
yarn medusa exec ./src/scripts/create-users-final.ts || echo "⚠️ Usuários já criados ou erro"

echo "🔑 Criando publishable key..."
yarn medusa exec ./src/scripts/create-publishable-key.ts || echo "⚠️ Publishable key já criada ou erro"

echo "✅ Setup de produção concluído!"
echo ""
echo "📝 Próximos passos:"
echo "1. Acesse o Admin Panel: https://seu-app.railway.app/app"
echo "2. Faça login com um dos usuários criados"
echo "3. Copie a Publishable API Key do Admin Panel"
echo "4. Configure no frontend: REACT_APP_MEDUSA_PUBLISHABLE_KEY"

