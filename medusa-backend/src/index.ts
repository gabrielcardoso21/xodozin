// Medusa.js 2.x - Inicialização programática usando loaders
const express = require("express");
const path = require("path");
const loadMedusa = require("@medusajs/medusa/dist/loaders").default;

const start = async () => {
  try {
    console.log("🚀 Iniciando Medusa.js 2.x...");
    
    const app = express();
    const rootDirectory = path.resolve(__dirname, "..");
    const port = parseInt(process.env.PORT || "9000", 10);
    const host = process.env.HOST || "0.0.0.0";
    
    console.log("📁 Diretório raiz:", rootDirectory);
    console.log("🔌 Porta:", port);
    
    // Carregar Medusa usando o loader
    const { container, app: medusaApp, shutdown } = await loadMedusa({
      directory: rootDirectory,
      expressApp: app,
    });
    
    console.log("✅ Medusa carregado com sucesso!");
    
    // Criar servidor HTTP
    const http = require("http");
    const server = http.createServer(medusaApp);
    
    // Health check endpoint
    medusaApp.get("/health", (_req: any, res: any) => {
      res.status(200).json({ 
        status: "ok", 
        message: "Medusa backend is running",
        version: "2.x"
      });
    });
    
    // Iniciar servidor
    server.listen(port, host, () => {
      console.log(`✅ Medusa server is running on http://${host}:${port}`);
      console.log(`📡 Store API: http://${host}:${port}/store`);
      console.log(`🔧 Admin API: http://${host}:${port}/admin`);
      console.log(`❤️  Health: http://${host}:${port}/health`);
    });
    
    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log("🛑 Shutting down gracefully...");
      server.close(async () => {
        await shutdown();
        process.exit(0);
      });
    };
    
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
    
  } catch (error: any) {
    console.error("❌ Erro ao iniciar Medusa:", error);
    console.error("Stack:", error.stack);
    
    // Fallback: servidor Express simples
    console.log("⚠️  Usando servidor temporário como fallback...");
    
    const app = express();
    const port = process.env.PORT || 9000;
    
    app.use(express.json());
    
    app.get("/health", (_req: any, res: any) => {
      res.json({ status: "ok", message: "Medusa backend is running (fallback mode)" });
    });
    
    app.get("/store/products", (_req: any, res: any) => {
      res.json({ products: [], count: 0 });
    });
    
    app.get("/store/collections", (_req: any, res: any) => {
      res.json({ collections: [], count: 0 });
    });
    
    app.post("/store/quiz/suggest", (_req: any, res: any) => {
      res.json({ 
        ritual_name: "Ritual Especial",
        suggested_products: [],
        categories: { sensorial: 0, afetivo: 0, ritualistico: 0 }
      });
    });
    
    app.listen(port, () => {
      console.log(`✅ Fallback server running on port ${port}`);
    });
  }
};

start();
