#!/bin/bash
# Monitor de logs do Render em tempo real

API_KEY="${RENDER_API_KEY:-rnd_uZd6hv7quW4fyZK1g1CgUcrDZpNI}"
SERVICE_ID="${1:-srv-d4fk6775r7bs73cq115g}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Monitorando Logs do Render${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Serviço: $SERVICE_ID"
echo "Pressione Ctrl+C para parar"
echo ""

LAST_CURSOR=""

while true; do
    # Buscar logs mais recentes
    RESPONSE=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/logs?limit=50" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Accept: application/json" 2>&1)
    
    # Verificar se há erros
    if echo "$RESPONSE" | grep -q "unauthorized\|Unauthorized"; then
        echo -e "${RED}❌ Erro de autenticação${NC}"
        break
    fi
    
    # Extrair logs
    LOGS=$(echo "$RESPONSE" | jq -r '.logs[]? | "\(.timestamp) [\(.level)] \(.message)"' 2>/dev/null || \
           echo "$RESPONSE" | jq -r '.messages[]? | "\(.timestamp) [\(.level)] \(.message)"' 2>/dev/null || \
           echo "$RESPONSE")
    
    if [ -n "$LOGS" ] && [ "$LOGS" != "null" ]; then
        # Filtrar e colorir logs
        echo "$LOGS" | while IFS= read -r line; do
            if echo "$line" | grep -qi "error\|failed\|timeout"; then
                echo -e "${RED}$line${NC}"
            elif echo "$line" | grep -qi "success\|completed\|listening\|database connection"; then
                echo -e "${GREEN}$line${NC}"
            elif echo "$line" | grep -qi "warn\|warning"; then
                echo -e "${YELLOW}$line${NC}"
            else
                echo "$line"
            fi
        done
    fi
    
    sleep 5
done

