# 🚀 Guia Rápido de Deploy - Xodózin

## Checklist de Deploy

### ✅ 1. MongoDB Atlas
- [ ] Criar conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Criar cluster (Free tier)
- [ ] Criar usuário do banco de dados
- [ ] Adicionar IP `0.0.0.0/0` em Network Access
- [ ] Obter connection string (substituir `<password>` pela senha real)

### ✅ 2. Render (Backend)
- [ ] Criar conta no [Render](https://render.com/)
- [ ] Conectar repositório GitHub
- [ ] Criar novo Web Service:
  - **Name:** `xodozin-backend`
  - **Root Directory:** (vazio)
  - **Build Command:** `cd backend && pip install -r requirements.txt`
  - **Start Command:** `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
- [ ] Configurar variáveis de ambiente:
  - `MONGO_URL` = connection string completa do MongoDB
  - `DB_NAME` = `xodozin`
  - `CORS_ORIGINS` = URL do frontend (será configurada depois)
- [ ] Aguardar deploy e anotar URL do backend

### ✅ 3. Vercel (Frontend)
- [ ] Criar conta no [Vercel](https://vercel.com/)
- [ ] Importar repositório GitHub
- [ ] Configurar projeto:
  - **Framework Preset:** Other
  - **Root Directory:** `frontend`
  - **Build Command:** `yarn build`
  - **Output Directory:** `build`
  - **Install Command:** `yarn install`
- [ ] Configurar variável de ambiente:
  - `REACT_APP_BACKEND_URL` = URL completa do backend no Render
- [ ] Aguardar deploy e anotar URL do frontend

### ✅ 4. Atualizar CORS
- [ ] Voltar ao Render
- [ ] Atualizar `CORS_ORIGINS` com a URL do frontend no Vercel
- [ ] Aguardar reinicialização do serviço

### ✅ 5. Testar
- [ ] Acessar URL do frontend
- [ ] Testar navegação
- [ ] Testar Quiz
- [ ] Testar seleção de produtos
- [ ] Testar Checkout (CEP SP)

## 📝 Variáveis de Ambiente

### Backend (Render)
```
MONGO_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/
DB_NAME=xodozin
CORS_ORIGINS=https://seu-app.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_BACKEND_URL=https://xodozin-backend.onrender.com
```

## 📚 Documentação Completa

Para mais detalhes, consulte o arquivo `DEPLOY.md` na raiz do projeto.

## ⚠️ Observações Importantes

1. **Render Free Tier:** O serviço hiberna após 15 minutos de inatividade. A primeira requisição após hibernar pode demorar ~30 segundos.

2. **MongoDB Atlas:** O free tier oferece 512MB de storage, suficiente para começar.

3. **CORS:** Certifique-se de que a URL do frontend no `CORS_ORIGINS` está exata (com `https://` e sem espaços).

4. **Connection String:** Substitua `<password>` na connection string pela senha real do usuário do MongoDB.

5. **Build Time:** O primeiro build pode demorar alguns minutos. Tenha paciência!

