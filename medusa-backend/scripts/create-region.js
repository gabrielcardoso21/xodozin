/**
 * Script para criar região Brasil no Medusa
 * Execute: node scripts/create-region.js
 */

const axios = require('axios');
require('dotenv').config();

const MEDUSA_API_URL = process.env.MEDUSA_API_URL || 'http://localhost:9000';
const ADMIN_TOKEN = process.env.MEDUSA_ADMIN_TOKEN; // Token do admin (gerar via admin)

async function createBrazilRegion() {
  try {
    console.log('🇧🇷 Criando região Brasil no Medusa...');
    
    // Criar região Brasil
    const regionData = {
      name: 'Brasil',
      currency_code: 'brl',
      tax_rate: 0,
      payment_providers: [],
      fulfillment_providers: []
    };
    
    const response = await axios.post(
      `${MEDUSA_API_URL}/admin/regions`,
      regionData,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Região Brasil criada com sucesso!');
    console.log('ID da região:', response.data.region.id);
    console.log('');
    console.log('⚠️  IMPORTANTE: Use este ID nas chamadas da API:');
    console.log(`   Region ID: ${response.data.region.id}`);
    
    return response.data.region.id;
  } catch (error) {
    if (error.response) {
      console.error('❌ Erro ao criar região:', error.response.data);
    } else {
      console.error('❌ Erro:', error.message);
    }
    
    console.log('');
    console.log('💡 Alternativa: Crie a região manualmente via Admin:');
    console.log('   1. Acesse: http://localhost:7001 (Admin do Medusa)');
    console.log('   2. Vá em Settings > Regions');
    console.log('   3. Clique em "Add Region"');
    console.log('   4. Configure:');
    console.log('      - Name: Brasil');
    console.log('      - Currency: BRL (Real Brasileiro)');
    console.log('      - Tax Rate: 0');
    
    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  if (!ADMIN_TOKEN) {
    console.error('❌ MEDUSA_ADMIN_TOKEN não configurado no .env');
    console.log('');
    console.log('💡 Para obter o token:');
    console.log('   1. Acesse o Admin do Medusa: http://localhost:7001');
    console.log('   2. Faça login');
    console.log('   3. Vá em Settings > API Tokens');
    console.log('   4. Crie um novo token');
    console.log('   5. Adicione no .env: MEDUSA_ADMIN_TOKEN=seu-token-aqui');
    process.exit(1);
  }
  
  createBrazilRegion()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Erro fatal:', err);
      process.exit(1);
    });
}

module.exports = { createBrazilRegion };

