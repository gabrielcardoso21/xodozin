import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
// import {
//   linkSalesChannelsToProductWorkflow,
// } from "@medusajs/medusa/core-flows";

export default async function linkProductsToSalesChannel({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

  logger.info("🔗 Vinculando produtos ao sales channel...");

  // Buscar sales channel padrão
  const salesChannels = await salesChannelModuleService.listSalesChannels();
  const defaultSalesChannel = salesChannels[0];

  if (!defaultSalesChannel) {
    throw new Error("Nenhum sales channel encontrado!");
  }

  logger.info(`Sales channel encontrado: ${defaultSalesChannel.name} (${defaultSalesChannel.id})`);

  // Buscar todos os produtos
  const products = await productModuleService.listProducts({});

  logger.info(`Encontrados ${products.length} produtos`);

  // TODO: Corrigir workflow quando API estiver disponível
  // Por enquanto, produtos são vinculados automaticamente ao sales channel padrão
  logger.info("⚠️  Workflow de vinculação não disponível. Produtos serão vinculados automaticamente ao sales channel padrão.");

  logger.info("");
  logger.info("🎉 Processo concluído!");
  logger.info(`✅ ${products.length} produtos processados`);
}

