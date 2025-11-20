#!/bin/bash
set -e

# Executar entrypoint padrão do WordPress em background
/usr/local/bin/docker-entrypoint.sh apache2-foreground &
WP_PID=$!

# Aguardar WordPress estar pronto
echo "Aguardando WordPress estar disponível..."
for i in {1..60}; do
    if curl -f http://localhost/wp-admin/install.php > /dev/null 2>&1 || \
       wp core is-installed --allow-root 2>/dev/null; then
        echo "WordPress está pronto!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "⚠️ Timeout aguardando WordPress"
        exit 1
    fi
    sleep 2
done

# Executar inicialização do WooCommerce
echo "Inicializando WooCommerce..."
/usr/local/bin/init-woocommerce.sh || echo "⚠️ Aviso: Erro ao inicializar WooCommerce (pode já estar instalado)"

# Aguardar processo do WordPress
wait $WP_PID
