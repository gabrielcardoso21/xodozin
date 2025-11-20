import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Subscriber que escuta eventos de pedido criado e emite NFe automaticamente
 * 
 * Evento: order.placed
 */
export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const orderId = data.id;

  try {
    logger.info(`Pedido criado: ${orderId}. Verificando se deve emitir NFe...`);

    // Buscar pedido
    const orderModule = container.resolve(Modules.ORDER);
    const orders = await orderModule.listOrders({ id: orderId });

    if (!orders || orders.length === 0) {
      logger.warn(`Pedido ${orderId} não encontrado após evento order.placed`);
      return;
    }

    const order = orders[0];

    // Verificar se NFe já foi emitida
    if (order.metadata?.nfe_key) {
      logger.info(`NFe já foi emitida para pedido ${orderId}. Chave: ${order.metadata.nfe_key}`);
      return;
    }

    // Verificar se há token do Focus NFe configurado
    const focusNfeToken = process.env.FOCUS_NFE_TOKEN;
    if (!focusNfeToken) {
      logger.warn(`FOCUS_NFE_TOKEN não configurado. NFe não será emitida automaticamente para pedido ${orderId}.`);
      return;
    }

    // Verificar se dados da empresa estão configurados
    const companyCnpj = process.env.COMPANY_CNPJ;
    if (!companyCnpj) {
      logger.warn(`COMPANY_CNPJ não configurado. NFe não será emitida automaticamente para pedido ${orderId}.`);
      return;
    }

    // Verificar se pedido está pago (status = "completed" ou payment_status = "captured")
    // Nota: Em alguns casos, pode querer emitir NFe apenas quando pagamento for confirmado
    // Por enquanto, emitimos assim que o pedido é criado
    const shouldEmitNFe = order.status === "completed" || 
                         order.payment_status === "captured" ||
                         order.payment_status === "authorized";

    if (!shouldEmitNFe) {
      logger.info(`Pedido ${orderId} ainda não está pago. NFe será emitida quando pagamento for confirmado.`);
      // Poderia criar um subscriber separado para order.payment_captured
      return;
    }

    logger.info(`Emitindo NFe automaticamente para pedido ${orderId}...`);

    // Preparar dados para emissão de NFe
    const focusNfeEnvironment = process.env.FOCUS_NFE_ENVIRONMENT || "sandbox";
    const focusNfeBaseUrl = focusNfeEnvironment === "production" 
      ? "https://api.focusnfe.com.br"
      : "https://homologacao.focusnfe.com.br";

    const companyName = process.env.COMPANY_NAME || "Xodózin";
    const companyAddress = process.env.COMPANY_ADDRESS || "";

    // Preparar dados do pedido para NFe
    const nfeData = {
      natureza_operacao: "Venda",
      data_emissao: new Date().toISOString().split('T')[0],
      data_entrada_saida: new Date().toISOString().split('T')[0],
      tipo_documento: "1", // 1 = NFe
      local_destino: "1", // 1 = Operação interna
      finalidade_emissao: "1", // 1 = Normal
      consumidor_final: "1", // 1 = Sim
      presenca_comprador: "1", // 1 = Operação presencial
      items: order.items?.map((item: any, index: number) => ({
        numero_item: index + 1,
        codigo_produto: item.variant?.sku || item.id || `ITEM-${index + 1}`,
        descricao: item.title || item.variant?.title || "Produto",
        cfop: "5102", // CFOP para venda de mercadoria
        unidade_comercial: "UN",
        quantidade_comercial: item.quantity || 1,
        valor_unitario_comercial: (item.unit_price || 0) / 100, // Converter de centavos para reais
        valor_total: ((item.unit_price || 0) * (item.quantity || 1)) / 100
      })) || [],
      cliente: {
        nome: (order.shipping_address?.first_name || "") + " " + (order.shipping_address?.last_name || "") || "Cliente",
        cpf: order.shipping_address?.cpf || "",
        email: order.email || "",
        telefone: order.shipping_address?.phone || "",
        endereco: {
          logradouro: order.shipping_address?.address_1 || "",
          numero: order.shipping_address?.address_2 || "",
          bairro: order.shipping_address?.city || "",
          municipio: order.shipping_address?.city || "São Paulo",
          uf: order.shipping_address?.province || "SP",
          cep: order.shipping_address?.postal_code?.replace(/\D/g, "") || "",
          pais: "BRA"
        }
      },
      transporte: {
        modalidade_frete: "9", // 9 = Sem frete
        volumes: [
          {
            quantidade: "1",
            especie: "Volumes",
            peso_bruto: "0.5",
            peso_liquido: "0.5"
          }
        ]
      }
    };

    // Chamar API do Focus NFe
    const axios = require("axios");
    const nfeResponse = await axios.post(
      `${focusNfeBaseUrl}/v2/nfe?ref=${orderId}`,
      nfeData,
      {
        auth: {
          username: focusNfeToken,
          password: ""
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Salvar dados da NFe no metadata do pedido
    const nfeKey = nfeResponse.data.chave_nfe;
    const nfeNumber = nfeResponse.data.numero;
    const nfeUrl = nfeResponse.data.url;

    // Atualizar pedido com dados da NFe
    await orderModule.updateOrders({
      id: orderId,
      metadata: {
        ...order.metadata,
        nfe_key: nfeKey,
        nfe_number: nfeNumber,
        nfe_url: nfeUrl,
        nfe_emitted_at: new Date().toISOString()
      }
    });

    logger.info(`✅ NFe emitida automaticamente para pedido ${orderId}. Chave: ${nfeKey}`);

    // Enviar email com NFe após emissão bem-sucedida
    try {
      const { sendNFeEmail } = await import("../utils/email");
      await sendNFeEmail({
        ...order,
        metadata: {
          ...order.metadata,
          nfe_key: nfeKey,
          nfe_number: nfeNumber,
          nfe_url: nfeUrl,
          nfe_emitted_at: new Date().toISOString(),
        },
      });
      
      // Marcar que email foi enviado
      await orderModule.updateOrders({
        id: orderId,
        metadata: {
          ...order.metadata,
          nfe_key: nfeKey,
          nfe_number: nfeNumber,
          nfe_url: nfeUrl,
          nfe_emitted_at: new Date().toISOString(),
          nfe_email_sent: true,
          nfe_email_sent_at: new Date().toISOString(),
        },
      });
      
      logger.info(`✅ Email de NFe enviado para pedido ${orderId}`);
    } catch (emailError: any) {
      logger.error(`❌ Erro ao enviar email de NFe (mas NFe foi emitida):`, emailError);
      // Não falhar o processo se email falhar
    }

  } catch (error: any) {
    logger.error(`❌ Erro ao emitir NFe automaticamente para pedido ${orderId}:`, error);
    
    // Log detalhado do erro
    if (error.response?.data) {
      logger.error(`Detalhes do erro Focus NFe:`, error.response.data);
    }
    
    // Não lançar erro para não quebrar o fluxo do pedido
    // A NFe pode ser emitida manualmente depois
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};

