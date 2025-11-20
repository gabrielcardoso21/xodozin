#!/bin/bash
set -e

# Executar inicialização do WooCommerce em background
# Isso garante que o WooCommerce seja instalado assim que o WordPress estiver pronto
(
    sleep 10  # Aguardar WordPress iniciar
    echo "Aguardando WordPress estar disponível para instalar WooCommerce..."
    for i in {1..120}; do
        if wp core is-installed --allow-root 2>/dev/null; then
            echo "WordPress está pronto! Inicializando WooCommerce..."
            /usr/local/bin/init-woocommerce.sh || echo "⚠️ Aviso: Erro ao inicializar WooCommerce"
            break
        fi
        sleep 2
    done
) &

# Executar entrypoint padrão do WordPress (isso inicia o Apache)
# O entrypoint padrão está em /usr/local/bin/docker-entrypoint.sh
exec /usr/local/bin/docker-entrypoint.sh "$@"
