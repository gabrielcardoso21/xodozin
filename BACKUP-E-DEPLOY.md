# 💾 Backup e Deploy - Dados no Banco

## ✅ Sim, tudo fica no banco PostgreSQL!

Todos os dados do Medusa são armazenados no banco de dados PostgreSQL, incluindo:

- ✅ **Usuários** (Gabriel e Anne)
- ✅ **Regiões** (Brasil)
- ✅ **Moedas** (BRL)
- ✅ **Produtos**
- ✅ **Pedidos**
- ✅ **Clientes**
- ✅ **Configurações do Store**
- ✅ **Stock Locations**
- ✅ **Shipping Options**
- ✅ **Tax Regions**

## 💾 Fazer Backup do Banco

### Backup Local

```bash
# Fazer backup
docker exec xodozin-postgres pg_dump -U postgres xodozin > backup_$(date +%Y%m%d_%H%M%S).sql

# Ou usando o script já existente
./scripts/backup-banco.sh
```

### Restaurar Backup

```bash
# Restaurar backup
docker exec -i xodozin-postgres psql -U postgres xodozin < backup_20241111_120000.sql

# Ou usando o script
./scripts/restore-banco.sh backup_20241111_120000.sql
```

## 🚀 Deploy Gratuito com Dados

Quando você fizer deploy em Railway, Render ou Fly.io:

### 1. Fazer Backup Antes do Deploy

```bash
# Fazer backup completo
docker exec xodozin-postgres pg_dump -U postgres xodozin > backup_pre_deploy.sql
```

### 2. No Deploy, os Dados Serão Preservados Se:

- ✅ Você usar o mesmo banco PostgreSQL (migração)
- ✅ Você restaurar o backup no novo banco
- ✅ Você configurar a `DATABASE_URL` apontando para o banco com dados

### 3. Restaurar Backup no Deploy

#### Railway
```bash
# Conectar ao banco Railway
railway connect postgres

# Restaurar backup
psql $DATABASE_URL < backup_pre_deploy.sql
```

#### Render
```bash
# Via Render Dashboard ou CLI
# Upload do arquivo SQL e restaurar via interface
```

#### Fly.io
```bash
# Conectar ao banco
fly postgres connect

# Restaurar backup
psql < backup_pre_deploy.sql
```

## 📋 Checklist de Deploy com Dados

- [ ] Fazer backup do banco local
- [ ] Criar banco PostgreSQL na plataforma de deploy
- [ ] Restaurar backup no novo banco
- [ ] Configurar `DATABASE_URL` na plataforma
- [ ] Executar `yarn setup:brasil` (se necessário)
- [ ] Verificar se usuários estão presentes
- [ ] Testar login com Gabriel e Anne

## ⚠️ Importante

1. **Usuários**: Os usuários criados via CLI ficam no banco, mas as senhas são hasheadas. No deploy, você precisará:
   - Restaurar o backup (usuários estarão lá)
   - OU recriar os usuários via CLI no deploy

2. **Configurações**: Todas as configurações (região, moeda, etc.) ficam no banco e serão preservadas no backup.

3. **Scripts de Setup**: Os scripts `setup:brasil` e `setup:users` podem ser executados novamente no deploy se necessário (eles verificam se já existem antes de criar).

## 🔄 Processo Recomendado para Deploy

1. **Fazer backup local**
2. **Fazer deploy da aplicação**
3. **Criar banco PostgreSQL na plataforma**
4. **Restaurar backup no banco da plataforma**
5. **Configurar DATABASE_URL**
6. **Executar scripts de setup (se necessário)**
7. **Verificar se tudo está funcionando**

## 📝 Notas

- O backup SQL contém TODOS os dados, incluindo usuários, produtos, pedidos, etc.
- Ao restaurar o backup, você terá exatamente o mesmo estado do banco local
- Os scripts de setup são idempotentes (podem ser executados várias vezes sem problemas)

