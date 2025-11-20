import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Endpoint para emitir nota fiscal (NFe) para um pedido
 * 
 * GET /store/orders/:id/invoice
 * 
 * Integra com Focus NFe API para emissão automática de notas fiscais
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id: orderId } = req.params;
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);

  try {
    // Verificar se orderId foi fornecido
    if (!orderId) {
      return res.status(400).json({
        error: "Order ID é obrigatório"
      });
    }

    // Buscar pedido
    const orderModule = req.scope.resolve(Modules.ORDER);
    const orders = await orderModule.listOrders({ id: orderId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        error: "Pedido não encontrado"
      });
    }

    const order = orders[0];

    // Verificar se NFe já foi emitida
    if (order.metadata?.nfe_key) {
      return res.status(200).json({
        message: "NFe já foi emitida para este pedido",
        nfe_key: order.metadata.nfe_key,
        nfe_number: order.metadata.nfe_number,
        nfe_url: order.metadata.nfe_url
      });
    }

    // Verificar se há token do Focus NFe configurado
    const focusNfeToken = process.env.FOCUS_NFE_TOKEN;
    if (!focusNfeToken) {
      logger.warn("FOCUS_NFE_TOKEN não configurado. Não é possível emitir NFe.");
      return res.status(503).json({
        error: "Serviço de emissão de NFe não configurado",
        message: "Configure FOCUS_NFE_TOKEN nas variáveis de ambiente"
      });
    }

    // Preparar dados para emissão de NFe
    const focusNfeEnvironment = process.env.FOCUS_NFE_ENVIRONMENT || "sandbox";
    const focusNfeBaseUrl = focusNfeEnvironment === "production" 
      ? "https://api.focusnfe.com.br"
      : "https://homologacao.focusnfe.com.br";

    // Dados da empresa (deve estar configurado nas variáveis de ambiente)
    const companyCnpj = process.env.COMPANY_CNPJ;
    const companyName = process.env.COMPANY_NAME || "Xodózin";
    const companyAddress = process.env.COMPANY_ADDRESS || "";

    if (!companyCnpj) {
      logger.warn("COMPANY_CNPJ não configurado. Não é possível emitir NFe.");
      return res.status(503).json({
        error: "Dados da empresa não configurados",
        message: "Configure COMPANY_CNPJ, COMPANY_NAME e COMPANY_ADDRESS nas variáveis de ambiente"
      });
    }

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
      items: order.items?.map((item: any) => ({
        numero_item: item.quantity || 1,
        codigo_produto: item.variant?.sku || item.id,
        descricao: item.title || item.variant?.title || "Produto",
        cfop: "5102", // CFOP para venda de mercadoria
        unidade_comercial: "UN",
        quantidade_comercial: item.quantity || 1,
        valor_unitario_comercial: (item.unit_price || 0) / 100, // Converter de centavos para reais
        valor_total: ((item.unit_price || 0) * (item.quantity || 1)) / 100
      })) || [],
      cliente: {
        nome: ((order.shipping_address as any)?.first_name || "") + " " + ((order.shipping_address as any)?.last_name || "") || "Cliente",
        cpf: (order.shipping_address as any)?.cpf || "",
        email: (order as any).email || "",
        telefone: (order.shipping_address as any)?.phone || "",
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
    await orderModule.updateOrders([{
      id: orderId,
      metadata: {
        ...(order.metadata || {}),
        nfe_key: nfeKey,
        nfe_number: nfeNumber,
        nfe_url: nfeUrl,
        nfe_emitted_at: new Date().toISOString()
      }
    }]);

    logger.info(`NFe emitida com sucesso para pedido ${orderId}. Chave: ${nfeKey}`);

    return res.status(200).json({
      success: true,
      message: "NFe emitida com sucesso",
      nfe_key: nfeKey,
      nfe_number: nfeNumber,
      nfe_url: nfeUrl,
      order_id: orderId
    });

  } catch (error: any) {
    logger.error(`Erro ao emitir NFe para pedido ${orderId}:`, error);
    
    // Se for erro da API Focus NFe, retornar mensagem específica
    if (error.response?.data) {
      return res.status(error.response.status || 500).json({
        error: "Erro ao emitir NFe",
        message: error.response.data.mensagem || error.message,
        details: error.response.data
      });
    }

    return res.status(500).json({
      error: "Erro interno ao emitir NFe",
      message: error.message
    });
  }
}

