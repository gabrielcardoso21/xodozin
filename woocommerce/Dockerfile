FROM wordpress:latest

# Instalar WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Instalar dependências para WP-CLI
RUN apt-get update && apt-get install -y \
    less \
    default-mysql-client \
    git \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copiar scripts
COPY install-woocommerce.sh /usr/local/bin/install-woocommerce.sh
COPY init-woocommerce.sh /usr/local/bin/init-woocommerce.sh
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-custom.sh

# Dar permissão de execução
RUN chmod +x /usr/local/bin/install-woocommerce.sh \
    && chmod +x /usr/local/bin/init-woocommerce.sh \
    && chmod +x /usr/local/bin/docker-entrypoint-custom.sh

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html

# Usar entrypoint customizado
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-custom.sh"]
CMD ["apache2-foreground"]

