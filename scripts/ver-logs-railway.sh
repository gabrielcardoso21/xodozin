#!/bin/bash

# Script para ver logs do Railway
# Requer Railway CLI instalado e autenticado

set -e

export PATH="$HOME/.local/bin:$PATH"

echo "🔍 Verificando logs do Railway..."
echo ""

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado"
    echo "Instalando..."
    npm install -g @railway/cli --prefix ~/.local
    export PATH="$HOME/.local/bin:$PATH"
fi

# Verificar autenticação
if ! railway whoami &> /dev/null; then
    echo "⚠️  Não autenticado no Railway"
    echo "Execute: railway login"
    echo ""
    echo "Ou use o token do .secrets:"
    echo "  source .secrets"
    echo "  export RAILWAY_TOKEN=\$RAILWAY_TOKEN"
    exit 1
fi

echo "✅ Autenticado no Railway"
echo ""

# Listar projetos
echo "📦 Projetos disponíveis:"
railway list 2>&1 | head -20 || echo "Erro ao listar projetos"

echo ""
echo "📊 Para ver logs de um projeto específico:"
echo "  1. railway link (para linkar ao projeto)"
echo "  2. railway logs --tail 100"
echo ""

# Tentar ver logs se já estiver linkado
if railway status &> /dev/null; then
    echo "📋 Logs recentes:"
    railway logs --tail 50 2>&1 | head -50
else
    echo "💡 Link ao projeto primeiro:"
    echo "  railway link"
    echo "  railway logs --tail 100"
fi

