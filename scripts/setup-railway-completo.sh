#!/bin/bash

# Script para configurar Railway completamente após deploy
# Uso: bash scripts/setup-railway-completo.sh

set -e

export PATH="$HOME/.local/bin:$PATH"

echo "🚀 Configurando Railway após deploy..."
echo ""

# Verificar se está linkado ao Railway
if ! railway status &>/dev/null; then
    echo "❌ Não está linkado ao Railway. Execute: railway link"
    exit 1
fi

echo "✅ Railway linkado"
echo ""

# Executar migrations
echo "📦 Executando migrations..."
railway run yarn medusa migrations run || echo "⚠️ Migrations já executadas ou erro (pode ser normal)"
echo ""

# Configurar Brasil
echo "🇧🇷 Configurando região Brasil..."
railway run yarn medusa exec ./src/scripts/setup-brasil.ts || echo "⚠️ Brasil já configurado ou erro"
echo ""

# Criar usuários
echo "👤 Criando usuários..."
railway run yarn medusa exec ./src/scripts/create-users-final.ts || echo "⚠️ Usuários já criados ou erro"
echo ""

# Criar publishable key
echo "🔑 Criando publishable key..."
railway run yarn medusa exec ./src/scripts/create-publishable-key.ts || echo "⚠️ Publishable key já criada ou erro"
echo ""

echo "✅ Setup completo!"
echo ""
echo "📝 Próximos passos:"
echo "1. Verifique os logs: railway logs --tail 50"
echo "2. Acesse o Admin Panel: https://seu-app.railway.app/app"
echo "3. Faça login com um dos usuários criados"
echo "4. Copie a Publishable API Key do Admin Panel"
echo "5. Configure no frontend: REACT_APP_MEDUSA_PUBLISHABLE_KEY"

