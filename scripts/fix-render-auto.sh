#!/bin/bash
# Script para corrigir automaticamente problemas no Render

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔧 Correção Automática do Render.com${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar se Render CLI está instalado
if ! command -v render &> /dev/null; then
    echo -e "${RED}❌ Render CLI não encontrado${NC}"
    echo "   Instalando..."
    echo 'Dcd0af7854#' | sudo -S npm install -g render-cli 2>&1 || {
        echo -e "${RED}❌ Falha ao instalar Render CLI${NC}"
        exit 1
    }
fi

echo -e "${GREEN}✅ Render CLI instalado${NC}"
echo ""

# Verificar se está logado
echo -e "${YELLOW}Verificando autenticação...${NC}"
if render whoami &> /dev/null; then
    echo -e "${GREEN}✅ Autenticado no Render${NC}"
    render whoami
else
    echo -e "${YELLOW}⚠️  Não autenticado${NC}"
    echo "   Para autenticar, execute: render login"
    echo "   Ou forneça o token de API: export RENDER_API_KEY=seu_token"
    exit 1
fi
echo ""

# Listar serviços
echo -e "${YELLOW}Listando serviços...${NC}"
SERVICES=$(render services:list --format json 2>/dev/null || echo "[]")
if [ "$SERVICES" != "[]" ]; then
    echo -e "${GREEN}✅ Serviços encontrados${NC}"
    echo "$SERVICES" | jq -r '.[] | "\(.name) - \(.id)"' 2>/dev/null || echo "$SERVICES"
else
    echo -e "${YELLOW}⚠️  Nenhum serviço encontrado ou erro ao listar${NC}"
fi
echo ""

# Procurar serviço medusa-backend
echo -e "${YELLOW}Procurando serviço medusa-backend...${NC}"
SERVICE_ID=$(echo "$SERVICES" | jq -r '.[] | select(.name == "medusa-backend") | .id' 2>/dev/null || echo "")

if [ -z "$SERVICE_ID" ]; then
    echo -e "${RED}❌ Serviço medusa-backend não encontrado${NC}"
    echo "   Serviços disponíveis:"
    echo "$SERVICES" | jq -r '.[] | "  - \(.name)"' 2>/dev/null || echo "   (erro ao listar)"
    exit 1
fi

echo -e "${GREEN}✅ Serviço encontrado: $SERVICE_ID${NC}"
echo ""

# Verificar variáveis de ambiente
echo -e "${YELLOW}Verificando variáveis de ambiente...${NC}"
ENV_VARS=$(render env:list "$SERVICE_ID" --format json 2>/dev/null || echo "[]")

# Verificar DATABASE_URL
if echo "$ENV_VARS" | jq -e '.[] | select(.key == "DATABASE_URL")' &> /dev/null; then
    echo -e "${GREEN}✅ DATABASE_URL configurada${NC}"
    DB_URL=$(echo "$ENV_VARS" | jq -r '.[] | select(.key == "DATABASE_URL") | .value')
    echo "   Valor: ${DB_URL:0:50}..."
else
    echo -e "${RED}❌ DATABASE_URL não encontrada${NC}"
    echo "   Adicionando DATABASE_URL..."
    
    # Connection string do banco criado
    DB_URL="postgresql://medusa:tOzJWZA6PRHPengOLrIGX55YMxNBWOL7@dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com/medusa_0p60"
    
    if render env:set "$SERVICE_ID" DATABASE_URL="$DB_URL" 2>&1; then
        echo -e "${GREEN}✅ DATABASE_URL adicionada${NC}"
    else
        echo -e "${RED}❌ Falha ao adicionar DATABASE_URL${NC}"
    fi
fi

# Verificar PORT
if echo "$ENV_VARS" | jq -e '.[] | select(.key == "PORT")' &> /dev/null; then
    echo -e "${GREEN}✅ PORT configurada${NC}"
else
    echo -e "${YELLOW}⚠️  PORT não encontrada${NC}"
    echo "   Adicionando PORT=9000..."
    
    if render env:set "$SERVICE_ID" PORT="9000" 2>&1; then
        echo -e "${GREEN}✅ PORT adicionada${NC}"
    else
        echo -e "${YELLOW}⚠️  Falha ao adicionar PORT (pode não ser crítico)${NC}"
    fi
fi

# Verificar outras variáveis essenciais
REQUIRED_VARS=("JWT_SECRET" "COOKIE_SECRET" "NODE_ENV" "NODE_OPTIONS")

for VAR in "${REQUIRED_VARS[@]}"; do
    if echo "$ENV_VARS" | jq -e ".[] | select(.key == \"$VAR\")" &> /dev/null; then
        echo -e "${GREEN}✅ $VAR configurada${NC}"
    else
        echo -e "${YELLOW}⚠️  $VAR não encontrada${NC}"
        
        case "$VAR" in
            "JWT_SECRET")
                VALUE="BjDkFtmmnvHg0K27gMnhSA+X+4doi0M7GlOY9G+haqo="
                ;;
            "COOKIE_SECRET")
                VALUE="/x8ADNgnuElv3GzN3djgLSnVlt9GKGFLaOT9t4Xx57o="
                ;;
            "NODE_ENV")
                VALUE="production"
                ;;
            "NODE_OPTIONS")
                VALUE="--max-old-space-size=2048"
                ;;
        esac
        
        if render env:set "$SERVICE_ID" "$VAR=$VALUE" 2>&1; then
            echo -e "${GREEN}✅ $VAR adicionada${NC}"
        else
            echo -e "${YELLOW}⚠️  Falha ao adicionar $VAR${NC}"
        fi
    fi
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Correção concluída!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "   1. Fazer redeploy do serviço no Render"
echo "   2. Verificar logs após o deploy"
echo ""
echo "   Para fazer deploy: render services:deploy $SERVICE_ID"
echo "   Para ver logs: render logs $SERVICE_ID"

