#!/bin/bash

# Script para obter logs do Railway
# Execute este script e cole a saída aqui

set -e

export PATH="$HOME/.local/bin:$PATH"

echo "🔍 Tentando obter logs do Railway..."
echo ""

# Tentar via CLI
if command -v railway &> /dev/null; then
    echo "📋 Tentando via Railway CLI..."
    
    if railway whoami &> /dev/null; then
        echo "✅ Autenticado no Railway"
        echo ""
        echo "📊 Logs recentes:"
        railway logs --tail 100 2>&1 || echo "Erro ao obter logs via CLI"
    else
        echo "⚠️  Não autenticado. Execute: railway login"
    fi
else
    echo "⚠️  Railway CLI não encontrado"
fi

echo ""
echo "📝 ALTERNATIVA:"
echo "1. Acesse: https://railway.app"
echo "2. Vá no seu projeto → Deployments"
echo "3. Clique no deployment com erro"
echo "4. Clique em 'View Logs'"
echo "5. Copie e cole os logs aqui"
echo ""

