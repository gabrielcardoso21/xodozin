# Xodozin - E-commerce com Medusa.js

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

### Iniciar o Projeto

```bash
# Iniciar todos os serviços
docker-compose up -d

# Aguardar inicialização (2-3 minutos)
# Acessar Admin Panel: http://localhost:9000/app
```

### Inicialização Manual (Primeira Vez)

```bash
# Executar setup inicial
./INICIALIZAR-MEDUSA.sh
```

## 📁 Estrutura do Projeto

```
xodozin/
├── docker-compose.yml      # Configuração Docker
├── xodozin/                # Backend Medusa v2
│   ├── medusa-config.ts   # Configuração do Medusa
│   └── src/
│       ├── admin/         # Customizações do Admin Panel
│       ├── api/           # Endpoints customizados
│       └── scripts/       # Scripts de setup
├── frontend/              # Frontend React
└── INICIALIZAR-MEDUSA.sh  # Script de inicialização
```

## 🌐 URLs

- **Admin Panel**: http://localhost:9000/app
- **Store API**: http://localhost:9000/store
- **Admin API**: http://localhost:9000/admin
- **Health Check**: http://localhost:9000/health

## ⚙️ Configuração

### Variáveis de Ambiente

As variáveis de ambiente estão configuradas no `docker-compose.yml`:
- `DATABASE_URL`: PostgreSQL
- `REDIS_URL`: Redis
- `JWT_SECRET`: Secret para JWT
- `COOKIE_SECRET`: Secret para cookies
- `STORE_CORS`: CORS para Store API
- `ADMIN_CORS`: CORS para Admin Panel

### Configurar Brasil

Após inicializar, execute:

```bash
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/setup-brasil.ts"
```

## 🔧 Troubleshooting

### Admin Panel não carrega

1. Verificar se o container está rodando: `docker ps`
2. Verificar logs: `docker logs xodozin-medusa`
3. Aguardar 2-3 minutos após iniciar (compilação do Vite)

### Erros de WebSocket

Os erros de WebSocket são apenas avisos (HMR não funciona no Docker). O Admin Panel funciona normalmente, apenas sem atualizações automáticas.

### Problemas de i18n

Se houver erro de i18n, verificar se o arquivo `src/admin/i18n/index.ts` existe:

```bash
docker exec xodozin-medusa sh -c "cd /app && ls -la src/admin/i18n/"
```

## 📝 Próximos Passos

1. ✅ Configurar região Brasil
2. ⏳ Migrar dados do MongoDB para PostgreSQL
3. ⏳ Configurar métodos de pagamento (Mercado Pago, Pix)
4. ⏳ Integrar API de NF (Focus NFe ou NFe.io)
5. ⏳ Configurar deploy em produção

## 📚 Documentação Adicional

- [Configuração](./CONFIGURACAO.md) - Configuração do Medusa e Brasil
- [Integração Frontend](./INTEGRACAO.md) - Integração do frontend com Medusa
- [Troubleshooting](./TROUBLESHOOTING.md) - Solução de problemas comuns
- [Configurar Brasil](./CONFIGURAR-MEDUSA-BRASIL.md) - Configuração específica do Brasil
- [Orquestração Containers](./ORQUESTRACAO-CONTAINERS-MVP.md) - Opções de orquestração para MVP
