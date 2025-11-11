# 🐳 Como Usar - Docker Simples

## 🚀 Iniciar Tudo

```bash
./start-medusa.sh
```

Ou se tiver docker-compose instalado:

```bash
docker-compose up -d
```

Isso inicia:
- ✅ PostgreSQL (porta 5432)
- ✅ Redis (porta 6379)
- ✅ Medusa Backend (porta 9000)

## 🎨 Acessar Admin Panel

Após iniciar, aguarde ~30-60 segundos e acesse:

**http://localhost:9000/app**

## 📋 Comandos Úteis

```bash
# Ver logs
docker-compose logs -f medusa

# Parar tudo
docker-compose down

# Reiniciar
docker-compose restart medusa

# Ver status
docker-compose ps
```

## ⚙️ Configuração

Tudo está configurado no `docker-compose.yml`. Variáveis importantes:

- `DATABASE_URL`: Conexão com PostgreSQL
- `REDIS_URL`: Conexão com Redis
- `JWT_SECRET`: Secret para JWT (mude em produção!)
- `COOKIE_SECRET`: Secret para cookies (mude em produção!)

## 🎯 Próximos Passos

1. Acesse `http://localhost:9000/app`
2. Crie seu usuário admin
3. Configure produtos e collections
4. Pronto! 🎉

---

**Simples assim!** Um `docker-compose up -d` e tudo funciona.

