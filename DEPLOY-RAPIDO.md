# 🚀 Deploy Rápido - Passo a Passo

## ✅ Status: PRONTO PARA DEPLOY!

Todos os arquivos de configuração estão prontos. Siga os passos abaixo:

---

## 📋 Passo 1: MongoDB Atlas (5 minutos)

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um novo cluster (escolha a região mais próxima do Brasil)
4. Configure usuário do banco:
   - Vá em "Database Access" > "Add New Database User"
   - Crie usuário e senha (ANOTE ESSAS CREDENCIAIS!)
5. Configure Network Access:
   - Vá em "Network Access" > "Add IP Address"
   - Adicione `0.0.0.0/0` (permite de qualquer IP)
6. Obtenha a connection string:
   - Vá em "Database" > "Connect" > "Connect your application"
   - Copie a string (exemplo: `mongodb+srv://usuario:senha@cluster.mongodb.net/`)
   - **IMPORTANTE:** Substitua `<password>` pela senha real que você criou
   - **ANOTE ESSA STRING COMPLETA!**

---

## 🔧 Passo 2: Render - Backend (10 minutos)

1. Acesse: https://render.com
2. Faça login com GitHub
3. Clique em "New" > "Web Service"
4. Conecte seu repositório GitHub (selecione o repositório do Xodózin)
5. O Render vai detectar automaticamente o `render.yaml` ✅
6. Configure as variáveis de ambiente:
   - Clique em "Environment Variables"
   - Adicione:
     ```
     MONGO_URL = mongodb+srv://usuario:senha@cluster.mongodb.net/
     DB_NAME = xodozin
     CORS_ORIGINS = https://seu-app.vercel.app
     ```
   - **IMPORTANTE:** 
     - Cole a connection string COMPLETA do MongoDB (com senha substituída)
     - Deixe `CORS_ORIGINS` vazio por enquanto (vamos atualizar depois)
7. Clique em "Create Web Service"
8. Aguarde o deploy (pode demorar 5-10 minutos)
9. **ANOTE A URL DO BACKEND** (exemplo: `https://xodozin-backend.onrender.com`)

---

## 🎨 Passo 3: Vercel - Frontend (5 minutos)

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New..." > "Project"
4. Importe seu repositório GitHub (selecione o repositório do Xodózin)
5. O Vercel vai detectar automaticamente o `vercel.json` ✅
6. Configure:
   - **Root Directory:** `frontend` (se não detectar automaticamente)
   - **Framework Preset:** Other (ou deixe automático)
7. Configure variável de ambiente:
   - Clique em "Environment Variables"
   - Adicione:
     ```
     REACT_APP_BACKEND_URL = https://xodozin-backend.onrender.com
     ```
   - **IMPORTANTE:** Use a URL completa do backend que você obteve no passo anterior (com `https://`)
8. Clique em "Deploy"
9. Aguarde o deploy (pode demorar 3-5 minutos)
10. **ANOTE A URL DO FRONTEND** (exemplo: `https://xodozin.vercel.app`)

---

## 🔄 Passo 4: Atualizar CORS (2 minutos)

1. Volte ao Render (dashboard do backend)
2. Vá em "Environment" > "Environment Variables"
3. Atualize `CORS_ORIGINS` com a URL do frontend:
   ```
   CORS_ORIGINS = https://seu-app.vercel.app
   ```
4. Salve (o Render vai reiniciar automaticamente)

---

## ✅ Passo 5: Testar!

1. Acesse a URL do frontend no Vercel
2. Teste:
   - ✅ Navegação na Home
   - ✅ Quiz funcionando
   - ✅ Seleção de produtos
   - ✅ Checkout (CEP de SP)

---

## 🎉 Pronto!

Seu app está no ar! 🚀

---

## ⚠️ Observações Importantes

1. **Render Free Tier:** O serviço hiberna após 15 min de inatividade. A primeira requisição após hibernar pode demorar ~30 segundos (isso é normal).

2. **MongoDB Atlas:** O free tier oferece 512MB, suficiente para começar.

3. **URLs:** Sempre use `https://` nas URLs (não `http://`).

4. **Variáveis de Ambiente:** Certifique-se de não ter espaços extras nas variáveis.

---

## 🆘 Problemas Comuns

### Backend não conecta ao MongoDB
- Verifique se o IP `0.0.0.0/0` está na lista de Network Access
- Verifique se a connection string está correta (com senha substituída)
- Veja os logs no Render para mais detalhes

### CORS Error
- Verifique se `CORS_ORIGINS` tem a URL exata do frontend (com `https://`)
- Certifique-se de que não há espaços extras

### Frontend não encontra Backend
- Verifique se `REACT_APP_BACKEND_URL` está configurado corretamente
- Certifique-se de que a URL está completa (com `https://`)
- Aguarde alguns segundos se o backend estiver hibernado

