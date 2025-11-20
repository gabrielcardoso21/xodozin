#!/bin/bash
# Script para inicializar WooCommerce após WordPress estar pronto
# Este script será executado via cron ou manualmente após deploy

set -e

WP_URL="${WP_URL:-http://localhost}"
WP_ADMIN_USER="${WP_ADMIN_USER:-admin}"
WP_ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-admin}"
WP_ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@example.com}"

echo "Aguardando WordPress estar disponível..."
for i in {1..30}; do
    if wp core is-installed --allow-root 2>/dev/null || curl -f "$WP_URL" > /dev/null 2>&1; then
        echo "WordPress está pronto!"
        break
    fi
    echo "Tentativa $i/30..."
    sleep 5
done

# Instalar WordPress se não estiver instalado
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "Instalando WordPress..."
    wp core install \
        --url="$WP_URL" \
        --title="WooCommerce Store" \
        --admin_user="$WP_ADMIN_USER" \
        --admin_password="$WP_ADMIN_PASSWORD" \
        --admin_email="$WP_ADMIN_EMAIL" \
        --allow-root \
        --skip-email || echo "Aviso: WordPress pode já estar instalado"
fi

# Instalar WooCommerce se não estiver instalado
if ! wp plugin is-installed woocommerce --allow-root 2>/dev/null; then
    echo "Instalando WooCommerce..."
    wp plugin install woocommerce --activate --allow-root
else
    echo "WooCommerce já está instalado, ativando..."
    wp plugin activate woocommerce --allow-root
fi

echo "✅ WooCommerce configurado!"

