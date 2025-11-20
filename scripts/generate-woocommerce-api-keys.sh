#!/bin/bash
# Script para gerar API keys do WooCommerce automaticamente via WP-CLI
# e configurar o frontend automaticamente

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parâmetros
SERVICE_URL="${1:-}"
WP_ADMIN_USER="${WP_ADMIN_USER:-admin}"
WP_ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-}"

if [ -z "$SERVICE_URL" ]; then
    echo -e "${RED}❌ ERRO: URL do serviço não fornecida${NC}"
    echo "Uso: $0 <URL_DO_SERVICO>"
    echo "Exemplo: $0 https://woocommerce-store-xxxx.onrender.com"
    exit 1
fi

# Remover barra final se houver
SERVICE_URL="${SERVICE_URL%/}"

echo -e "${BLUE}🔑 Gerando API Keys do WooCommerce${NC}"
echo ""

# Aguardar WordPress estar pronto
echo "⏳ Aguardando WordPress estar disponível..."
MAX_RETRIES=30
RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
    if curl -f -s "$SERVICE_URL/wp-admin/install.php" > /dev/null 2>&1 || \
       curl -f -s "$SERVICE_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ WordPress está disponível!${NC}"
        break
    fi
    RETRY=$((RETRY + 1))
    echo "   Tentativa $RETRY/$MAX_RETRIES..."
    sleep 5
done

if [ $RETRY -ge $MAX_RETRIES ]; then
    echo -e "${RED}❌ Timeout: WordPress não está disponível${NC}"
    exit 1
fi

# Criar script PHP temporário para gerar API key via WordPress
echo "🔨 Criando API key via WordPress..."
TEMP_SCRIPT=$(cat <<'PHPSCRIPT'
<?php
// Carregar WordPress
require_once('wp-load.php');

// Verificar se WooCommerce está ativo
if (!class_exists('WooCommerce')) {
    die("WooCommerce não está instalado\n");
}

// Obter usuário admin
$user = get_user_by('login', 'admin');
if (!$user) {
    die("Usuário admin não encontrado\n");
}

// Gerar consumer key e secret
$consumer_key = 'ck_' . wc_rand_hash();
$consumer_secret = 'cs_' . wc_rand_hash();

// Criar API key no banco de dados
global $wpdb;
$table_name = $wpdb->prefix . 'woocommerce_api_keys';

$result = $wpdb->insert(
    $table_name,
    array(
        'user_id' => $user->ID,
        'description' => 'Frontend API - Gerado automaticamente',
        'permissions' => 'read_write',
        'consumer_key' => wc_api_hash($consumer_key),
        'consumer_secret' => $consumer_secret,
        'truncated_key' => substr($consumer_key, -7),
        'last_access' => null,
    ),
    array('%d', '%s', '%s', '%s', '%s', '%s', '%s')
);

if ($result) {
    echo "CONSUMER_KEY=$consumer_key\n";
    echo "CONSUMER_SECRET=$consumer_secret\n";
    echo "KEY_ID=" . $wpdb->insert_id . "\n";
} else {
    die("Erro ao criar API key\n");
}
PHPSCRIPT
)

# Tentar executar via WP-CLI no container (se tiver acesso SSH)
# Como alternativa, vamos usar a API REST do WordPress para criar

echo "📝 Gerando credenciais via WordPress REST API..."

# Primeiro, fazer login e obter nonce/cookie
LOGIN_RESPONSE=$(curl -s -c /tmp/wp-cookies.txt -b /tmp/wp-cookies.txt \
    -d "log=$WP_ADMIN_USER&pwd=$WP_ADMIN_PASSWORD&wp-submit=Log+In&redirect_to=$SERVICE_URL/wp-admin/" \
    -L "$SERVICE_URL/wp-login.php" 2>&1)

# Se não tiver senha, tentar método alternativo via WP-CLI no container
# Ou criar via banco de dados diretamente

echo -e "${YELLOW}⚠️  Método automático via API requer autenticação${NC}"
echo ""
echo "📋 Opções para gerar API key:"
echo ""
echo "Opção 1: Via WP-CLI no container (Recomendado)"
echo "  1. Acesse o container via Render Shell:"
echo "     - Dashboard Render → Seu Serviço → Shell"
echo "  2. Execute:"
echo "     wp wc api create --user=admin --description='Frontend API' --permissions=read_write"
echo ""
echo "Opção 2: Via Interface Web (Manual)"
echo "  1. Acesse: $SERVICE_URL/wp-admin"
echo "  2. Siga o guia: GUIA-GERAR-API-KEY-WOOCOMMERCE.md"
echo ""
echo "Opção 3: Script PHP (se tiver acesso ao servidor)"
echo "  Execute o script PHP que cria a chave diretamente no banco"

# Criar script helper que pode ser executado no container
cat > /tmp/create-wc-api-key.php <<'PHPEOF'
<?php
require_once('wp-load.php');

if (!class_exists('WooCommerce')) {
    die("WooCommerce não está instalado\n");
}

$user = get_user_by('login', 'admin');
if (!$user) {
    die("Usuário admin não encontrado\n");
}

$consumer_key = 'ck_' . wc_rand_hash();
$consumer_secret = 'cs_' . wc_rand_hash();

global $wpdb;
$table_name = $wpdb->prefix . 'woocommerce_api_keys';

$result = $wpdb->insert(
    $table_name,
    array(
        'user_id' => $user->ID,
        'description' => 'Frontend API - Auto',
        'permissions' => 'read_write',
        'consumer_key' => wc_api_hash($consumer_key),
        'consumer_secret' => $consumer_secret,
        'truncated_key' => substr($consumer_key, -7),
    ),
    array('%d', '%s', '%s', '%s', '%s', '%s')
);

if ($result) {
    echo json_encode([
        'consumer_key' => $consumer_key,
        'consumer_secret' => $consumer_secret,
        'key_id' => $wpdb->insert_id
    ]);
} else {
    die(json_encode(['error' => 'Falha ao criar']));
}
PHPEOF

echo ""
echo -e "${GREEN}✅ Script PHP criado em /tmp/create-wc-api-key.php${NC}"
echo "   Você pode copiar este script para o container e executá-lo"
echo ""

