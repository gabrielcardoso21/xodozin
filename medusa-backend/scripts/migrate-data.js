/**
 * Script de migração de dados do MongoDB (FastAPI) para Medusa.js
 * 
 * Pré-requisitos:
 * - MongoDB rodando e acessível
 * - Medusa.js configurado e rodando
 * - Node.js >= 20
 * 
 * Uso:
 * node scripts/migrate-data.js
 */

const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config();

const MEDUSA_API_URL = process.env.MEDUSA_API_URL || process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'xodozin';
const ADMIN_TOKEN = process.env.MEDUSA_ADMIN_TOKEN;

/**
 * Conecta ao MongoDB e busca produtos
 */
async function getProductsFromMongo() {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL não configurada no .env');
  }
  
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  
  const products = await db.collection('products').find({}).toArray();
  await client.close();
  
  return products;
}

/**
 * Conecta ao MongoDB e busca kits
 */
async function getKitsFromMongo() {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL não configurada no .env');
  }
  
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  
  const kits = await db.collection('kits').find({}).toArray();
  await client.close();
  
  return kits;
}

/**
 * Cria produto no Medusa
 */
async function createProductInMedusa(product) {
  try {
    // Primeiro, criar o produto via Admin API
    // Nota: Em produção, você precisaria autenticar com Admin API
    // Por enquanto, vamos usar a Store API se disponível
    
    const productData = {
      title: product.name,
      description: product.description,
      handle: product.id.toLowerCase().replace(/\s+/g, '-'),
      status: 'published',
      images: [{ url: product.image_url }],
      metadata: {
        category: product.category, // sensorial, afetivo, ritualistico
        original_id: product.id
      },
      // Variantes
      options: [
        {
          title: 'Default',
          values: ['Default']
        }
      ],
      variants: [
        {
          title: 'Default',
          prices: [
            {
              amount: Math.round(product.price * 100), // Medusa usa centavos
              currency_code: 'brl'
            }
          ],
          options: {
            Default: 'Default'
          },
          inventory_quantity: 100 // Ajustar conforme necessário
        }
      ]
    };
    
    console.log(`Criando produto: ${product.name}`);
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (ADMIN_TOKEN) {
      headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
    }
    
    const response = await axios.post(`${MEDUSA_API_URL}/admin/products`, productData, {
      headers
    });
    
    return response.data;
  } catch (error) {
    console.error(`Erro ao criar produto ${product.name}:`, error.message);
    throw error;
  }
}

/**
 * Cria collection (kit) no Medusa
 */
async function createCollectionInMedusa(kit, productIds) {
  try {
    const collectionData = {
      title: kit.name,
      handle: kit.id.toLowerCase().replace(/\s+/g, '-'),
      metadata: {
        tier: kit.tier, // xodo, encanto, completo
        description: kit.description,
        price_min: kit.price_min,
        price_max: kit.price_max,
        original_id: kit.id
      }
    };
    
    console.log(`Criando collection: ${kit.name}`);
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (ADMIN_TOKEN) {
      headers['Authorization'] = `Bearer ${ADMIN_TOKEN}`;
    }
    
    const response = await axios.post(`${MEDUSA_API_URL}/admin/collections`, collectionData, {
      headers
    });
    
    // Adicionar produtos à collection
    if (productIds.length > 0) {
      await axios.post(`${MEDUSA_API_URL}/admin/collections/${response.data.collection.id}/products`, {
        product_ids: productIds
      }, {
        headers
      });
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erro ao criar collection ${kit.name}:`, error.message);
    throw error;
  }
}

/**
 * Função principal de migração
 */
async function migrate() {
  console.log('🚀 Iniciando migração de dados do MongoDB para Medusa.js...\n');
  
  // Verificar pré-requisitos
  if (!MONGO_URL) {
    console.error('❌ MONGO_URL não configurada no .env');
    console.log('   Configure: MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/');
    process.exit(1);
  }
  
  if (!ADMIN_TOKEN) {
    console.warn('⚠️  MEDUSA_ADMIN_TOKEN não configurado no .env');
    console.log('   O script tentará usar Admin API sem autenticação (pode falhar)');
    console.log('   Para obter o token:');
    console.log('   1. Acesse o Admin do Medusa: http://localhost:7001');
    console.log('   2. Faça login');
    console.log('   3. Vá em Settings > API Tokens');
    console.log('   4. Crie um novo token');
    console.log('   5. Adicione no .env: MEDUSA_ADMIN_TOKEN=seu-token-aqui');
    console.log('');
    console.log('   Continuando sem token (pode falhar)...\n');
  }
  
  try {
    // 1. Migrar produtos
    console.log('📦 Buscando produtos do MongoDB...');
    const products = await getProductsFromMongo();
    console.log(`Encontrados ${products.length} produtos\n`);
    
    const productIdMap = {}; // Mapeia ID antigo -> ID novo do Medusa
    
    for (const product of products) {
      try {
        const medusaProduct = await createProductInMedusa(product);
        productIdMap[product.id] = medusaProduct.product?.id || medusaProduct.id;
        console.log(`✅ Produto migrado: ${product.name} (ID: ${productIdMap[product.id]})`);
      } catch (error) {
        console.error(`❌ Erro ao migrar produto ${product.name}:`, error.response?.data || error.message);
        // Continuar com próximo produto
      }
    }
    
    // 2. Migrar kits (collections)
    console.log('\n📦 Buscando kits do MongoDB...');
    const kits = await getKitsFromMongo();
    console.log(`Encontrados ${kits.length} kits\n`);
    
    for (const kit of kits) {
      try {
        // Mapear IDs de produtos antigos para novos
        const productIds = kit.items
          .map(oldId => productIdMap[oldId])
          .filter(id => id !== undefined);
        
        await createCollectionInMedusa(kit, productIds);
        console.log(`✅ Kit migrado: ${kit.name}`);
      } catch (error) {
        console.error(`❌ Erro ao migrar kit ${kit.name}:`, error.response?.data || error.message);
        // Continuar com próximo kit
      }
    }
    
    console.log('\n✅ Migração concluída!');
  } catch (error) {
    console.error('\n❌ Erro na migração:', error);
    process.exit(1);
  }
}

// Executar migração
if (require.main === module) {
  migrate().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Erro fatal:', err);
    process.exit(1);
  });
}

module.exports = { migrate, getProductsFromMongo, getKitsFromMongo };

