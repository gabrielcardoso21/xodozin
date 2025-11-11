# 🚀 Início Rápido - Medusa.js

Guia simplificado para começar a usar o Medusa.js **agora mesmo**!

---

## ✅ Passo 1: Verificar se está tudo rodando

```bash
docker ps | grep xodozin
```

Você deve ver:
- ✅ `xodozin-postgres` (Up)
- ✅ `xodozin-redis` (Up)  
- ✅ `xodozin-medusa-backend` (Up)

Se algum não estiver rodando:

```bash
docker start xodozin-postgres xodozin-redis xodozin-medusa-backend
```

---

## ✅ Passo 2: Testar se o Medusa está respondendo

```bash
curl http://localhost:9000/health
```

**Esperado:**
```json
{"status":"ok","message":"Medusa backend is running"}
```

---

## ✅ Passo 3: Criar Usuário Admin

```bash
docker exec -it xodozin-medusa-backend npx medusa user
```

**Siga as instruções:**
- Email: `admin@xodozin.com.br` (ou seu email)
- Senha: (escolha uma senha segura)

---

## ✅ Passo 4: Acessar Admin Panel

Abra no navegador:

**http://localhost:7001**

Faça login com o usuário criado.

---

## ✅ Passo 5: Configurar Região Brasil

1. No Admin Panel, vá em **Settings > Regions**
2. Clique em **Create Region**
3. Configure:
   - **Name:** Brasil
   - **Currency:** BRL (Real Brasileiro)
   - **Countries:** Brazil
4. Clique em **Save**

---

## ✅ Passo 6: Adicionar Primeiro Produto

1. No Admin Panel, vá em **Products**
2. Clique em **Create Product**
3. Preencha:
   - **Title:** Nome do produto
   - **Description:** Descrição
   - **Price:** R$ 0,00 (configure depois)
   - **Inventory:** Quantidade
4. Clique em **Save**

**Pronto!** Você já pode começar a adicionar produtos!

---

## ✅ Passo 7: Criar um Kit (Collection)

1. Vá em **Collections**
2. Clique em **Create Collection**
3. Preencha:
   - **Title:** Nome do kit
   - **Products:** Selecione os produtos
4. Clique em **Save**

---

## ✅ Passo 8: Testar no Frontend

1. Certifique-se que o frontend está rodando: `cd frontend && npm start`
2. Acesse: `http://localhost:3000`
3. Os produtos devem aparecer automaticamente!

---

## 🆘 Problemas Comuns

### "Cannot connect to database"

```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Se não estiver, iniciar:
docker start xodozin-postgres

# Aguardar alguns segundos e tentar novamente
```

### "Admin Panel não abre"

```bash
# Verificar se Medusa está rodando
docker logs xodozin-medusa-backend | tail -20

# Reiniciar se necessário
docker restart xodozin-medusa-backend
```

### "Produtos não aparecem no frontend"

1. Verifique se `REACT_APP_USE_MEDUSA=true` no `.env` do frontend
2. Verifique se o Medusa está respondendo: `curl http://localhost:9000/store/products`
3. Reinicie o frontend

---

## 📚 Próximos Passos

- Configurar métodos de pagamento (Stripe, PIX)
- Configurar métodos de envio
- Adicionar mais produtos
- Personalizar o frontend

---

**🎉 Pronto para começar!** Use o Admin Panel para gerenciar tudo!

