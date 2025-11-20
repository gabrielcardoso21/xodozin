#!/bin/bash
# Script para automatizar setup no Render.com
# Este script prepara tudo e fornece instruções claras

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Setup Automatizado para Render.com${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "xodozin/render.yaml" ]; then
    echo -e "${RED}❌ Erro: render.yaml não encontrado em xodozin/${NC}"
    echo "   Execute este script da raiz do projeto"
    exit 1
fi

echo -e "${GREEN}✅ Arquivos de configuração encontrados${NC}"
echo ""

# Verificar se render.yaml está correto
echo "🔍 Verificando configuração do render.yaml..."
if grep -q "build:skip-if-exists" xodozin/render.yaml; then
    echo -e "${GREEN}✅ render.yaml configurado corretamente${NC}"
else
    echo -e "${YELLOW}⚠️  render.yaml pode precisar de atualização${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Passos para Configurar no Render${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}1. Criar conta no Render${NC}"
echo "   Acesse: https://render.com"
echo "   Clique em 'Get Started for Free'"
echo "   Faça login com GitHub (recomendado)"
echo ""

echo -e "${YELLOW}2. Conectar Repositório${NC}"
echo "   No dashboard do Render:"
echo "   - Clique em 'New +' → 'Blueprint'"
echo "   - OU clique em 'New +' → 'Web Service'"
echo "   - Selecione 'Connect GitHub'"
echo "   - Autorize o Render a acessar seus repositórios"
echo "   - Selecione o repositório: $(git remote get-url origin 2>/dev/null | sed 's/.*\///' | sed 's/\.git$//' || echo 'seu-repositorio')"
echo ""

echo -e "${YELLOW}3. Configurar Blueprint (Recomendado - Mais Fácil)${NC}"
echo "   Se escolheu Blueprint:"
echo "   - O Render detectará automaticamente o render.yaml"
echo "   - Clique em 'Apply'"
echo "   - O Render criará todos os serviços automaticamente"
echo ""

echo -e "${YELLOW}4. OU Configurar Web Service Manualmente${NC}"
echo "   Se escolheu Web Service:"
echo "   - Name: medusa-backend"
echo "   - Environment: Node"
echo "   - Build Command: yarn install && yarn build:skip-if-exists"
echo "   - Start Command: bash scripts/ensure-admin-accessible.sh && bash scripts/verify-admin-before-start.sh && yarn start:skip-build"
echo "   - Root Directory: xodozin"
echo ""

echo -e "${YELLOW}5. Criar Banco de Dados PostgreSQL${NC}"
echo "   No dashboard do Render:"
echo "   - Clique em 'New +' → 'PostgreSQL'"
echo "   - Name: medusa-postgres"
echo "   - Database: medusa"
echo "   - User: medusa"
echo "   - Plano: Free (se disponível) ou Starter"
echo ""

echo -e "${YELLOW}6. Criar Redis (Opcional mas Recomendado)${NC}"
echo "   No dashboard do Render:"
echo "   - Clique em 'New +' → 'Redis'"
echo "   - Name: medusa-redis"
echo "   - Plano: Free (se disponível) ou Starter"
echo ""

echo -e "${YELLOW}7. Configurar Variáveis de Ambiente${NC}"
echo "   No serviço Web Service, vá em 'Environment':"
echo "   - DATABASE_URL: (será preenchido automaticamente se conectou o PostgreSQL)"
echo "   - REDIS_URL: (será preenchido automaticamente se conectou o Redis)"
echo "   - JWT_SECRET: (clique em 'Generate' ou use: openssl rand -base64 32)"
echo "   - COOKIE_SECRET: (clique em 'Generate' ou use: openssl rand -base64 32)"
echo "   - NODE_ENV: production"
echo "   - NODE_OPTIONS: --max-old-space-size=2048"
echo "   - STORE_CORS: https://seu-dominio.onrender.com (ajuste depois)"
echo "   - ADMIN_CORS: https://seu-dominio.onrender.com (ajuste depois)"
echo ""

echo -e "${YELLOW}8. Conectar Banco de Dados ao Serviço${NC}"
echo "   No serviço Web Service:"
echo "   - Vá em 'Environment'"
echo "   - Clique em 'Link Resource'"
echo "   - Selecione 'medusa-postgres'"
echo "   - A variável DATABASE_URL será criada automaticamente"
echo ""

echo -e "${YELLOW}9. Conectar Redis ao Serviço${NC}"
echo "   No serviço Web Service:"
echo "   - Vá em 'Environment'"
echo "   - Clique em 'Link Resource'"
echo "   - Selecione 'medusa-redis'"
echo "   - A variável REDIS_URL será criada automaticamente"
echo ""

echo -e "${YELLOW}10. Fazer Deploy${NC}"
echo "   - Clique em 'Manual Deploy' → 'Deploy latest commit'"
echo "   - OU faça push para a branch main (se Auto-Deploy estiver ativado)"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Script de Setup Concluído!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Gerar valores para JWT_SECRET e COOKIE_SECRET
echo -e "${YELLOW}🔑 Valores Gerados para Variáveis de Ambiente:${NC}"
echo ""
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "GERE_UM_VALOR_ALEATORIO_AQUI")
COOKIE_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "GERE_UM_VALOR_ALEATORIO_AQUI")

echo "   JWT_SECRET: $JWT_SECRET"
echo "   COOKIE_SECRET: $COOKIE_SECRET"
echo ""
echo "   (Copie esses valores para usar no Render)"
echo ""

# Verificar se há um arquivo .env ou similar para referência
if [ -f "xodozin/.env.example" ] || [ -f "xodozin/.env" ]; then
    echo -e "${YELLOW}📝 Nota: Verifique também outras variáveis em .env.example${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔗 Links Úteis${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "   Render Dashboard: https://dashboard.render.com"
echo "   Documentação Render: https://render.com/docs"
echo "   Status do Render: https://status.render.com"
echo ""

