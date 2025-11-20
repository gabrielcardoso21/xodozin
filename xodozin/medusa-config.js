// Este arquivo é gerado automaticamente durante o build
// Se não existir, o Medusa tentará usar medusa-config.ts diretamente
// Mas para garantir compatibilidade, criamos este wrapper

// Tentar carregar o TypeScript usando ts-node se disponível
try {
  require('ts-node/register');
  module.exports = require('./medusa-config.ts');
} catch (e) {
  // Se ts-node não estiver disponível, tentar carregar o arquivo compilado
  try {
    module.exports = require('./.medusa/server/medusa-config.js');
  } catch (e2) {
    // Se nada funcionar, tentar o arquivo TypeScript diretamente (pode funcionar em alguns ambientes)
    try {
      module.exports = require('./medusa-config.ts');
    } catch (e3) {
      console.error('Erro ao carregar medusa-config:', e3.message);
      throw e3;
    }
  }
}

