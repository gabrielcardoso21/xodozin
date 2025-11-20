import { ExecArgs } from "@medusajs/framework/types";
import { createApiKeysWorkflow, linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";

export default async function createPublishableKey({ container }: ExecArgs) {
  const logger = container.resolve("logger");
  
  logger.info("Criando publishable API key...");
  
  // Buscar sales channel padrão
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const salesChannels = await salesChannelModule.listSalesChannels();
  const defaultSalesChannel = salesChannels[0];
  
  if (!defaultSalesChannel) {
    throw new Error("Nenhum sales channel encontrado. Execute o setup do Brasil primeiro.");
  }
  
  // Criar publishable API key
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Frontend Web",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  
  const publishableApiKey = publishableApiKeyResult[0];
  
  // Vincular ao sales channel
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });
  
  logger.info("✅ Publishable API key criada com sucesso!");
  logger.info(`🔑 Token: ${publishableApiKey.token}`);
  logger.info(`📝 ID: ${publishableApiKey.id}`);
  logger.info(`📝 Title: ${publishableApiKey.title}`);
  
  console.log("\n=== PUBLISHABLE API KEY ===");
  console.log(`Token: ${publishableApiKey.token}`);
  console.log(`ID: ${publishableApiKey.id}`);
  console.log("===========================\n");
  
  return publishableApiKey;
}

