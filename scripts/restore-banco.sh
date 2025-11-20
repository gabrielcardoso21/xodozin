#!/bin/bash

# Script para restaurar backup do banco de dados PostgreSQL
# Uso: ./scripts/restore-banco.sh [arquivo-backup]

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configurações
DB_NAME="${DB_NAME:-medusa-xodozin}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"

if [ -z "$1" ]; then
    echo -e "${RED}❌ Erro: Especifique o arquivo de backup${NC}"
    echo ""
    echo "Uso: ./scripts/restore-banco.sh [arquivo-backup]"
    echo ""
    echo "Backups disponíveis:"
    ls -lh "$BACKUP_DIR"/*.dump 2>/dev/null | awk '{print "   " $9}' || echo "   Nenhum backup encontrado"
    exit 1
fi

BACKUP_FILE="$1"

# Se não for caminho absoluto, procurar no diretório de backups
if [[ ! "$BACKUP_FILE" = /* ]]; then
    BACKUP_FILE="${BACKUP_DIR}/${BACKUP_FILE}"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Erro: Arquivo de backup não encontrado: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  ATENÇÃO: Esta operação vai SOBRESCREVER o banco de dados atual!${NC}"
echo -e "${YELLOW}   Banco: ${DB_NAME}${NC}"
echo -e "${YELLOW}   Backup: ${BACKUP_FILE}${NC}"
echo ""
read -p "Tem certeza que deseja continuar? (digite 'sim' para confirmar): " confirm

if [ "$confirm" != "sim" ]; then
    echo -e "${BLUE}Operação cancelada.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔄 Restaurando backup...${NC}"

# Verificar se PostgreSQL está rodando
if ! docker ps | grep -q postgres; then
    echo -e "${YELLOW}⚠️  PostgreSQL não está rodando em Docker${NC}"
    echo -e "${YELLOW}   Tentando restore direto...${NC}"
    
    if command -v pg_restore &> /dev/null; then
        # Drop e recriar banco
        PGPASSWORD="${DB_PASSWORD:-postgres}" psql \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d postgres \
            -c "DROP DATABASE IF EXISTS \"${DB_NAME}\";" \
            -c "CREATE DATABASE \"${DB_NAME}\";"
        
        # Restaurar
        if [[ "$BACKUP_FILE" == *.dump ]]; then
            PGPASSWORD="${DB_PASSWORD:-postgres}" pg_restore \
                -h "$DB_HOST" \
                -p "$DB_PORT" \
                -U "$DB_USER" \
                -d "$DB_NAME" \
                -c \
                "$BACKUP_FILE"
        else
            PGPASSWORD="${DB_PASSWORD:-postgres}" psql \
                -h "$DB_HOST" \
                -p "$DB_PORT" \
                -U "$DB_USER" \
                -d "$DB_NAME" \
                < "$BACKUP_FILE"
        fi
    else
        echo -e "${RED}❌ pg_restore não encontrado. Use Docker.${NC}"
        exit 1
    fi
else
    CONTAINER_NAME=$(docker ps | grep postgres | awk '{print $NF}' | head -1)
    
    # Copiar backup para container se necessário
    if [[ "$BACKUP_FILE" != /tmp/* ]]; then
        docker cp "$BACKUP_FILE" "${CONTAINER_NAME}:/tmp/$(basename $BACKUP_FILE)"
        BACKUP_FILE="/tmp/$(basename $BACKUP_FILE)"
    fi
    
    # Drop e recriar banco
    echo -e "${BLUE}🗑️  Removendo banco existente...${NC}"
    docker exec "$CONTAINER_NAME" psql \
        -U "$DB_USER" \
        -d postgres \
        -c "DROP DATABASE IF EXISTS \"${DB_NAME}\";" \
        -c "CREATE DATABASE \"${DB_NAME}\";"
    
    # Restaurar
    echo -e "${BLUE}📦 Restaurando dados...${NC}"
    if [[ "$BACKUP_FILE" == *.dump ]]; then
        docker exec "$CONTAINER_NAME" pg_restore \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            -c \
            "$BACKUP_FILE"
    else
        docker exec -i "$CONTAINER_NAME" psql \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            < "$BACKUP_FILE"
    fi
    
    # Limpar arquivo temporário
    docker exec "$CONTAINER_NAME" rm -f "$BACKUP_FILE" 2>/dev/null || true
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Backup restaurado com sucesso!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}💡 Próximos passos:${NC}"
echo -e "   1. Reiniciar o Medusa Backend"
echo -e "   2. Verificar se tudo está funcionando"
echo ""

