#!/bin/bash

# Script para verificar logs do Railway via API
# Uso: bash scripts/verificar-logs-railway.sh

set -e

source .secrets

if [ -z "$RAILWAY_TOKEN" ]; then
    echo "❌ RAILWAY_TOKEN não encontrado no .secrets"
    exit 1
fi

echo "🔍 Verificando projetos Railway..."

# Listar projetos
PROJECTS=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
    "https://api.railway.app/v1/projects" | jq -r '.projects[] | "\(.id)|\(.name)"' 2>/dev/null || echo "")

if [ -z "$PROJECTS" ]; then
    echo "⚠️  Não foi possível listar projetos. Verificando token..."
    echo "Tentando obter informações do projeto..."
    
    # Tentar obter informações do usuário
    USER_INFO=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
        "https://api.railway.app/v1/user" 2>/dev/null || echo "")
    
    if [ -z "$USER_INFO" ]; then
        echo "❌ Token inválido ou sem permissões"
        exit 1
    fi
    
    echo "✅ Token válido"
    echo "📋 Projetos encontrados:"
    echo "$PROJECTS" | while IFS='|' read -r id name; do
        echo "  - $name ($id)"
    done
else
    echo "📋 Projetos encontrados:"
    echo "$PROJECTS" | while IFS='|' read -r id name; do
        echo "  - $name ($id)"
        
        # Listar serviços do projeto
        echo "  📦 Serviços:"
        SERVICES=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
            "https://api.railway.app/v1/projects/$id/services" | jq -r '.services[] | "\(.id)|\(.name)"' 2>/dev/null || echo "")
        
        echo "$SERVICES" | while IFS='|' read -r service_id service_name; do
            echo "    - $service_name ($service_id)"
            
            # Obter deployments recentes
            DEPLOYMENTS=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
                "https://api.railway.app/v1/services/$service_id/deployments" | jq -r '.deployments[0:3][] | "\(.id)|\(.status)|\(.createdAt)"' 2>/dev/null || echo "")
            
            if [ -n "$DEPLOYMENTS" ]; then
                echo "      📊 Deployments recentes:"
                echo "$DEPLOYMENTS" | while IFS='|' read -r deploy_id status created; do
                    echo "        - $status (criado em: $created)"
                done
            fi
        done
    done
fi

echo ""
echo "💡 Para ver logs completos, use o Railway Dashboard ou Railway CLI"

