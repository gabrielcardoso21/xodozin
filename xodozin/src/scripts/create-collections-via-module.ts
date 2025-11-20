import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createCollectionsWorkflow,
  batchLinkProductsToCollectionWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function createCollectionsViaModule({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);

  logger.info("📦 Criando collections (kits)...");

  // Buscar produtos
  const products = await productModuleService.listProducts({});
  
  if (products.length === 0) {
    logger.info("⚠️  Nenhum produto encontrado. Crie produtos primeiro.");
    return;
  }

  logger.info(`Encontrados ${products.length} produtos`);

  // Criar collections usando workflow
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

  const createdCollections: any[] = [];

  for (const collectionData of collections) {
    try {
      // Verificar se já existe
      const existing = await productModuleService.listProductCollections({
        handle: collectionData.handle,
      });

      let collection;
      if (existing.length > 0) {
        collection = existing[0];
        logger.info(`⚠️  Collection "${collectionData.title}" já existe, usando existente`);
      } else {
        // Criar collection usando workflow
        const { result } = await createCollectionsWorkflow(container).run({
          input: {
            collections: [collectionData],
          },
        });
        collection = result[0];
        logger.info(`✅ Collection criada: ${collection.title} (${collection.id})`);
      }

      createdCollections.push(collection as any);

      // Vincular produtos à collection usando workflow
      const productsToLink = products.slice(0, 2).map(p => p.id);
      
      if (productsToLink.length > 0) {
        await batchLinkProductsToCollectionWorkflow(container).run({
          input: {
            id: collection.id,
            add: productsToLink,
          },
        });
        logger.info(`✅ ${productsToLink.length} produtos vinculados à collection ${collection.title}`);
      }
    } catch (error: any) {
      logger.error(`❌ Erro ao processar collection "${collectionData.title}": ${error.message}`);
      if (error.stack) logger.error(error.stack);
    }
  }

  logger.info("");
  logger.info("🎉 Processo concluído!");
  logger.info(`✅ ${createdCollections.length} collections processadas`);
}

