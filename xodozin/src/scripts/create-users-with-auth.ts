import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createUsersWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function createUsersWithAuth({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);
  const authModuleService = container.resolve(Modules.AUTH);

  logger.info("👥 Criando usuários com autenticação...");

  // Verificar usuários existentes
  const existingUsers = await userModuleService.listUsers({});
  
  const gabrielExists = existingUsers.some(u => u.email === "gabriel@xodozin.com.br");
  const anneExists = existingUsers.some(u => u.email === "anne@xodozin.com.br");

  // Deletar usuários existentes sem auth
  if (gabrielExists) {
    const gabriel = existingUsers.find(u => u.email === "gabriel@xodozin.com.br");
    logger.info(`Deletando usuário Gabriel existente (${gabriel?.id})...`);
    await userModuleService.deleteUsers(gabriel!.id);
  }
  
  if (anneExists) {
    const anne = existingUsers.find(u => u.email === "anne@xodozin.com.br");
    logger.info(`Deletando usuário Anne existente (${anne?.id})...`);
    await userModuleService.deleteUsers(anne!.id);
  }

  // Criar Gabriel usando workflow (que cria auth automaticamente)
  logger.info("Criando usuário Gabriel com autenticação...");
  try {
    const { result } = await createUsersWorkflow(container).run({
      input: {
        users: [
          {
            email: "gabriel@xodozin.com.br",
            password: "Gabriel123!",
            first_name: "Gabriel",
            last_name: "Admin",
          },
        ],
      },
    });
    logger.info(`✅ Usuário Gabriel criado: ${result[0].id}`);
  } catch (error: any) {
    logger.error(`Erro ao criar Gabriel: ${error.message}`);
    logger.error(error.stack);
  }

  // Criar Anne usando workflow
  logger.info("Criando usuário Anne com autenticação...");
  try {
    const { result } = await createUsersWorkflow(container).run({
      input: {
        users: [
          {
            email: "anne@xodozin.com.br",
            password: "Anne123!",
            first_name: "Anne",
            last_name: "User",
          },
        ],
      },
    });
    logger.info(`✅ Usuário Anne criado: ${result[0].id}`);
  } catch (error: any) {
    logger.error(`Erro ao criar Anne: ${error.message}`);
    logger.error(error.stack);
  }

  // Verificar auth identities criadas
  logger.info("");
  logger.info("Verificando identidades de autenticação...");
  const authIdentities = await authModuleService.listAuthIdentities({});
  logger.info(`Total de auth identities: ${authIdentities.length}`);

  logger.info("");
  logger.info("🎉 Processo concluído!");
  logger.info("");
  logger.info("📋 Credenciais:");
  logger.info("   Gabriel: gabriel@xodozin.com.br / Gabriel123!");
  logger.info("   Anne: anne@xodozin.com.br / Anne123!");
}

