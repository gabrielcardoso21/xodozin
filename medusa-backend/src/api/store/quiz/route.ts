import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

/**
 * Endpoint customizado para sugestão de produtos baseado no quiz
 * POST /store/quiz/suggest
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { recipient, moment, feeling } = req.body;
    
    // Validar dados de entrada
    if (!recipient || !moment || !feeling) {
      res.status(400).json({
        message: "Campos obrigatórios: recipient, moment, feeling"
      });
      return;
    }
    
    // Resolver serviços do Medusa
    const productService = req.scope.resolve("productService");
    
    // Determinar categorias baseado nas respostas
    const categories = determineCategories(recipient, moment, feeling);
    
    // Buscar produtos por categoria usando metadata
    const allProducts = [];
    for (const category of categories) {
      try {
        const products = await productService.listAndCount({
          metadata: {
            category: category
          }
        });
        allProducts.push(...products[0]);
      } catch (error) {
        console.warn(`Erro ao buscar produtos da categoria ${category}:`, error);
      }
    }
    
    // Se não encontrou produtos, buscar todos
    if (allProducts.length === 0) {
      try {
        const all = await productService.listAndCount({});
        allProducts.push(...all[0]);
      } catch (error) {
        console.error('Erro ao buscar todos os produtos:', error);
      }
    }
    
    // Limitar a 9 produtos (3 de cada categoria)
    const suggestedProducts = allProducts.slice(0, 9);
    
    // Contar por categoria
    const categoryCounts = {
      sensorial: suggestedProducts.filter(p => p.metadata?.category === 'sensorial').length,
      afetivo: suggestedProducts.filter(p => p.metadata?.category === 'afetivo').length,
      ritualistico: suggestedProducts.filter(p => p.metadata?.category === 'ritualistico').length
    };
    
    // Nome do ritual baseado no destinatário
    const ritualName = getRitualName(recipient);
    
    // Formatar produtos para resposta
    const formattedProducts = suggestedProducts.map(product => {
      const variant = product.variants?.[0];
      const price = variant?.prices?.[0];
      
      return {
        id: product.id,
        name: product.title,
        description: product.description || '',
        category: product.metadata?.category || 'outros',
        price: price ? price.amount / 100 : 0, // Converter centavos para reais
        image_url: product.images?.[0]?.url || '',
        variant_id: variant?.id
      };
    });
    
    res.json({
      ritual_name: ritualName,
      suggested_products: formattedProducts,
      categories: categoryCounts
    });
  } catch (error) {
    console.error('Erro no endpoint de quiz:', error);
    res.status(500).json({
      message: "Erro ao processar sugestão de produtos",
      error: error.message
    });
  }
}

/**
 * Determina categorias baseado nas respostas do quiz
 */
function determineCategories(recipient: string, moment: string, feeling: string): string[] {
  const categories: string[] = [];
  
  // Lógica de sugestão baseada nas respostas
  // Sempre incluir pelo menos uma categoria de cada tipo
  categories.push('sensorial', 'afetivo', 'ritualistico');
  
  // Ajustar baseado no feeling
  if (feeling === 'pausar' || feeling === 'reconectar') {
    // Priorizar sensorial e ritualistico
    categories.push('sensorial', 'ritualistico');
  } else if (feeling === 'fortalecer' || feeling === 'celebrar') {
    // Priorizar afetivo e ritualistico
    categories.push('afetivo', 'ritualistico');
  }
  
  return [...new Set(categories)]; // Remover duplicatas
}

/**
 * Retorna nome do ritual baseado no destinatário
 */
function getRitualName(recipient: string): string {
  const ritualNames: Record<string, string> = {
    'parceiro': 'Ritual do Amor',
    'amigo': 'Ritual da Amizade',
    'familia': 'Ritual do Aconchego',
    'proprio': 'Ritual do Autocuidado',
    'colega': 'Ritual da Conexão'
  };
  
  return ritualNames[recipient] || 'Ritual Especial';
}
