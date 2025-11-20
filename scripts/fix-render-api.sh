#!/bin/bash
# Script para corrigir problemas no Render usando a API

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔧 Correção via API do Render.com${NC}"
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
    read -p "Cole o token aqui (ou pressione Enter para pular): " API_KEY
    
    if [ -n "$API_KEY" ]; then
        export RENDER_API_KEY="$API_KEY"
        echo "export RENDER_API_KEY=\"$API_KEY\"" >> ~/.bashrc
        echo -e "${GREEN}✅ Token configurado${NC}"
    else
        echo -e "${RED}❌ Token necessário para usar a API${NC}"
        echo ""
        echo "Como alternativa, você pode:"
        echo "   1. Configurar manualmente no dashboard do Render"
        echo "   2. Executar: export RENDER_API_KEY='seu_token'"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Token de API configurado${NC}"
echo ""

# Informações do banco
DB_URL="postgresql://medusa:tOzJWZA6PRHPengOLrIGX55YMxNBWOL7@dpg-d4fk6n75r7bs73cq1a4g-a.oregon-postgres.render.com/medusa_0p60"

echo -e "${YELLOW}📋 Variáveis que serão verificadas/adicionadas:${NC}"
echo "   - DATABASE_URL"
echo "   - PORT=9000"
echo "   - JWT_SECRET"
echo "   - COOKIE_SECRET"
echo "   - NODE_ENV=production"
echo "   - NODE_OPTIONS=--max-old-space-size=2048"
echo ""

# Nota: A API do Render requer autenticação e conhecimento do service ID
# Como não temos acesso direto, vamos criar um script que gera comandos curl

echo -e "${YELLOW}📝 Gerando comandos para configurar variáveis...${NC}"
echo ""

cat > /tmp/render-set-env.sh << EOF
#!/bin/bash
# Comandos para configurar variáveis no Render via API
# Execute estes comandos após obter o SERVICE_ID

SERVICE_ID="seu-service-id-aqui"
API_KEY="$RENDER_API_KEY"

# Adicionar DATABASE_URL
curl -X PUT "https://api.render.com/v1/services/\$SERVICE_ID/env-vars/DATABASE_URL" \\
  -H "Authorization: Bearer \$API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"value": "$DB_URL"}'

# Adicionar PORT
curl -X PUT "https://api.render.com/v1/services/\$SERVICE_ID/env-vars/PORT" \\
  -H "Authorization: Bearer \$API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"value": "9000"}'

# Adicionar JWT_SECRET
curl -X PUT "https://api.render.com/v1/services/\$SERVICE_ID/env-vars/JWT_SECRET" \\
  -H "Authorization: Bearer \$API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"value": "BjDkFtmmnvHg0K27gMnhSA+X+4doi0M7GlOY9G+haqo="}'

# Adicionar COOKIE_SECRET
curl -X PUT "https://api.render.com/v1/services/\$SERVICE_ID/env-vars/COOKIE_SECRET" \\
  -H "Authorization: Bearer \$API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"value": "/x8ADNgnuElv3GzN3djgLSnVlt9GKGFLaOT9t4Xx57o="}'

# Adicionar NODE_ENV
curl -X PUT "https://api.render.com/v1/services/\$SERVICE_ID/env-vars/NODE_ENV" \\
  -H "Authorization: Bearer \$API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"value": "production"}'

# Adicionar NODE_OPTIONS
curl -X PUT "https://api.render.com/v1/services/\$SERVICE_ID/env-vars/NODE_OPTIONS" \\
  -H "Authorization: Bearer \$API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"value": "--max-old-space-size=2048"}'
EOF

chmod +x /tmp/render-set-env.sh

echo -e "${GREEN}✅ Script gerado em /tmp/render-set-env.sh${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "   A API do Render requer o SERVICE_ID do seu serviço."
echo "   A forma mais fácil é configurar manualmente no dashboard."
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Solução Mais Simples:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Acesse: https://dashboard.render.com"
echo "2. Vá no serviço 'medusa-backend'"
echo "3. Clique em 'Environment'"
echo "4. Adicione estas variáveis:"
echo ""
echo "   DATABASE_URL = $DB_URL"
echo "   PORT = 9000"
echo "   JWT_SECRET = BjDkFtmmnvHg0K27gMnhSA+X+4doi0M7GlOY9G+haqo="
echo "   COOKIE_SECRET = /x8ADNgnuElv3GzN3djgLSnVlt9GKGFLaOT9t4Xx57o="
echo "   NODE_ENV = production"
echo "   NODE_OPTIONS = --max-old-space-size=2048"
echo ""
echo "5. Clique em 'Save Changes'"
echo "6. Faça redeploy do serviço"
echo ""

