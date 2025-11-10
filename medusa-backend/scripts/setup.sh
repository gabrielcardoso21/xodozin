#!/bin/bash

# Script de setup do Medusa.js
# Executa todas as etapas necessárias para configurar o Medusa

set -e

echo "🚀 Setup do Medusa.js - Xodózin"
echo "================================"
echo ""

# Verificar Node.js
echo "📦 Verificando Node.js..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js >= 20 é necessário. Versão atual: $(node --version)"
    echo "   Instale Node.js 20+ usando: nvm install 20"
    exit 1
fi
echo "✅ Node.js $(node --version) OK"
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando .env a partir do .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env criado. Configure as variáveis de ambiente!"
    else
        echo "⚠️  .env.example não encontrado. Criando .env básico..."
        cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/xodozin
REDIS_URL=redis://localhost:6379
JWT_SECRET=$(openssl rand -hex 32)
COOKIE_SECRET=$(openssl rand -hex 32)
PORT=9000
NODE_ENV=development
CORS=http://localhost:3000
EOF
        echo "✅ .env criado com valores padrão"
    fi
    echo "⚠️  IMPORTANTE: Configure DATABASE_URL e outras variáveis no .env"
    echo ""
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install
echo "✅ Dependências instaladas"
echo ""

# Build
echo "🔨 Fazendo build..."
npm run build
echo "✅ Build concluído"
echo ""

# Executar migrações
echo "🗄️  Executando migrações do banco de dados..."
echo "⚠️  Certifique-se de que o banco de dados está configurado e acessível"
read -p "Continuar com as migrações? (s/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    npx medusa migrations run
    echo "✅ Migrações executadas"
else
    echo "⏭️  Migrações puladas. Execute manualmente: npx medusa migrations run"
fi
echo ""

echo "✅ Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure DATABASE_URL no .env"
echo "   2. Configure REDIS_URL no .env (opcional)"
echo "   3. Execute: npx medusa migrations run (se ainda não executou)"
echo "   4. Execute: npm run dev (para iniciar em modo desenvolvimento)"
echo ""

