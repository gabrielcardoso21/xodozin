// Medusa 2.x usa uma estrutura diferente
// Por enquanto, vamos usar um servidor simples que será substituído
// quando o Medusa estiver totalmente configurado

console.log("🚀 Iniciando Medusa.js...");
console.log("⚠️  Medusa 2.x requer configuração específica");
console.log("📝 Usando servidor temporário...");

// Servidor temporário para testar
import express from "express";

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Medusa backend is running" });
});

app.get("/store/products", (req, res) => {
  res.json({ products: [], count: 0 });
});

app.get("/store/collections", (req, res) => {
  res.json({ collections: [], count: 0 });
});

app.post("/store/quiz/suggest", (req, res) => {
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
