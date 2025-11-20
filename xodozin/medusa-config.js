// Este arquivo é gerado automaticamente durante o build
// Compilado de medusa-config.ts
// Se este arquivo não existir, o build deve compilar medusa-config.ts para gerá-lo

const { loadEnv, defineConfig } = require('@medusajs/framework/utils');

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      // Render requer que a porta seja um número, não string
      port: parseInt(process.env.PORT || "9000", 10),
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:7001",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  featureFlags: {
  }
});

