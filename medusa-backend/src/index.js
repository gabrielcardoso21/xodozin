// Medusa.js 2.x - Servidor temporário funcional
// Usar servidor Express enquanto Medusa completo é configurado

console.log("🚀 Iniciando Medusa.js...");
console.log("📝 Usando servidor temporário (funcional)...");

const express = require("express");
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Medusa backend is running" });
});

// Store API - Products
app.get("/store/products", (_req, res) => {
  res.json({ products: [], count: 0 });
});

// Store API - Collections
app.get("/store/collections", (_req, res) => {
  res.json({ collections: [], count: 0 });
});

// Store API - Quiz Suggest
app.post("/store/quiz/suggest", (req, res) => {
  const { recipient, moment, feeling } = req.body || {};
  
  res.json({ 
    ritual_name: getRitualName(recipient),
    suggested_products: [],
    categories: { sensorial: 0, afetivo: 0, ritualistico: 0 }
  });
});

// Helper function
function getRitualName(recipient) {
  const names = {
    'parceiro': 'Ritual do Amor',
    'amigo': 'Ritual da Amizade',
    'familia': 'Ritual do Aconchego',
    'proprio': 'Ritual do Autocuidado',
    'colega': 'Ritual da Conexão'
  };
  return names[recipient] || 'Ritual Especial';
}

app.listen(port, () => {
  console.log(`✅ Medusa server is running on port ${port}`);
  console.log(`📡 Health check: http://localhost:${port}/health`);
  console.log(`📦 Products API: http://localhost:${port}/store/products`);
});

