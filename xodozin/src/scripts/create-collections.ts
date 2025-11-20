import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
// Workflows de collections não estão disponíveis, usar módulo diretamente
// import { createProductCollectionsWorkflow, linkProductsToCollectionWorkflow } from "@medusajs/medusa/core-flows";

export default async function createCollections({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

  logger.info("📦 Criando collections (kits)...");

  // Buscar sales channel padrão
  const salesChannels = await salesChannelModuleService.listSalesChannels();
  const defaultSalesChannel = salesChannels[0];

  if (!defaultSalesChannel) {
    throw new Error("Nenhum sales channel encontrado!");
  }

  // Buscar produtos
  const products = await productModuleService.listProducts({});
  
  if (products.length === 0) {
    logger.info("⚠️  Nenhum produto encontrado. Crie produtos primeiro.");
    return;
  }

  logger.info(`Encontrados ${products.length} produtos`);

  // Criar collections de exemplo
  const collections = [
    {
      title: "Kit Xodó",
      handle: "kit-xodo",
      metadata: {
        tier: "xodo",
        description: "Kit completo de autocuidado e reconexão",
        price_min: 50,
        price_max: 100,
      },
    },
    {
      title: "Kit Encanto",
      handle: "kit-encanto",
      metadata: {
        tier: "encanto",
        description: "Kit para conexão romântica",
        price_min: 100,
        price_max: 150,
      },
    },
    {
      title: "Kit Completo",
      handle: "kit-completo",
      metadata: {
        tier: "completo",
        description: "Kit completo para amizade e conexão",
        price_min: 150,
        price_max: 200,
      },
    },
  ];

  // TODO: Implementar criação de collections via módulo quando API estiver disponível
  logger.warn("⚠️  Criação de collections via workflow não está disponível. Use o Admin Panel para criar collections.");
  
  for (const collectionData of collections) {
    try {
      // Usar módulo diretamente
      const productModule = container.resolve(Modules.PRODUCT);
      const collection = await productModule.createProductCollections([collectionData] as any);
      logger.info(`✅ Collection criada: ${collectionData.title}`);

      // TODO: Vincular produtos via módulo quando API estiver disponível
      logger.info(`⚠️  Vincule produtos manualmente via Admin Panel para a collection ${collectionData.title}`);
    } catch (error: any) {
      if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        logger.info(`⚠️  Collection "${collectionData.title}" já existe`);
      } else {
        logger.error(`❌ Erro ao criar collection "${collectionData.title}": ${error.message}`);
      }
    }
  }

  logger.info("");
  logger.info("🎉 Processo concluído!");
}

