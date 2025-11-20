# 🔧 Troubleshooting

## Problemas Comuns

### Admin Panel não carrega

**Sintomas:**
- Página em branco em http://localhost:9000/app
- Erro no console do navegador

**Soluções:**
1. Verificar se o container está rodando:
   ```bash
   docker ps | grep xodozin-medusa
   ```

2. Verificar logs:
   ```bash
   docker logs xodozin-medusa --tail 50
   ```

3. Aguardar 2-3 minutos após iniciar (compilação do Vite)

4. Limpar cache e reiniciar:
   ```bash
   docker-compose restart medusa
   ```

### Erros de WebSocket

**Sintomas:**
- Erros no console: `WebSocket connection to 'ws://localhost:XXXXX' failed`
- `ERR_CONNECTION_REFUSED`

**Solução:**
- **Isso é normal no Docker!** Os erros de WebSocket são apenas avisos de que o HMR (Hot Module Replacement) não funciona no Docker.
- O Admin Panel funciona normalmente, apenas sem atualizações automáticas.
- Para atualizar, recarregue a página manualmente (F5).

### Erro de i18n

**Sintomas:**
- Erro: `Failed to resolve import "/src/admin/i18n/index.ts"`

**Solução:**
1. Verificar se o arquivo existe:
   ```bash
   docker exec xodozin-medusa sh -c "cd /app && ls -la src/admin/i18n/"
   ```

2. Se não existir, criar:
   ```bash
   docker exec xodozin-medusa sh -c "cd /app && mkdir -p src/admin/i18n && echo 'export default {}' > src/admin/i18n/index.ts"
   ```

3. Reiniciar container:
   ```bash
   docker-compose restart medusa
   ```

### Banco de dados não conecta

**Sintomas:**
- Erro: `connection timeout` ou `connection refused`

**Soluções:**
1. Verificar se o PostgreSQL está rodando:
   ```bash
   docker ps | grep postgres
   ```

2. Verificar health check:
   ```bash
   docker exec xodozin-postgres pg_isready -U postgres
   ```

3. Verificar variável de ambiente:
   ```bash
   docker exec xodozin-medusa sh -c "echo \$DATABASE_URL"
   ```

### Porta já em uso

**Sintomas:**
- Erro: `port is already allocated`

**Solução:**
1. Verificar qual processo está usando a porta:
   ```bash
   sudo lsof -i :9000
   ```

2. Parar o processo ou mudar a porta no `docker-compose.yml`

## Limpeza

### Limpar imagens Docker não usadas

```bash
docker image prune -a
```

### Limpar volumes não usados

```bash
docker volume prune
```

### Limpar tudo (cuidado!)

```bash
docker system prune -a --volumes
```

