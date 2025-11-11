# 🎨 Como Acessar o Admin Panel do Medusa

## ✅ Status Atual

O Medusa está configurado para usar o **Admin Panel oficial** do Medusa.js 2.x.

## 🌐 URLs de Acesso

### Admin Panel (Interface Gráfica)
- **URL Principal:** `http://localhost:9000/app`
- **URL Alternativa:** `http://localhost:9000/admin`

### APIs
- **Store API:** `http://localhost:9000/store`
- **Admin API:** `http://localhost:9000/admin`
- **Health Check:** `http://localhost:9000/health`

## 🚀 Como Iniciar

### Opção 1: Usando Docker (Recomendado)

```bash
# Iniciar todos os serviços
docker compose -f docker-compose.dev.yml up -d

# Ver logs do backend
docker logs -f xodozin-medusa-backend
```

O Admin Panel será servido automaticamente quando o `medusa develop` iniciar.

### Opção 2: Manual (Local)

```bash
cd medusa-backend

# Instalar dependências (se necessário)
npm install --legacy-peer-deps

# Iniciar em modo desenvolvimento (com Admin Panel)
npm run dev
# ou
npx medusa develop
```

## 👤 Criar Usuário Admin

Se for a primeira vez acessando, você precisará criar um usuário admin:

```bash
# Dentro do container ou localmente
cd medusa-backend
npx medusa user -e admin@xodozin.com -p sua-senha-segura
```

Ou acesse `http://localhost:9000/app` e siga o processo de onboarding.

## 🔧 Configuração

O Admin Panel está configurado em `medusa-config.js`:

```javascript
{
  resolve: "@medusajs/admin",
  options: {
    serve: process.env.NODE_ENV === "development", // true em desenvolvimento
  },
}
```

## ⚠️ Troubleshooting

### Admin Panel não aparece

1. **Verificar se `medusa develop` está rodando:**
   ```bash
   docker logs xodozin-medusa-backend | grep -i "admin\|app"
   ```

2. **Verificar se `NODE_ENV=development`:**
   ```bash
   docker exec xodozin-medusa-backend sh -c "echo \$NODE_ENV"
   ```
   Deve retornar `development`

3. **Verificar se `@medusajs/admin` está instalado:**
   ```bash
   docker exec xodozin-medusa-backend sh -c "cd /app && ls node_modules/@medusajs/admin"
   ```

4. **Reiniciar o container:**
   ```bash
   docker restart xodozin-medusa-backend
   ```

### Erro de CORS

Se você ver erros de CORS ao acessar o Admin Panel, verifique:

```bash
# Verificar ADMIN_CORS no .env
docker exec xodozin-medusa-backend sh -c "cd /app && grep ADMIN_CORS .env"
```

Deve incluir `http://localhost:3000` e `http://localhost:7001`.

## 📚 Recursos do Admin Panel

Com o Admin Panel você pode:

- ✅ **Gerenciar Produtos:** Adicionar, editar, remover produtos
- ✅ **Gerenciar Collections:** Criar e organizar kits/coleções
- ✅ **Gerenciar Pedidos:** Ver e processar pedidos
- ✅ **Gerenciar Estoque:** Controlar níveis de estoque
- ✅ **Configurar Regiões:** Definir regiões de entrega e moedas
- ✅ **Configurar Pagamentos:** Integrar métodos de pagamento
- ✅ **Gerenciar Usuários:** Criar e gerenciar usuários admin

## 🎯 Próximos Passos

1. Acesse `http://localhost:9000/app`
2. Crie seu usuário admin (se necessário)
3. Configure a região "Brasil" com moeda BRL
4. Adicione produtos e collections
5. Configure métodos de pagamento

---

**Última atualização:** $(date)

