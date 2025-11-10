# 🐳 Instalação do Medusa.js com Docker

## ✅ Por que Docker?

- ✅ **Mais rápido** - Não precisa instalar Node.js, PostgreSQL, Redis manualmente
- ✅ **Mais confiável** - Ambiente isolado e consistente
- ✅ **Mais fácil** - Um comando e tudo funciona
- ✅ **Mais portável** - Funciona em qualquer máquina com Docker

---

## 🚀 Instalação Rápida

### 1. Verificar Docker

```bash
docker --version
```

Se não tiver instalado:
```bash
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Instalar Docker Compose

```bash
# Opção 1: Via apt (recomendado)
sudo apt install docker-compose

# Opção 2: Via script
./install-docker-compose.sh
```

### 3. Iniciar tudo

```bash
# Usar script automático (recomendado)
./start-medusa-docker.sh

# Ou manualmente
docker-compose -f docker-compose.dev.yml up --build -d
```

### 4. Executar Migrações

```bash
docker exec -it xodozin-medusa-backend npx medusa migrations run
```

### 5. Testar

```bash
curl http://localhost:9000/store/products
```

---

## 📋 Comandos Úteis

### Ver logs
```bash
docker-compose -f docker-compose.dev.yml logs -f medusa-backend
```

### Parar serviços
```bash
docker-compose -f docker-compose.dev.yml down
```

### Reiniciar
```bash
docker-compose -f docker-compose.dev.yml restart medusa-backend
```

### Executar comandos no container
```bash
# Shell do container
docker exec -it xodozin-medusa-backend sh

# Executar migrações
docker exec -it xodozin-medusa-backend npx medusa migrations run

# Migrar dados
docker exec -it xodozin-medusa-backend node scripts/migrate-data.js
```

---

## 🎯 Próximos Passos

1. ✅ Docker instalado
2. ✅ Docker Compose instalado
3. ⏭️ Executar `./start-medusa-docker.sh`
4. ⏭️ Executar migrações
5. ⏭️ Migrar dados (opcional)
6. ⏭️ Testar API
7. ⏭️ Ativar no frontend

---

## 📚 Documentação

- `DOCKER-MEDUSA.md` - Guia completo do Docker
- `docker-compose.dev.yml` - Configuração de desenvolvimento
- `docker-compose.yml` - Configuração de produção

