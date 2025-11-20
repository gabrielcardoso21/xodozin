#!/bin/bash
# Script para inicializar WooCommerce após WordPress estar pronto
# Este script será executado via cron ou manualmente após deploy

# Não usar set -e para não parar no primeiro erro
set +e

WP_URL="${WP_URL:-http://localhost}"
WP_ADMIN_USER="${WP_ADMIN_USER:-admin}"
WP_ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-admin}"
WP_ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@example.com}"
WP_TITLE="${WP_TITLE:-WooCommerce Store}"

echo "Aguardando banco de dados estar disponível..."
for i in {1..60}; do
    if wp db check --allow-root 2>/dev/null; then
        echo "Banco de dados está disponível!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "⚠️ Timeout aguardando banco de dados"
        exit 1
    fi
    sleep 2
done

echo "Aguardando WordPress estar disponível..."
for i in {1..60}; do
    if wp core is-installed --allow-root 2>/dev/null; then
        echo "WordPress está instalado!"
        break
    fi
    # Tentar instalar WordPress
    if [ $i -gt 5 ]; then  # Aguardar um pouco antes de tentar instalar
        echo "Tentando instalar WordPress..."
        wp core install \
            --url="$WP_URL" \
            --title="$WP_TITLE" \
            --admin_user="$WP_ADMIN_USER" \
            --admin_password="$WP_ADMIN_PASSWORD" \
            --admin_email="$WP_ADMIN_EMAIL" \
            --allow-root \
            --skip-email 2>&1
        
        if wp core is-installed --allow-root 2>/dev/null; then
            echo "✅ WordPress instalado com sucesso!"
            break
        fi
    fi
    sleep 2
done

# Verificar se WordPress está instalado antes de continuar
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "❌ WordPress não está instalado. Abortando instalação do WooCommerce."
    exit 1
fi

# Instalar WooCommerce se não estiver instalado
if ! wp plugin is-installed woocommerce --allow-root 2>/dev/null; then
    echo "Instalando WooCommerce..."
    wp plugin install woocommerce --activate --allow-root || {
        echo "⚠️ Erro ao instalar WooCommerce, tentando novamente..."
        sleep 5
        wp plugin install woocommerce --activate --allow-root
    }
else
    echo "WooCommerce já está instalado, ativando..."
    wp plugin activate woocommerce --allow-root
fi

echo "✅ WooCommerce configurado!"

