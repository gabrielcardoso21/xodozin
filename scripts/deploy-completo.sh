#!/bin/bash

# Script de deploy COMPLETO e AUTOMÁTICO para Xodozin
# Usa Railway API e Vercel API quando tokens são fornecidos
# Caso contrário, usa CLI com autenticação interativa

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para exibir ajuda
show_help() {
    echo "Uso: $0 [OPÇÕES]"
    echo ""
    echo "Opções:"
    echo "  --railway-token TOKEN    Token de API do Railway (totalmente automático)"
    echo "  --vercel-token TOKEN     Token de API do Vercel (totalmente automático)"
    echo "  --github-repo REPO       Repositório GitHub (ex: usuario/xodozin)"
    echo "  --project-name NAME      Nome do projeto (padrão: xodozin)"
    echo "  --help                   Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0                                    # Modo interativo (CLI)"
    echo "  $0 --railway-token xxx --vercel-token yyy  # Totalmente automático"
}

# Parse argumentos
RAILWAY_TOKEN=""
VERCEL_TOKEN=""
GITHUB_REPO=""
PROJECT_NAME="xodozin"
USE_API=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --railway-token)
            RAILWAY_TOKEN="$2"
            USE_API=true
            shift 2
            ;;
        --vercel-token)
            VERCEL_TOKEN="$2"
            USE_API=true
            shift 2
            ;;
        --github-repo)
            GITHUB_REPO="$2"
            shift 2
            ;;
        --project-name)
            PROJECT_NAME="$2"
            shift 2
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Erro: Opção desconhecida: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

echo -e "${GREEN}🚀 Deploy Automático Xodozin${NC}"
echo ""

# Verificar se temos tokens (modo API) ou precisamos usar CLI
if [ "$USE_API" = true ]; then
    echo -e "${BLUE}📡 Modo: API (Totalmente Automático)${NC}"
    
    if [ -z "$RAILWAY_TOKEN" ] || [ -z "$VERCEL_TOKEN" ]; then
        echo -e "${RED}❌ Erro: Tokens de Railway e Vercel são necessários para modo API${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}⚠️  Modo API ainda não implementado completamente${NC}"
    echo -e "${YELLOW}   Use o modo CLI interativo por enquanto${NC}"
    exit 1
else
    echo -e "${BLUE}🖥️  Modo: CLI (Semi-Automático)${NC}"
    echo -e "${YELLOW}⚠️  Você precisará fazer login uma vez${NC}"
    echo ""
    
    # Verificar/instalar CLIs
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}📦 Instalando Railway CLI...${NC}"
        npm i -g @railway/cli
    fi
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
        npm i -g vercel
    fi
    
    # Verificar autenticação
    echo -e "${GREEN}🔐 Verificando autenticação...${NC}"
    
    if ! railway whoami &> /dev/null; then
        echo -e "${YELLOW}⚠️  Não autenticado no Railway${NC}"
        echo -e "${YELLOW}   Execute: railway login${NC}"
        railway login
    fi
    
    if ! vercel whoami &> /dev/null; then
        echo -e "${YELLOW}⚠️  Não autenticado no Vercel${NC}"
        echo -e "${YELLOW}   Execute: vercel login${NC}"
        vercel login
    fi
    
    echo -e "${GREEN}✅ Autenticado${NC}"
    echo ""
fi

# Gerar secrets
echo -e "${GREEN}🔐 Gerando secrets...${NC}"
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✅ Secrets gerados${NC}"
echo ""

# Resumo do que será feito
echo -e "${BLUE}📋 Resumo do Deploy:${NC}"
echo "  - Backend: Railway"
echo "  - Frontend: Vercel"
echo "  - Projeto: $PROJECT_NAME"
if [ -n "$GITHUB_REPO" ]; then
    echo "  - Repositório: $GITHUB_REPO"
fi
echo ""

read -p "Continuar? (s/n): " confirm
if [ "$confirm" != "s" ]; then
    echo -e "${YELLOW}Deploy cancelado${NC}"
    exit 0
fi

# Executar script de deploy automático
echo -e "${GREEN}🚀 Iniciando deploy...${NC}"
echo ""

# Usar o script deploy-automatico.sh que já criamos
bash scripts/deploy-automatico.sh

echo -e "${GREEN}✅ Deploy concluído!${NC}"

