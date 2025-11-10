#!/bin/bash

# Script para instalar Medusa.js automaticamente
# Responde automaticamente às perguntas do create-medusa-app

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

cd /home/gabriel/xodozin

# Remover diretório antigo se existir
rm -rf medusa-backend

# Criar projeto Medusa com respostas automáticas
echo "N" | npx create-medusa-app@latest medusa-backend <<EOF
N
postgres
sqlite://./medusa.db
N
N
N
EOF

echo "✅ Medusa instalado!"

