# ⚙️ Configurações Avançadas - Odoo Xodózin

Este guia cobre configurações mais avançadas do sistema, incluindo categorias, preços, imagens e personalizações.

## 📂 Categorias de Produtos

### O que são Categorias?

Categorias ajudam a organizar produtos no Odoo. Você pode criar categorias para:
- Organização interna
- Filtros no site (futuro)
- Relatórios e análises

### Como Criar uma Categoria

1. Acesse **Vendas** > **Produtos** > **Categorias de Produto**
2. Clique em **Criar**
3. Preencha:
   - **Nome**: Nome da categoria (ex: "Sensorial", "Ritualístico")
   - **Categoria Pai**: Deixe vazio para categoria principal, ou selecione uma categoria pai para criar subcategorias
4. Clique em **Salvar**

### Como Associar Produto a uma Categoria

1. Abra o produto
2. Vá até a aba **Vendas**
3. No campo **Categoria de Produto**, selecione a categoria
4. Clique em **Salvar**

### Categorias Recomendadas para Rituais

Para facilitar a organização de produtos para rituais, crie estas categorias:

- **Sensorial**: Produtos que envolvem os sentidos
- **Afetivo**: Produtos com significado emocional
- **Ritualístico**: Produtos que guiam rituais

## 💰 Preços e Variações

### Configurar Preço de Venda

O preço de venda é definido no campo **Preço de Venda** (aba "Vendas").

**Formato:**
- Use ponto (.) como separador decimal
- Exemplo: `49.90` (correto)
- ❌ Não use: `49,90` ou `R$ 49.90`

### Preços com Desconto

Para criar produtos com desconto:

1. Defina o **Preço de Venda** com o valor já descontado
2. Ou use a funcionalidade de **Lista de Preços** do Odoo (avançado)

**Exemplo:**
- Preço original: R$ 59.90
- Preço com desconto: R$ 49.90
- Defina "Preço de Venda" como `49.90`

### Múltiplos Preços (Avançado)

O Odoo suporta múltiplas listas de preços:

1. Acesse **Vendas** > **Configuração** > **Lista de Preços**
2. Crie listas de preços diferentes
3. Associe a clientes ou produtos específicos

**Nota:** Para a maioria dos casos, o preço de venda padrão é suficiente.

## 🖼️ Upload e Otimização de Imagens

### Requisitos de Imagem

**Formatos Suportados:**
- JPG / JPEG
- PNG

**Tamanho Recomendado:**
- Mínimo: 800x800 pixels
- Ideal: 1200x1200 pixels
- Máximo: 2000x2000 pixels

**Peso do Arquivo:**
- Ideal: Menor que 500KB
- Máximo: 2MB
- Use compressão para reduzir o tamanho

### Como Fazer Upload

1. Abra o produto ou kit
2. Vá até a aba **Imagem do Produto**
3. Clique em **Escolher arquivo** ou arraste a imagem
4. A imagem será processada automaticamente

### Otimização de Imagens

**Antes de fazer upload:**

1. **Redimensione** a imagem para 1200x1200 pixels
2. **Comprima** a imagem usando ferramentas online:
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)
3. **Verifique** o tamanho do arquivo (deve ser < 500KB)

**Dicas:**
- Use fundo neutro ou contexto apropriado
- Mostre o produto de forma clara
- Use boa iluminação
- Evite imagens borradas ou pixeladas

### Múltiplas Imagens (Avançado)

O Odoo suporta múltiplas imagens por produto:

1. Na aba **Imagem do Produto**, você pode adicionar imagens adicionais
2. A primeira imagem é a imagem principal
3. Imagens adicionais aparecem como galeria

**Nota:** Atualmente, o site mostra apenas a imagem principal.

## 🌐 Publicação no Website

### Configurações de Publicação

Para que produtos e kits apareçam no site, você DEVE marcar:

1. ✅ **Pode ser Vendido** (aba "Vendas")
   - Permite que o produto seja vendido
   - Sem isso, o produto não pode ser adicionado ao carrinho

2. ✅ **Publicado no Website** (aba "Website")
   - Faz o produto aparecer no site
   - Sem isso, o produto não é visível, mesmo que possa ser vendido

### Ocultar Produto sem Excluir

Para ocultar um produto do site sem excluí-lo:

1. Desmarque ✅ **Publicado no Website**
2. O produto permanece no Odoo, mas não aparece no site
3. Você pode publicá-lo novamente a qualquer momento

### Publicar Múltiplos Produtos

Para publicar vários produtos de uma vez:

1. Acesse **Vendas** > **Produtos** > **Produtos**
2. Selecione os produtos desejados (checkboxes)
3. Clique em **Ação** > **Publicar no Website**
4. Confirme a ação

## 📦 Configurações de Estoque

### Tipos de Produto e Estoque

**Consumível:**
- Não tem controle de estoque
- Recomendado para a maioria dos produtos Xodózin
- Não precisa configurar estoque

**Armazenável:**
- Tem controle de estoque
- Use apenas se precisar controlar quantidade disponível
- Requer configuração de estoque

### Configurar Estoque (Avançado)

Se você usar produtos do tipo "Armazenável":

1. Acesse **Inventário** > **Produtos** > **Produtos**
2. Abra o produto
3. Configure:
   - **Quantidade Disponível**: Quantidade em estoque
   - **Ponto de Pedido**: Quantidade mínima antes de reabastecer
   - **Localização**: Onde o produto está armazenado

**Nota:** Para a maioria dos produtos Xodózin, use tipo "Consumível" para simplificar.

## 🎨 Personalização de Campos

### Campos Padrão

Todos os produtos têm estes campos padrão:
- Nome
- Tipo de Produto
- Preço de Venda
- Descrição
- Descrição de Venda
- Imagem
- Categoria

### Campos Adicionais (Avançado)

Você pode adicionar campos personalizados:

1. Acesse **Configurações** > **Técnico** > **Campos Personalizados**
2. Crie um novo campo
3. Associe ao modelo "product.template"
4. O campo aparecerá nos produtos

**Exemplo de uso:**
- Campo "Material Principal"
- Campo "Tamanho"
- Campo "Cor"

**Nota:** Campos personalizados podem não aparecer no site automaticamente. Consulte a documentação do Odoo para integração com o website.

## 🔧 Configurações do Website

### Categorias Públicas

Categorias públicas são visíveis no site:

1. Acesse **Website** > **Configuração** > **Categorias de Produto**
2. Crie ou edite categorias públicas
3. Associe produtos a essas categorias na aba "Website"

**Nota:** Atualmente, o site não usa categorias públicas para filtros, mas você pode organizar produtos assim.

### Descrição de Venda vs Descrição

**Descrição de Venda:**
- Aparece no site
- Use para descrever o produto de forma atrativa
- Foque em benefícios e características

**Descrição:**
- Não aparece no site
- Use para informações técnicas internas
- Útil para referência da equipe

## 📊 Relatórios e Análises

### Ver Produtos Publicados

Para ver todos os produtos publicados no website:

1. Acesse **Vendas** > **Produtos** > **Produtos**
2. Use o filtro: **Publicado no Website** = ✅ Sim

### Ver Produtos por Categoria

1. Acesse **Vendas** > **Produtos** > **Produtos**
2. Use o filtro: **Categoria de Produto** = [Selecione a categoria]

### Ver Kits

Para ver apenas kits (produtos tipo combo):

1. Acesse **Vendas** > **Produtos** > **Produtos**
2. Use o filtro: **Tipo** = Combo

## 🔄 Sincronização com o Site

### Quando Mudanças Aparecem no Site

- **Produtos novos**: Aparecem imediatamente após salvar (se publicados)
- **Edições**: Aparecem após alguns segundos
- **Exclusões**: Desaparecem imediatamente

### Cache do Navegador

Se mudanças não aparecerem:

1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Ou recarregue a página com cache limpo (Ctrl+F5)

### Verificar se Está Funcionando

1. Faça uma alteração no produto (ex: mude o preço)
2. Salve o produto
3. Acesse o site
4. Verifique se a alteração aparece
5. Se não aparecer, limpe o cache do navegador

## 💡 Dicas Avançadas

### Organização

- ✅ Use categorias consistentes
- ✅ Mantenha códigos de referência organizados
- ✅ Use descrições claras e padronizadas

### Performance

- ✅ Otimize imagens antes de fazer upload
- ✅ Use nomes de produtos descritivos mas concisos
- ✅ Mantenha descrições objetivas

### Manutenção

- ✅ Revise produtos regularmente
- ✅ Atualize preços quando necessário
- ✅ Mantenha imagens atualizadas
- ✅ Verifique se produtos estão publicados corretamente

## 🆘 Solução de Problemas Avançados

### Imagem não aparece no site

**Possíveis causas:**
1. ❌ Arquivo muito grande
   - **Solução:** Comprima a imagem

2. ❌ Formato não suportado
   - **Solução:** Converta para JPG ou PNG

3. ⏱️ Cache do navegador
   - **Solução:** Limpe o cache (Ctrl+Shift+Del)

### Preço não atualiza no site

**Possíveis causas:**
1. ⏱️ Cache do navegador
   - **Solução:** Limpe o cache (Ctrl+F5)

2. ❌ Produto não foi salvo
   - **Solução:** Verifique se clicou em "Salvar"

### Categoria não aparece

**Nota:** Categorias são principalmente para organização interna. O site atual não usa categorias para filtros.

## 📚 Referências

- [Manual de Produtos](./MANUAL-PRODUTOS.md) - Criar e gerenciar produtos
- [Manual de Kits](./MANUAL-KITS.md) - Criar e gerenciar kits
- [Manual de Rituais](./MANUAL-RITUAIS.md) - Configurar rituais
- [Conceitos Nativos do Odoo](./ODOO-CONCEITOS-NATIVOS.md) - Documentação técnica

---

**Voltar para:** [Índice Principal](./MANUAL-INDICE.md)

