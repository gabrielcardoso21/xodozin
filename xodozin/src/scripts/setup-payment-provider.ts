import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

/**
 * Script para configurar payment providers no Medusa
 * 
 * Suporta:
 * - Stripe (via @medusajs/payment-stripe)
 * - Mercado Pago (via módulo customizado - precisa ser implementado)
 * 
 * Variáveis de ambiente necessárias:
 * - STRIPE_SECRET_KEY (para Stripe)
 * - MERCADOPAGO_ACCESS_TOKEN (para Mercado Pago)
 */
export default async function setupPaymentProvider({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const regionModule = container.resolve(Modules.REGION);

  logger.info("💳 Configurando payment providers...");

  // Buscar região Brasil
  let regions: any[] = [];
  try {
    regions = (await regionModule.listRegions({
      currency_code: "brl",
    })) as any[];
  } catch (error) {
    logger.error("Erro ao buscar regiões:", error);
    throw error;
  }

  if (regions.length === 0) {
    logger.warn("⚠️ Região Brasil não encontrada. Execute 'yarn setup:brasil' primeiro.");
    return;
  }

  const brazilRegion = regions[0];
  logger.info(`✅ Região Brasil encontrada: ${brazilRegion.id}`);

  // Verificar payment providers disponíveis
  const paymentProviderModule = container.resolve(Modules.PAYMENT);
  
  // Listar payment providers existentes
  let existingProviders: any[] = [];
  try {
    existingProviders = (await paymentProviderModule.listPaymentProviders()) as any[];
  } catch (error) {
    logger.warn("Não foi possível listar payment providers:", error);
  }

  logger.info(`Payment providers encontrados: ${existingProviders.length}`);

  // Configurar Stripe se disponível
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey) {
    logger.info("🔵 Configurando Stripe...");
    
    // Verificar se Stripe provider já existe
    const stripeProvider = existingProviders.find(
      (p) => p.id === "pp_stripe" || p.id?.includes("stripe")
    );

    if (stripeProvider) {
      logger.info(`✅ Stripe já está configurado: ${stripeProvider.id}`);
    } else {
      logger.info("⚠️ Stripe provider não encontrado. Instale @medusajs/payment-stripe primeiro.");
      logger.info("   Execute: yarn add @medusajs/payment-stripe");
    }

    // Atualizar região para incluir Stripe nos payment providers
    try {
      const currentProviders = brazilRegion.payment_providers || [];
      if (!currentProviders.includes("pp_stripe") && !currentProviders.some((p: string) => p.includes("stripe"))) {
        logger.info("Adicionando Stripe à região Brasil...");
        // Nota: Atualizar região requer workflow específico
        // Por enquanto, apenas logamos
        logger.info("⚠️ Para adicionar Stripe à região, configure manualmente no Admin Panel:");
        logger.info("   Settings → Regions → Brasil → Payment Providers");
      }
    } catch (error) {
      logger.warn("Erro ao atualizar payment providers da região:", error);
    }
  } else {
    logger.info("ℹ️ STRIPE_SECRET_KEY não configurado. Pulando configuração do Stripe.");
  }

  // Configurar Mercado Pago se disponível
  const mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (mercadoPagoToken) {
    logger.info("🟢 Configurando Mercado Pago...");
    logger.info("⚠️ Mercado Pago requer módulo customizado. Implementação pendente.");
    logger.info("   Para implementar, crie um módulo de payment provider customizado.");
  } else {
    logger.info("ℹ️ MERCADOPAGO_ACCESS_TOKEN não configurado. Pulando configuração do Mercado Pago.");
  }

  // Verificar se há payment providers configurados na região
  const regionProviders = brazilRegion.payment_providers || [];
  if (regionProviders.length === 0) {
    logger.warn("⚠️ Nenhum payment provider configurado na região Brasil.");
    logger.info("   Configure manualmente no Admin Panel:");
    logger.info("   Settings → Regions → Brasil → Payment Providers");
  } else {
    logger.info(`✅ Payment providers na região Brasil: ${regionProviders.join(", ")}`);
  }

  logger.info("✅ Configuração de payment providers concluída.");
  logger.info("");
  logger.info("📝 Próximos passos:");
  logger.info("   1. Configure as credenciais no arquivo .env");
  logger.info("   2. Instale o módulo do payment provider (ex: @medusajs/payment-stripe)");
  logger.info("   3. Configure os payment providers na região Brasil via Admin Panel");
  logger.info("   4. Teste o fluxo de pagamento em ambiente de sandbox");
}

