#!/bin/bash
# Script para configurar frontend com credenciais WooCommerce

set -e

SERVICE_URL="${1:-}"
CONSUMER_KEY="${2:-}"
CONSUMER_SECRET="${3:-}"

if [ -z "$SERVICE_URL" ] || [ -z "$CONSUMER_KEY" ] || [ -z "$CONSUMER_SECRET" ]; then
    echo "Uso: $0 <URL> <CONSUMER_KEY> <CONSUMER_SECRET>"
    echo "Exemplo: $0 https://woocommerce-store-xxxx.onrender.com ck_abc123... cs_xyz789..."
    exit 1
fi

FRONTEND_ENV="frontend/.env"

# Criar .env se não existir
if [ ! -f "$FRONTEND_ENV" ]; then
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example "$FRONTEND_ENV"
    else
        touch "$FRONTEND_ENV"
    fi
fi

# Remover variáveis antigas
grep -v "REACT_APP_WOOCOMMERCE" "$FRONTEND_ENV" > "$FRONTEND_ENV.tmp" 2>/dev/null || true

# Adicionar novas variáveis
cat >> "$FRONTEND_ENV.tmp" <<EOF
REACT_APP_WOOCOMMERCE_API_URL=$SERVICE_URL
REACT_APP_WOOCOMMERCE_CONSUMER_KEY=$CONSUMER_KEY
REACT_APP_WOOCOMMERCE_CONSUMER_SECRET=$CONSUMER_SECRET
EOF

mv "$FRONTEND_ENV.tmp" "$FRONTEND_ENV"

echo "✅ Frontend configurado!"
echo "   Arquivo: $FRONTEND_ENV"
echo "   URL: $SERVICE_URL"
echo ""
echo "💡 Reinicie o servidor de desenvolvimento para aplicar as mudanças:"
echo "   cd frontend && npm start"

