#!/bin/bash

# Script para fazer backup do banco de dados PostgreSQL do Medusa
# Uso: ./scripts/backup-banco.sh [nome-do-backup]

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configurações
DB_NAME="${DB_NAME:-medusa-xodozin}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="${1:-medusa-backup-${TIMESTAMP}}.sql"

# Criar diretório de backups se não existir
mkdir -p "$BACKUP_DIR"

echo -e "${BLUE}📦 Fazendo backup do banco de dados...${NC}"
echo -e "   Banco: ${GREEN}${DB_NAME}${NC}"
echo -e "   Arquivo: ${GREEN}${BACKUP_DIR}/${BACKUP_NAME}${NC}"
echo ""

# Verificar se PostgreSQL está rodando
if ! docker ps | grep -q postgres; then
    echo -e "${YELLOW}⚠️  PostgreSQL não está rodando em Docker${NC}"
    echo -e "${YELLOW}   Tentando backup direto...${NC}"
    
    # Backup direto (se PostgreSQL está instalado localmente)
    if command -v pg_dump &> /dev/null; then
        PGPASSWORD="${DB_PASSWORD:-postgres}" pg_dump \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            -F c \
            -f "${BACKUP_DIR}/${BACKUP_NAME}.dump"
        echo -e "${GREEN}✅ Backup criado: ${BACKUP_DIR}/${BACKUP_NAME}.dump${NC}"
    else
        echo -e "${YELLOW}⚠️  pg_dump não encontrado. Usando Docker...${NC}"
        docker exec medusa-postgres-temp pg_dump \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            -F c \
            -f "/tmp/${BACKUP_NAME}.dump"
        
        docker cp medusa-postgres-temp:/tmp/${BACKUP_NAME}.dump "${BACKUP_DIR}/${BACKUP_NAME}.dump"
        echo -e "${GREEN}✅ Backup criado: ${BACKUP_DIR}/${BACKUP_NAME}.dump${NC}"
    fi
else
    # Backup via Docker
    CONTAINER_NAME=$(docker ps | grep postgres | awk '{print $NF}' | head -1)
    
    echo -e "${BLUE}📦 Executando backup via Docker...${NC}"
    docker exec "$CONTAINER_NAME" pg_dump \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -F c \
        -f "/tmp/${BACKUP_NAME}.dump"
    
    docker cp "${CONTAINER_NAME}:/tmp/${BACKUP_NAME}.dump" "${BACKUP_DIR}/${BACKUP_NAME}.dump"
    
    # Limpar arquivo temporário do container
    docker exec "$CONTAINER_NAME" rm "/tmp/${BACKUP_NAME}.dump"
    
    echo -e "${GREEN}✅ Backup criado: ${BACKUP_DIR}/${BACKUP_NAME}.dump${NC}"
fi

# Criar também um backup em SQL (texto) para facilitar leitura
echo -e "${BLUE}📝 Criando backup em formato SQL (texto)...${NC}"
if docker ps | grep -q postgres; then
    CONTAINER_NAME=$(docker ps | grep postgres | awk '{print $NF}' | head -1)
    docker exec "$CONTAINER_NAME" pg_dump \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -F p \
        > "${BACKUP_DIR}/${BACKUP_NAME}.sql"
else
    PGPASSWORD="${DB_PASSWORD:-postgres}" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -F p \
        > "${BACKUP_DIR}/${BACKUP_NAME}.sql"
fi

echo -e "${GREEN}✅ Backup SQL criado: ${BACKUP_DIR}/${BACKUP_NAME}.sql${NC}"

# Mostrar tamanho dos arquivos
echo ""
echo -e "${BLUE}📊 Tamanho dos backups:${NC}"
ls -lh "${BACKUP_DIR}/${BACKUP_NAME}"* | awk '{print "   " $5 " - " $9}'

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Backup concluído com sucesso!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📁 Arquivos criados:${NC}"
echo -e "   ${GREEN}${BACKUP_DIR}/${BACKUP_NAME}.dump${NC} (formato binário - recomendado)"
echo -e "   ${GREEN}${BACKUP_DIR}/${BACKUP_NAME}.sql${NC} (formato texto - legível)"
echo ""
echo -e "${BLUE}💡 Para restaurar:${NC}"
echo -e "   ${YELLOW}./scripts/restore-banco.sh ${BACKUP_NAME}.dump${NC}"
echo ""

