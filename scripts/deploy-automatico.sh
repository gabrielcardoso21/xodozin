#!/bin/bash

# Script de deploy automático para Xodozin
# Requisitos:
# 1. Railway CLI instalado e autenticado (railway login)
# 2. Vercel CLI instalado e autenticado (vercel login)
# 3. Repositório já commitado e pushado no GitHub

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando deploy automático do Xodozin${NC}"
echo ""

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI não encontrado. Instalando...${NC}"
    npm i -g @railway/cli
fi

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI não encontrado. Instalando...${NC}"
    npm i -g vercel
fi

# Verificar autenticação Railway
echo -e "${GREEN}📋 Verificando autenticação Railway...${NC}"
if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Não autenticado no Railway. Execute: railway login${NC}"
    exit 1
fi

# Verificar autenticação Vercel
echo -e "${GREEN}📋 Verificando autenticação Vercel...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Não autenticado no Vercel. Execute: vercel login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Autenticações verificadas${NC}"
echo ""

# Gerar secrets
echo -e "${GREEN}🔐 Gerando secrets...${NC}"
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✅ Secrets gerados${NC}"
echo ""

# PARTE 1: Backend no Railway
echo -e "${GREEN}🚂 PARTE 1: Deploy Backend no Railway${NC}"
echo ""

# Perguntar se já existe projeto Railway
read -p "Já existe um projeto Railway? (s/n): " has_railway_project

if [ "$has_railway_project" != "s" ]; then
    echo -e "${YELLOW}📦 Criando novo projeto Railway...${NC}"
    echo -e "${YELLOW}⚠️  Nota: Você precisará selecionar o repositório GitHub manualmente${NC}"
    railway init
else
    echo -e "${GREEN}📦 Linkando ao projeto Railway existente...${NC}"
    railway link
fi

# Adicionar PostgreSQL
echo -e "${GREEN}🐘 Adicionando PostgreSQL...${NC}"
echo -e "${YELLOW}⚠️  Nota: Você precisará adicionar PostgreSQL manualmente no Railway Dashboard${NC}"
echo -e "${YELLOW}   Ou execute: railway add postgresql${NC}"
read -p "Pressione Enter após adicionar PostgreSQL..."

# Configurar variáveis de ambiente
echo -e "${GREEN}⚙️  Configurando variáveis de ambiente...${NC}"
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set COOKIE_SECRET="$COOKIE_SECRET"
railway variables set NODE_ENV=production
railway variables set PORT=9000
railway variables set STORE_CORS="*"
railway variables set ADMIN_CORS="*"
railway variables set AUTH_CORS="*"
railway variables set REDIS_URL=""

# Configurar Root Directory (via arquivo railway.json já existe)
echo -e "${GREEN}✅ Variáveis configuradas${NC}"
echo -e "${YELLOW}⚠️  IMPORTANTE: Configure Root Directory como 'xodozin' no Railway Dashboard${NC}"
read -p "Pressione Enter após configurar Root Directory..."

# Deploy
echo -e "${GREEN}🚀 Fazendo deploy...${NC}"
railway up

# Aguardar deploy
echo -e "${YELLOW}⏳ Aguardando deploy completar (~5 minutos)...${NC}"
sleep 30

# Obter URL
RAILWAY_URL=$(railway domain 2>/dev/null || railway status | grep -oP 'https://[^\s]+' | head -1)
if [ -z "$RAILWAY_URL" ]; then
    read -p "Digite a URL do Railway (ex: https://xodozin-production.up.railway.app): " RAILWAY_URL
fi

echo -e "${GREEN}✅ Backend deployado em: $RAILWAY_URL${NC}"
echo ""

# Setup pós-deploy
echo -e "${GREEN}🔧 Executando setup pós-deploy...${NC}"
railway run bash xodozin/scripts/setup-production.sh || railway run bash scripts/railway-setup.sh

echo -e "${GREEN}✅ Setup concluído${NC}"
echo ""

# PARTE 2: Frontend no Vercel
echo -e "${GREEN}🎨 PARTE 2: Deploy Frontend no Vercel${NC}"
echo ""

# Obter Publishable Key
echo -e "${YELLOW}⚠️  IMPORTANTE: Obtenha a Publishable Key do Admin Panel${NC}"
echo -e "${YELLOW}   Acesse: $RAILWAY_URL/app${NC}"
echo -e "${YELLOW}   Vá em Settings → API Keys → Copie a Publishable Key${NC}"
read -p "Cole a Publishable Key aqui: " PUBLISHABLE_KEY

# Deploy no Vercel
echo -e "${GREEN}🚀 Fazendo deploy no Vercel...${NC}"
cd frontend
vercel --prod --yes

# Obter URL do Vercel
VERCEL_URL=$(vercel ls | grep -oP 'https://[^\s]+' | head -1)
if [ -z "$VERCEL_URL" ]; then
    read -p "Digite a URL do Vercel (ex: https://xodozin.vercel.app): " VERCEL_URL
fi

cd ..

# Configurar variáveis de ambiente no Vercel
echo -e "${GREEN}⚙️  Configurando variáveis de ambiente no Vercel...${NC}"
cd frontend
vercel env add REACT_APP_MEDUSA_BACKEND_URL production "$RAILWAY_URL"
vercel env add REACT_APP_MEDUSA_PUBLISHABLE_KEY production "$PUBLISHABLE_KEY"
cd ..

# Redeploy com novas variáveis
echo -e "${GREEN}🔄 Fazendo redeploy com novas variáveis...${NC}"
cd frontend
vercel --prod --yes
cd ..

echo -e "${GREEN}✅ Frontend deployado em: $VERCEL_URL${NC}"
echo ""

# PARTE 3: Atualizar CORS
echo -e "${GREEN}🔗 PARTE 3: Atualizando CORS${NC}"
echo ""

railway variables set STORE_CORS="$VERCEL_URL"
railway variables set ADMIN_CORS="$VERCEL_URL"
railway variables set AUTH_CORS="$VERCEL_URL"

echo -e "${GREEN}✅ CORS atualizado${NC}"
echo ""

# Validação final
echo -e "${GREEN}✅ Deploy completo!${NC}"
echo ""
echo -e "${GREEN}📝 URLs:${NC}"
echo -e "  Backend: $RAILWAY_URL"
echo -e "  Admin Panel: $RAILWAY_URL/app"
echo -e "  Frontend: $VERCEL_URL"
echo ""
echo -e "${GREEN}🎉 Pronto!${NC}"

