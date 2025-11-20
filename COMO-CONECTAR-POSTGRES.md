# 🔗 Como Conectar PostgreSQL ao Serviço no Railway

## 📋 Métodos para Conectar PostgreSQL

### Método 1: Via Dashboard (Mais Comum)

1. **Acesse:** https://railway.app
2. **Projeto "kind-harmony"**
3. **Clique no serviço "xodozin"** (não no PostgreSQL)
4. **Vá em "Variables"** (ou "Environment Variables")
5. **Clique em "+ New Variable"** ou **"+ Add Variable"**
6. **Nome:** `DATABASE_URL`
7. **Valor:** Clique em **"Reference"** ou **"Select from Service"**
8. **Selecione:** O serviço PostgreSQL
9. **Selecione a variável:** `DATABASE_URL` ou `POSTGRES_URL`
10. **Salve**

### Método 2: Via Dashboard - Aba "Data"

1. **Railway Dashboard** → Projeto "kind-harmony"
2. **Serviço "xodozin"**
3. Procure por aba **"Data"** ou **"Database"**
4. Deve mostrar opção para **"Connect Database"** ou **"Link Database"**
5. Selecione o PostgreSQL

### Método 3: Via Dashboard - Settings do PostgreSQL

1. **Railway Dashboard** → Projeto "kind-harmony"
2. **Clique no serviço PostgreSQL** (o banco de dados)
3. **Vá em "Settings"**
4. Procure por:
   - **"Connected Services"**
   - **"Service Connections"**
   - **"Link to Service"**
5. Adicione o serviço **"xodozin"**

### Método 4: Verificar se Já Está Conectado

Às vezes o Railway conecta automaticamente. Verifique:

```bash
railway variables --service xodozin | grep -i "database\|postgres"
```

Se aparecer `DATABASE_URL`, já está conectado!

## 🔍 Onde Procurar no Dashboard

As opções podem estar em diferentes lugares dependendo da versão do Railway:

- **Variables** → "+ New Variable" → "Reference"
- **Settings** → "Service Connections"
- **Data** → "Connect Database"
- **Networking** → "Service Links"

## ✅ Verificação

Após conectar, execute:

```bash
railway variables --service xodozin | grep DATABASE_URL
```

Deve mostrar algo como:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

## 🆘 Se Não Encontrar

Se não encontrar nenhuma dessas opções:

1. **Tire um print** do Dashboard do serviço PostgreSQL
2. **Tire um print** do Dashboard do serviço xodozin
3. Me envie os prints para eu identificar onde está a opção

Ou tente:
- Recriar o PostgreSQL (às vezes conecta automaticamente)
- Verificar se há um botão "Connect" ou "Link" em algum lugar

