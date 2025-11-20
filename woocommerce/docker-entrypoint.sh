#!/bin/bash
set -e

# Primeiro, executar o entrypoint padrão do WordPress para configurar tudo
# Isso garante que o WordPress está configurado antes de iniciar o servidor
/usr/local/bin/docker-entrypoint.sh "$@" &
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
        echo "⚠️ Timeout aguardando WordPress (continuando mesmo assim...)"
        break
    fi
    sleep 2
done

# Executar inicialização do WooCommerce em background
echo "Inicializando WooCommerce..."
/usr/local/bin/init-woocommerce.sh || echo "⚠️ Aviso: Erro ao inicializar WooCommerce (pode já estar instalado)" &

# Aguardar processo do WordPress (isso mantém o container rodando)
wait $WP_PID
