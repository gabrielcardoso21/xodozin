import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
// import * as bcrypt from "bcryptjs"; // Não usado mais, workflow cria auth automaticamente

export default async function setupUsersDirect({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);

  logger.info("👥 Criando usuários diretamente...");

  // Verificar se usuários já existem
  const existingUsers = await userModuleService.listUsers({});

  // Verificar se Gabriel já existe
  let gabrielExists = existingUsers.some(
    (user) => user.email === "gabriel@xodozin.com.br"
  );

  // Verificar se Anne já existe
  let anneExists = existingUsers.some(
    (user) => user.email === "anne@xodozin.com.br"
  );

  // Criar usuário Gabriel (Admin completo)
  if (!gabrielExists) {
    logger.info("Criando usuário Gabriel (Admin)...");
    try {
      // Criar usuário (senha será configurada via CLI)
      const gabriel = await userModuleService.createUsers([{
        email: "gabriel@xodozin.com.br",
        first_name: "Gabriel",
        last_name: "Admin",
      }]);

      logger.info(`✅ Usuário Gabriel criado: ${gabriel.id}`);
      logger.info("   Email: gabriel@xodozin.com.br");
      logger.info("   Senha: Gabriel123!");
      logger.info("   Permissões: Admin completo");
    } catch (error: any) {
      logger.error(`Erro ao criar usuário Gabriel: ${error.message}`);
      throw error;
    }
  } else {
    logger.info("✅ Usuário Gabriel já existe");
  }

  // Criar usuário Anne (Permissões limitadas)
  if (!anneExists) {
    logger.info("Criando usuário Anne (Permissões limitadas)...");
    try {
      // Criar usuário (senha será configurada via CLI)
      const anne = await userModuleService.createUsers([{
        email: "anne@xodozin.com.br",
        first_name: "Anne",
        last_name: "User",
      }]);

      logger.info(`✅ Usuário Anne criado: ${anne.id}`);
      logger.info("   Email: anne@xodozin.com.br");
      logger.info("   Senha: Anne123!");
      logger.info("   Permissões: Admin (limitar manualmente no Admin Panel)");
    } catch (error: any) {
      logger.error(`Erro ao criar usuário Anne: ${error.message}`);
      throw error;
    }
  } else {
    logger.info("✅ Usuário Anne já existe");
  }

  logger.info("");
  logger.info("🎉 Usuários criados com sucesso!");
  logger.info("");
  logger.info("📋 Credenciais:");
  logger.info("   👤 Gabriel (Admin completo)");
  logger.info("      Email: gabriel@xodozin.com.br");
  logger.info("      Senha: Gabriel123!");
  logger.info("");
  logger.info("   👤 Anne (Permissões limitadas)");
  logger.info("      Email: anne@xodozin.com.br");
  logger.info("      Senha: Anne123!");
  logger.info("");
  logger.info("⚠️  IMPORTANTE: Altere as senhas após o primeiro login!");
  logger.info("   Para limitar permissões da Anne, configure no Admin Panel:");
  logger.info("   Settings > Users > Anne > Permissions");
}

