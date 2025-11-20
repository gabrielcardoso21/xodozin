import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
  updateStoresStep,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

// Workflow para atualizar moedas do store
const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function setupBrasil({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("🇧🇷 Configurando região Brasil...");

  // Verificar se região já existe
  logger.info("Verificando se região Brasil já existe...");
  const regionModule = container.resolve(Modules.REGION);
  let existingRegions: any[] = [];
  try {
    existingRegions = await regionModule.listRegions({
      currency_code: "brl",
    }) as any[];
  } catch (error) {
    // Se não conseguir listar, tentar criar
  }

  let region;
  if (existingRegions.length > 0) {
    region = existingRegions[0];
    logger.info(`✅ Região Brasil já existe: ${region.id}`);
  } else {
    // Criar região Brasil
    logger.info("Criando região Brasil...");
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Brasil",
            currency_code: "brl",
            countries: ["br"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
    logger.info(`✅ Região Brasil criada: ${region.id}`);
  }

  // Criar tax region (se não existir)
  logger.info("Verificando tax region para Brasil...");
  try {
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: "br",
          provider_id: "tp_system",
        },
      ],
    });
    logger.info("✅ Tax region criada");
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      logger.info("✅ Tax region já existe");
    } else {
      throw error;
    }
  }

  // Criar stock location
  logger.info("Criando stock location...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Armazém São Paulo",
          address: {
            city: "São Paulo",
            country_code: "BR",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  // Atualizar store com location padrão, moeda BRL e região Brasil
  const [store] = await storeModuleService.listStores();
  
  // Configurar BRL como moeda padrão
  logger.info("Configurando BRL como moeda padrão do store...");
  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "brl",
          is_default: true,
        },
      ],
    },
  });
  logger.info("✅ Moeda BRL configurada como padrão");

  // Atualizar store com location padrão e região padrão
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
        // Nota: default_region_id pode não estar disponível diretamente
        // A região padrão é determinada pela primeira região criada ou pela moeda padrão
      },
    },
  });
  logger.info("✅ Store atualizado com location padrão");

  // Link provider manual_manual com stock location (necessário antes de criar shipping options)
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });
  logger.info("✅ Stock location criada e configurada");

  // Criar shipping profile
  logger.info("Criando shipping profile...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Perfil de Envio Padrão",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }
  logger.info("✅ Shipping profile criado");

  // Criar fulfillment set (se não existir)
  logger.info("Verificando fulfillment set...");
  let fulfillmentSet;
  try {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Entrega São Paulo",
      type: "shipping",
      service_zones: [
        {
          name: "Brasil",
          geo_zones: [
            {
              country_code: "br",
              type: "country",
            },
          ],
        },
      ],
    });
    logger.info(`✅ Fulfillment set criado: ${fulfillmentSet.id}`);
  } catch (error: any) {
    if (error.message?.includes("already exists") || error.message?.includes("duplicate")) {
      // Tentar buscar o fulfillment set existente
      const existingSets = await fulfillmentModuleService.listFulfillmentSets({
        name: "Entrega São Paulo",
      });
      if (existingSets.length > 0) {
        // Buscar o fulfillment set completo com todas as relações
        fulfillmentSet = await fulfillmentModuleService.retrieveFulfillmentSet(existingSets[0].id, {
          relations: ["service_zones", "service_zones.geo_zones"],
        });
        logger.info(`✅ Fulfillment set já existe: ${fulfillmentSet.id}`);
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }

  // Link stock location com fulfillment set (se não existir)
  logger.info("Verificando links...");
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });
    logger.info("✅ Links criados");
  } catch (error: any) {
    if (error.message?.includes("multiple links") || error.message?.includes("already exists")) {
      logger.info("✅ Links já existem");
    } else {
      throw error;
    }
  }

  // Criar shipping options (se não existir)
  logger.info("Criando opções de envio...");
  
  // Garantir que temos service zones
  let serviceZoneId;
  if (fulfillmentSet.service_zones && fulfillmentSet.service_zones.length > 0) {
    serviceZoneId = fulfillmentSet.service_zones[0].id;
  } else {
    // Buscar fulfillment set completo se não tiver service zones
    const fullFulfillmentSet = await fulfillmentModuleService.retrieveFulfillmentSet(fulfillmentSet.id);
    if (fullFulfillmentSet.service_zones && fullFulfillmentSet.service_zones.length > 0) {
      serviceZoneId = fullFulfillmentSet.service_zones[0].id;
    } else {
      logger.info("⚠️  Fulfillment set não tem service zones. Pulando criação de shipping options.");
      logger.info("   Você pode criar shipping options manualmente no Admin Panel.");
      logger.info("🎉 Configuração do Brasil concluída!");
      return;
    }
  }
  
  try {
    await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Entrega Padrão",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Padrão",
          description: "Entrega em 5 dias úteis.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "brl",
            amount: 1000, // R$ 10,00 em centavos
          },
          {
            region_id: region.id,
            amount: 1000,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
    logger.info("✅ Opções de envio criadas");
  } catch (error: any) {
    if (error.message?.includes("already exists") || error.message?.includes("not enabled")) {
      logger.info("⚠️  Opções de envio podem já existir ou precisar de configuração manual");
      logger.info("   Você pode criar manualmente no Admin Panel se necessário");
    } else {
      throw error;
    }
  }

  logger.info("🎉 Configuração do Brasil concluída!");
  logger.info("");
  logger.info("📋 Resumo da configuração:");
  logger.info(`   - Região: Brasil (${region.id})`);
  logger.info("   - Moeda padrão: BRL (Real Brasileiro)");
  logger.info(`   - Stock Location: ${stockLocation.name}`);
  logger.info("   - Locale: pt-BR (configurado automaticamente)");
  logger.info("");
  logger.info("✅ Store configurado e pronto para uso!");
}

