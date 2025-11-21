# 📦 Manual de Produtos - Odoo Xodózin

Este guia te ensina a criar, editar e gerenciar produtos individuais no Odoo.

## 🎯 O que são Produtos?

Produtos são itens individuais que podem ser vendidos separadamente ou compor kits e rituais.

**Exemplos de produtos:**
- Vela aromática de lavanda
- Caderno de journaling
- Baralho de cartas reflexivas
- Óleo essencial de eucalipto
- Incenso de sândalo

## 📋 Pré-requisitos

Antes de começar, certifique-se de que:
- ✅ Você tem acesso ao Odoo
- ✅ Você tem permissão para criar produtos
- ✅ Você tem as imagens dos produtos (opcional, mas recomendado)

## 🚀 Como Criar um Produto

### Passo 1: Acessar a Tela de Produtos

1. No menu principal do Odoo, clique em **Vendas**
2. Clique em **Produtos**
3. Clique em **Produtos**

![Navegação: Vendas > Produtos > Produtos]
```
Menu Principal
  └─ Vendas
      └─ Produtos
          └─ Produtos
```

### Passo 2: Criar Novo Produto

1. Clique no botão **Criar** (canto superior esquerdo)
2. Uma tela de formulário será aberta

### Passo 3: Preencher Informações Básicas

#### Campos Obrigatórios:

**Nome do Produto** (campo "Nome")
- Exemplo: "Vela Aromática de Lavanda"
- Use nomes descritivos e claros

**Tipo de Produto**
- **Consumível**: Produtos que não têm controle de estoque (recomendado para a maioria)
- **Armazenável**: Produtos com controle de estoque
- **Serviço**: Serviços prestados

**Preço de Venda**
- Exemplo: `49.90`
- Use ponto (.) como separador decimal
- Não use vírgula ou símbolo de moeda

#### Campos Importantes:

**Descrição de Venda** (campo "Descrição de Venda")
- Esta descrição aparece no site
- Seja descritivo e atrativo
- Exemplo: "Vela artesanal com aroma suave de lavanda, perfeita para momentos de relaxamento e introspecção."

**Descrição** (campo "Descrição")
- Descrição técnica (opcional)
- Não aparece no site, apenas para referência interna

**Código de Referência** (campo "Código de Referência Interno")
- Código único para identificar o produto
- Exemplo: "VELA-LAVANDA-001"
- Opcional, mas recomendado para organização

### Passo 4: Configurar Publicação no Website

**IMPORTANTE:** Para que o produto apareça no site, você DEVE marcar:

1. ✅ **Pode ser Vendido** (aba "Vendas")
   - Localização: Aba "Vendas" > Checkbox "Pode ser Vendido"
   - Sem isso, o produto não pode ser vendido

2. ✅ **Publicado no Website** (aba "Website")
   - Localização: Aba "Website" > Checkbox "Publicado no Website"
   - Sem isso, o produto não aparece no site

![Configuração de Publicação]
```
Aba "Vendas"
  └─ ☑ Pode ser Vendido

Aba "Website"  
  └─ ☑ Publicado no Website
```

### Passo 5: Adicionar Imagem

1. Vá até a aba **Imagem do Produto**
2. Clique em **Escolher arquivo** ou arraste uma imagem
3. A imagem será exibida no site

**Recomendações:**
- Formato: JPG ou PNG
- Tamanho: Mínimo 800x800 pixels
- Peso: Máximo 2MB (recomendado)
- Qualidade: Alta resolução para melhor visualização

### Passo 6: Configurar Categoria (Opcional)

1. Vá até a aba **Vendas**
2. No campo **Categoria de Produto**, selecione ou crie uma categoria
3. Isso ajuda a organizar produtos

### Passo 7: Salvar

1. Clique em **Salvar** (canto superior esquerdo)
2. O produto será criado e, se estiver publicado, aparecerá no site

## ✏️ Como Editar um Produto

### Método 1: Pela Lista de Produtos

1. Acesse **Vendas** > **Produtos** > **Produtos**
2. Encontre o produto na lista
3. Clique no nome do produto
4. Faça as alterações desejadas
5. Clique em **Salvar**

### Método 2: Pelo Formulário de Edição

1. Abra o produto
2. Clique no botão **Editar** (se estiver em modo visualização)
3. Faça as alterações
4. Clique em **Salvar**

### Campos que Você Pode Editar

- ✅ Nome
- ✅ Preço
- ✅ Descrição de Venda
- ✅ Descrição
- ✅ Imagem
- ✅ Categoria
- ✅ Publicação no Website
- ✅ Pode ser Vendido

**Dica:** Alterações são salvas imediatamente. O produto atualizado aparecerá no site após alguns segundos.

## 🗑️ Como Excluir um Produto

### Atenção!

⚠️ **CUIDADO:** Excluir um produto é uma ação permanente e pode afetar:
- Kits que usam esse produto como componente
- Pedidos que já foram feitos com esse produto
- Rituais que sugerem esse produto

### Passo a Passo

1. Acesse **Vendas** > **Produtos** > **Produtos**
2. Encontre o produto na lista
3. Clique no produto para abrir
4. Clique no menu **Ação** (canto superior direito)
5. Selecione **Excluir**
6. Confirme a exclusão

**Alternativa:** Se o produto estiver em uso, considere:
- Desmarcar "Publicado no Website" (oculta do site sem excluir)
- Desmarcar "Pode ser Vendido" (impede novas vendas)

## 📊 Campos Importantes Explicados

### Aba "Geral"

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| **Nome** | Nome do produto que aparece no site | ✅ Sim |
| **Tipo de Produto** | Consumível, Armazenável ou Serviço | ✅ Sim |
| **Código de Referência Interno** | Código único para identificação | ❌ Não |
| **Código de Barras** | Código de barras (se houver) | ❌ Não |
| **Categoria de Produto** | Categoria interna para organização | ❌ Não |

### Aba "Vendas"

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| **Pode ser Vendido** | Permite vender o produto | ✅ Sim (para aparecer no site) |
| **Preço de Venda** | Preço que aparece no site | ✅ Sim |
| **Categoria de Vendas** | Categoria para organização de vendas | ❌ Não |

### Aba "Website"

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| **Publicado no Website** | Faz o produto aparecer no site | ✅ Sim (para aparecer no site) |
| **Categorias Públicas** | Categorias visíveis no site | ❌ Não |

### Aba "Imagem do Produto"

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| **Imagem** | Imagem principal do produto | ❌ Não (mas altamente recomendado) |

## 🎨 Exemplo Prático Completo

Vamos criar um produto passo a passo:

### Produto: "Vela Aromática de Lavanda"

1. **Acesse:** Vendas > Produtos > Produtos > Criar

2. **Preencha:**
   - Nome: `Vela Aromática de Lavanda`
   - Tipo de Produto: `Consumível`
   - Código de Referência: `VELA-LAVANDA-001`
   - Preço de Venda: `49.90`

3. **Descrição de Venda:**
   ```
   Vela artesanal com aroma suave de lavanda, perfeita para 
   momentos de relaxamento e introspecção. Feita com cera de 
   soja e essência natural.
   ```

4. **Configure Publicação:**
   - Aba "Vendas": ✅ Marque "Pode ser Vendido"
   - Aba "Website": ✅ Marque "Publicado no Website"

5. **Adicione Imagem:**
   - Aba "Imagem do Produto"
   - Faça upload da imagem da vela

6. **Salve:** Clique em "Salvar"

7. **Resultado:** O produto aparecerá no site em alguns segundos!

## 💡 Dicas e Boas Práticas

### Nomes de Produtos
- ✅ Use nomes descritivos: "Vela Aromática de Lavanda"
- ❌ Evite nomes genéricos: "Vela"

### Preços
- ✅ Use valores claros: `49.90`, `129.00`
- ❌ Evite: `49,90` (vírgula) ou `R$ 49.90` (símbolo)

### Descrições
- ✅ Seja específico e atrativo
- ✅ Mencione benefícios e características
- ✅ Use linguagem que conecte com o cliente

### Imagens
- ✅ Use imagens de alta qualidade
- ✅ Mostre o produto de forma clara
- ✅ Use fundo neutro ou contexto apropriado

### Organização
- ✅ Use códigos de referência consistentes
- ✅ Organize por categorias
- ✅ Mantenha descrições atualizadas

## 🔍 Verificando se o Produto Aparece no Site

Após criar ou editar um produto:

1. Acesse o site: `http://localhost` (ou sua URL)
2. Navegue até a página de produtos (se houver)
3. Verifique se o produto aparece
4. Se não aparecer, verifique:
   - ✅ "Pode ser Vendido" está marcado?
   - ✅ "Publicado no Website" está marcado?
   - ✅ O produto foi salvo?

## 🆘 Solução de Problemas

### Produto não aparece no site

**Possíveis causas:**
1. ❌ "Publicado no Website" não está marcado
   - **Solução:** Marque a opção na aba "Website"

2. ❌ "Pode ser Vendido" não está marcado
   - **Solução:** Marque a opção na aba "Vendas"

3. ⏱️ Cache do navegador
   - **Solução:** Limpe o cache (Ctrl+Shift+Del) ou recarregue a página (Ctrl+F5)

### Erro ao salvar produto

**Possíveis causas:**
1. ❌ Campo obrigatório não preenchido
   - **Solução:** Verifique se Nome, Tipo e Preço estão preenchidos

2. ❌ Preço inválido
   - **Solução:** Use ponto (.) como separador decimal, ex: `49.90`

### Imagem não aparece

**Possíveis causas:**
1. ❌ Arquivo muito grande
   - **Solução:** Redimensione a imagem (máximo 2MB recomendado)

2. ❌ Formato não suportado
   - **Solução:** Use JPG ou PNG

## 📚 Próximos Passos

Agora que você sabe criar produtos, aprenda a:
- [Criar Kits](./MANUAL-KITS.md) - Agrupar produtos em kits
- [Configurar Rituais](./MANUAL-RITUAIS.md) - Preparar produtos para rituais personalizados
- [Configurações Avançadas](./MANUAL-CONFIGURACOES-AVANCADAS.md) - Aprofundar em configurações

---

**Voltar para:** [Índice Principal](./MANUAL-INDICE.md)

