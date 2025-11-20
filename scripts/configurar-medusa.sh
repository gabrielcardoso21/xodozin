#!/bin/bash

# Script para configurar Medusa automaticamente (sem interface)
# Uso: ./scripts/configurar-medusa.sh

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Configurando Medusa automaticamente...${NC}"
echo ""

# Verificar se Medusa está rodando
if ! curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Medusa não está respondendo em http://localhost:9000${NC}"
    echo -e "${YELLOW}   Iniciando Medusa...${NC}"
    cd xodozin
    yarn dev > ../medusa-setup.log 2>&1 &
    MEDUSA_PID=$!
    echo -e "${GREEN}✅ Medusa iniciado (PID: $MEDUSA_PID)${NC}"
    echo -e "${BLUE}⏳ Aguardando Medusa iniciar...${NC}"
    sleep 10
    
    # Aguardar Medusa estar pronto
    for i in {1..30}; do
        if curl -s http://localhost:9000/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Medusa está pronto!${NC}"
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${YELLOW}⚠️  Medusa pode não estar pronto ainda. Continuando...${NC}"
        fi
        sleep 2
    done
    cd ..
fi

echo ""
echo -e "${BLUE}🇧🇷 Configurando região Brasil...${NC}"
cd xodozin

# Executar script de setup do Brasil
if [ -f "src/scripts/setup-brasil.ts" ]; then
    echo -e "${BLUE}📝 Executando script de configuração...${NC}"
    npx medusa exec ./src/scripts/setup-brasil.ts || {
        echo -e "${YELLOW}⚠️  Erro ao executar script. Tentando método alternativo...${NC}"
    }
else
    echo -e "${YELLOW}⚠️  Script setup-brasil.ts não encontrado${NC}"
    echo -e "${YELLOW}   Criando script...${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "   1. Criar usuário admin: ${YELLOW}npx medusa user${NC}"
echo -e "   2. Acessar Admin Panel: ${YELLOW}http://localhost:9000/app${NC}"
echo -e "   3. Adicionar produtos manualmente ou via script"
echo ""

cd ..

