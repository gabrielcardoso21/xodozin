import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { sendPaymentConfirmationEmail } from "../../utils/email";

/**
 * Webhook para receber confirmação de pagamento do gateway
 * 
 * POST /webhooks/payment
 * 
 * Suporta webhooks de:
 * - Stripe
 * - Mercado Pago
 * - Outros gateways de pagamento
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const orderModule = req.scope.resolve(Modules.ORDER);
  const paymentModule = req.scope.resolve(Modules.PAYMENT);

  try {
    const webhookData = req.body as any;
    const headers = req.headers;

    logger.info("Webhook de pagamento recebido");

    // Identificar provider baseado nos headers ou dados
    const provider = (headers["x-provider"] as string) || 
                    webhookData.provider || 
                    (webhookData.type?.startsWith("stripe") ? "stripe" : null) ||
                    (webhookData.type?.startsWith("mercadopago") ? "mercadopago" : null) ||
                    "unknown";

    // Processar webhook baseado no provider
    let orderId: string | null = null;
    let paymentStatus: string = "pending";

    if (provider === "stripe" || webhookData.type?.startsWith("payment_intent")) {
      // Webhook do Stripe
      const paymentIntent = webhookData.data?.object || webhookData.object;
      orderId = paymentIntent?.metadata?.order_id || paymentIntent?.metadata?.medusa_order_id;
      
      if (paymentIntent?.status === "succeeded") {
        paymentStatus = "captured";
      } else if (paymentIntent?.status === "processing") {
        paymentStatus = "pending";
      } else if (paymentIntent?.status === "requires_payment_method") {
        paymentStatus = "requires_action";
      }
    } else if (provider === "mercadopago" || webhookData.type === "payment") {
      // Webhook do Mercado Pago
      const payment = webhookData.data || webhookData;
      orderId = payment?.external_reference || payment?.metadata?.order_id;
      
      if (payment?.status === "approved") {
        paymentStatus = "captured";
      } else if (payment?.status === "pending") {
        paymentStatus = "pending";
      } else if (payment?.status === "rejected") {
        paymentStatus = "canceled";
      }
    } else {
      // Tentar extrair order_id de forma genérica
      orderId = webhookData.order_id || 
                webhookData.metadata?.order_id ||
                webhookData.external_reference ||
                webhookData.reference;
      
      // Tentar determinar status
      if (webhookData.status === "paid" || webhookData.status === "approved" || webhookData.status === "succeeded") {
        paymentStatus = "captured";
      } else if (webhookData.status === "pending") {
        paymentStatus = "pending";
      }
    }

    if (!orderId) {
      logger.warn("Webhook de pagamento recebido mas order_id não encontrado");
      return res.status(400).json({
        error: "order_id não encontrado no webhook"
      });
    }

    // Buscar pedido
    const orders = await orderModule.listOrders({ id: orderId });
    
    if (!orders || orders.length === 0) {
      logger.warn(`Pedido ${orderId} não encontrado para atualizar status de pagamento`);
      return res.status(404).json({
        error: "Pedido não encontrado"
      });
    }

    const order = orders[0] as any;

    // Atualizar status do pagamento no pedido (via metadata, payment_status não é editável diretamente)
    await orderModule.updateOrders([{
      id: orderId,
      metadata: {
        ...(order.metadata || {}),
        payment_status: paymentStatus,
        payment_webhook_received_at: new Date().toISOString(),
        payment_provider: provider,
        payment_webhook_data: webhookData
      }
    }]);

    logger.info(`Status de pagamento atualizado para pedido ${orderId}: ${paymentStatus}`);

    // Se pagamento foi confirmado, enviar email de confirmação
    if (paymentStatus === "captured") {
      try {
        // Verificar se email já foi enviado (evitar duplicatas)
        if (!order.metadata?.payment_confirmation_email_sent) {
          await sendPaymentConfirmationEmail({
            ...order,
            payment_status: paymentStatus,
          });
          
          // Marcar que email foi enviado
          await orderModule.updateOrders([{
            id: orderId,
            metadata: {
              ...(order.metadata || {}),
              payment_status: paymentStatus,
              payment_webhook_received_at: new Date().toISOString(),
              payment_provider: provider,
              payment_webhook_data: webhookData,
              payment_confirmation_email_sent: true,
              payment_confirmation_email_sent_at: new Date().toISOString(),
            },
          }]);
          
          logger.info(`✅ Email de confirmação de pagamento enviado para pedido ${orderId}`);
        }
      } catch (emailError: any) {
        logger.error(`❌ Erro ao enviar email de confirmação de pagamento:`, emailError);
        // Não falhar o webhook se email falhar
      }
      
      // NFe será emitida pelo subscriber order.placed (se ainda não foi emitida)
      if (!order.metadata?.nfe_key) {
        logger.info(`Pagamento confirmado para pedido ${orderId}. NFe será emitida pelo subscriber order.placed.`);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processado com sucesso",
      order_id: orderId,
      payment_status: paymentStatus
    });

  } catch (error: any) {
    logger.error("Erro ao processar webhook de pagamento:", error);
    
    return res.status(500).json({
      error: "Erro ao processar webhook",
      message: error.message
    });
  }
}

