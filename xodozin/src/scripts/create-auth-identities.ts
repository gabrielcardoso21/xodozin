import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import * as bcrypt from "bcryptjs";

export default async function createAuthIdentities({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);
  const authModuleService = container.resolve(Modules.AUTH);

  logger.info("🔐 Criando identidades de autenticação...");

  // Buscar usuários
  const users = await userModuleService.listUsers({});
  
  const gabriel = users.find(u => u.email === "gabriel@xodozin.com.br");
  const anne = users.find(u => u.email === "anne@xodozin.com.br");

  if (!gabriel) {
    logger.error("❌ Usuário Gabriel não encontrado!");
    return;
  }

  if (!anne) {
    logger.error("❌ Usuário Anne não encontrado!");
    return;
  }

  // Criar auth identity e provider identity para Gabriel
  logger.info("Criando autenticação para Gabriel...");
  try {
    const hashedPassword = await bcrypt.hash("Gabriel123!", 10);
    
    // Criar auth identity
    const authIdentityArray = await authModuleService.createAuthIdentities([{
      entity_id: gabriel.id,
      provider_metadata: {},
    }] as any);
    const authIdentity = authIdentityArray[0];

    // Criar provider identity com emailpass (API mudou)
    await authModuleService.createProviderIdentities([{
      provider: "emailpass",
      auth_identity_id: authIdentity.id,
      user_metadata: {
        email: gabriel.email,
      },
      provider_metadata: {
        password: hashedPassword,
      },
    }] as any);

    logger.info(`✅ Autenticação criada para Gabriel (auth: ${authIdentity.id})`);
  } catch (error: any) {
    logger.error(`Erro ao criar auth para Gabriel: ${error.message}`);
    if (error.stack) logger.error(error.stack);
  }

  // Criar auth identity e provider identity para Anne
  logger.info("Criando autenticação para Anne...");
  try {
    const hashedPassword = await bcrypt.hash("Anne123!", 10);
    
    // Criar auth identity (API mudou, usar método correto)
    const authIdentityArray = await authModuleService.createAuthIdentities([{
      entity_id: anne.id,
      provider_metadata: {},
    }] as any);
    const authIdentity = authIdentityArray[0];

    // Criar provider identity com emailpass (API mudou)
    await authModuleService.createProviderIdentities([{
      provider: "emailpass",
      auth_identity_id: authIdentity.id,
      user_metadata: {
        email: anne.email,
      },
      provider_metadata: {
        password: hashedPassword,
      },
    }] as any);

    logger.info(`✅ Autenticação criada para Anne (auth: ${authIdentity.id})`);
  } catch (error: any) {
    logger.error(`Erro ao criar auth para Anne: ${error.message}`);
    if (error.stack) logger.error(error.stack);
  }

  // Verificar
  const authIdentities = await authModuleService.listAuthIdentities({});
  const providerIdentities = await authModuleService.listProviderIdentities({});
  
  logger.info("");
  logger.info(`Total de auth identities: ${authIdentities.length}`);
  logger.info(`Total de provider identities: ${providerIdentities.length}`);
  
  logger.info("");
  logger.info("🎉 Processo concluído!");
  logger.info("");
  logger.info("📋 Credenciais:");
  logger.info("   Gabriel: gabriel@xodozin.com.br / Gabriel123!");
  logger.info("   Anne: anne@xodozin.com.br / Anne123!");
  logger.info("");
  logger.info("🌐 Teste o login em: http://localhost:9000/app");
}

