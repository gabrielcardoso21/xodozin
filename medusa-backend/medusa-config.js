const plugins = [
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').AdminOptions} */
    options: {
      serve: process.env.NODE_ENV === "development",
    },
  },
];

// Adicionar Stripe se configurado
if (process.env.STRIPE_API_KEY) {
  plugins.push({
    resolve: "@medusajs/payment-stripe",
    options: {
      apiKey: process.env.STRIPE_API_KEY,
    },
  });
}

// Detectar tipo de banco de dados
const databaseUrl = process.env.DATABASE_URL || "";
const isSQLite = databaseUrl.startsWith("sqlite://");
const databaseType = isSQLite ? "sqlite" : "postgres";

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig: {
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    database_url: process.env.DATABASE_URL,
    database_type: databaseType,
    // Medusa 2.x usa database_extra para configurações do Knex
    ...(databaseType === "postgres" ? {
      database_extra: {
        pool: {
          min: 0,
          max: 3,
          idleTimeoutMillis: 10000,
          acquireTimeoutMillis: 30000,
        },
      },
    } : {}),
    store_cors: process.env.CORS || "http://localhost:3000",
    admin_cors: process.env.ADMIN_CORS || "http://localhost:7001",
    redis_url: process.env.REDIS_URL,
  },
  plugins,
};

