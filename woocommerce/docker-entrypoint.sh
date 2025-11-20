#!/bin/bash
# Não usar set -e para não parar no primeiro erro
set +e

# Executar inicialização do WooCommerce em background (não bloqueia o servidor)
(
    sleep 15  # Aguardar WordPress e Apache iniciarem
    echo "Iniciando instalação do WooCommerce em background..."
    /usr/local/bin/init-woocommerce.sh 2>&1 | tee /tmp/woocommerce-init.log || echo "⚠️ WooCommerce será instalado depois"
) &

# Executar entrypoint padrão do WordPress (isso inicia o Apache)
# IMPORTANTE: Isso deve ser executado e não pode falhar
exec /usr/local/bin/docker-entrypoint.sh "$@"
