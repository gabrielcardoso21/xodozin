# 🔧 Corrigir Variável de Ambiente no Vercel

## ❌ Problema Atual

A URL está sendo construída incorretamente:
- **Erro:** `https://xodozin-3bhh.vercel.app/xodozin-backend.onrender.com/api/kits`
- **Causa:** A variável `REACT_APP_BACKEND_URL` no Vercel está configurada **SEM** `https://`

---

## ✅ Solução: Corrigir Variável no Vercel

### **Passo 1: Acessar Configurações do Vercel**

1. Acesse: https://vercel.com
2. Faça login na sua conta
3. Vá no dashboard do seu projeto **xodozin**

### **Passo 2: Verificar Variável de Ambiente**

1. Clique em **"Settings"** (Configurações) no menu lateral
2. Clique em **"Environment Variables"** (Variáveis de Ambiente)
3. Procure por `REACT_APP_BACKEND_URL`

### **Passo 3: Verificar Valor Atual**

**❌ INCORRETO (causa o erro):**
```
xodozin-backend.onrender.com
```
ou
```
xodozin-backend.onrender.com/
```

**✅ CORRETO (deve ser assim):**
```
https://xodozin-backend.onrender.com
```

### **Passo 4: Corrigir a Variável**

1. Se a variável estiver **incorreta**, clique nos **3 pontos** ao lado dela
2. Selecione **"Edit"** (Editar)
3. Altere o valor para:
   ```
   https://xodozin-backend.onrender.com
   ```
4. **IMPORTANTE:**
   - ✅ Deve começar com `https://`
   - ✅ **NÃO** deve ter barra no final
   - ✅ Deve ser a URL completa do backend no Render
5. Clique em **"Save"** (Salvar)

### **Passo 5: Aguardar Redeploy**

1. Após salvar, o Vercel vai fazer um **redeploy automático**
2. Aguarde alguns minutos (2-5 minutos)
3. Você pode acompanhar o deploy em **"Deployments"**

### **Passo 6: Testar**

1. Acesse: https://xodozin-3bhh.vercel.app
2. Abra o DevTools (F12) > **"Console"**
3. Verifique se não há mais erros
4. Teste o Quiz novamente

---

## 🧪 Como Verificar se Está Correto

### **No Console do Navegador:**

Após o deploy, a URL deve ser:
- ✅ **Correto:** `https://xodozin-backend.onrender.com/api/kits`
- ❌ **Incorreto:** `https://xodozin-3bhh.vercel.app/xodozin-backend.onrender.com/api/kits`

### **No Network Tab:**

1. Abra o DevTools (F12)
2. Vá em **"Network"** (Rede)
3. Tente fazer o Quiz
4. Veja a requisição para `/api/quiz/suggest`
5. A URL deve ser: `https://xodozin-backend.onrender.com/api/quiz/suggest`

---

## 📝 Checklist

- [ ] Acessei o dashboard do Vercel
- [ ] Fui em Settings > Environment Variables
- [ ] Encontrei `REACT_APP_BACKEND_URL`
- [ ] Verifiquei que está com `https://` no início
- [ ] Verifiquei que **NÃO** tem barra no final
- [ ] Salvei as alterações
- [ ] Aguardei o redeploy automático
- [ ] Testei novamente

---

## 🆘 Se Ainda Não Funcionar

### **Verificar Deploy:**

1. Vá em **"Deployments"** no Vercel
2. Verifique se há um deploy recente (deve ter o commit `cc6bca3` ou mais recente)
3. Se não houver, o deploy pode estar em andamento
4. Clique no deploy para ver os logs

### **Forçar Redeploy:**

1. Vá em **"Deployments"**
2. Clique nos **3 pontos** do último deploy
3. Selecione **"Redeploy"**
4. Aguarde concluir

### **Verificar Logs do Build:**

1. Vá em **"Deployments"**
2. Clique no último deploy
3. Veja os logs do build
4. Verifique se há erros

---

## ✨ Código Já Foi Corrigido

O código já foi atualizado para adicionar `https://` automaticamente, mas é melhor configurar corretamente no Vercel para evitar problemas.

---

**Após corrigir a variável e aguardar o redeploy, o erro deve desaparecer!** 🚀

