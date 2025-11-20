#!/bin/bash
# Script para corrigir automaticamente problemas no Render usando API

set -e

API_KEY="${RENDER_API_KEY:-rnd_uZd6hv7quW4fyZK1g1CgUcrDZpNI}"
DB_URL="postgresql://medusa:tOzJWZA6PRHPengOLrIGX55YMxNBWOL7@dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com/medusa_0p60"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔧 Correção Automática do Render.com${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Listar serviços
echo -e "${YELLOW}1. Listando serviços...${NC}"
SERVICES=$(curl -s -X GET "https://api.render.com/v1/services" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Accept: application/json")

if echo "$SERVICES" | grep -q "unauthorized\|Unauthorized"; then
    echo -e "${RED}❌ Erro de autenticação. Verifique o API_KEY${NC}"
    exit 1
fi

# Encontrar serviço medusa-backend
SERVICE_ID=$(echo "$SERVICES" | jq -r '.[].service | select(.name == "medusa-backend") | .id' | head -1)

if [ -z "$SERVICE_ID" ]; then
    echo -e "${YELLOW}⚠️  Serviço medusa-backend não encontrado${NC}"
    echo "   Serviços disponíveis:"
    echo "$SERVICES" | jq -r '.[].service | "  - \(.name) (\(.id))"' | head -10
    echo ""
    read -p "Digite o SERVICE_ID do serviço medusa-backend: " SERVICE_ID
fi

if [ -z "$SERVICE_ID" ]; then
    echo -e "${RED}❌ SERVICE_ID necessário${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Serviço encontrado: $SERVICE_ID${NC}"
echo ""

# Verificar variáveis de ambiente
echo -e "${YELLOW}2. Verificando variáveis de ambiente...${NC}"
ENV_VARS=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Accept: application/json")

# Função para adicionar/atualizar variável
add_env_var() {
    local KEY=$1
    local VALUE=$2
    
    echo -e "${YELLOW}   Adicionando $KEY...${NC}"
    
    RESPONSE=$(curl -s -X PUT "https://api.render.com/v1/services/$SERVICE_ID/env-vars/$KEY" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"value\": \"$VALUE\"}")
    
    if echo "$RESPONSE" | grep -q "error\|Error"; then
        echo -e "${RED}   ❌ Erro ao adicionar $KEY${NC}"
        echo "   Resposta: $RESPONSE"
        return 1
    else
        echo -e "${GREEN}   ✅ $KEY adicionada${NC}"
        return 0
    fi
}

# Verificar e adicionar variáveis
VARS_TO_ADD=()

# DATABASE_URL
if echo "$ENV_VARS" | jq -e ".[] | select(.key == \"DATABASE_URL\")" &> /dev/null; then
    CURRENT_DB=$(echo "$ENV_VARS" | jq -r '.[] | select(.key == "DATABASE_URL") | .value')
    if [ "$CURRENT_DB" != "$DB_URL" ]; then
        echo -e "${YELLOW}   ⚠️  DATABASE_URL existe mas está diferente${NC}"
        echo "   Atual: ${CURRENT_DB:0:50}..."
        VARS_TO_ADD+=("DATABASE_URL|$DB_URL")
    else
        echo -e "${GREEN}   ✅ DATABASE_URL já configurada corretamente${NC}"
    fi
else
    echo -e "${RED}   ❌ DATABASE_URL não encontrada${NC}"
    VARS_TO_ADD+=("DATABASE_URL|$DB_URL")
fi

# PORT
if echo "$ENV_VARS" | jq -e ".[] | select(.key == \"PORT\")" &> /dev/null; then
    CURRENT_PORT=$(echo "$ENV_VARS" | jq -r '.[] | select(.key == "PORT") | .value')
    if [ "$CURRENT_PORT" != "9000" ]; then
        echo -e "${YELLOW}   ⚠️  PORT existe mas está diferente: $CURRENT_PORT${NC}"
        VARS_TO_ADD+=("PORT|9000")
    else
        echo -e "${GREEN}   ✅ PORT já configurada corretamente${NC}"
    fi
else
    echo -e "${RED}   ❌ PORT não encontrada${NC}"
    VARS_TO_ADD+=("PORT|9000")
fi

# Outras variáveis
check_and_add() {
    local KEY=$1
    local VALUE=$2
    
    if echo "$ENV_VARS" | jq -e ".[] | select(.key == \"$KEY\")" &> /dev/null; then
        echo -e "${GREEN}   ✅ $KEY já configurada${NC}"
    else
        echo -e "${YELLOW}   ⚠️  $KEY não encontrada${NC}"
        VARS_TO_ADD+=("$KEY|$VALUE")
    fi
}

check_and_add "JWT_SECRET" "BjDkFtmmnvHg0K27gMnhSA+X+4doi0M7GlOY9G+haqo="
check_and_add "COOKIE_SECRET" "/x8ADNgnuElv3GzN3djgLSnVlt9GKGFLaOT9t4Xx57o="
check_and_add "NODE_ENV" "production"
check_and_add "NODE_OPTIONS" "--max-old-space-size=2048"

echo ""

# Adicionar variáveis que faltam
if [ ${#VARS_TO_ADD[@]} -gt 0 ]; then
    echo -e "${YELLOW}3. Adicionando variáveis faltantes...${NC}"
    for VAR_PAIR in "${VARS_TO_ADD[@]}"; do
        KEY=$(echo "$VAR_PAIR" | cut -d'|' -f1)
        VALUE=$(echo "$VAR_PAIR" | cut -d'|' -f2)
        add_env_var "$KEY" "$VALUE"
    done
else
    echo -e "${GREEN}✅ Todas as variáveis já estão configuradas!${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Correção concluída!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "   1. Fazer redeploy do serviço no Render"
echo "   2. Monitorar logs para verificar se funcionou"
echo ""
echo "   Para fazer deploy via API:"
echo "   curl -X POST \"https://api.render.com/v1/services/$SERVICE_ID/deploys\" \\"
echo "     -H \"Authorization: Bearer $API_KEY\""
echo ""

