# Medusa Backend - Xodózin

Backend e-commerce usando Medusa.js para gerenciar produtos, pedidos, pagamentos e estoque.

## Pré-requisitos

- Node.js >= 20
- PostgreSQL ou SQLite
- Redis (opcional, mas recomendado)

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar migrações
npm run build
npx medusa migrations run

# Iniciar servidor de desenvolvimento
npm run dev
```

## Estrutura

```
medusa-backend/
├── src/
│   ├── api/              # Endpoints customizados
│   │   └── store/        # Endpoints públicos (Store API)
│   │       └── quiz/     # Endpoint customizado para Quiz
│   ├── models/           # Modelos customizados
│   └── services/         # Serviços customizados
├── medusa-config.js      # Configuração do Medusa
└── package.json
```

## API Endpoints

### Store API (Pública)

- `GET /store/products` - Listar produtos
- `GET /store/products/:id` - Buscar produto
- `GET /store/collections` - Listar collections (kits)
- `GET /store/collections/:id` - Buscar collection
- `POST /store/carts` - Criar carrinho
- `POST /store/carts/:id/line-items` - Adicionar item ao carrinho
- `POST /store/carts/:id/complete` - Finalizar pedido
- `POST /store/quiz/suggest` - Sugestão de produtos baseado no quiz (customizado)

## Variáveis de Ambiente

Ver `.env.example` para lista completa.

Principais:
- `DATABASE_URL` - URL do banco de dados
- `REDIS_URL` - URL do Redis (opcional)
- `JWT_SECRET` - Secret para JWT
- `COOKIE_SECRET` - Secret para cookies
- `CORS` - URL do frontend para CORS

