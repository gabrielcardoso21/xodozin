import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

export default async function deleteUsers({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);

  logger.info("🗑️  Deletando usuários existentes...");

  // Buscar usuários
  const users = await userModuleService.listUsers({});
  
  // Deletar Gabriel
  const gabriel = users.find(u => u.email === "gabriel@xodozin.com.br");
  if (gabriel) {
    logger.info(`Deletando usuário Gabriel (${gabriel.id})...`);
    await userModuleService.deleteUsers(gabriel.id);
    logger.info("✅ Usuário Gabriel deletado");
  } else {
    logger.info("⚠️  Usuário Gabriel não encontrado");
  }

  // Deletar Anne
  const anne = users.find(u => u.email === "anne@xodozin.com.br");
  if (anne) {
    logger.info(`Deletando usuário Anne (${anne.id})...`);
    await userModuleService.deleteUsers(anne.id);
    logger.info("✅ Usuário Anne deletada");
  } else {
    logger.info("⚠️  Usuário Anne não encontrado");
  }

  logger.info("");
  logger.info("🎉 Usuários deletados! Agora você pode recriar via CLI:");
  logger.info("   yarn medusa user");
}

