import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import * as bcrypt from "bcryptjs";

export default async function resetPassword({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);

  logger.info("🔐 Resetando senhas dos usuários...");

  // Buscar usuários
  const users = await userModuleService.listUsers({});
  
  // Resetar senha do Gabriel
  const gabriel = users.find((u: any) => u.email === "gabriel@xodozin.com.br");
  if (gabriel) {
    logger.info("Resetando senha do Gabriel...");
    const hashedPassword = await bcrypt.hash("Gabriel123!", 10);
    
    await userModuleService.updateUsers([{
      id: gabriel.id,
      password_hash: hashedPassword,
    }]);
    
    logger.info("✅ Senha do Gabriel resetada");
    logger.info("   Email: gabriel@xodozin.com.br");
    logger.info("   Nova senha: Gabriel123!");
  } else {
    logger.info("⚠️  Usuário Gabriel não encontrado");
  }

  // Resetar senha da Anne
  const anne = users.find((u: any) => u.email === "anne@xodozin.com.br");
  if (anne) {
    logger.info("Resetando senha da Anne...");
    const hashedPassword = await bcrypt.hash("Anne123!", 10);
    
    await userModuleService.updateUsers([{
      id: anne.id,
      password_hash: hashedPassword,
    }]);
    
    logger.info("✅ Senha da Anne resetada");
    logger.info("   Email: anne@xodozin.com.br");
    logger.info("   Nova senha: Anne123!");
  } else {
    logger.info("⚠️  Usuário Anne não encontrado");
  }

  logger.info("");
  logger.info("🎉 Senhas resetadas com sucesso!");
}

