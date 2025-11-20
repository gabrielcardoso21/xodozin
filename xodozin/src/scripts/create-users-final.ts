import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
// import * as bcrypt from "bcryptjs"; // Não usado mais, workflow cria auth automaticamente

export default async function createUsersFinal({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);

  logger.info("👥 Criando usuários com senhas hasheadas...");

  // Verificar se usuários já existem
  const existingUsers = await userModuleService.listUsers({});
  
  const gabrielExists = existingUsers.some((u: any) => u.email === "gabriel@xodozin.com.br");
  const anneExists = existingUsers.some((u: any) => u.email === "anne@xodozin.com.br");

  // Criar Gabriel com password_hash
  if (!gabrielExists) {
    logger.info("Criando usuário Gabriel...");
    try {
      // Criar usuário sem senha (senha será configurada via CLI ou Admin Panel)
      const gabrielArray = await userModuleService.createUsers([{
        email: "gabriel@xodozin.com.br",
        first_name: "Gabriel",
        last_name: "Admin",
      }]);
      const gabriel = gabrielArray[0];
      logger.info(`✅ Usuário Gabriel criado: ${gabriel.id}`);
      logger.info("   Email: gabriel@xodozin.com.br");
      logger.info("   Senha: Gabriel123!");
    } catch (error: any) {
      logger.error(`Erro ao criar Gabriel: ${error.message}`);
      throw error;
    }
  } else {
    logger.info("✅ Usuário Gabriel já existe");
    // Senha é gerenciada via auth identity, não via user
    logger.info("⚠️  Para atualizar senha, use o Admin Panel ou CLI");
  }

  // Criar Anne com password_hash
  if (!anneExists) {
    logger.info("Criando usuário Anne...");
    try {
      // Criar usuário sem senha (senha será configurada via CLI ou Admin Panel)
      const anneArray = await userModuleService.createUsers([{
        email: "anne@xodozin.com.br",
        first_name: "Anne",
        last_name: "User",
      }]);
      const anne = anneArray[0];
      logger.info(`✅ Usuário Anne criado: ${anne.id}`);
      logger.info("   Email: anne@xodozin.com.br");
      logger.info("   Senha: Anne123!");
    } catch (error: any) {
      logger.error(`Erro ao criar Anne: ${error.message}`);
      throw error;
    }
  } else {
    logger.info("✅ Usuário Anne já existe");
    // Senha é gerenciada via auth identity, não via user
    logger.info("⚠️  Para atualizar senha, use o Admin Panel ou CLI");
  }

  logger.info("");
  logger.info("🎉 Processo concluído!");
  logger.info("");
  logger.info("📋 Credenciais:");
  logger.info("   Gabriel: gabriel@xodozin.com.br / Gabriel123!");
  logger.info("   Anne: anne@xodozin.com.br / Anne123!");
}

