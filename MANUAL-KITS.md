# 🎁 Manual de Kits - Odoo Xodózin

Este guia te ensina a criar, editar e gerenciar kits (produtos tipo combo) no Odoo.

## 🎯 O que são Kits?

Kits são produtos prontos que agrupam vários produtos individuais. No Odoo, kits são produtos do tipo **"Combo"**.

**Exemplos de kits:**
- Kit Xodózin (tier: xodo) - Kit básico de autocuidado
- Kit Encanto (tier: encanto) - Kit romântico
- Kit Completo (tier: completo) - Kit completo com vários itens

**Características dos kits:**
- Têm um preço fixo definido
- Agrupam vários produtos como componentes
- Aparecem na página inicial e na página de kits do site
- São categorizados por "tier" (xodo, encanto, completo)

## 🎨 Tiers dos Kits

Os kits são automaticamente categorizados pelo **nome**. O sistema identifica o tier assim:

| Tier | Palavras no Nome | Ícone no Site |
|------|------------------|---------------|
| **xodo** | Contém "xodó" ou "xodo" | ❤️ Coração |
| **encanto** | Contém "encanto" | ✨ Estrelas |
| **completo** | Contém "completo" | 🎁 Presente |
| **outros** | Qualquer outro nome | ❤️ Coração (padrão) |

**Exemplos:**
- ✅ "Kit Xodózin Premium" → tier: **xodo**
- ✅ "Kit Encanto Romântico" → tier: **encanto**
- ✅ "Kit Completo Especial" → tier: **completo**
- ⚠️ "Kit Básico" → tier: **outros**

**Dica:** Use as palavras-chave corretas no nome para que o ícone apareça corretamente no site!

## 📋 Pré-requisitos

Antes de criar um kit, você precisa ter:
- ✅ Produtos individuais já criados (para usar como componentes)
- ✅ Acesso ao Odoo
- ✅ Permissão para criar produtos

## 🚀 Como Criar um Kit

### Passo 1: Acessar a Tela de Produtos

1. No menu principal do Odoo, clique em **Vendas**
2. Clique em **Produtos**
3. Clique em **Produtos**

### Passo 2: Criar Novo Produto (Tipo Combo)

1. Clique no botão **Criar**
2. Uma tela de formulário será aberta

### Passo 3: Configurar como Kit (Tipo Combo)

**IMPORTANTE:** Para criar um kit, você DEVE selecionar o tipo "Combo":

1. No campo **Tipo de Produto**, selecione **Combo**
2. Isso transforma o produto em um kit

![Seleção do Tipo Combo]
```
Tipo de Produto: [Combo ▼]
  ├─ Consumível
  ├─ Armazenável
  ├─ Serviço
  └─ Combo ← SELECIONE ESTE
```

### Passo 4: Preencher Informações Básicas

#### Campos Obrigatórios:

**Nome do Kit** (campo "Nome")
- Use nomes que contenham as palavras-chave para o tier desejado
- Exemplos:
  - "Kit Xodózin Premium" (tier: xodo)
  - "Kit Encanto Romântico" (tier: encanto)
  - "Kit Completo Especial" (tier: completo)

**Preço de Venda**
- Este é o preço do kit completo
- Exemplo: `199.90`
- Use ponto (.) como separador decimal

**Descrição de Venda**
- Descrição que aparece no site
- Exemplo: "Kit completo com vela aromática, caderno de journaling e baralho de cartas reflexivas."

### Passo 5: Adicionar Componentes ao Kit

**Esta é a parte mais importante!** Aqui você define quais produtos fazem parte do kit.

1. Vá até a aba **Componentes do Combo**
2. Clique em **Adicionar uma linha**
3. Para cada produto que faz parte do kit:
   - **Produto**: Selecione o produto da lista
   - **Quantidade**: Defina quantas unidades desse produto vão no kit
   - Clique em **Adicionar uma linha** para adicionar mais produtos

![Adicionando Componentes]
```
Aba "Componentes do Combo"
  └─ Adicionar uma linha
      ├─ Produto: [Vela Aromática de Lavanda ▼] | Quantidade: [1]
      ├─ Produto: [Caderno de Journaling ▼] | Quantidade: [1]
      └─ Produto: [Baralho de Cartas ▼] | Quantidade: [1]
```

**Exemplo Prático:**
- Kit Xodózin Premium contém:
  - 1x Vela Aromática de Lavanda
  - 1x Caderno de Journaling
  - 1x Baralho de Cartas Reflexivas

### Passo 6: Configurar Publicação no Website

**IMPORTANTE:** Para que o kit apareça no site:

1. ✅ **Pode ser Vendido** (aba "Vendas")
   - Localização: Aba "Vendas" > Checkbox "Pode ser Vendido"

2. ✅ **Publicado no Website** (aba "Website")
   - Localização: Aba "Website" > Checkbox "Publicado no Website"

### Passo 7: Adicionar Imagem

1. Vá até a aba **Imagem do Produto**
2. Faça upload da imagem do kit
3. A imagem será exibida no site

**Dica:** Use uma imagem que represente o kit completo ou seja atrativa.

### Passo 8: Salvar

1. Clique em **Salvar**
2. O kit será criado e aparecerá no site (se estiver publicado)

## 🎨 Exemplo Prático Completo

Vamos criar o "Kit Xodózin Premium" passo a passo:

### Passo 1: Informações Básicas

1. **Acesse:** Vendas > Produtos > Produtos > Criar

2. **Preencha:**
   - Nome: `Kit Xodózin Premium` (contém "xodó" → tier: xodo)
   - Tipo de Produto: `Combo` ⭐
   - Preço de Venda: `199.90`

3. **Descrição de Venda:**
   ```
   Kit completo de autocuidado com vela aromática de lavanda, 
   caderno de journaling e baralho de cartas reflexivas. 
   Perfeito para momentos de introspecção e reconexão.
   ```

### Passo 2: Adicionar Componentes

1. Vá até a aba **Componentes do Combo**
2. Adicione os produtos:
   - Produto: "Vela Aromática de Lavanda" | Quantidade: 1
   - Produto: "Caderno de Journaling" | Quantidade: 1
   - Produto: "Baralho de Cartas Reflexivas" | Quantidade: 1

### Passo 3: Publicar

1. Aba "Vendas": ✅ Marque "Pode ser Vendido"
2. Aba "Website": ✅ Marque "Publicado no Website"

### Passo 4: Imagem

1. Aba "Imagem do Produto"
2. Faça upload da imagem do kit

### Passo 5: Salvar

1. Clique em **Salvar**
2. O kit aparecerá no site com ícone ❤️ (tier: xodo)

## ✏️ Como Editar um Kit

### Editar Informações Básicas

1. Acesse **Vendas** > **Produtos** > **Produtos**
2. Encontre o kit na lista
3. Clique no nome do kit
4. Clique em **Editar**
5. Faça as alterações desejadas
6. Clique em **Salvar**

### Adicionar ou Remover Componentes

1. Abra o kit
2. Vá até a aba **Componentes do Combo**
3. Para **adicionar**:
   - Clique em **Adicionar uma linha**
   - Selecione o produto e defina a quantidade
4. Para **remover**:
   - Clique no ícone de lixeira ao lado do componente
5. Clique em **Salvar**

### Alterar o Tier do Kit

O tier é determinado pelo **nome**. Para alterar:

1. Abra o kit
2. Edite o campo **Nome**
3. Adicione ou remova as palavras-chave:
   - Para tier "xodo": adicione "xodó" ou "xodo" no nome
   - Para tier "encanto": adicione "encanto" no nome
   - Para tier "completo": adicione "completo" no nome
4. Salve

**Exemplo:**
- Nome atual: "Kit Básico" (tier: outros)
- Novo nome: "Kit Xodózin Básico" (tier: xodo) ✅

## 🗑️ Como Excluir um Kit

### Atenção!

⚠️ **CUIDADO:** Excluir um kit é uma ação permanente e pode afetar:
- Pedidos que já foram feitos com esse kit
- Clientes que têm esse kit favoritado

### Passo a Passo

1. Acesse **Vendas** > **Produtos** > **Produtos**
2. Encontre o kit na lista
3. Clique no kit para abrir
4. Clique no menu **Ação** (canto superior direito)
5. Selecione **Excluir**
6. Confirme a exclusão

**Alternativa:** Se o kit estiver em uso, considere:
- Desmarcar "Publicado no Website" (oculta do site sem excluir)
- Desmarcar "Pode ser Vendido" (impede novas vendas)

## 📊 Relação Kit-Produtos

### Diagrama de Relação

```
Kit (Tipo: Combo)
  │
  ├─ Componente 1: Produto A (Quantidade: 1)
  ├─ Componente 2: Produto B (Quantidade: 2)
  └─ Componente 3: Produto C (Quantidade: 1)
```

### Como Funciona

- O kit **agrupa** produtos individuais
- Cada produto pode estar em **múltiplos kits**
- A quantidade de cada produto no kit é configurável
- O preço do kit é **independente** dos preços dos produtos

**Exemplo:**
- Kit Xodózin Premium: R$ 199.90
  - Contém: Vela (R$ 49.90) + Caderno (R$ 79.90) + Baralho (R$ 69.90)
  - Total individual: R$ 199.70
  - Preço do kit: R$ 199.90 (pode ser diferente!)

## 💡 Dicas e Boas Práticas

### Nomes de Kits

- ✅ Use palavras-chave para o tier: "Kit Xodózin", "Kit Encanto", "Kit Completo"
- ✅ Seja descritivo: "Kit Xodózin Premium" é melhor que "Kit 1"
- ❌ Evite nomes genéricos que não indiquem o tier

### Componentes

- ✅ Use produtos que já existem (crie-os primeiro se necessário)
- ✅ Defina quantidades apropriadas (geralmente 1 de cada)
- ✅ Considere o valor total dos componentes ao definir o preço do kit

### Preços

- ✅ O preço do kit pode ser diferente da soma dos componentes
- ✅ Considere descontos ou valores promocionais
- ✅ Mantenha preços competitivos

### Imagens

- ✅ Use imagens que representem o kit completo
- ✅ Mostre os produtos do kit na imagem (se possível)
- ✅ Use alta qualidade para melhor visualização

## 🔍 Verificando se o Kit Aparece no Site

Após criar ou editar um kit:

1. Acesse o site: `http://localhost` (ou sua URL)
2. Vá até a página inicial
3. Verifique se o kit aparece na seção "Kits Pré-Prontos"
4. Verifique se o ícone correto aparece (baseado no tier)
5. Se não aparecer, verifique:
   - ✅ "Pode ser Vendido" está marcado?
   - ✅ "Publicado no Website" está marcado?
   - ✅ O nome contém a palavra-chave do tier?
   - ✅ O kit foi salvo?

## 🆘 Solução de Problemas

### Kit não aparece no site

**Possíveis causas:**
1. ❌ "Publicado no Website" não está marcado
   - **Solução:** Marque a opção na aba "Website"

2. ❌ "Pode ser Vendido" não está marcado
   - **Solução:** Marque a opção na aba "Vendas"

3. ❌ Tipo não é "Combo"
   - **Solução:** Altere o tipo para "Combo" na aba "Geral"

### Ícone errado no site

**Possível causa:**
- ❌ Nome não contém a palavra-chave do tier

**Solução:**
- Edite o nome do kit para incluir:
  - "xodó" ou "xodo" → ícone ❤️
  - "encanto" → ícone ✨
  - "completo" → ícone 🎁

### Erro ao adicionar componente

**Possíveis causas:**
1. ❌ Produto não existe
   - **Solução:** Crie o produto primeiro

2. ❌ Produto não está disponível
   - **Solução:** Verifique se o produto está ativo

### Preço não aparece corretamente

**Possível causa:**
- ❌ Preço não foi definido ou está em formato inválido

**Solução:**
- Verifique o campo "Preço de Venda"
- Use ponto (.) como separador decimal
- Exemplo: `199.90` (não `199,90` ou `R$ 199.90`)

## 📚 Próximos Passos

Agora que você sabe criar kits, aprenda a:
- [Configurar Rituais](./MANUAL-RITUAIS.md) - Preparar produtos para rituais personalizados
- [Configurações Avançadas](./MANUAL-CONFIGURACOES-AVANCADAS.md) - Aprofundar em configurações
- [Voltar para Índice](./MANUAL-INDICE.md) - Ver todos os manuais

---

**Voltar para:** [Índice Principal](./MANUAL-INDICE.md)

