#!/bin/bash
# Script simplificado para monitorar logs do Render

SERVICE_ID="${1:-}"
API_KEY="${RENDER_API_KEY:-}"

if [ -z "$SERVICE_ID" ]; then
    echo "Uso: $0 <SERVICE_ID> [API_KEY]"
    echo ""
    echo "Para obter o SERVICE_ID:"
    echo "  1. Acesse o dashboard do Render"
    echo "  2. Vá no serviço 'medusa-backend'"
    echo "  3. O SERVICE_ID está na URL: dashboard.render.com/web/XXXX-XXXX-XXXX"
    echo ""
    echo "Para obter o API_KEY:"
    echo "  1. Acesse: https://dashboard.render.com/account/api-keys"
    echo "  2. Crie uma API Key"
    echo "  3. Copie o token"
    echo ""
    echo "Ou configure: export RENDER_API_KEY='seu_token'"
    exit 1
fi

if [ -z "$API_KEY" ] && [ -n "$2" ]; then
    API_KEY="$2"
fi

if [ -z "$API_KEY" ]; then
    echo "❌ API_KEY necessária"
    echo "   Configure: export RENDER_API_KEY='seu_token'"
    echo "   Ou passe como segundo argumento: $0 $SERVICE_ID seu_token"
    exit 1
fi

echo "📊 Monitorando logs do serviço $SERVICE_ID..."
echo "   Pressione Ctrl+C para parar"
echo ""

# Função para buscar e exibir logs
fetch_logs() {
    RESPONSE=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/logs?limit=50" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Accept: application/json" 2>&1)
    
    if echo "$RESPONSE" | grep -q "unauthorized\|Unauthorized"; then
        echo "❌ Erro de autenticação. Verifique o API_KEY"
        return 1
    fi
    
    if echo "$RESPONSE" | grep -q "not found\|Not Found"; then
        echo "❌ Serviço não encontrado. Verifique o SERVICE_ID"
        return 1
    fi
    
    # Tentar extrair logs da resposta
    echo "$RESPONSE" | jq -r '.logs[]?.message // .messages[]?.message // .[]?.message // empty' 2>/dev/null || \
    echo "$RESPONSE" | grep -o '"message":"[^"]*"' | sed 's/"message":"\(.*\)"/\1/' || \
    echo "$RESPONSE"
}

# Monitoramento contínuo
LAST_LOG=""
while true; do
    NEW_LOGS=$(fetch_logs)
    
    if [ "$NEW_LOGS" != "$LAST_LOG" ]; then
        echo "$NEW_LOGS" | tail -10
        LAST_LOG="$NEW_LOGS"
    fi
    
    sleep 5
done

