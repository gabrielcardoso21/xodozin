#!/bin/bash
# Script para fazer deploy do WooCommerce via Blueprint (render.yaml)
# Mais simples e confiável que criar via API

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

RENDER_API_KEY="${RENDER_API_KEY:-rnd_uZd6hv7quW4fyZK1g1CgUcrDZpNI}"
REPO_URL="${REPO_URL:-https://github.com/gabrielcardoso21/xodozin.git}"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Setup WooCommerce via Blueprint (render.yaml)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar se render.yaml existe
if [ ! -f "woocommerce/render.yaml" ]; then
    echo -e "${RED}❌ ERRO: woocommerce/render.yaml não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ render.yaml encontrado${NC}"
echo ""

# Verificar se serviço já existe
echo "🔍 Verificando se serviço já existe..."
EXISTING_SERVICE=$(curl -s -X GET "https://api.render.com/v1/services?name=woocommerce-store" \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Accept: application/json" | jq -r '.[] | select(.service.name == "woocommerce-store") | .service.id' | head -1)

if [ -n "$EXISTING_SERVICE" ] && [ "$EXISTING_SERVICE" != "null" ]; then
    echo -e "${YELLOW}⚠️  Serviço 'woocommerce-store' já existe${NC}"
    echo "   Service ID: $EXISTING_SERVICE"
    echo ""
    echo "Opções:"
    echo "  1. Fazer redeploy do serviço existente"
    echo "  2. Criar novo serviço com nome diferente"
    echo "  3. Cancelar"
    read -p "Escolha (1/2/3): " choice
    
    case $choice in
        1)
            echo "🔄 Fazendo redeploy..."
            curl -s -X POST "https://api.render.com/v1/services/$EXISTING_SERVICE/deploys" \
                -H "Authorization: Bearer $RENDER_API_KEY" \
                -H "Content-Type: application/json" \
                -d '{"clearBuildCache": true}' > /dev/null
            SERVICE_ID="$EXISTING_SERVICE"
            ;;
        2)
            read -p "Novo nome do serviço: " NEW_NAME
            SERVICE_NAME="$NEW_NAME"
            EXISTING_SERVICE=""
            ;;
        3)
            echo "Cancelado."
            exit 0
            ;;
        *)
            echo "Opção inválida. Cancelado."
            exit 1
            ;;
    esac
fi

if [ -z "$EXISTING_SERVICE" ] || [ "$EXISTING_SERVICE" == "null" ]; then
    echo ""
    echo -e "${YELLOW}📋 Para criar via Blueprint:${NC}"
    echo ""
    echo "1. Acesse: https://dashboard.render.com"
    echo "2. Clique em 'New +' → 'Blueprint'"
    echo "3. Conecte o repositório: $REPO_URL"
    echo "4. Render detectará automaticamente o render.yaml em woocommerce/"
    echo "5. Clique em 'Apply' para criar o serviço e banco"
    echo ""
    echo "OU"
    echo ""
    echo "Execute manualmente via Render CLI (se tiver instalado):"
    echo "   render blueprint launch woocommerce/render.yaml"
    echo ""
    read -p "Pressione ENTER quando o serviço estiver criado no Render..."
fi

# Aguardar serviço estar disponível
echo ""
echo "⏳ Aguardando serviço estar disponível..."

# Tentar obter service ID
SERVICE_ID=$(curl -s -X GET "https://api.render.com/v1/services?name=woocommerce-store" \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Accept: application/json" | jq -r '.[] | select(.service.name == "woocommerce-store") | .service.id' | head -1)

if [ -z "$SERVICE_ID" ] || [ "$SERVICE_ID" == "null" ]; then
    echo -e "${YELLOW}⚠️  Serviço não encontrado via API${NC}"
    echo "   Você pode continuar manualmente:"
    echo "   1. Acesse o dashboard do Render"
    echo "   2. Copie a URL do serviço"
    echo "   3. Execute: bash scripts/configure-frontend.sh <URL> <CONSUMER_KEY> <CONSUMER_SECRET>"
    exit 0
fi

echo -e "${GREEN}✅ Serviço encontrado (ID: $SERVICE_ID)${NC}"

# Aguardar deploy
echo "⏳ Aguardando deploy completar..."
MAX_WAIT=600  # 10 minutos
ELAPSED=0

while [ $ELAPSED -lt $MAX_WAIT ]; do
    DEPLOY_STATUS=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/deploys?limit=1" \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Accept: application/json" | jq -r '.[0].deploy.status // "unknown"')
    
    if [ "$DEPLOY_STATUS" == "live" ] || [ "$DEPLOY_STATUS" == "update_succeeded" ]; then
        echo -e "${GREEN}✅ Deploy concluído!${NC}"
        break
    elif [ "$DEPLOY_STATUS" == "update_failed" ] || [ "$DEPLOY_STATUS" == "build_failed" ]; then
        echo -e "${RED}❌ Deploy falhou!${NC}"
        echo "Verifique os logs no dashboard do Render"
        exit 1
    fi
    
    echo "   Status: $DEPLOY_STATUS (aguardando...)"
    sleep 15
    ELAPSED=$((ELAPSED + 15))
done

# Obter URL
SERVICE_INFO=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID" \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Accept: application/json")

SERVICE_URL=$(echo "$SERVICE_INFO" | jq -r '.service.serviceDetails.url // .service.url // empty')

if [ -z "$SERVICE_URL" ] || [ "$SERVICE_URL" == "null" ]; then
    SERVICE_URL="https://woocommerce-store.onrender.com"
fi

echo ""
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "📋 Informações:"
echo "   URL: $SERVICE_URL"
echo "   Admin: $SERVICE_URL/wp-admin"
echo ""
echo "📝 Próximos passos:"
echo "   1. Aguarde 2-3 minutos para WordPress inicializar"
echo "   2. Acesse: $SERVICE_URL/wp-admin"
echo "   3. Siga: GUIA-GERAR-API-KEY-WOOCOMMERCE.md"
echo "   4. Configure frontend: bash scripts/configure-frontend.sh <URL> <KEY> <SECRET>"

