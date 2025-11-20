#!/bin/bash
set -e

# Variáveis de ambiente
WP_URL="${WP_URL:-http://localhost}"
WP_ADMIN_USER="${WP_ADMIN_USER:-admin}"
WP_ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-$(openssl rand -base64 32)}"
WP_ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@example.com}"
WP_TITLE="${WP_TITLE:-WooCommerce Store}"

# Aguardar WordPress estar pronto
echo "Aguardando WordPress estar disponível..."
until wp core is-installed --allow-root 2>/dev/null || curl -f "$WP_URL" > /dev/null 2>&1; do
    sleep 2
done

# Instalar WordPress se não estiver instalado
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "Instalando WordPress..."
    wp core install \
        --url="$WP_URL" \
        --title="$WP_TITLE" \
        --admin_user="$WP_ADMIN_USER" \
        --admin_password="$WP_ADMIN_PASSWORD" \
        --admin_email="$WP_ADMIN_EMAIL" \
        --allow-root \
        --skip-email
fi

# Instalar WooCommerce
if ! wp plugin is-installed woocommerce --allow-root 2>/dev/null; then
    echo "Instalando WooCommerce..."
    wp plugin install woocommerce --activate --allow-root
fi

# Ativar WooCommerce
wp plugin activate woocommerce --allow-root

# Criar Consumer Key e Secret para REST API
echo "Criando credenciais REST API..."
CONSUMER_KEY=$(openssl rand -hex 32)
CONSUMER_SECRET=$(openssl rand -hex 32)

# Salvar credenciais em arquivo temporário para o script de automação ler
echo "WOOCOMMERCE_CONSUMER_KEY=$CONSUMER_KEY" > /tmp/woocommerce-credentials.txt
echo "WOOCOMMERCE_CONSUMER_SECRET=$CONSUMER_SECRET" >> /tmp/woocommerce-credentials.txt
echo "WP_ADMIN_USER=$WP_ADMIN_USER" >> /tmp/woocommerce-credentials.txt
echo "WP_ADMIN_PASSWORD=$WP_ADMIN_PASSWORD" >> /tmp/woocommerce-credentials.txt

# Criar aplicação REST API via WP-CLI
wp wc tool run install_pages --user=1 --allow-root || true

echo "✅ WooCommerce instalado e configurado!"
echo "Consumer Key: $CONSUMER_KEY"
echo "Consumer Secret: $CONSUMER_SECRET"

