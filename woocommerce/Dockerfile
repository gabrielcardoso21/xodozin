FROM wordpress:latest

# Instalar WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Instalar dependências para WP-CLI
RUN apt-get update && apt-get install -y \
    less \
    mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar script de instalação
COPY install-woocommerce.sh /usr/local/bin/install-woocommerce.sh
RUN chmod +x /usr/local/bin/install-woocommerce.sh

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html

