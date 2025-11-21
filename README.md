# Xodozin - E-commerce com Odoo v18

Sistema de e-commerce para venda de rituais de presente personalizados, utilizando Odoo v18 como backend e React como frontend.

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### Estrutura do Projeto

```
xodozin/
├── frontend/              # Frontend React (servido por Nginx)
│   ├── src/
│   │   └── utils/
│   │       ├── odoo-api.js      # API Odoo (JSON-RPC)
│   │       ├── odoo-adapter.js  # Adaptador de dados
│   │       └── api-hybrid.js    # API híbrida (usa Odoo)
│   └── Dockerfile
├── odoo/                  # Backend Odoo v18 (Doodba)
│   ├── Dockerfile
│   ├── prod.yaml          # Configurações de produção
│   ├── devel.yaml         # Configurações de desenvolvimento
│   ├── repos.yaml         # Repositórios de módulos
│   ├── ENV-VARIABLES.md   # Documentação de variáveis
│   └── odoo/custom/src/private/  # Módulos customizados
├── docker/                # Configurações Docker
│   ├── nginx-frontend.conf  # Configuração Nginx
│   └── odoo.conf          # Configuração Odoo
├── docker-compose.yml     # Docker Compose para produção
├── docker-compose.dev.yml # Docker Compose para desenvolvimento
├── scripts/               # Scripts de automação
│   ├── setup-odoo-contabo.sh
│   ├── deploy-odoo-contabo.sh
│   └── configure-frontend-odoo.sh
└── README.md              # Este arquivo
```

## 🌐 URLs

### Desenvolvimento Local (Docker Compose)
- **Frontend + Odoo**: http://localhost (porta 80)
- **Odoo direto**: http://localhost:8069
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Produção (Contabo)
- **Odoo**: http://193.203.15.173:8069 (ou configurar domínio)
- **Frontend**: http://193.203.15.173 (ou configurar domínio)

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Odoo
ADMIN_PASSWORD=admin
DB_USER=odoo
DB_PASSWORD=odoo
DB_NAME=xodozin

# Frontend (usado em runtime, não em build)
REACT_APP_ODOO_DATABASE=xodozin
REACT_APP_ODOO_USERNAME=admin
REACT_APP_ODOO_PASSWORD=admin
```

**Importante**: O frontend usa `window.location.origin` em runtime para determinar a URL do Odoo, então não precisa configurar `REACT_APP_ODOO_URL` (o Nginx faz proxy automaticamente).

## 🚀 Setup Local

### Opção 1: Docker Compose (Recomendado)

```bash
# Construir e iniciar todos os serviços
docker compose up --build -d

# Ver logs
docker compose logs -f

# Parar serviços
docker compose down
```

O frontend estará disponível em `http://localhost` e o Odoo em `http://localhost:8069`.

**Primeira inicialização do Odoo:**
Na primeira vez, o Odoo precisa inicializar o banco de dados. Isso pode levar alguns minutos. Verifique os logs:

```bash
docker compose logs -f odoo
```

Quando o Odoo estiver pronto, acesse `http://localhost:8069` e configure o banco de dados.

### Opção 2: Desenvolvimento (Frontend separado)

```bash
# Iniciar apenas Odoo e banco
docker compose up db redis odoo -d

# No frontend, instalar dependências e iniciar dev server
cd frontend
yarn install
yarn start
```

## 📦 Deploy no Contabo

### Setup Inicial

```bash
# Executar script de setup
./scripts/setup-odoo-contabo.sh

# Configurar .env no servidor
ssh root@193.203.15.173
cd /opt/xodozin
nano .env  # Configurar variáveis

# Iniciar serviços
docker compose up -d
```

### Deploy de Atualizações

```bash
# Executar script de deploy
./scripts/deploy-odoo-contabo.sh
```

## 📚 Documentação

### Manuais de Uso (para usuários finais)
- [📚 Manual Índice](./MANUAL-INDICE.md) - Índice principal com visão geral
- [📦 Manual de Produtos](./MANUAL-PRODUTOS.md) - Como criar e gerenciar produtos
- [🎁 Manual de Kits](./MANUAL-KITS.md) - Como criar e gerenciar kits
- [✨ Manual de Rituais](./MANUAL-RITUAIS.md) - Como configurar rituais
- [⚙️ Configurações Avançadas](./MANUAL-CONFIGURACOES-AVANCADAS.md) - Configurações avançadas

### Documentação Técnica
- [🐳 Docker Setup](./DOCKER-SETUP.md) - Guia completo de setup Docker
- [🔧 Odoo Setup](./ODOO-SETUP.md) - Guia completo de setup do Odoo
- [🔗 Integração Frontend](./ODOO-INTEGRACAO.md) - Guia de integração frontend
- [🚀 Deploy Contabo](./ODOO-DEPLOY.md) - Guia de deploy no Contabo
- [🎯 Conceitos Nativos Odoo](./ODOO-CONCEITOS-NATIVOS.md) - Como usar conceitos nativos do Odoo
- [📝 Variáveis de Ambiente](./odoo/ENV-VARIABLES.md) - Documentação de variáveis

## 🔧 Troubleshooting

### Odoo não inicia
1. Verificar logs: `docker compose logs odoo`
2. Verificar banco de dados: `docker compose logs db`
3. Verificar variáveis de ambiente no `.env`

### Frontend não conecta ao Odoo
1. Verificar se Odoo está rodando: `curl http://localhost:8069/web/webclient/version_info`
2. Verificar logs do Nginx: `docker compose logs frontend`
3. Verificar se o proxy Nginx está funcionando: `curl http://localhost/jsonrpc`

### Erros de CORS
O Nginx já está configurado para adicionar headers CORS automaticamente. Se ainda houver problemas:
1. Verificar `docker/nginx-frontend.conf`
2. Verificar se o frontend está usando `window.location.origin` (não hardcoded `localhost:8069`)

### Produtos/Kits não aparecem no site
1. Verificar se estão marcados como "Pode ser Vendido" no Odoo
2. Verificar se estão marcados como "Publicado no Website" no Odoo
3. Verificar se o tipo do kit é "Combo" (para kits)

## 🛠️ Tecnologias

- **Backend**: Odoo v18 (Doodba)
- **Frontend**: React 19 + Radix UI
- **Banco de Dados**: PostgreSQL 15
- **Cache**: Redis 7
- **Web Server**: Nginx (para frontend e proxy reverso)
- **Deploy**: Docker + Docker Compose
- **Servidor**: Contabo (193.203.15.173)

## 📝 Próximos Passos

1. ✅ Setup básico do Odoo v18
2. ✅ Integração frontend com Odoo
3. ✅ Manuais de uso completos
4. ⏳ Configurar métodos de pagamento
5. ⏳ Configurar métodos de envio
6. ⏳ Módulo de quiz customizado
7. ⏳ Integração Focus NFe

## 🤝 Contribuindo

Este é um projeto privado. Para dúvidas ou sugestões, entre em contato com o mantenedor.

## 📄 Licença

Proprietário - Todos os direitos reservados.
