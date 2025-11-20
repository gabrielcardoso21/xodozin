#!/bin/bash
# Script para diagnosticar problemas no Render

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 Diagnóstico do Render.com${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar se Render CLI está instalado
echo -e "${YELLOW}1. Verificando Render CLI...${NC}"
if command -v render &> /dev/null; then
    echo -e "${GREEN}✅ Render CLI encontrado${NC}"
    RENDER_CLI_AVAILABLE=true
else
    echo -e "${RED}❌ Render CLI não encontrado${NC}"
    echo "   Para instalar: npm install -g render-cli"
    RENDER_CLI_AVAILABLE=false
fi
echo ""

# Verificar variáveis de ambiente locais
echo -e "${YELLOW}2. Verificando configuração local...${NC}"
if [ -f "xodozin/render.yaml" ]; then
    echo -e "${GREEN}✅ render.yaml encontrado${NC}"
    
    # Verificar se DATABASE_URL está configurada
    if grep -q "DATABASE_URL" xodozin/render.yaml; then
        echo -e "${GREEN}✅ DATABASE_URL configurada no render.yaml${NC}"
    else
        echo -e "${YELLOW}⚠️  DATABASE_URL não encontrada no render.yaml${NC}"
    fi
    
    # Verificar se PORT está configurada
    if grep -q "PORT" xodozin/render.yaml; then
        echo -e "${GREEN}✅ PORT configurada no render.yaml${NC}"
    else
        echo -e "${YELLOW}⚠️  PORT não encontrada no render.yaml${NC}"
    fi
else
    echo -e "${RED}❌ render.yaml não encontrado${NC}"
fi
echo ""

# Verificar medusa-config
echo -e "${YELLOW}3. Verificando medusa-config...${NC}"
if [ -f "xodozin/medusa-config.js" ]; then
    echo -e "${GREEN}✅ medusa-config.js encontrado${NC}"
    
    # Verificar se porta está configurada
    if grep -q "port:" xodozin/medusa-config.js || grep -q "PORT" xodozin/medusa-config.js; then
        echo -e "${GREEN}✅ Porta configurada no medusa-config.js${NC}"
    else
        echo -e "${YELLOW}⚠️  Porta não encontrada no medusa-config.js${NC}"
    fi
else
    echo -e "${RED}❌ medusa-config.js não encontrado${NC}"
fi
echo ""

# Verificar se há conexão com o banco (se DATABASE_URL estiver configurada localmente)
echo -e "${YELLOW}4. Verificando conexão com banco de dados...${NC}"
if [ -n "$DATABASE_URL" ]; then
    echo -e "${GREEN}✅ DATABASE_URL encontrada no ambiente local${NC}"
    echo "   Tentando conectar..."
    
    # Extrair informações da connection string
    if echo "$DATABASE_URL" | grep -q "postgresql://"; then
        DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
        DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
        
        echo "   Host: $DB_HOST"
        echo "   Database: $DB_NAME"
        
        # Tentar conectar (se psql estiver disponível)
        if command -v psql &> /dev/null; then
            if timeout 5 psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
                echo -e "${GREEN}✅ Conexão com banco bem-sucedida${NC}"
            else
                echo -e "${RED}❌ Falha ao conectar ao banco${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  psql não disponível para testar conexão${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  DATABASE_URL não configurada localmente${NC}"
    echo "   Isso é normal - a variável deve estar no Render"
fi
echo ""

# Resumo e recomendações
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Resumo e Recomendações${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$RENDER_CLI_AVAILABLE" = true ]; then
    echo -e "${GREEN}✅ Render CLI disponível${NC}"
    echo "   Você pode usar: render services:list"
    echo "   Para ver serviços: render services:list"
    echo "   Para ver logs: render logs <service-id>"
else
    echo -e "${YELLOW}⚠️  Render CLI não disponível${NC}"
    echo "   Para diagnóstico completo, instale: npm install -g render-cli"
    echo "   Depois faça login: render login"
fi

echo ""
echo -e "${YELLOW}🔧 Próximos Passos:${NC}"
echo "   1. Verificar no dashboard do Render se o banco está 'linked' ao serviço"
echo "   2. Verificar se DATABASE_URL está presente nas variáveis de ambiente"
echo "   3. Verificar se PORT=9000 está configurada"
echo "   4. Fazer redeploy após corrigir configurações"
echo ""

