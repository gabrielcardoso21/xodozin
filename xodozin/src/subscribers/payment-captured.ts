import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Subscriber que escuta eventos de pagamento confirmado e envia email
 * 
 * Evento: payment.captured (ou podemos usar webhook de pagamento)
 * 
 * Nota: O Medusa pode não ter evento payment.captured nativo.
 * Este subscriber pode ser disparado manualmente ou via webhook.
 */
export default async function paymentCapturedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; order_id?: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const orderId = (data as any).id || (data as any).order_id;

  if (!orderId) {
    logger.warn("paymentCapturedHandler: order_id não encontrado no evento");
    return;
  }

  try {
    logger.info(`Pagamento confirmado para pedido ${orderId}. Enviando email de confirmação...`);

    // Buscar pedido
    const orderModule = container.resolve(Modules.ORDER);
    const orders = await orderModule.listOrders({ id: orderId });

    if (!orders || orders.length === 0) {
      logger.warn(`Pedido ${orderId} não encontrado para enviar email de confirmação`);
      return;
    }

    const order = orders[0] as any;

    // Verificar se pagamento foi realmente confirmado
    if (order.payment_status !== "captured" && order.payment_status !== "authorized") {
      logger.info(`Pedido ${orderId} ainda não está pago. Status: ${order.payment_status}`);
      return;
    }

    // Verificar se email já foi enviado (evitar duplicatas)
    if (order.metadata?.payment_confirmation_email_sent) {
      logger.info(`Email de confirmação de pagamento já foi enviado para pedido ${orderId}`);
      return;
    }

    // Enviar email de confirmação (dynamic import para evitar erro de build)
    const { sendPaymentConfirmationEmail } = await import("../utils/email.js");
    await sendPaymentConfirmationEmail(order);

    // Marcar que email foi enviado
    await orderModule.updateOrders([{
      id: orderId,
      metadata: {
        ...order.metadata,
        payment_confirmation_email_sent: true,
        payment_confirmation_email_sent_at: new Date().toISOString(),
      },
    }]);

    logger.info(`✅ Email de confirmação de pagamento enviado para pedido ${orderId}`);

  } catch (error: any) {
    logger.error(`❌ Erro ao enviar email de confirmação de pagamento para pedido ${orderId}:`, error);
    // Não lançar erro para não quebrar o fluxo
  }
}

// Nota: O Medusa pode não ter evento payment.captured nativo
// Este subscriber pode ser chamado manualmente ou via webhook
export const config: SubscriberConfig = {
  event: "payment.captured", // Pode não existir, será chamado manualmente
};

