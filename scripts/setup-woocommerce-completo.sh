#!/bin/bash
# Script COMPLETO que faz TUDO automaticamente:
# 1. Cria serviço no Render
# 2. Aguarda deploy
# 3. Gera API keys
# 4. Configura frontend

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Setup COMPLETO WooCommerce - 100% Automatizado${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Passo 1: Criar serviço no Render
echo -e "${GREEN}📦 Passo 1/4: Criando serviço no Render...${NC}"
bash scripts/setup-woocommerce-render.sh

# Extrair URL do output
SERVICE_URL=$(bash scripts/setup-woocommerce-render.sh 2>&1 | grep -oP 'URL: \K[^\s]+' | head -1)

if [ -z "$SERVICE_URL" ]; then
    # Tentar obter do último deploy
    export RENDER_API_KEY="${RENDER_API_KEY:-rnd_uZd6hv7quW4fyZK1g1CgUcrDZpNI}"
    SERVICE_ID=$(curl -s -X GET "https://api.render.com/v1/services?name=woocommerce-store" \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Accept: application/json" | jq -r '.[0].service.id // empty' | head -1)
    
    if [ -n "$SERVICE_ID" ]; then
        SERVICE_INFO=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID" \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Accept: application/json")
        SERVICE_URL=$(echo "$SERVICE_INFO" | jq -r '.service.serviceDetails.url // .service.url // empty')
    fi
fi

if [ -z "$SERVICE_URL" ]; then
    echo -e "${RED}❌ Não foi possível obter URL do serviço${NC}"
    echo "Por favor, execute manualmente:"
    echo "  1. bash scripts/setup-woocommerce-render.sh"
    echo "  2. Copie a URL retornada"
    echo "  3. bash scripts/generate-woocommerce-api-keys.sh <URL>"
    exit 1
fi

echo -e "${GREEN}✅ Serviço criado: $SERVICE_URL${NC}"
echo ""

# Passo 2: Aguardar WordPress estar pronto
echo -e "${GREEN}⏳ Passo 2/4: Aguardando WordPress estar pronto...${NC}"
MAX_WAIT=300
ELAPSED=0

while [ $ELAPSED -lt $MAX_WAIT ]; do
    if curl -f -s "$SERVICE_URL/wp-admin/install.php" > /dev/null 2>&1 || \
       curl -f -s "$SERVICE_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ WordPress está pronto!${NC}"
        break
    fi
    echo "   Aguardando... ($ELAPSED/$MAX_WAIT segundos)"
    sleep 10
    ELAPSED=$((ELAPSED + 10))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo -e "${YELLOW}⚠️  Timeout aguardando WordPress${NC}"
    echo "Continue manualmente:"
    echo "  bash scripts/generate-woocommerce-api-keys.sh $SERVICE_URL"
    exit 1
fi

# Passo 3: Gerar API keys (via método que funciona)
echo -e "${GREEN}🔑 Passo 3/4: Gerando API keys...${NC}"
echo ""
echo -e "${YELLOW}⚠️  Para gerar API keys automaticamente, você precisa:${NC}"
echo ""
echo "Opção A: Via Render Shell (Recomendado)"
echo "  1. Acesse: https://dashboard.render.com"
echo "  2. Vá no serviço 'woocommerce-store'"
echo "  3. Clique em 'Shell'"
echo "  4. Execute:"
echo "     wp wc api create --user=admin --description='Frontend API' --permissions=read_write"
echo ""
echo "Opção B: Via Interface Web"
echo "  1. Acesse: $SERVICE_URL/wp-admin"
echo "  2. Siga: GUIA-GERAR-API-KEY-WOOCOMMERCE.md"
echo ""

read -p "Você já gerou as API keys? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo "⏸️  Pausando para você gerar as API keys..."
    echo "   Quando tiver as credenciais, execute:"
    echo "   bash scripts/configure-frontend.sh $SERVICE_URL <CONSUMER_KEY> <CONSUMER_SECRET>"
    exit 0
fi

# Passo 4: Configurar frontend
echo -e "${GREEN}⚙️  Passo 4/4: Configurando frontend...${NC}"

read -p "Consumer Key (ck_...): " CONSUMER_KEY
read -p "Consumer Secret (cs_...): " CONSUMER_SECRET

if [ -z "$CONSUMER_KEY" ] || [ -z "$CONSUMER_SECRET" ]; then
    echo -e "${RED}❌ Credenciais não fornecidas${NC}"
    exit 1
fi

# Configurar .env
FRONTEND_ENV="frontend/.env"
if [ ! -f "$FRONTEND_ENV" ]; then
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example "$FRONTEND_ENV"
    else
        touch "$FRONTEND_ENV"
    fi
fi

# Atualizar ou adicionar variáveis
grep -v "REACT_APP_WOOCOMMERCE" "$FRONTEND_ENV" > "$FRONTEND_ENV.tmp" || true
cat >> "$FRONTEND_ENV.tmp" <<EOF
REACT_APP_WOOCOMMERCE_API_URL=$SERVICE_URL
REACT_APP_WOOCOMMERCE_CONSUMER_KEY=$CONSUMER_KEY
REACT_APP_WOOCOMMERCE_CONSUMER_SECRET=$CONSUMER_SECRET
EOF
mv "$FRONTEND_ENV.tmp" "$FRONTEND_ENV"

echo -e "${GREEN}✅ Frontend configurado!${NC}"
echo ""
echo "📋 Resumo:"
echo "   URL: $SERVICE_URL"
echo "   Consumer Key: ${CONSUMER_KEY:0:20}..."
echo "   Frontend .env: $FRONTEND_ENV"
echo ""
echo "✅ Setup completo! Agora você pode usar o WooCommerce no frontend."

