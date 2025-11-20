/**
 * Sistema de Internacionalização (i18n) para o Admin Panel do Medusa
 * 
 * Este arquivo exporta as traduções disponíveis e configura o sistema de i18n.
 * Por enquanto, o Medusa v2 não tem suporte nativo de i18n no admin panel,
 * mas esta estrutura permite extensões futuras e customizações.
 */

import ptBR from "./pt-BR";

export type Locale = "pt-BR" | "en";

export const translations = {
  "pt-BR": ptBR,
  // Adicionar outras traduções aqui no futuro
  // "en": en,
} as const;

export const defaultLocale: Locale = "pt-BR";

/**
 * Obtém a tradução para um locale específico
 */
export function getTranslation(locale: Locale = defaultLocale) {
  return translations[locale] || translations[defaultLocale];
}

/**
 * Função helper para traduzir chaves aninhadas
 * Exemplo: t("products.title") => "Produtos"
 */
export function t(key: string, locale: Locale = defaultLocale): string {
  const translation = getTranslation(locale);
  const keys = key.split(".");
  let value: any = translation;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Retorna a chave se não encontrar tradução
    }
  }

  return typeof value === "string" ? value : key;
}

// Exportar traduções padrão
export { ptBR };
export default translations;

