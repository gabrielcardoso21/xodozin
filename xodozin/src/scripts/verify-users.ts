import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

export default async function verifyUsers({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);

  logger.info("🔍 Verificando usuários...");

  // Listar todos os usuários
  const users = await userModuleService.listUsers({});
  
  logger.info(`Total de usuários encontrados: ${users.length}`);
  logger.info("");

  // Verificar Gabriel
  const gabriel = users.find((u: any) => u.email === "gabriel@xodozin.com.br");
  if (gabriel) {
    logger.info("✅ Usuário Gabriel encontrado:");
    logger.info(`   ID: ${gabriel.id}`);
    logger.info(`   Email: ${gabriel.email}`);
    logger.info(`   Nome: ${(gabriel as any).first_name} ${(gabriel as any).last_name}`);
    logger.info(`   Tem password_hash: ${(gabriel as any).password_hash ? 'Sim' : 'Não'}`);
    logger.info(`   Password hash (primeiros 20 chars): ${(gabriel as any).password_hash ? (gabriel as any).password_hash.substring(0, 20) + '...' : 'N/A'}`);
  } else {
    logger.info("❌ Usuário Gabriel NÃO encontrado");
  }

  logger.info("");

  // Verificar Anne
  const anne = users.find((u: any) => u.email === "anne@xodozin.com.br");
  if (anne) {
    logger.info("✅ Usuário Anne encontrado:");
    logger.info(`   ID: ${anne.id}`);
    logger.info(`   Email: ${anne.email}`);
    logger.info(`   Nome: ${(anne as any).first_name} ${(anne as any).last_name}`);
    logger.info(`   Tem password_hash: ${(anne as any).password_hash ? 'Sim' : 'Não'}`);
    logger.info(`   Password hash (primeiros 20 chars): ${(anne as any).password_hash ? (anne as any).password_hash.substring(0, 20) + '...' : 'N/A'}`);
  } else {
    logger.info("❌ Usuário Anne NÃO encontrado");
  }

  logger.info("");
  logger.info("📋 Todos os usuários:");
  users.forEach((user, index) => {
    logger.info(`   ${index + 1}. ${user.email} (${user.id})`);
  });
}

