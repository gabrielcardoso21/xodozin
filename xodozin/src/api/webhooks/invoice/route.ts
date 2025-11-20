import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Webhook para receber atualizações de NFe do Focus NFe
 * 
 * POST /webhooks/invoice
 * 
 * Recebe notificações sobre status de emissão de NFe
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  const orderModule = req.scope.resolve(Modules.ORDER);

  try {
    const webhookData = req.body as any;
    const headers = req.headers;

    logger.info("Webhook de NFe recebido");

    // Extrair referência do pedido (order_id)
    const orderId = webhookData.ref || 
                    webhookData.reference ||
                    webhookData.order_id ||
                    webhookData.metadata?.order_id;

    if (!orderId) {
      logger.warn("Webhook de NFe recebido mas order_id não encontrado");
      return res.status(400).json({
        error: "order_id não encontrado no webhook"
      });
    }

    // Buscar pedido
    const orders = await orderModule.listOrders({ id: orderId });
    
    if (!orders || orders.length === 0) {
      logger.warn(`Pedido ${orderId} não encontrado para atualizar status de NFe`);
      return res.status(404).json({
        error: "Pedido não encontrado"
      });
    }

    const order = orders[0] as any;

    // Processar status da NFe
    const nfeStatus = webhookData.status || webhookData.situacao || "unknown";
    const nfeKey = webhookData.chave_nfe || webhookData.chave || order.metadata?.nfe_key;
    const nfeNumber = webhookData.numero || webhookData.numero_nfe || order.metadata?.nfe_number;
    const nfeUrl = webhookData.url || webhookData.url_nfe || order.metadata?.nfe_url;

    // Atualizar metadata do pedido com informações da NFe
    const updatedMetadata: any = {
      ...(order.metadata || {}),
      nfe_status: nfeStatus,
      nfe_webhook_received_at: new Date().toISOString(),
      nfe_webhook_data: webhookData
    };

    // Se NFe foi autorizada/emitida, salvar chave e número
    if (nfeStatus === "autorizado" || nfeStatus === "authorized" || nfeKey) {
      updatedMetadata.nfe_key = nfeKey || updatedMetadata.nfe_key;
      updatedMetadata.nfe_number = nfeNumber || updatedMetadata.nfe_number;
      updatedMetadata.nfe_url = nfeUrl || updatedMetadata.nfe_url;
      updatedMetadata.nfe_emitted_at = updatedMetadata.nfe_emitted_at || new Date().toISOString();
      
      logger.info(`NFe autorizada para pedido ${orderId}. Chave: ${nfeKey}`);
    }

    // Se NFe foi cancelada
    if (nfeStatus === "cancelado" || nfeStatus === "canceled") {
      updatedMetadata.nfe_canceled_at = new Date().toISOString();
      logger.info(`NFe cancelada para pedido ${orderId}`);
    }

    // Atualizar pedido
    await orderModule.updateOrders([{
      id: orderId,
      metadata: updatedMetadata
    }]);

    logger.info(`Status de NFe atualizado para pedido ${orderId}: ${nfeStatus}`);

    return res.status(200).json({
      success: true,
      message: "Webhook de NFe processado com sucesso",
      order_id: orderId,
      nfe_status: nfeStatus,
      nfe_key: nfeKey
    });

  } catch (error: any) {
    logger.error("Erro ao processar webhook de NFe:", error);
    
    return res.status(500).json({
      error: "Erro ao processar webhook de NFe",
      message: error.message
    });
  }
}

