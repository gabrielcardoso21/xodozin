# 🔐 Variáveis de Ambiente - Configuração

## ✅ MongoDB Atlas - Configurado!

**Connection String Completa:**
```
mongodb+srv://xodozin_db_user:hLknhhO2wEuJwHru@xodozin.mnii2px.mongodb.net/?appName=xodozin
```

---

## 🔧 Render (Backend) - Variáveis de Ambiente

Configure estas variáveis no Render:

### 1. MONGO_URL
```
mongodb+srv://xodozin_db_user:hLknhhO2wEuJwHru@xodozin.mnii2px.mongodb.net/?appName=xodozin
```

### 2. DB_NAME
```
xodozin
```

### 3. CORS_ORIGINS
```
https://xodozin-3bhh.vercel.app
```
**⚠️ IMPORTANTE:** Esta é a URL real do seu frontend no Vercel. Se você tiver outras URLs (preview, etc), pode adicionar separadas por vírgula:
```
https://xodozin-3bhh.vercel.app,https://xodozin-git-main-seu-usuario.vercel.app
```

---

## 🎨 Vercel (Frontend) - Variáveis de Ambiente

Configure esta variável no Vercel:

### 1. REACT_APP_BACKEND_URL
```
https://xodozin-backend.onrender.com
```
**⚠️ IMPORTANTE:** Substitua `xodozin-backend.onrender.com` pela URL real do seu backend no Render (você vai obter depois do deploy)

---

## 📝 Passo a Passo no Render

1. Acesse o dashboard do seu serviço no Render
2. Vá em **"Environment"** no menu lateral
3. Clique em **"Add Environment Variable"**
4. Adicione cada variável:
   - **Key:** `MONGO_URL`
   - **Value:** `mongodb+srv://xodozin_db_user:hLknhhO2wEuJwHru@xodozin.mnii2px.mongodb.net/?appName=xodozin`
   - Clique em **"Save Changes"**
   
   Repita para:
   - **Key:** `DB_NAME` | **Value:** `xodozin`
   - **Key:** `CORS_ORIGINS` | **Value:** `https://seu-app.vercel.app` (atualize depois com a URL real)

---

## 📝 Passo a Passo no Vercel

1. Acesse o dashboard do seu projeto no Vercel
2. Vá em **"Settings"** > **"Environment Variables"**
3. Clique em **"Add New"**
4. Adicione:
   - **Key:** `REACT_APP_BACKEND_URL`
   - **Value:** `https://xodozin-backend.onrender.com` (atualize com a URL real do Render)
   - Selecione **"Production"**, **"Preview"** e **"Development"**
   - Clique em **"Save"**

---

## ⚠️ Ordem de Deploy

1. **Primeiro:** Deploy do Backend no Render
   - Configure `MONGO_URL` e `DB_NAME`
   - Deixe `CORS_ORIGINS` vazio ou com `*` temporariamente
   - Anote a URL do backend (ex: `https://xodozin-backend.onrender.com`)

2. **Segundo:** Deploy do Frontend no Vercel
   - Configure `REACT_APP_BACKEND_URL` com a URL do backend do Render
   - Anote a URL do frontend (ex: `https://xodozin.vercel.app`)

3. **Terceiro:** Atualizar CORS no Render
   - Volte ao Render e atualize `CORS_ORIGINS` com a URL do frontend do Vercel

---

## 🆘 Se o Quiz estiver dando erro

O erro "Erro ao processar suas respostas" geralmente acontece quando:

1. **Backend não está rodando:**
   - Verifique se o deploy no Render foi concluído
   - Verifique os logs no Render para ver se há erros

2. **CORS não configurado:**
   - Certifique-se de que `CORS_ORIGINS` tem a URL exata do frontend (com `https://`)

3. **URL do backend errada:**
   - Verifique se `REACT_APP_BACKEND_URL` está correto no Vercel
   - Certifique-se de que a URL está completa (com `https://`)

4. **Backend hibernado (Render Free Tier):**
   - O Render free tier hiberna após 15 min de inatividade
   - A primeira requisição pode demorar ~30 segundos para "acordar"
   - Isso é normal no plano gratuito

---

## ✅ Checklist

- [ ] MongoDB Atlas configurado com Network Access `0.0.0.0/0`
- [ ] Render com `MONGO_URL` configurado corretamente
- [ ] Render com `DB_NAME` configurado como `xodozin`
- [ ] Vercel com `REACT_APP_BACKEND_URL` configurado com URL do Render
- [ ] Render com `CORS_ORIGINS` configurado com URL do Vercel
- [ ] Backend rodando sem erros (verificar logs no Render)
- [ ] Frontend fazendo requisições corretas (verificar console do navegador)

