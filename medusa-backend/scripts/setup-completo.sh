#!/bin/bash

# Script de setup completo e automatizado do Medusa.js
# Executa todas as etapas possíveis automaticamente

set -e

echo "🚀 Setup Automatizado do Medusa.js - Xodózin"
echo "=============================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para imprimir sucesso
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função para imprimir aviso
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Função para imprimir erro
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Passo 1: Verificar containers
echo "📦 Passo 1: Verificando containers..."
if docker ps | grep -q xodozin-postgres; then
    success "PostgreSQL está rodando"
else
    error "PostgreSQL não está rodando"
    echo "   Iniciando PostgreSQL..."
    docker start xodozin-postgres || {
        error "Não foi possível iniciar PostgreSQL"
        exit 1
    }
    sleep 5
    success "PostgreSQL iniciado"
fi

if docker ps | grep -q xodozin-redis; then
    success "Redis está rodando"
else
    error "Redis não está rodando"
    echo "   Iniciando Redis..."
    docker start xodozin-redis || {
        error "Não foi possível iniciar Redis"
        exit 1
    }
    sleep 3
    success "Redis iniciado"
fi

if docker ps | grep -q xodozin-medusa-backend; then
    success "Medusa Backend está rodando"
else
    error "Medusa Backend não está rodando"
    echo "   Iniciando Medusa Backend..."
    docker start xodozin-medusa-backend || {
        error "Não foi possível iniciar Medusa Backend"
        exit 1
    }
    sleep 5
    success "Medusa Backend iniciado"
fi

echo ""

# Passo 2: Aguardar serviços estarem prontos
echo "⏳ Passo 2: Aguardando serviços estarem prontos..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker exec xodozin-postgres pg_isready -U postgres >/dev/null 2>&1; then
        success "PostgreSQL está pronto"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    error "Timeout aguardando PostgreSQL"
    exit 1
fi

RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker exec xodozin-redis redis-cli ping >/dev/null 2>&1; then
        success "Redis está pronto"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    error "Timeout aguardando Redis"
    exit 1
fi

echo ""

# Passo 3: Testar API do Medusa
echo "🧪 Passo 3: Testando API do Medusa..."
sleep 3
if curl -s http://localhost:9000/health >/dev/null 2>&1; then
    success "API do Medusa está respondendo"
else
    warning "API do Medusa ainda não está respondendo (pode estar inicializando)"
fi

echo ""

# Passo 4: Executar migrações (se necessário)
echo "🗄️  Passo 4: Verificando migrações do banco de dados..."
echo "   (As migrações são executadas automaticamente pelo Medusa na primeira inicialização)"
warning "Se precisar executar manualmente: docker exec -it xodozin-medusa-backend npx medusa db:migrate"

echo ""

# Passo 5: Criar usuário admin
echo "👤 Passo 5: Criar usuário administrador..."
warning "O Medusa CLI requer interação para criar usuário."
echo ""
echo "📝 Para criar o usuário admin, execute:"
echo "   docker exec -it xodozin-medusa-backend npx medusa user"
echo ""
echo "💡 Ou acesse o Admin Panel e siga o onboarding:"
echo "   http://localhost:7001"
echo ""

# Passo 6: Criar região Brasil (se possível)
echo "🌍 Passo 6: Criar região Brasil..."
if [ -f "scripts/create-region.js" ]; then
    warning "Para criar a região, você precisa:"
    echo "   1. Ter um usuário admin criado"
    echo "   2. Ter um token admin"
    echo "   3. Executar: docker exec -it xodozin-medusa-backend node scripts/create-region.js"
    echo ""
    echo "   Ou criar manualmente pelo Admin Panel:"
    echo "   http://localhost:7001 > Settings > Regions > Create Region"
else
    warning "Script de criação de região não encontrado"
fi

echo ""

# Resumo
echo "=============================================="
echo "✅ Setup Automatizado Concluído!"
echo ""
echo "📋 Próximos Passos Manuais:"
echo ""
echo "1. Criar usuário admin:"
echo "   docker exec -it xodozin-medusa-backend npx medusa user"
echo ""
echo "2. Acessar Admin Panel:"
echo "   http://localhost:7001"
echo ""
echo "3. Configurar Região Brasil:"
echo "   Settings > Regions > Create Region"
echo "   - Name: Brasil"
echo "   - Currency: BRL"
echo "   - Countries: Brazil"
echo ""
echo "4. Adicionar produtos:"
echo "   Products > Create Product"
echo ""
echo "5. Criar Collections (Kits):"
echo "   Collections > Create Collection"
echo ""
echo "=============================================="
echo ""
success "Tudo pronto para começar!"

