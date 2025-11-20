# 💳 Pagamento e Emissão de Nota Fiscal

Este documento descreve como configurar e usar o sistema de pagamento e emissão automática de notas fiscais (NFe) no Xodózin.

## 📋 Índice

1. [Configuração de Payment Providers](#configuração-de-payment-providers)
2. [Configuração do Focus NFe](#configuração-do-focus-nfe)
3. [Fluxo de Pagamento](#fluxo-de-pagamento)
4. [Emissão Automática de NFe](#emissão-automática-de-nfe)
5. [Webhooks](#webhooks)
6. [Testes](#testes)
7. [Troubleshooting](#troubleshooting)

## 🔧 Configuração de Payment Providers

### Stripe

1. **Criar conta no Stripe**
   - Acesse: https://stripe.com
   - Crie uma conta e obtenha suas chaves de API

2. **Instalar módulo do Stripe**
   ```bash
   cd xodozin
   yarn add @medusajs/payment-stripe
   ```

3. **Configurar variáveis de ambiente**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Configurar payment provider**
   ```bash
   yarn setup:payment
   ```

5. **Configurar no Admin Panel**
   - Acesse: Settings → Regions → Brasil → Payment Providers
   - Adicione o Stripe provider

### Mercado Pago

1. **Criar conta no Mercado Pago**
   - Acesse: https://www.mercadopago.com.br
   - Crie uma conta e obtenha suas credenciais

2. **Configurar variáveis de ambiente**
   ```env
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
   MERCADOPAGO_PUBLIC_KEY=APP_USR-...
   ```

3. **Nota**: Mercado Pago requer um módulo customizado (não incluído por padrão)

## 📄 Configuração do Focus NFe

### 1. Criar Conta no Focus NFe

1. Acesse: https://www.focusnfe.com.br
2. Crie uma conta
3. Obtenha seu token de API

### 2. Configurar Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
# Focus NFe
FOCUS_NFE_TOKEN=seu_token_focus_nfe_aqui
FOCUS_NFE_ENVIRONMENT=sandbox
# Opções: sandbox (homologação) ou production (produção)

# Dados da Empresa para NFe
COMPANY_CNPJ=12345678000190
COMPANY_NAME=Xodózin
COMPANY_ADDRESS=Rua Exemplo, 123 - Bairro - São Paulo - SP, CEP: 01234-567

# Resend (Email Provider - Gratuito até 3.000 emails/mês)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=vendas@xodozin.com.br
```

### 3. Homologação

Antes de usar em produção, é necessário homologar:

1. Configure `FOCUS_NFE_ENVIRONMENT=sandbox`
2. Teste a emissão de NFe em ambiente de homologação
3. Após homologação, altere para `FOCUS_NFE_ENVIRONMENT=production`

## 💳 Fluxo de Pagamento

### Frontend

O fluxo de pagamento no frontend funciona da seguinte forma:

1. **Cliente seleciona método de pagamento** (Cartão, PIX, Boleto)
2. **Frontend cria payment session** no Medusa
3. **Cliente autoriza pagamento** (via gateway)
4. **Frontend completa carrinho** (cria pedido)

### Backend

1. **Payment session criada** → Medusa processa com provider
2. **Pagamento autorizado** → Gateway processa
3. **Webhook recebido** → Status do pedido atualizado
4. **Email de confirmação enviado** → Cliente recebe confirmação de pagamento ✅
5. **Pedido criado** → Subscriber emite NFe automaticamente
6. **Email de NFe enviado** → Cliente recebe NFe por email ✅

## 📋 Emissão Automática de NFe

### Como Funciona

A emissão de NFe é automática e acontece em dois momentos:

1. **Subscriber `order-placed.ts`**
   - Escuta evento `order.placed`
   - Emite NFe automaticamente quando pedido é criado e pago
   - Salva chave de acesso da NFe no metadata do pedido
   - **Envia email automaticamente com a NFe** ✅

2. **Endpoint manual `/store/orders/:id/invoice`**
   - Permite emitir NFe manualmente para um pedido
   - Útil para reemissão ou correção

## 📧 Sistema de Emails Automáticos

### Como Funciona

O sistema envia emails automaticamente em dois momentos:

1. **Email de Confirmação de Pagamento**
   - Enviado quando webhook de pagamento confirma pagamento
   - Contém: confirmação, detalhes do pedido, previsão de entrega
   - **Quando:** Imediatamente após confirmação de pagamento

2. **Email com NFe**
   - Enviado após NFe ser emitida com sucesso
   - Contém: número da NFe, chave de acesso, link para download
   - **Quando:** Alguns minutos após emissão da NFe (assíncrono)

### Configuração do Resend

1. **Criar conta no Resend** (gratuito até 3.000 emails/mês)
   - Acesse: https://resend.com
   - Crie uma conta
   - Obtenha sua API key

2. **Configurar domínio** (opcional, mas recomendado)
   - Adicione seu domínio no Resend
   - Configure DNS records
   - Isso melhora a deliverability dos emails

3. **Configurar variáveis de ambiente**
   ```env
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=vendas@xodozin.com.br
   ```

### Templates de Email

Os templates são criados em `src/utils/email.ts` e incluem:
- Design responsivo
- Informações do pedido
- Links para download da NFe
- Branding da empresa

### Dados Necessários

Para emitir NFe, os seguintes dados devem estar configurados:

- ✅ `FOCUS_NFE_TOKEN`: Token da API Focus NFe
- ✅ `COMPANY_CNPJ`: CNPJ da empresa
- ✅ `COMPANY_NAME`: Nome da empresa
- ✅ `COMPANY_ADDRESS`: Endereço completo da empresa
- ✅ Dados do cliente no pedido (nome, CPF, endereço)
- ✅ Itens do pedido com preços

### Verificar NFe Emitida

A NFe emitida fica salva no metadata do pedido:

```json
{
  "nfe_key": "35200112345678000190550010000000001234567890",
  "nfe_number": "123",
  "nfe_url": "https://homologacao.focusnfe.com.br/v2/nfe/123.pdf",
  "nfe_emitted_at": "2024-01-01T12:00:00.000Z"
}
```

## 🔔 Webhooks

### Webhook de Pagamento

**Endpoint**: `POST /webhooks/payment`

Recebe confirmações de pagamento dos gateways:

- **Stripe**: Webhook `payment_intent.succeeded`
- **Mercado Pago**: Webhook `payment`
- **Outros**: Formato genérico

**Headers esperados**:
- `x-provider`: Nome do provider (stripe, mercadopago, etc.)

**Payload esperado**:
```json
{
  "order_id": "order_123",
  "status": "captured",
  "provider": "stripe"
}
```

### Webhook de NFe

**Endpoint**: `POST /webhooks/invoice`

Recebe atualizações de status da NFe do Focus NFe:

**Payload esperado**:
```json
{
  "ref": "order_123",
  "status": "autorizado",
  "chave_nfe": "35200112345678000190550010000000001234567890",
  "numero": "123",
  "url": "https://homologacao.focusnfe.com.br/v2/nfe/123.pdf"
}
```

### Configurar Webhooks no Focus NFe

1. Acesse o painel do Focus NFe
2. Vá em Configurações → Webhooks
3. Configure a URL: `https://seu-dominio.com/webhooks/invoice`
4. Selecione os eventos: `nfe.autorizada`, `nfe.cancelada`

## 🧪 Testes

### Testar Pagamento

1. **Ambiente de Sandbox**:
   - Use cartões de teste do Stripe: https://stripe.com/docs/testing
   - Use credenciais de teste do Mercado Pago

2. **Testar fluxo completo**:
   ```bash
   # 1. Iniciar backend
   cd xodozin
   yarn dev

   # 2. Iniciar frontend
   cd frontend
   yarn start

   # 3. Fazer um pedido de teste
   # 4. Verificar logs do backend para ver payment session criada
   # 5. Verificar webhook recebido
   ```

### Testar Emissão de NFe

1. **Ambiente de Homologação**:
   ```env
   FOCUS_NFE_ENVIRONMENT=sandbox
   ```

2. **Emitir NFe manualmente**:
   ```bash
   curl -X GET http://localhost:9000/store/orders/{order_id}/invoice \
     -H "x-publishable-api-key: pk_..."
   ```

3. **Verificar NFe emitida**:
   - Verificar metadata do pedido no Admin Panel
   - Verificar logs do backend
   - Acessar URL da NFe retornada

## 🔍 Troubleshooting

### Pagamento não está funcionando

1. **Verificar payment provider configurado**:
   ```bash
   yarn setup:payment
   ```

2. **Verificar credenciais**:
   - Verificar se `STRIPE_SECRET_KEY` ou `MERCADOPAGO_ACCESS_TOKEN` estão corretos
   - Verificar se payment provider está habilitado na região Brasil

3. **Verificar logs**:
   ```bash
   # Ver logs do Medusa
   tail -f logs/medusa.log
   ```

### NFe não está sendo emitida

1. **Verificar variáveis de ambiente**:
   ```bash
   # Verificar se todas as variáveis estão configuradas
   echo $FOCUS_NFE_TOKEN
   echo $COMPANY_CNPJ
   ```

2. **Verificar subscriber**:
   - Verificar se `order-placed.ts` está sendo executado
   - Verificar logs do backend para erros

3. **Emitir manualmente**:
   ```bash
   curl -X GET http://localhost:9000/store/orders/{order_id}/invoice
   ```

### Webhook não está sendo recebido

1. **Verificar URL do webhook**:
   - Gateway deve estar configurado para enviar para URL correta
   - URL deve ser acessível publicamente (usar ngrok para desenvolvimento)

2. **Verificar autenticação**:
   - Alguns gateways requerem autenticação no webhook
   - Verificar headers esperados

3. **Testar webhook manualmente**:
   ```bash
   curl -X POST http://localhost:9000/webhooks/payment \
     -H "Content-Type: application/json" \
     -H "x-provider: stripe" \
     -d '{"order_id": "order_123", "status": "captured"}'
   ```

## 📝 Próximos Passos

- [x] Configurar sistema de emails automáticos ✅
- [ ] Configurar payment provider real (Stripe ou Mercado Pago)
- [ ] Homologar emissão de NFe no Focus NFe
- [ ] Configurar webhooks em produção
- [ ] Testar fluxo completo de pagamento e NFe
- [ ] Configurar domínio no Resend (melhorar deliverability)

## 🔗 Links Úteis

- [Documentação Medusa Payment](https://docs.medusajs.com/resources/commerce-modules/payment)
- [Documentação Focus NFe](https://doc.focusnfe.com.br/)
- [Documentação Stripe](https://stripe.com/docs)
- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)

