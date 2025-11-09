# 🚀 Como Rodar Localmente

## Pré-requisitos

- Python 3.8+ instalado
- Node.js e Yarn instalados
- MongoDB Atlas configurado (ou MongoDB local)

---

## 📋 Passo 1: Configurar Backend

### 1.1. Criar arquivo `.env` no backend

```bash
cd backend
nano .env
# ou
vim .env
```

### 1.2. Adicionar as seguintes variáveis no arquivo `.env`:

```env
MONGO_URL=mongodb+srv://xodozin_db_user:hLknhhO2wEuJwHru@xodozin.mnii2px.mongodb.net/?appName=xodozin
DB_NAME=xodozin
CORS_ORIGINS=http://localhost:3000
```

### 1.3. Instalar dependências e rodar:

```bash
# Instalar dependências
pip install -r requirements.txt

# Rodar o servidor
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

O backend estará rodando em: `http://localhost:8000`

---

## 📋 Passo 2: Configurar Frontend

### 2.1. Criar arquivo `.env` no frontend

```bash
cd frontend
nano .env
# ou
vim .env
```

### 2.2. Adicionar a seguinte variável no arquivo `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 2.3. Instalar dependências e rodar:

```bash
# Instalar dependências
yarn install

# Rodar o servidor de desenvolvimento
yarn start
```

O frontend estará rodando em: `http://localhost:3000`

---

## ✅ Testar Localmente

1. Acesse: `http://localhost:3000`
2. Teste o Quiz
3. Teste a seleção de produtos
4. Teste o Checkout

---

## 🔧 Troubleshooting

### Backend não conecta ao MongoDB
- Verifique se a connection string está correta no `.env`
- Verifique se o IP está na lista de Network Access no MongoDB Atlas

### CORS Error
- Verifique se `CORS_ORIGINS` no backend tem `http://localhost:3000`
- Certifique-se de que não há espaços extras

### Frontend não encontra Backend
- Verifique se `REACT_APP_BACKEND_URL` está como `http://localhost:8000`
- Verifique se o backend está rodando na porta 8000

---

## 📝 Comandos Rápidos

### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Frontend:
```bash
cd frontend
yarn install
yarn start
```

---

## 🎯 Vantagens de Rodar Localmente

- ✅ Testa mudanças rapidamente
- ✅ Debug mais fácil
- ✅ Não depende do deploy
- ✅ Resolve problemas antes de fazer deploy

---

**Depois de resolver tudo localmente, você pode fazer o deploy com confiança!** 🚀

