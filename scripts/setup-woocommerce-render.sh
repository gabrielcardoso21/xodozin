#!/bin/bash
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
RENDER_API_KEY="${RENDER_API_KEY:-rnd_uZd6hv7quW4fyZK1g1CgUcrDZpNI}"
RENDER_API_URL="https://api.render.com/v1"
SERVICE_NAME="woocommerce-store"
DB_NAME="woocommerce-db"
REPO_URL="${REPO_URL:-https://github.com/gabrielcardoso21/xodozin.git}"

echo -e "${GREEN}🚀 Setup Automatizado WooCommerce no Render${NC}"
echo ""

# Verificar se API key está configurada
if [ -z "$RENDER_API_KEY" ]; then
    echo -e "${RED}❌ ERRO: RENDER_API_KEY não configurada!${NC}"
    exit 1
fi

# Função para fazer requisições à API do Render
render_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            "$RENDER_API_URL$endpoint" \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data"
    else
        curl -s -X "$method" \
            "$RENDER_API_URL$endpoint" \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Accept: application/json"
    fi
}

# Verificar se serviço já existe
echo "🔍 Verificando se serviço já existe..."
EXISTING_SERVICE=$(render_api GET "/services?name=$SERVICE_NAME" | jq -r '.[] | select(.service.name == "'$SERVICE_NAME'") | .service.id' | head -1)

if [ -n "$EXISTING_SERVICE" ] && [ "$EXISTING_SERVICE" != "null" ]; then
    echo -e "${YELLOW}⚠️  Serviço '$SERVICE_NAME' já existe (ID: $EXISTING_SERVICE)${NC}"
    read -p "Deseja continuar e atualizar? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Cancelado."
        exit 0
    fi
    SERVICE_ID="$EXISTING_SERVICE"
else
    # Verificar se banco já existe
    echo "📦 Verificando banco de dados PostgreSQL..."
    EXISTING_DB=$(render_api GET "/databases?name=$DB_NAME" | jq -r '.[] | select(.database.name == "'$DB_NAME'") | .database.id' | head -1)
    
    if [ -n "$EXISTING_DB" ] && [ "$EXISTING_DB" != "null" ]; then
        echo -e "${GREEN}✅ Banco de dados já existe (ID: $EXISTING_DB)${NC}"
        DB_ID="$EXISTING_DB"
    else
        # Criar banco de dados
        echo "📦 Criando banco de dados PostgreSQL..."
        DB_DATA=$(cat <<EOF
{
  "name": "$DB_NAME",
  "database": {
    "name": "$DB_NAME",
    "user": "wordpress",
    "databaseName": "wordpress",
    "plan": "free"
  }
}
EOF
)
        
        DB_RESPONSE=$(render_api POST "/databases" "$DB_DATA")
        echo "Debug DB Response: $DB_RESPONSE" >&2
        
        # Tentar diferentes formatos de resposta
        DB_ID=$(echo "$DB_RESPONSE" | jq -r '.database.id // .id // empty' 2>/dev/null || echo "")
        
        if [ -z "$DB_ID" ] || [ "$DB_ID" == "null" ]; then
            # Tentar formato alternativo
            DB_ID=$(echo "$DB_RESPONSE" | jq -r '.[0].database.id // .[0].id // empty' 2>/dev/null || echo "")
        fi
    
    if [ -z "$DB_ID" ] || [ "$DB_ID" == "null" ]; then
        # Tentar buscar banco existente
        echo "⚠️  Erro ao criar banco, tentando buscar existente..."
        DB_ID=$(render_api GET "/databases?name=$DB_NAME" | jq -r '.[] | select(.database.name == "'$DB_NAME'") | .database.id' | head -1)
        if [ -z "$DB_ID" ] || [ "$DB_ID" == "null" ]; then
            echo -e "${RED}❌ ERRO: Não foi possível criar ou encontrar banco de dados${NC}"
            echo "Resposta: $DB_RESPONSE"
            exit 1
        fi
        echo -e "${GREEN}✅ Banco de dados encontrado (ID: $DB_ID)${NC}"
    else
        echo -e "${GREEN}✅ Banco de dados criado (ID: $DB_ID)${NC}"
    fi
    
    # Aguardar banco estar pronto
    echo "⏳ Aguardando banco de dados estar pronto..."
    sleep 10
    
    # Obter informações do banco
    DB_INFO=$(render_api GET "/databases/$DB_ID")
    DB_HOST=$(echo "$DB_INFO" | jq -r '.database.connectionString // .database.host // empty' | cut -d'@' -f2 | cut -d':' -f1)
    DB_USER=$(echo "$DB_INFO" | jq -r '.database.user // "wordpress"')
    DB_PASSWORD=$(echo "$DB_INFO" | jq -r '.database.password // empty')
    DB_DATABASE=$(echo "$DB_INFO" | jq -r '.database.databaseName // "wordpress"')
    
    # Criar serviço web
    echo "🌐 Criando serviço web..."
    SERVICE_DATA=$(cat <<EOF
{
  "type": "web_service",
  "name": "$SERVICE_NAME",
  "ownerId": "$(render_api GET /owners | jq -r '.[0].owner.id')",
  "repo": "$REPO_URL",
  "branch": "main",
  "rootDir": "woocommerce",
  "env": "docker",
  "dockerfilePath": "./Dockerfile",
  "dockerContext": ".",
  "plan": "free",
  "healthCheckPath": "/wp-admin/install.php",
  "envVars": [
    {
      "key": "WORDPRESS_DB_HOST",
      "value": "$DB_HOST"
    },
    {
      "key": "WORDPRESS_DB_USER",
      "value": "$DB_USER"
    },
    {
      "key": "WORDPRESS_DB_PASSWORD",
      "value": "$DB_PASSWORD"
    },
    {
      "key": "WORDPRESS_DB_NAME",
      "value": "$DB_DATABASE"
    },
    {
      "key": "WORDPRESS_TABLE_PREFIX",
      "value": "wp_"
    },
    {
      "key": "WORDPRESS_DEBUG",
      "value": "0"
    },
    {
      "key": "WP_ADMIN_USER",
      "value": "admin"
    },
    {
      "key": "WP_ADMIN_EMAIL",
      "value": "admin@xodozin.com"
    },
    {
      "key": "WP_TITLE",
      "value": "Xodózin Store"
    }
  ]
}
EOF
)
    
    SERVICE_RESPONSE=$(render_api POST "/services" "$SERVICE_DATA")
    SERVICE_ID=$(echo "$SERVICE_RESPONSE" | jq -r '.service.id // empty')
    
    if [ -z "$SERVICE_ID" ] || [ "$SERVICE_ID" == "null" ]; then
        echo -e "${RED}❌ ERRO: Não foi possível criar serviço${NC}"
        echo "Resposta: $SERVICE_RESPONSE"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Serviço criado (ID: $SERVICE_ID)${NC}"
    fi
fi

# Aguardar deploy completar
echo "⏳ Aguardando deploy completar..."
MAX_WAIT=300  # 5 minutos
ELAPSED=0

while [ $ELAPSED -lt $MAX_WAIT ]; do
    DEPLOY_STATUS=$(render_api GET "/services/$SERVICE_ID/deploys?limit=1" | jq -r '.[0].deploy.status // "unknown"')
    
    if [ "$DEPLOY_STATUS" == "live" ] || [ "$DEPLOY_STATUS" == "update_succeeded" ]; then
        echo -e "${GREEN}✅ Deploy concluído!${NC}"
        break
    elif [ "$DEPLOY_STATUS" == "update_failed" ] || [ "$DEPLOY_STATUS" == "build_failed" ]; then
        echo -e "${RED}❌ Deploy falhou!${NC}"
        echo "Verifique os logs no dashboard do Render"
        exit 1
    fi
    
    echo "   Status: $DEPLOY_STATUS (aguardando...)"
    sleep 10
    ELAPSED=$((ELAPSED + 10))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo -e "${YELLOW}⚠️  Timeout aguardando deploy. Verifique manualmente.${NC}"
fi

# Obter URL do serviço
SERVICE_INFO=$(render_api GET "/services/$SERVICE_ID")
SERVICE_URL=$(echo "$SERVICE_INFO" | jq -r '.service.serviceDetails.url // .service.url // empty')

if [ -z "$SERVICE_URL" ] || [ "$SERVICE_URL" == "null" ]; then
    echo -e "${YELLOW}⚠️  URL do serviço não disponível ainda.${NC}"
    SERVICE_URL="https://$SERVICE_NAME.onrender.com"
fi

echo ""
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "📋 Informações do Serviço:"
echo "   URL: $SERVICE_URL"
echo "   Admin: $SERVICE_URL/wp-admin"
echo "   Service ID: $SERVICE_ID"
echo ""
echo "🔑 Credenciais padrão:"
echo "   Usuário: admin"
echo "   Senha: (gerada automaticamente - verifique logs do container)"
echo ""
echo "📝 Próximos passos:"
echo "   1. Acesse $SERVICE_URL/wp-admin"
echo "   2. Faça login com as credenciais"
echo "   3. Vá em WooCommerce > Configurações > Avançado > REST API"
echo "   4. Crie uma nova chave de API"
echo "   5. Configure o frontend com a URL e credenciais"
echo ""
echo "💡 Para automatizar criação de API keys, execute:"
echo "   bash scripts/generate-woocommerce-api-keys.sh $SERVICE_URL"

