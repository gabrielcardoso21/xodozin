#!/bin/bash
# Script para configurar autenticação do Render CLI

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔐 Configurar Autenticação Render CLI${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar se Render CLI está instalado
if ! command -v render &> /dev/null; then
    echo -e "${RED}❌ Render CLI não encontrado${NC}"
    echo "   Instalando..."
    echo 'Dcd0af7854#' | sudo -S npm install -g render-cli 2>&1
fi

echo -e "${GREEN}✅ Render CLI instalado${NC}"
echo ""

# Verificar se já está autenticado
if render whoami &> /dev/null; then
    echo -e "${GREEN}✅ Já autenticado${NC}"
    render whoami
    exit 0
fi

echo -e "${YELLOW}Opções de autenticação:${NC}"
echo ""
echo "1. Login interativo (abre navegador)"
echo "2. Usar token de API"
echo ""
read -p "Escolha uma opção (1 ou 2): " OPTION

case $OPTION in
    1)
        echo ""
        echo -e "${YELLOW}Iniciando login interativo...${NC}"
        echo "   Isso abrirá seu navegador para autenticação"
        render login
        ;;
    2)
        echo ""
        echo -e "${YELLOW}Para obter o token de API:${NC}"
        echo "   1. Acesse: https://dashboard.render.com/account/api-keys"
        echo "   2. Clique em 'Create API Key'"
        echo "   3. Copie o token gerado"
        echo ""
        read -p "Cole o token aqui: " API_KEY
        
        if [ -n "$API_KEY" ]; then
            export RENDER_API_KEY="$API_KEY"
            echo "export RENDER_API_KEY=\"$API_KEY\"" >> ~/.bashrc
            echo -e "${GREEN}✅ Token configurado${NC}"
            
            # Verificar se funciona
            if render whoami &> /dev/null; then
                echo -e "${GREEN}✅ Autenticação bem-sucedida${NC}"
                render whoami
            else
                echo -e "${RED}❌ Falha na autenticação. Verifique o token.${NC}"
            fi
        else
            echo -e "${RED}❌ Token não fornecido${NC}"
        fi
        ;;
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

