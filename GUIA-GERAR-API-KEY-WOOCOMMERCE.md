# 🔑 Guia Detalhado: Gerar API Key do WooCommerce

Este guia mostra passo a passo como gerar as credenciais REST API do WooCommerce que serão usadas no frontend.

## ⚠️ IMPORTANTE: Onde Gerar a API Key

**Você NÃO precisa ir no site da WooCommerce (woocommerce.com)!**

A API Key é gerada **dentro da sua própria aplicação WordPress/WooCommerce** que está rodando no Render.

- ✅ **SIM**: Acesse `https://seu-servico.onrender.com/wp-admin` (sua aplicação)
- ❌ **NÃO**: Não acesse woocommerce.com ou qualquer site externo

A API Key é específica da sua instalação do WooCommerce e é gerada no painel administrativo do WordPress.

## 📋 Pré-requisitos

- ✅ WooCommerce instalado e funcionando na sua aplicação no Render
- ✅ Acesso ao painel administrativo do WordPress (`/wp-admin`) da SUA aplicação
- ✅ Permissões de administrador
- ✅ Aplicação já deployada e rodando

---

## 🚀 Passo a Passo

### Passo 1: Acessar o Painel Administrativo da SUA Aplicação

1. **Acesse a URL da SUA aplicação WordPress/WooCommerce no Render:**
   ```
   https://seu-servico.onrender.com/wp-admin
   ```
   
   > ⚠️ **ATENÇÃO**: Esta é a URL da SUA aplicação que você deployou no Render, NÃO o site da WooCommerce!

2. **Faça login com suas credenciais de administrador:**
   - **Usuário**: `admin` (ou o usuário que você configurou)
   - **Senha**: (a senha que você configurou ou que foi gerada automaticamente)

   > 💡 **Dica**: Se você esqueceu a senha, você pode:
   > - Verificar os logs do container no Render
   > - Ou usar o script de recuperação de senha do WordPress
   > - Ou executar o script `init-woocommerce.sh` que gera uma nova senha

### Passo 2: Navegar até Configurações do WooCommerce

1. No menu lateral esquerdo, localize **"WooCommerce"**
2. Clique em **"WooCommerce"** para expandir o menu
3. Clique em **"Configurações"**

   > 📍 **Caminho visual**: 
   > ```
   > Dashboard → WooCommerce → Configurações
   > ```

### Passo 3: Acessar Configurações Avançadas

1. Na página de configurações do WooCommerce, você verá várias abas no topo:
   - Geral
   - Produtos
   - Envio
   - Pagamentos
   - Contas e privacidade
   - Email
   - **Avançado** ← Clique aqui

2. Clique na aba **"Avançado"**

### Passo 4: Acessar REST API

1. Na aba "Avançado", você verá uma lista de opções no menu lateral esquerdo:
   - Páginas
   - Importação de CSV
   - Exportação de CSV
   - Sistema
   - **REST API** ← Clique aqui

2. Clique em **"REST API"**

   > 📍 **Caminho completo**: 
   > ```
   > Dashboard → WooCommerce → Configurações → Avançado → REST API
   > ```

### Passo 5: Criar Nova Chave de API

1. Na página "REST API", você verá:
   - Uma seção "Chaves de API" (pode estar vazia se for a primeira vez)
   - Um botão **"Adicionar chave"** ou **"Add key"** (se estiver em inglês)

2. Clique no botão **"Adicionar chave"**

### Passo 6: Preencher Dados da Chave

Um formulário será exibido. Preencha os campos:

#### Campo 1: Descrição
- **O que é**: Nome identificador para esta chave
- **Exemplo**: `Frontend Xodózin` ou `API Frontend React`
- **Importante**: Escolha um nome que você consiga identificar depois

#### Campo 2: Usuário
- **O que é**: Usuário WordPress que terá acesso via API
- **Recomendação**: Selecione `admin` (ou o usuário administrador)
- **Importante**: Este usuário precisa ter permissões adequadas

#### Campo 3: Permissões
- **Opções disponíveis**:
  - ⚠️ **Somente leitura** - Apenas consultar dados (GET)
  - ✅ **Leitura/Gravação** - Consultar e modificar dados (GET, POST, PUT, DELETE) ← **ESCOLHA ESTA**
  - ⚠️ **Somente gravação** - Apenas modificar dados (POST, PUT, DELETE)

- **Recomendação**: Selecione **"Leitura/Gravação"** para ter acesso completo

#### Campo 4: Endereços IP permitidos (Opcional)
- **O que é**: Restrição de IPs que podem usar esta chave
- **Recomendação**: Deixe em branco para permitir de qualquer lugar
- **Uso**: Se quiser restringir, adicione IPs separados por vírgula

### Passo 7: Gerar a Chave

1. Após preencher todos os campos, clique no botão **"Gerar chave de API"** ou **"Generate API key"**

2. Aguarde alguns segundos enquanto o WordPress gera as credenciais

### Passo 8: Copiar as Credenciais

Após gerar, você verá uma tabela com as seguintes informações:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Descrição** | Nome que você deu | Frontend Xodózin |
| **Usuário** | Usuário WordPress | admin |
| **Consumer key** | Chave pública (começa com `ck_`) | `ck_1234567890abcdef...` |
| **Consumer secret** | Chave secreta (começa com `cs_`) | `cs_9876543210fedcba...` |
| **Permissões** | Tipo de acesso | Leitura/Gravação |
| **Último acesso** | Data do último uso | Nunca |

#### ⚠️ IMPORTANTE: Copiar as Credenciais

1. **Consumer Key** (chave pública):
   - Começa com `ck_`
   - Exemplo: `ck_1234567890abcdef1234567890abcdef12345678`
   - Clique no botão de copiar ao lado ou selecione e copie manualmente

2. **Consumer Secret** (chave secreta):
   - Começa com `cs_`
   - Exemplo: `cs_9876543210fedcba9876543210fedcba98765432`
   - Clique no botão de copiar ao lado ou selecione e copie manualmente

   > 🔒 **ATENÇÃO**: 
   > - O **Consumer Secret** só é mostrado UMA VEZ após a criação
   > - Se você fechar a página sem copiar, precisará criar uma nova chave
   > - Salve essas credenciais em local seguro

### Passo 9: Configurar no Frontend

Agora que você tem as credenciais, configure no frontend:

1. **Copie o arquivo `.env.example` para `.env`** (se ainda não fez):

   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Edite o arquivo `.env`** e adicione:

   ```env
   # URL do seu site WooCommerce (sem barra no final)
   REACT_APP_WOOCOMMERCE_API_URL=https://seu-servico.onrender.com
   
   # Consumer Key (começa com ck_)
   REACT_APP_WOOCOMMERCE_CONSUMER_KEY=ck_1234567890abcdef1234567890abcdef12345678
   
   # Consumer Secret (começa com cs_)
   REACT_APP_WOOCOMMERCE_CONSUMER_SECRET=cs_9876543210fedcba9876543210fedcba98765432
   ```

3. **Salve o arquivo**

4. **Reinicie o servidor de desenvolvimento** (se estiver rodando):

   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente
   npm start
   ```

---

## 🔍 Verificar se Está Funcionando

### Teste 1: Verificar Configuração

No console do navegador (F12), você deve ver:

```
=== WooCommerce Config Debug ===
Base URL: https://seu-servico.onrender.com
API URL: https://seu-servico.onrender.com/wp-json/wc/v3
Consumer Key: ***configurado***
Consumer Secret: ***configurado***
Configurado: true
================================
```

### Teste 2: Testar API Manualmente

Você pode testar a API diretamente no navegador ou com curl:

```bash
# Substitua pelas suas credenciais
curl "https://seu-servico.onrender.com/wp-json/wc/v3/products" \
  -u "ck_SUA_CONSUMER_KEY:cs_SEU_CONSUMER_SECRET"
```

Se funcionar, você verá uma lista de produtos em JSON.

### Teste 3: Testar no Frontend

No código React, teste:

```javascript
import { woocommerceService } from '@/services/woocommerce';

// Testar listagem de produtos
woocommerceService.getProducts()
  .then(products => console.log('Produtos:', products))
  .catch(error => console.error('Erro:', error));
```

---

## 🛠️ Troubleshooting

### Problema: Não consigo ver a opção "REST API"

**Solução:**
1. Verifique se o WooCommerce está instalado e ativado
2. Vá em: **Plugins → Plugins Instalados**
3. Certifique-se de que "WooCommerce" está **Ativado**

### Problema: Botão "Gerar chave" não aparece

**Solução:**
1. Verifique se você está logado como administrador
2. Verifique se tem permissões de administrador
3. Tente desativar e reativar o WooCommerce

### Problema: Consumer Secret não aparece após gerar

**Solução:**
- O Consumer Secret só aparece UMA VEZ após criar
- Se você não copiou, precisa criar uma nova chave
- Vá em: **WooCommerce → Configurações → Avançado → REST API**
- Clique em "Revogar" na chave antiga
- Crie uma nova chave

### Problema: Erro 401 Unauthorized

**Solução:**
1. Verifique se Consumer Key e Secret estão corretos (sem espaços)
2. Verifique se as credenciais começam com `ck_` e `cs_`
3. Verifique se a URL está correta (sem barra no final)
4. Verifique se a chave tem permissões de "Leitura/Gravação"

### Problema: Erro CORS

**Solução:**
1. Instale o plugin "CORS Headers" no WordPress
2. Ou adicione no `.htaccess`:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

### Problema: Não consigo acessar /wp-admin

**Solução:**
1. Verifique se o serviço está online no Render
2. Verifique os logs do container no Render
3. Aguarde alguns minutos após o deploy (WordPress pode estar inicializando)

---

## 📸 Referência Visual (Descrição)

### Tela 1: Dashboard WordPress
```
┌─────────────────────────────────────┐
│ WordPress Admin                     │
├─────────────────────────────────────┤
│ [Menu Lateral]                      │
│  • Dashboard                        │
│  • WooCommerce ← Clique aqui        │
│    └─ Configurações                │
│  • Produtos                         │
│  • ...                              │
└─────────────────────────────────────┘
```

### Tela 2: Configurações WooCommerce
```
┌─────────────────────────────────────┐
│ WooCommerce → Configurações         │
├─────────────────────────────────────┤
│ [Abas]                              │
│ Geral | Produtos | ... | Avançado ←│
│                                     │
│ [Menu Lateral]                      │
│  • Páginas                          │
│  • REST API ← Clique aqui           │
│  • Sistema                          │
└─────────────────────────────────────┘
```

### Tela 3: REST API
```
┌─────────────────────────────────────┐
│ REST API                            │
├─────────────────────────────────────┤
│                                     │
│ [Botão: Adicionar chave] ← Clique  │
│                                     │
│ Chaves de API:                      │
│ (vazio ou lista de chaves)          │
└─────────────────────────────────────┘
```

### Tela 4: Formulário de Criação
```
┌─────────────────────────────────────┐
│ Adicionar chave de API              │
├─────────────────────────────────────┤
│ Descrição: [Frontend Xodózin]      │
│                                     │
│ Usuário: [admin ▼]                 │
│                                     │
│ Permissões:                         │
│ ( ) Somente leitura                 │
│ (•) Leitura/Gravação ← Escolha     │
│ ( ) Somente gravação                │
│                                     │
│ [Gerar chave de API] ← Clique      │
└─────────────────────────────────────┘
```

### Tela 5: Credenciais Geradas
```
┌─────────────────────────────────────┐
│ Chaves de API                       │
├─────────────────────────────────────┤
│ Descrição: Frontend Xodózin         │
│ Usuário: admin                      │
│                                     │
│ Consumer key:                       │
│ ck_1234567890abcdef... [Copiar]    │
│                                     │
│ Consumer secret:                    │
│ cs_9876543210fedcba... [Copiar]    │
│                                     │
│ ⚠️ Copie AGORA! Só aparece uma vez│
└─────────────────────────────────────┘
```

---

## ✅ Checklist Final

Antes de usar no frontend, verifique:

- [ ] WooCommerce está instalado e ativado
- [ ] Consegui acessar `/wp-admin`
- [ ] Naveguei até: WooCommerce → Configurações → Avançado → REST API
- [ ] Criei uma nova chave de API
- [ ] Preenchi: Descrição, Usuário (admin), Permissões (Leitura/Gravação)
- [ ] Copiei o **Consumer Key** (começa com `ck_`)
- [ ] Copiei o **Consumer Secret** (começa com `cs_`)
- [ ] Configurei no arquivo `.env` do frontend
- [ ] Reiniciei o servidor de desenvolvimento
- [ ] Testei a API e funcionou

---

## 🎯 Próximos Passos

Após configurar as credenciais:

1. ✅ Teste listar produtos: `woocommerceService.getProducts()`
2. ✅ Teste criar carrinho: `woocommerceService.createCart()`
3. ✅ Teste adicionar item: `woocommerceService.addToCart()`
4. ✅ Integre nas páginas do frontend

---

## 💡 Dicas Importantes

1. **Segurança**: 
   - Nunca commite o arquivo `.env` no Git
   - O `.env` já está no `.gitignore`
   - Use variáveis de ambiente diferentes para dev/prod

2. **Múltiplas Chaves**:
   - Você pode criar várias chaves de API
   - Útil para diferentes ambientes (dev, staging, prod)
   - Cada chave pode ter permissões diferentes

3. **Revogar Chaves**:
   - Se uma chave for comprometida, você pode revogá-la
   - Vá em: REST API → Clique em "Revogar" na chave
   - Crie uma nova chave imediatamente

4. **Logs de Acesso**:
   - A coluna "Último acesso" mostra quando a chave foi usada
   - Útil para monitorar uso e detectar problemas

---

## 📞 Precisa de Ajuda?

Se tiver problemas:

1. Verifique os logs do WordPress no Render
2. Verifique se o WooCommerce está atualizado
3. Tente criar uma nova chave de API
4. Verifique se a URL está correta (sem barra no final)

---

**Pronto!** Agora você tem todas as informações necessárias para gerar e configurar a API Key do WooCommerce! 🎉

