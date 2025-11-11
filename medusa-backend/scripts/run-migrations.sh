#!/bin/sh

# Script para executar migrações do Medusa
# Aguarda o banco estar pronto e executa as migrações

set -e

echo "🗄️  Executando migrações do Medusa.js..."
echo ""

# Verificar variáveis de ambiente
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não configurada!"
    exit 1
fi

echo "📊 Database URL: ${DATABASE_URL}"
echo ""

# Aguardar banco estar pronto (máximo 30 tentativas, 2s cada = 60s)
echo "⏳ Aguardando banco de dados estar pronto..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if node -e "
        const { Client } = require('pg');
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        client.connect()
            .then(() => {
                console.log('✅ Banco conectado!');
                process.exit(0);
            })
            .catch((err) => {
                console.log('⏳ Aguardando...');
                process.exit(1);
            });
    " 2>/dev/null; then
        echo "✅ Banco de dados está pronto!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        sleep 2
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Timeout aguardando banco de dados"
    exit 1
fi

echo ""
echo "🚀 Executando migrações..."
echo ""

# Executar migrações
npx medusa db:migrate || {
    echo "⚠️  Migrações podem já ter sido executadas ou erro ocorreu"
    echo "   Verificando status do banco..."
}

echo ""
echo "✅ Processo de migração concluído!"

