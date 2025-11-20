#!/bin/bash
# Script para analisar erro do deploy que falhou no Render

API_KEY="${RENDER_API_KEY:-rnd_uZd6hv7quW4fyZK1g1CgUcrDZpNI}"
SERVICE_ID="${1:-srv-d4fk6775r7bs73cq115g}"

echo "🔍 Analisando deploy que falhou..."
echo ""

# Obter último deploy que falhou
DEPLOY_INFO=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/deploys?limit=5" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Accept: application/json")

FAILED_DEPLOY=$(echo "$DEPLOY_INFO" | jq -r '.[] | select(.deploy.status == "update_failed") | .deploy.id' | head -1)

if [ -z "$FAILED_DEPLOY" ] || [ "$FAILED_DEPLOY" = "null" ]; then
    echo "❌ Nenhum deploy falhado encontrado"
    exit 1
fi

echo "Deploy ID que falhou: $FAILED_DEPLOY"
echo ""

# Obter informações do deploy
DEPLOY_DETAILS=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/deploys/$FAILED_DEPLOY" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Accept: application/json")

echo "Informações do deploy:"
echo "$DEPLOY_DETAILS" | jq -r '.deploy | "Status: \(.status)\nCommit: \(.commit.id[0:7])\nMensagem: \(.commit.message)\nIniciado: \(.startedAt)\nFinalizado: \(.finishedAt)"'
echo ""

# Verificar variáveis de ambiente
echo "📋 Verificando variáveis de ambiente..."
ENV_VARS=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Accept: application/json")

CRITICAL_VARS=("DATABASE_URL" "PORT" "JWT_SECRET" "COOKIE_SECRET" "NODE_ENV" "NODE_OPTIONS")
MISSING_VARS=()

for VAR in "${CRITICAL_VARS[@]}"; do
    if echo "$ENV_VARS" | jq -e ".[].envVar | select(.key == \"$VAR\")" &> /dev/null; then
        VALUE=$(echo "$ENV_VARS" | jq -r ".[].envVar | select(.key == \"$VAR\") | .value")
        if [ "$VAR" = "DATABASE_URL" ]; then
            echo "✅ $VAR: ${VALUE:0:60}..."
        else
            echo "✅ $VAR: $VALUE"
        fi
    else
        echo "❌ $VAR: NÃO CONFIGURADA"
        MISSING_VARS+=("$VAR")
    fi
done

echo ""
if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Variáveis faltando: ${MISSING_VARS[*]}"
else
    echo "✅ Todas as variáveis críticas estão configuradas"
fi

echo ""
echo "📝 Próximos passos:"
echo "1. Verificar logs no dashboard: https://dashboard.render.com/web/$SERVICE_ID"
echo "2. Identificar erro específico nos logs"
echo "3. Aplicar correção baseada no erro"
echo "4. Fazer novo deploy"

