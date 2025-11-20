#!/bin/bash

# Script para monitorar logs do Railway continuamente
# Uso: bash scripts/monitor-railway.sh

set -e

export PATH="$HOME/.local/bin:$PATH"

echo "🔍 Monitorando logs do Railway..."
echo "Pressione Ctrl+C para parar"
echo ""

while true; do
    echo "=== $(date) ==="
    railway logs --tail 50 2>&1 | tail -30
    echo ""
    echo "Aguardando 10 segundos..."
    sleep 10
done

