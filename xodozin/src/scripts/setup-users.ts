import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createInvitesWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function setupUsers({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const userModuleService = container.resolve(Modules.USER);

  logger.info("👥 Configurando usuários...");

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

  // Criar convite para Gabriel (Admin completo)
  if (!gabrielExists) {
    logger.info("Criando convite para Gabriel (Admin)...");
    try {
      const { result: gabrielInvite } = await createInvitesWorkflow(container).run({
        input: {
          invites: [
            {
              email: "gabriel@xodozin.com.br",
              role: "admin",
              metadata: {
                first_name: "Gabriel",
                last_name: "Admin",
              },
            },
          ],
        },
      });

      logger.info(`✅ Convite criado para Gabriel: ${gabrielInvite[0].id}`);
      logger.info("   Email: gabriel@xodozin.com.br");
      logger.info("   Token: " + gabrielInvite[0].token);
      logger.info("   Permissões: Admin completo");
      logger.info("   ⚠️  Use o token para aceitar o convite no Admin Panel");
    } catch (error: any) {
      if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        logger.info("✅ Usuário/convite para Gabriel já existe");
        gabrielExists = true;
      } else {
        logger.error(`Erro ao criar convite para Gabriel: ${error.message}`);
        throw error;
      }
    }
  } else {
    logger.info("✅ Usuário Gabriel já existe");
  }

  // Criar convite para Anne (Permissões limitadas)
  // Nota: No Medusa v2, todos os usuários são admins por padrão
  // Para limitar permissões, você precisaria criar um sistema customizado
  // Por enquanto, criamos como admin mas com nota sobre limitação manual
  if (!anneExists) {
    logger.info("Criando convite para Anne (Permissões limitadas)...");
    try {
      const { result: anneInvite } = await createInvitesWorkflow(container).run({
        input: {
          invites: [
            {
              email: "anne@xodozin.com.br",
              role: "admin", // Por padrão, mas pode ser limitado manualmente
              metadata: {
                first_name: "Anne",
                last_name: "User",
                limited_permissions: true, // Flag para identificar usuário limitado
              },
            },
          ],
        },
      });

      logger.info(`✅ Convite criado para Anne: ${anneInvite[0].id}`);
      logger.info("   Email: anne@xodozin.com.br");
      logger.info("   Token: " + anneInvite[0].token);
      logger.info("   Permissões: Admin (limitar manualmente no Admin Panel)");
      logger.info("   ⚠️  Use o token para aceitar o convite no Admin Panel");
    } catch (error: any) {
      if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
        logger.info("✅ Usuário/convite para Anne já existe");
        anneExists = true;
      } else {
        logger.error(`Erro ao criar convite para Anne: ${error.message}`);
        throw error;
      }
    }
  } else {
    logger.info("✅ Usuário Anne já existe");
  }

  logger.info("");
  logger.info("🎉 Configuração de usuários concluída!");
  logger.info("");
  logger.info("📋 Convites criados:");
  logger.info("   👤 Gabriel (Admin completo)");
  logger.info("      Email: gabriel@xodozin.com.br");
  logger.info("      Aceite o convite no Admin Panel usando o token acima");
  logger.info("");
  logger.info("   👤 Anne (Permissões limitadas)");
  logger.info("      Email: anne@xodozin.com.br");
  logger.info("      Aceite o convite no Admin Panel usando o token acima");
  logger.info("      ⚠️  Limite permissões manualmente após aceitar o convite");
  logger.info("");
  logger.info("📝 Para aceitar os convites:");
  logger.info("   1. Acesse http://localhost:9000/app");
  logger.info("   2. Use o token do convite para criar a senha");
  logger.info("   3. Faça login com o email e senha criada");
}
