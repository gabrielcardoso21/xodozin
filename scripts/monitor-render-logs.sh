#!/bin/bash
# Script para monitorar logs do Render em tempo real

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Monitor de Logs do Render.com${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar se há token de API
if [ -z "$RENDER_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  RENDER_API_KEY não configurada${NC}"
    echo ""
    echo "Para obter o token de API:"
    echo "   1. Acesse: https://dashboard.render.com/account/api-keys"
    echo "   2. Clique em 'Create API Key'"
    echo "   3. Copie o token gerado"
    echo ""
    read -p "Cole o token aqui (ou pressione Enter para usar método alternativo): " API_KEY
    
    if [ -n "$API_KEY" ]; then
        export RENDER_API_KEY="$API_KEY"
    fi
fi

# Método 1: Via API do Render (se tiver token)
if [ -n "$RENDER_API_KEY" ]; then
    echo -e "${GREEN}✅ Token de API configurado${NC}"
    echo ""
    echo -e "${YELLOW}Para usar a API, você precisa do SERVICE_ID${NC}"
    echo "   Você pode encontrar no URL do serviço no dashboard"
    echo "   Exemplo: https://dashboard.render.com/web/xxxx-xxxx-xxxx"
    echo "   O SERVICE_ID é a parte 'xxxx-xxxx-xxxx'"
    echo ""
    read -p "Cole o SERVICE_ID aqui (ou Enter para pular): " SERVICE_ID
    
    if [ -n "$SERVICE_ID" ]; then
        echo ""
        echo -e "${YELLOW}Buscando logs via API...${NC}"
        
        # Tentar buscar logs via API
        LOGS=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/logs" \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Accept: application/json" 2>&1)
        
        if echo "$LOGS" | grep -q "logs\|messages"; then
            echo -e "${GREEN}✅ Logs obtidos via API${NC}"
            echo "$LOGS" | jq '.' 2>/dev/null || echo "$LOGS"
        else
            echo -e "${YELLOW}⚠️  Resposta da API:${NC}"
            echo "$LOGS" | head -20
            echo ""
            echo -e "${YELLOW}Nota: A API pode ter limitações ou formato diferente${NC}"
        fi
    fi
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📋 Método Alternativo: Dashboard do Render${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Para ver os logs em tempo real:"
echo "   1. Acesse: https://dashboard.render.com"
echo "   2. Vá no serviço 'medusa-backend'"
echo "   3. Clique na aba 'Logs'"
echo "   4. Os logs aparecerão em tempo real"
echo ""
echo -e "${YELLOW}🔍 O que procurar nos logs:${NC}"
echo ""
echo "✅ Sucesso:"
echo "   - 'Database connection established'"
echo "   - 'Migrations completed'"
echo "   - 'Listening on port 9000'"
echo ""
echo "❌ Erros comuns:"
echo "   - 'Pg connection failed' → DATABASE_URL não configurada"
echo "   - 'No open ports detected' → PORT não configurada"
echo "   - 'Cannot find module medusa-config' → Problema de build"
echo ""

# Método 2: Tentar usar websocket ou stream (se disponível)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔄 Monitoramento Contínuo${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Para monitorar logs continuamente via API:"
echo ""
echo "1. Obtenha o SERVICE_ID do seu serviço"
echo "2. Execute:"
echo ""
echo "   export RENDER_API_KEY='seu_token'"
echo "   SERVICE_ID='seu-service-id'"
echo "   while true; do"
echo "     curl -s -X GET \"https://api.render.com/v1/services/\$SERVICE_ID/logs\" \\"
echo "       -H \"Authorization: Bearer \$RENDER_API_KEY\" | jq '.'"
echo "     sleep 5"
echo "   done"
echo ""

# Criar script de monitoramento contínuo
cat > /tmp/render-logs-monitor.sh << 'EOF'
#!/bin/bash
# Monitor contínuo de logs do Render

if [ -z "$RENDER_API_KEY" ] || [ -z "$1" ]; then
    echo "Uso: $0 <SERVICE_ID>"
    echo "   export RENDER_API_KEY='seu_token'"
    exit 1
fi

SERVICE_ID=$1

echo "Monitorando logs do serviço $SERVICE_ID..."
echo "Pressione Ctrl+C para parar"
echo ""

while true; do
    LOGS=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/logs" \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Accept: application/json" 2>&1)
    
    if echo "$LOGS" | grep -q "error\|Error\|ERROR"; then
        echo -e "\033[0;31m$LOGS\033[0m"
    elif echo "$LOGS" | grep -q "success\|Success\|listening\|Listening"; then
        echo -e "\033[0;32m$LOGS\033[0m"
    else
        echo "$LOGS" | tail -5
    fi
    
    sleep 10
done
EOF

chmod +x /tmp/render-logs-monitor.sh

echo -e "${GREEN}✅ Script de monitoramento criado em /tmp/render-logs-monitor.sh${NC}"
echo ""
echo "Para usar:"
echo "   export RENDER_API_KEY='seu_token'"
echo "   /tmp/render-logs-monitor.sh <SERVICE_ID>"
echo ""

