import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  updateCollectionsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function updateCollectionsMetadata({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);

  logger.info("📝 Atualizando metadata das collections...");

  // Buscar collections existentes
  const collections = await productModuleService.listProductCollections({});

  const collectionsToUpdate = [
    {
      handle: "kit-xodo",
      metadata: {
        tier: "xodo",
        description: "Kit completo de autocuidado e reconexão",
        price_min: 50,
        price_max: 100,
      },
    },
    {
      handle: "kit-encanto",
      metadata: {
        tier: "encanto",
        description: "Kit para conexão romântica",
        price_min: 100,
        price_max: 150,
      },
    },
    {
      handle: "kit-completo",
      metadata: {
        tier: "completo",
        description: "Kit completo para amizade e conexão",
        price_min: 150,
        price_max: 200,
      },
    },
  ];

  for (const collectionData of collectionsToUpdate) {
    const collection = collections.find(c => c.handle === collectionData.handle);
    
    if (collection) {
      try {
        await updateCollectionsWorkflow(container).run({
          input: {
            selector: { id: collection.id },
            update: {
              metadata: collectionData.metadata,
            },
          },
        });
        logger.info(`✅ Metadata atualizado para "${collection.title}"`);
      } catch (error: any) {
        logger.error(`❌ Erro ao atualizar "${collection.title}": ${error.message}`);
      }
    } else {
      logger.info(`⚠️  Collection "${collectionData.handle}" não encontrada`);
    }
  }

  logger.info("");
  logger.info("🎉 Processo concluído!");
}

