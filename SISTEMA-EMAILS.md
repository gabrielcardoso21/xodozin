# 📧 Sistema de Emails Automáticos

## ✅ Status

Sistema de emails automáticos implementado usando **Resend** (gratuito até 3.000 emails/mês).

## 🎯 Funcionalidades

### 1. Email de Confirmação de Pagamento

**Quando é enviado:**
- Após webhook de pagamento confirmar pagamento
- Status do pedido: `payment_status = "captured"`

**Conteúdo:**
- ✅ Confirmação de pagamento
- 📦 Detalhes do pedido (número, valor, data)
- 💝 Mensagem de agradecimento
- 📄 Informação sobre NFe (será enviada em breve)

**Arquivo:** `src/api/webhooks/payment/route.ts`

### 2. Email com NFe

**Quando é enviado:**
- Após NFe ser emitida com sucesso
- Quando `metadata.nfe_key` é adicionado ao pedido

**Conteúdo:**
- 📄 Número da NFe
- 🔑 Chave de acesso
- 🔗 Link para download da NFe
- 💰 Valor total do pedido

**Arquivo:** `src/subscribers/order-placed.ts`

## 🔧 Configuração

### 1. Criar Conta no Resend

1. Acesse: https://resend.com
2. Crie uma conta (gratuito)
3. Vá em **API Keys** → **Create API Key**
4. Copie a API key (começa com `re_`)

### 2. Configurar Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
# Resend (Email Provider)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=vendas@xodozin.com.br

# Nome da empresa (usado nos templates)
COMPANY_NAME=Xodózin
```

### 3. Configurar Domínio (Opcional, mas Recomendado)

Para melhorar a deliverability dos emails:

1. No Resend, vá em **Domains** → **Add Domain**
2. Adicione seu domínio (ex: `xodozin.com.br`)
3. Configure os registros DNS conforme instruções
4. Aguarde verificação (pode levar algumas horas)

**Benefícios:**
- Emails não vão para spam
- Branding profissional
- Melhor taxa de entrega

## 📦 Instalação

O Resend já está instalado no `package.json`. Para instalar:

```bash
cd xodozin
yarn install
```

## 🧪 Testar

### Testar Email de Confirmação de Pagamento

1. Fazer um pedido de teste
2. Simular webhook de pagamento:
   ```bash
   curl -X POST http://localhost:9000/webhooks/payment \
     -H "Content-Type: application/json" \
     -H "x-provider: stripe" \
     -d '{
       "type": "payment_intent.succeeded",
       "data": {
         "object": {
           "status": "succeeded",
           "metadata": {
             "order_id": "order_123"
           }
         }
       }
     }'
   ```
3. Verificar email recebido

### Testar Email de NFe

1. Fazer um pedido de teste
2. Aguardar NFe ser emitida automaticamente
3. Verificar email recebido com NFe

## 📊 Fluxo Completo

```
Cliente faz pedido
    ↓
Pagamento processado
    ↓
Webhook confirma pagamento
    ↓
📧 Email 1: "Pagamento Confirmado!" (instantâneo)
    ↓
NFe emitida em background (1-5 minutos)
    ↓
📧 Email 2: "Sua NFe está disponível" (assíncrono)
```

## 🔍 Troubleshooting

### Emails não estão sendo enviados

1. **Verificar RESEND_API_KEY:**
   ```bash
   echo $RESEND_API_KEY
   ```
   Deve começar com `re_`

2. **Verificar logs:**
   ```bash
   # Ver logs do Medusa
   tail -f logs/medusa.log | grep -i email
   ```

3. **Verificar se email do cliente está no pedido:**
   - O pedido deve ter `order.email` ou `order.shipping_address.email`

### Emails vão para spam

1. **Configurar domínio no Resend** (recomendado)
2. **Verificar SPF/DKIM records** no DNS
3. **Usar email profissional** (não Gmail/Hotmail)

### Erro: "Resend não configurado"

- Verificar se `RESEND_API_KEY` está configurado
- Verificar se variável está no `.env`
- Reiniciar servidor após adicionar variável

## 💰 Custos

### Resend (Gratuito)

- **Plano Free:** 3.000 emails/mês
- **Plano Pro:** $20/mês (50.000 emails)
- **Plano Business:** $80/mês (200.000 emails)

**Para começar:** Plano gratuito é suficiente! ✅

## 📝 Próximos Passos

- [ ] Configurar domínio no Resend
- [ ] Personalizar templates de email
- [ ] Adicionar tracking de abertura (opcional)
- [ ] Testar em produção

## 🔗 Links Úteis

- [Resend Documentation](https://resend.com/docs)
- [Resend Dashboard](https://resend.com/emails)
- [Email Best Practices](https://resend.com/docs/send-emails/best-practices)

