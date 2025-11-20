#!/bin/bash

# Script para gerar secrets seguros para deploy
# Execute: bash scripts/generate-secrets.sh

echo "🔐 Gerando secrets seguros para deploy..."
echo ""
echo "JWT_SECRET:"
openssl rand -base64 32
echo ""
echo "COOKIE_SECRET:"
openssl rand -base64 32
echo ""
echo "✅ Secrets gerados! Copie e cole no Railway Dashboard → Variables"

