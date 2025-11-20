# 🔧 Inicialização Manual do Medusa

## 📋 O que mudou

A inicialização automática foi removida do `docker-compose.yml`. Agora o container apenas inicia o Medusa em modo desenvolvimento, sem instalar dependências ou fazer setup do banco toda vez.

## ✅ Inicialização (Fazer apenas uma vez)

### 1. Instalar Dependências

```bash
docker exec xodozin-medusa sh -c "cd /app && yarn install"
```

### 2. Setup do Banco de Dados

```bash
docker exec xodozin-medusa sh -c "cd /app && echo 'xodozin' | DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa db:setup"
```

### 3. Configurar Região Brasil (Opcional)

```bash
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/setup-brasil.ts"
```

### 4. Criar Publishable API Key (Opcional)

```bash
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/create-publishable-key.ts"
```

## 🚀 Iniciar Medusa

Após a inicialização, o Medusa iniciará automaticamente quando o container for iniciado:

```bash
docker-compose up -d medusa
```

Ou se já estiver rodando:

```bash
docker-compose restart medusa
```

## 📝 Script de Inicialização Completa

Você pode criar um script para fazer tudo de uma vez:

```bash
#!/bin/bash
# inicializar-medusa.sh

echo "📦 Instalando dependências..."
docker exec xodozin-medusa sh -c "cd /app && yarn install"

echo "⏳ Aguardando banco estar pronto..."
sleep 5

echo "🔧 Executando setup do banco..."
docker exec xodozin-medusa sh -c "cd /app && echo 'xodozin' | DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa db:setup"

echo "🇧🇷 Configurando região Brasil..."
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/setup-brasil.ts"

echo "🔑 Criando publishable API key..."
docker exec xodozin-medusa sh -c "cd /app && DATABASE_URL='postgresql://postgres:postgres@postgres:5432/xodozin?sslmode=disable' yarn medusa exec ./src/scripts/create-publishable-key.ts"

echo "✅ Inicialização completa!"
```

## ⚠️ Quando Fazer Inicialização

Faça a inicialização apenas quando:
- ✅ Primeira vez configurando o projeto
- ✅ Após clonar o repositório
- ✅ Após limpar volumes do Docker
- ✅ Após mudanças significativas no banco de dados

**NÃO precisa fazer toda vez que reiniciar o container!**

