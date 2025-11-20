# 🇧🇷 Configurar Medusa para Brasil

Guia completo para configurar o Medusa com português, moeda BRL e região Brasil.

## ✅ Passo 1: Iniciar Serviços

```bash
cd /home/gabriel/xodozin
docker-compose up -d
```

Aguarde alguns minutos para os serviços iniciarem completamente.

## ✅ Passo 2: Verificar se está tudo rodando

```bash
docker-compose ps
```

Você deve ver:
- ✅ `xodozin-postgres` (Up, healthy)
- ✅ `xodozin-redis` (Up, healthy)
- ✅ `xodozin-medusa` (Up)

## ✅ Passo 3: Criar Usuário Admin

```bash
docker exec -it xodozin-medusa npx medusa user
```

Siga as instruções:
- Email: `admin@xodozin.com.br` (ou seu email)
- Senha: (escolha uma senha segura)

## ✅ Passo 4: Acessar Admin Panel

Abra no navegador:
**http://localhost:7001**

Faça login com o usuário criado.

## ✅ Passo 5: Configurar Idioma Português

1. No Admin Panel, clique no **ícone de engrenagem** (⚙️) no canto superior direito
2. Ou vá em **Settings**
3. Procure por **"Language"** ou **"Idioma"**
4. Selecione **"Português"** ou **"pt-BR"**
5. A interface será atualizada automaticamente

## ✅ Passo 6: Configurar Região Brasil

### Opção A: Via Admin Panel (Recomendado) ⭐

1. No Admin Panel, vá em **Settings > Regions**
2. Clique em **"Create Region"** ou **"Adicionar Região"**
3. Configure:
   - **Name:** Brasil
   - **Currency:** BRL (Real Brasileiro)
   - **Countries:** Brazil
   - **Tax Rate:** 0 (ou valor desejado)
4. Clique em **"Save"** ou **"Salvar"**

### Opção B: Via Script (Recomendado após criar usuário admin) ⭐

Execute o script de configuração do Brasil que já está pronto:

```bash
docker exec -it xodozin-medusa yarn medusa exec ./src/scripts/setup-brasil.ts
```

Este script irá:
- ✅ Criar região Brasil com moeda BRL
- ✅ Configurar tax region para Brasil
- ✅ Criar stock location (Armazém São Paulo)
- ✅ Criar shipping profile e fulfillment set
- ✅ Criar opções de envio padrão

## ✅ Passo 7: Verificar Configuração

### Testar API

```bash
# Health check
curl http://localhost:9000/health

# Listar regiões
curl http://localhost:9000/admin/regions \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Verificar no Admin Panel

1. Acesse **Settings > Regions**
2. Você deve ver a região "Brasil" com moeda BRL
3. A interface deve estar em português

## 🎯 Próximos Passos

1. **Adicionar Produtos:** Vá em Products > Create Product
2. **Configurar Pagamentos:** Settings > Payment Providers (Mercado Pago)
3. **Configurar Envio:** Settings > Shipping Options

## 🆘 Problemas Comuns

### "Cannot connect to database"
- Verifique se o PostgreSQL está rodando: `docker ps | grep postgres`
- Aguarde alguns minutos após iniciar os containers
- Verifique logs: `docker logs xodozin-medusa`

### "Region already exists"
- A região já foi criada, está tudo certo!
- Você pode verificar em Settings > Regions

### Admin Panel não abre
- Verifique se a porta 7001 está disponível
- Verifique logs: `docker logs xodozin-medusa`
- Aguarde alguns minutos após iniciar

## 📚 Recursos

- [Documentação Medusa - Regiões](https://docs.medusajs.com/resources/commerce-modules/region)
- [Documentação Medusa - Traduções](https://docs.medusajs.com/learn/fundamentals/admin/translations)

