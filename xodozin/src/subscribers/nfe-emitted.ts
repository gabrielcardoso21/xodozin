import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Subscriber que escuta quando NFe é emitida e envia email
 * 
 * Evento: order.updated (quando metadata.nfe_key é adicionado)
 * 
 * Nota: Este subscriber será chamado quando o order-placed.ts
 * atualizar o pedido com os dados da NFe.
 */
export default async function nfeEmittedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const orderId = (data as any).id;

  try {
    logger.info(`Verificando se NFe foi emitida para pedido ${orderId}...`);

    // Buscar pedido
    const orderModule = container.resolve(Modules.ORDER);
    const orders = await orderModule.listOrders({ id: orderId });

    if (!orders || orders.length === 0) {
      logger.warn(`Pedido ${orderId} não encontrado para enviar email de NFe`);
      return;
    }

    const order = orders[0] as any;

    // Verificar se NFe foi emitida
    if (!order.metadata?.nfe_key) {
      logger.info(`NFe ainda não foi emitida para pedido ${orderId}`);
      return;
    }

    // Verificar se email já foi enviado (evitar duplicatas)
    if (order.metadata?.nfe_email_sent) {
      logger.info(`Email de NFe já foi enviado para pedido ${orderId}`);
      return;
    }

    // Enviar email com NFe (dynamic import para evitar erro de build)
    const { sendNFeEmail } = await import("../utils/email.js");
    await sendNFeEmail(order);

    // Marcar que email foi enviado
    await orderModule.updateOrders([{
      id: orderId,
      metadata: {
        ...order.metadata,
        nfe_email_sent: true,
        nfe_email_sent_at: new Date().toISOString(),
      },
    }]);

    logger.info(`✅ Email de NFe enviado para pedido ${orderId}`);

  } catch (error: any) {
    logger.error(`❌ Erro ao enviar email de NFe para pedido ${orderId}:`, error);
    // Não lançar erro para não quebrar o fluxo
  }
}

// Este subscriber será chamado quando order-placed.ts atualizar o pedido
// Pode não ter evento nativo, então será chamado manualmente
export const config: SubscriberConfig = {
  event: "order.updated", // Será disparado quando metadata for atualizado
};

