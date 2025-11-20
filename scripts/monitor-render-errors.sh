#!/bin/bash
# Script para monitorar deploy do Render e identificar erros

API_KEY="${RENDER_API_KEY:-rnd_uZd6hv7quW4fyZK1g1CgUcrDZpNI}"
SERVICE_ID="${1:-srv-d4fk6775r7bs73cq115g}"
SERVICE_URL="https://medusa-backend-wdvb.onrender.com"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 Monitorando Deploy do Render${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

PREVIOUS_STATUS=""
ERROR_COUNT=0

while true; do
    # Obter status do deploy
    DEPLOY_INFO=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/deploys?limit=1" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Accept: application/json")
    
    DEPLOY_STATUS=$(echo "$DEPLOY_INFO" | jq -r '.[0].deploy.status // "unknown"')
    DEPLOY_FINISHED=$(echo "$DEPLOY_INFO" | jq -r '.[0].deploy.finishedAt // "N/A"')
    DEPLOY_COMMIT=$(echo "$DEPLOY_INFO" | jq -r '.[0].deploy.commit.id[0:7] // "N/A"')
    
    TIMESTAMP=$(date +"%H:%M:%S")
    
    # Só mostrar se o status mudou
    if [ "$DEPLOY_STATUS" != "$PREVIOUS_STATUS" ]; then
        case "$DEPLOY_STATUS" in
            "live"|"update_succeeded")
                echo -e "${GREEN}[$TIMESTAMP] ✅ Deploy bem-sucedido!${NC}"
                echo "   Status: $DEPLOY_STATUS"
                echo "   Commit: $DEPLOY_COMMIT"
                echo "   Finalizado: $DEPLOY_FINISHED"
                echo ""
                echo -e "${BLUE}Testando serviço...${NC}"
                
                # Testar health check
                for i in {1..5}; do
                    sleep 5
                    HEALTH=$(curl -s -w "\n%{http_code}" --max-time 10 "$SERVICE_URL/health" 2>&1)
                    HTTP_CODE=$(echo "$HEALTH" | tail -1)
                    if [ "$HTTP_CODE" = "200" ]; then
                        echo -e "${GREEN}✅ Serviço está respondendo!${NC}"
                        echo "   URL: $SERVICE_URL"
                        echo "   Health: $SERVICE_URL/health"
                        echo "   Admin: $SERVICE_URL/app"
                        break
                    else
                        echo -e "${YELLOW}⏳ Tentativa $i/5: HTTP $HTTP_CODE${NC}"
                    fi
                done
                break
                ;;
            "update_failed")
                echo -e "${RED}[$TIMESTAMP] ❌ Deploy falhou!${NC}"
                echo "   Status: $DEPLOY_STATUS"
                echo "   Commit: $DEPLOY_COMMIT"
                echo "   Finalizado: $DEPLOY_FINISHED"
                echo ""
                echo -e "${RED}⚠️  Verifique os logs no dashboard:${NC}"
                echo "   https://dashboard.render.com/web/$SERVICE_ID"
                echo ""
                echo -e "${YELLOW}Erros comuns e soluções:${NC}"
                echo "   1. 'Cannot find module' → Verificar se arquivo existe"
                echo "   2. 'No open ports' → Verificar se PORT está configurada"
                echo "   3. 'Pg connection failed' → Verificar DATABASE_URL"
                echo "   4. 'Build failed' → Verificar buildCommand"
                break
                ;;
            "update_in_progress"|"queued"|"build_in_progress")
                echo -e "${YELLOW}[$TIMESTAMP] ⏳ Deploy em andamento...${NC}"
                echo "   Status: $DEPLOY_STATUS"
                echo "   Commit: $DEPLOY_COMMIT"
                ;;
            *)
                echo -e "${YELLOW}[$TIMESTAMP] ⚠️  Status: $DEPLOY_STATUS${NC}"
                ;;
        esac
        PREVIOUS_STATUS="$DEPLOY_STATUS"
    else
        # Mostrar um ponto a cada 30 segundos
        echo -n "."
    fi
    
    # Verificar variáveis críticas periodicamente
    if [ $((ERROR_COUNT % 20)) -eq 0 ]; then
        echo ""
        echo -e "${BLUE}Verificando variáveis de ambiente...${NC}"
        ENV_VARS=$(curl -s -X GET "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
            -H "Authorization: Bearer $API_KEY" \
            -H "Accept: application/json")
        
        CRITICAL_VARS=("DATABASE_URL" "PORT" "JWT_SECRET" "COOKIE_SECRET")
        MISSING_VARS=()
        
        for VAR in "${CRITICAL_VARS[@]}"; do
            if ! echo "$ENV_VARS" | jq -e ".[].envVar | select(.key == \"$VAR\")" &> /dev/null; then
                MISSING_VARS+=("$VAR")
            fi
        done
        
        if [ ${#MISSING_VARS[@]} -eq 0 ]; then
            echo -e "${GREEN}✅ Todas as variáveis críticas estão configuradas${NC}"
        else
            echo -e "${RED}❌ Variáveis faltando: ${MISSING_VARS[*]}${NC}"
        fi
        echo ""
    fi
    
    ERROR_COUNT=$((ERROR_COUNT + 1))
    sleep 10
done

