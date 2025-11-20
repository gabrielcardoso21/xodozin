#!/bin/bash

# Script de deploy usando tokens do arquivo .secrets
# Uso: bash scripts/deploy-com-tokens.sh

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 Deploy Automático com Tokens${NC}"
echo ""

# Verificar se .secrets existe
if [ ! -f ".secrets" ]; then
    echo -e "${RED}❌ Arquivo .secrets não encontrado!${NC}"
    echo -e "${YELLOW}   Crie o arquivo .secrets com os tokens:${NC}"
    echo "   RAILWAY_TOKEN=seu_token"
    echo "   VERCEL_TOKEN=seu_token"
    echo "   GITHUB_TOKEN=seu_token"
    exit 1
fi

# Carregar secrets
echo -e "${BLUE}📋 Carregando tokens do arquivo .secrets...${NC}"
source .secrets

# Verificar se tokens estão definidos
if [ -z "$RAILWAY_TOKEN" ] || [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ Tokens não encontrados no arquivo .secrets!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Tokens carregados${NC}"
echo ""

# Obter repositório GitHub (se não fornecido)
if [ -z "$GITHUB_REPO" ]; then
    # Tentar obter do git remoto
    GITHUB_REPO=$(git remote get-url origin 2>/dev/null | sed -E 's/.*github.com[:/]([^/]+\/[^/]+)(\.git)?$/\1/' || echo "")
    
    if [ -z "$GITHUB_REPO" ]; then
        read -p "Digite o repositório GitHub (ex: usuario/xodozin): " GITHUB_REPO
    fi
fi

echo -e "${BLUE}📦 Repositório: $GITHUB_REPO${NC}"
echo ""

# Executar deploy completo
echo -e "${GREEN}🚀 Iniciando deploy...${NC}"
bash scripts/deploy-completo.sh \
    --railway-token "$RAILWAY_TOKEN" \
    --vercel-token "$VERCEL_TOKEN" \
    --github-repo "$GITHUB_REPO"

echo -e "${GREEN}✅ Deploy concluído!${NC}"

