#!/bin/bash

# Script para verificar se o deploy está funcionando
# Execute: bash scripts/verify-deploy.sh <URL_DO_RAILWAY>

set -e

RAILWAY_URL=$1

if [ -z "$RAILWAY_URL" ]; then
  echo "❌ Erro: Forneça a URL do Railway"
  echo "Uso: bash scripts/verify-deploy.sh https://seu-app.railway.app"
  exit 1
fi

echo "🔍 Verificando deploy em: $RAILWAY_URL"
echo ""

# Verificar health check
echo "1. Verificando health check..."
HEALTH_RESPONSE=$(curl -s "$RAILWAY_URL/health" || echo "ERROR")
if [[ "$HEALTH_RESPONSE" == *"ok"* ]] || [[ "$HEALTH_RESPONSE" == *"status"* ]]; then
  echo "✅ Health check OK: $HEALTH_RESPONSE"
else
  echo "❌ Health check falhou: $HEALTH_RESPONSE"
fi
echo ""

# Verificar Admin Panel
echo "2. Verificando Admin Panel..."
ADMIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL/app" || echo "000")
if [ "$ADMIN_RESPONSE" == "200" ] || [ "$ADMIN_RESPONSE" == "302" ]; then
  echo "✅ Admin Panel acessível (HTTP $ADMIN_RESPONSE)"
else
  echo "⚠️ Admin Panel retornou HTTP $ADMIN_RESPONSE"
fi
echo ""

# Verificar Store API
echo "3. Verificando Store API..."
STORE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL/store" || echo "000")
if [ "$STORE_RESPONSE" == "200" ] || [ "$STORE_RESPONSE" == "404" ]; then
  echo "✅ Store API acessível (HTTP $STORE_RESPONSE)"
else
  echo "⚠️ Store API retornou HTTP $STORE_RESPONSE"
fi
echo ""

echo "📝 URLs importantes:"
echo "  - Health: $RAILWAY_URL/health"
echo "  - Admin Panel: $RAILWAY_URL/app"
echo "  - Store API: $RAILWAY_URL/store"
echo "  - Admin API: $RAILWAY_URL/admin"

