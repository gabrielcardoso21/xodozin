import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseExtra: {
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 60000,
      },
    },
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:7001",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // Configuração de locale padrão para Brasil
    // O Medusa v2 usa a configuração do store para determinar locale e formatação
    // Esta configuração será aplicada quando o store for criado/atualizado
    store: {
      // Locale padrão será configurado via script setup-brasil.ts
      // A moeda BRL e região Brasil já são configuradas automaticamente
    }
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
