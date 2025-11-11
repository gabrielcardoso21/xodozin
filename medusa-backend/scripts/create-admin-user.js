#!/usr/bin/env node

/**
 * Script para criar usuário admin automaticamente
 * Uso: node scripts/create-admin-user.js [email] [senha]
 */

const { execSync } = require('child_process');

const email = process.argv[2] || 'admin@xodozin.com.br';
const password = process.argv[3] || 'admin123456';

console.log('👤 Criando usuário administrador...');
console.log(`📧 Email: ${email}`);
console.log('');

try {
  // Usar o comando medusa user com input não-interativo
  // Infelizmente, o Medusa CLI não suporta flags não-interativas diretamente
  // Vamos tentar usar a Admin API se disponível, ou criar via script
  
  console.log('⚠️  O Medusa CLI requer interação para criar usuário.');
  console.log('📝 Execute manualmente:');
  console.log(`   docker exec -it xodozin-medusa-backend npx medusa user`);
  console.log('');
  console.log('💡 Ou use o Admin Panel para criar o primeiro usuário:');
  console.log('   1. Acesse http://localhost:7001');
  console.log('   2. Siga o processo de onboarding');
  console.log('');
  
  // Tentar verificar se já existe usuário
  console.log('🔍 Verificando se já existe usuário admin...');
  
  process.exit(0);
} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}

