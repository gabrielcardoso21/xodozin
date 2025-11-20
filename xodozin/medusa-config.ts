import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // databaseExtra removido - não suportado no Medusa v2
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:7001",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // Configuração de locale padrão para Brasil
    // O Medusa v2 usa a configuração do store para determinar locale e formatação
    // Esta configuração será aplicada quando o store for criado/atualizado via script setup-brasil.ts
  },
  // Configuração de Payment Providers
  // Variáveis de ambiente necessárias:
  // - STRIPE_SECRET_KEY: Chave secreta do Stripe (opcional)
  // - MERCADOPAGO_ACCESS_TOKEN: Token de acesso do Mercado Pago (opcional)
  // - FOCUS_NFE_TOKEN: Token da API Focus NFe para emissão de notas fiscais (opcional)
  // - FOCUS_NFE_ENVIRONMENT: Ambiente da Focus NFe (production/sandbox)
  // - COMPANY_CNPJ: CNPJ da empresa para emissão de NFe
  // - COMPANY_NAME: Nome da empresa
  // - COMPANY_ADDRESS: Endereço completo da empresa
  featureFlags: {
    // Flags de feature podem ser adicionadas aqui
  }
})
