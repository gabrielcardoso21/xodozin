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
      // Usar workflow para criar usuário com autenticação
      const { createUsersWorkflow } = await import("@medusajs/medusa/core-flows");
      const { result } = await createUsersWorkflow(container).run({
        input: {
          users: [{
            email: "gabriel@xodozin.com.br",
            password: "Gabriel123!",
            first_name: "Gabriel",
            last_name: "Admin",
          }],
        },
      });
      const gabriel = result[0];
      logger.info(`✅ Usuário Gabriel criado: ${gabriel.id}`);
      logger.info("   Email: gabriel@xodozin.com.br");
      logger.info("   Senha: Gabriel123!");
    } catch (error: any) {
      logger.error(`Erro ao criar Gabriel: ${error.message}`);
      throw error;
    }
  } else {
    logger.info("✅ Usuário Gabriel já existe");
    // Atualizar senha se não tiver hash
    const gabriel = existingUsers.find((u: any) => u.email === "gabriel@xodozin.com.br");
    if (gabriel && !(gabriel as any).password_hash) {
      logger.info("Atualizando senha do Gabriel (não tinha hash)...");
      const hashedPassword = await bcrypt.hash("Gabriel123!", 10);
      await userModuleService.updateUsers([{
        id: gabriel.id,
        password_hash: hashedPassword,
      }]);
      logger.info("✅ Senha do Gabriel atualizada");
    }
  }

  // Criar Anne com password_hash
  if (!anneExists) {
    logger.info("Criando usuário Anne...");
    try {
      // Usar workflow para criar usuário com autenticação
      const { createUsersWorkflow } = await import("@medusajs/medusa/core-flows");
      const { result } = await createUsersWorkflow(container).run({
        input: {
          users: [{
            email: "anne@xodozin.com.br",
            password: "Anne123!",
            first_name: "Anne",
            last_name: "User",
          }],
        },
      });
      const anne = result[0];
      logger.info(`✅ Usuário Anne criado: ${anne.id}`);
      logger.info("   Email: anne@xodozin.com.br");
      logger.info("   Senha: Anne123!");
    } catch (error: any) {
      logger.error(`Erro ao criar Anne: ${error.message}`);
      throw error;
    }
  } else {
    logger.info("✅ Usuário Anne já existe");
    // Atualizar senha se não tiver hash
    const anne = existingUsers.find((u: any) => u.email === "anne@xodozin.com.br");
    if (anne && !(anne as any).password_hash) {
      logger.info("Atualizando senha da Anne (não tinha hash)...");
      const hashedPassword = await bcrypt.hash("Anne123!", 10);
      await userModuleService.updateUsers([{
        id: anne.id,
        password_hash: hashedPassword,
      }]);
      logger.info("✅ Senha da Anne atualizada");
    }
  }

  logger.info("");
  logger.info("🎉 Processo concluído!");
  logger.info("");
  logger.info("📋 Credenciais:");
  logger.info("   Gabriel: gabriel@xodozin.com.br / Gabriel123!");
  logger.info("   Anne: anne@xodozin.com.br / Anne123!");
}

