#!/bin/bash

# Script para instalar Docker Compose

echo "🔧 Instalando Docker Compose..."

# Verificar se já está instalado
if command -v docker-compose &> /dev/null; then
    echo "✅ docker-compose já está instalado"
    docker-compose --version
    exit 0
fi

# Tentar instalar via apt
if command -v apt &> /dev/null; then
    echo "📦 Instalando via apt..."
    sudo apt update
    sudo apt install -y docker-compose
    if [ $? -eq 0 ]; then
        echo "✅ Docker Compose instalado!"
        docker-compose --version
        exit 0
    fi
fi

# Instalar via pip como alternativa
if command -v pip3 &> /dev/null; then
    echo "📦 Instalando via pip..."
    pip3 install docker-compose
    if [ $? -eq 0 ]; then
        echo "✅ Docker Compose instalado via pip!"
        docker-compose --version
        exit 0
    fi
fi

echo "❌ Não foi possível instalar Docker Compose automaticamente"
echo "   Instale manualmente: sudo apt install docker-compose"
exit 1

