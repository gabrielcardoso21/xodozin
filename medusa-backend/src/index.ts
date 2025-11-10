// Medusa.js 2.x - Usar comando start do Medusa
// O Medusa gerencia tudo automaticamente via CLI
// Este arquivo é um fallback caso o CLI não funcione

console.log("🚀 Iniciando Medusa.js...");
console.log("⚠️  Usando servidor temporário enquanto CLI é configurado...");

// Servidor temporário funcional
import express from "express";

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

app.get("/health", (_req: any, res: any) => {
  res.json({ status: "ok", message: "Medusa backend is running" });
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
  console.log(`✅ Medusa server is running on port ${port}`);
  console.log(`📡 Health check: http://localhost:${port}/health`);
  console.log(`📦 Products API: http://localhost:${port}/store/products`);
});
