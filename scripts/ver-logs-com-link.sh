#!/bin/bash

# Script para ver logs após fazer railway link manualmente
# Execute: railway link (selecione o projeto)
# Depois: bash scripts/ver-logs-com-link.sh

set -e

export PATH="$HOME/.local/bin:$PATH"

echo "🔍 Verificando logs do Railway..."
echo ""

# Verificar se está linkado
if ! railway status &> /dev/null; then
    echo "❌ Projeto não está linkado"
    echo ""
    echo "Execute primeiro:"
    echo "  railway link"
    echo "  (Selecione o projeto 'kind-harmony')"
    echo ""
    exit 1
fi

echo "✅ Projeto linkado"
echo ""

# Mostrar status
echo "📊 Status do projeto:"
railway status 2>&1 | head -10
echo ""

# Mostrar logs
echo "📋 Logs recentes (últimas 200 linhas):"
echo "=========================================="
railway logs --tail 200 2>&1
echo "=========================================="

