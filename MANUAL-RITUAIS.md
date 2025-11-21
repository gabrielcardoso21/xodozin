# ✨ Manual de Rituais - Odoo Xodózin

Este guia explica como os rituais funcionam e como configurá-los no Odoo.

## 🎯 O que são Rituais?

Rituais são **kits personalizados** criados através de um quiz interativo. O cliente responde perguntas sobre:
- Para quem é o presente
- Qual a vibe necessária
- Qual o momento
- Personalidade da pessoa
- Sentidos preferidos
- Cores, aromas e preferências

Baseado nas respostas, o sistema **sugere produtos** que podem ser combinados em um ritual personalizado.

## 🔄 Como os Rituais Funcionam

### Fluxo do Quiz

```
Cliente acessa o site
  ↓
Clica em "Criar meu ritual personalizado"
  ↓
Responde perguntas do quiz (3 telas)
  ↓
Sistema processa respostas
  ↓
Sugere produtos organizados por categoria
  ↓
Cliente seleciona produtos desejados
  ↓
Finaliza pedido
```

### Estrutura do Quiz

**Tela 1: Perguntas Básicas**
- Para quem é o presente?
- Qual vibe essa pessoa tá precisando?
- Qual o momento?
- Essa pessoa é mais...
- Qual sentido ela mais curte?

**Tela 2: Personalização**
- Nome de quem vai receber
- Cores que ela ama
- Aromas preferidos
- O que toca o coração dessa pessoa?
- Cultura pop (filmes, música, livros)

**Tela 3: Finalização**
- Mensagem especial (opcional)
- Gostos específicos (opcional)
- WhatsApp para contato

### Categorias de Produtos

Os produtos sugeridos são organizados em **3 categorias**:

1. **Sensorial** 🌿
   - Elementos que envolvem os sentidos
   - Exemplos: velas, incensos, óleos essenciais, sabores especiais

2. **Afetivo** ❤️
   - Símbolos afetivos e objetos com significado
   - Exemplos: cartas, objetos personalizados, presentes simbólicos

3. **Ritualístico** 📖
   - Guias e materiais para rituais
   - Exemplos: cadernos de journaling, baralhos de cartas, perguntas reflexivas

## 📋 Como Configurar Produtos para Rituais

### Passo 1: Criar os Produtos

Primeiro, crie os produtos individuais que você quer que apareçam em rituais. Siga o [Manual de Produtos](./MANUAL-PRODUTOS.md) para isso.

### Passo 2: Categorizar os Produtos

No Odoo, você pode usar **Categorias de Produto** para organizar produtos por tipo:

1. Acesse **Vendas** > **Produtos** > **Categorias de Produto**
2. Crie categorias que correspondam às categorias de rituais:
   - **Sensorial** (ou similar)
   - **Afetivo** (ou similar)
   - **Ritualístico** (ou similar)

3. Ao criar ou editar um produto, associe-o à categoria apropriada:
   - Aba "Vendas" > Campo "Categoria de Produto"

**Exemplo:**
- Produto: "Vela Aromática de Lavanda"
  - Categoria: "Sensorial" ✅

- Produto: "Caderno de Journaling"
  - Categoria: "Ritualístico" ✅

- Produto: "Carta Personalizada"
  - Categoria: "Afetivo" ✅

### Passo 3: Configurar Produtos para Aparecerem em Rituais

Para que um produto apareça nas sugestões de rituais:

1. ✅ **Pode ser Vendido** (aba "Vendas")
   - Marque esta opção

2. ✅ **Publicado no Website** (aba "Website")
   - Marque esta opção

3. ✅ **Descrição de Venda** preenchida
   - Isso ajuda o sistema a entender o produto

**Nota:** Atualmente, o sistema de sugestões de rituais está em desenvolvimento. Os produtos que estão publicados e podem ser vendidos estarão disponíveis para seleção manual pelo cliente durante a criação do ritual.

## 🎨 Exemplo Prático: Configurando Produtos para um Ritual

Vamos configurar produtos para um "Ritual da Pausa Intencional":

### Produtos Necessários

1. **Vela Aromática de Lavanda** (Sensorial)
   - Categoria: Sensorial
   - Descrição: "Vela com aroma calmante de lavanda"
   - Publicado: ✅

2. **Baralho de Cartas Reflexivas** (Ritualístico)
   - Categoria: Ritualístico
   - Descrição: "Baralho com perguntas para reflexão diária"
   - Publicado: ✅

3. **Caderno de Journaling** (Ritualístico)
   - Categoria: Ritualístico
   - Descrição: "Caderno para anotações e reflexões"
   - Publicado: ✅

4. **Incenso de Sândalo** (Sensorial)
   - Categoria: Sensorial
   - Descrição: "Incenso com aroma terroso e relaxante"
   - Publicado: ✅

### Passo a Passo

1. **Crie cada produto** seguindo o [Manual de Produtos](./MANUAL-PRODUTOS.md)

2. **Associe à categoria apropriada:**
   - Aba "Vendas" > Campo "Categoria de Produto"
   - Selecione "Sensorial", "Ritualístico" ou "Afetivo"

3. **Publique no website:**
   - Aba "Website" > ✅ "Publicado no Website"
   - Aba "Vendas" > ✅ "Pode ser Vendido"

4. **Salve cada produto**

## 🔍 Como Testar um Ritual

### No Site

1. Acesse o site: `http://localhost` (ou sua URL)
2. Clique em **"Criar meu ritual personalizado"** (botão na página inicial)
3. Responda as perguntas do quiz
4. Na tela de sugestões, verifique se os produtos aparecem
5. Selecione produtos e finalize o pedido

### Verificando se Produtos Aparecem

Se os produtos não aparecerem nas sugestões:

1. ✅ Verifique se estão publicados no website
2. ✅ Verifique se "Pode ser Vendido" está marcado
3. ✅ Verifique se têm descrição de venda
4. ✅ Verifique se estão na categoria correta

## 📊 Estrutura de Dados dos Rituais

### Respostas do Quiz

O quiz coleta as seguintes informações:

```javascript
{
  // Tela 1
  recipient: "proprio" | "parceiro" | "amigo" | "familia" | "colega",
  vibe: "pausar" | "reconectar" | "fortalecer" | "celebrar" | "planejar" | "divertir" | "apimentar",
  moment: "natal" | "aniversario" | "sem-data" | "inicio-ciclo" | "fim-ciclo" | "dificil",
  personality: "introspectiva" | "parceira" | "pratica" | "sensivel" | "divertida" | "reflexiva",
  sense: "olfato" | "tato" | "visao" | "paladar" | "audicao" | "todos",
  
  // Tela 2
  name: "Nome da pessoa",
  colors: ["terrosos", "quentes", ...],
  aromas: ["lavanda", "citricos", ...],
  heartTouch: ["palavras", "musica", ...],
  popCulture: "Descrição...",
  
  // Tela 3
  message: "Mensagem especial",
  specificLikes: "Gostos específicos",
  whatsapp: "Telefone"
}
```

### Produtos Sugeridos

Os produtos sugeridos são organizados por categoria:

```javascript
{
  suggested_products: [
    {
      id: "1",
      name: "Vela Aromática de Lavanda",
      category: "sensorial",
      price: 49.90,
      // ...
    },
    {
      id: "2",
      name: "Caderno de Journaling",
      category: "ritualistico",
      price: 79.90,
      // ...
    }
  ]
}
```

## 💡 Dicas e Boas Práticas

### Organização de Produtos

- ✅ Use categorias consistentes
- ✅ Mantenha descrições claras e atrativas
- ✅ Considere o propósito de cada produto ao categorizar

### Categorias

- ✅ **Sensorial**: Produtos que envolvem os 5 sentidos
- ✅ **Afetivo**: Produtos com significado emocional
- ✅ **Ritualístico**: Produtos que guiam ou facilitam rituais

### Descrições

- ✅ Seja específico sobre o uso do produto
- ✅ Mencione como o produto se encaixa em rituais
- ✅ Use linguagem que conecte com o propósito do ritual

### Preços

- ✅ Considere que produtos serão combinados em rituais
- ✅ Mantenha preços acessíveis para combinações
- ✅ Ofereça opções em diferentes faixas de preço

## 🔄 Fluxo Completo do Ritual

### Diagrama Detalhado

```
┌─────────────────────────────────────┐
│  Cliente acessa o site              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Clica em "Criar ritual"            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  TELA 1: Perguntas Básicas        │
│  - Para quem?                      │
│  - Qual vibe?                      │
│  - Qual momento?                   │
│  - Personalidade?                  │
│  - Sentido preferido?              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  TELA 2: Personalização            │
│  - Nome                            │
│  - Cores                           │
│  - Aromas                          │
│  - O que toca o coração?           │
│  - Cultura pop                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  TELA 3: Finalização               │
│  - Mensagem especial                │
│  - Gostos específicos               │
│  - WhatsApp                         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Sistema processa respostas         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Sugere produtos por categoria      │
│  - Sensorial                        │
│  - Afetivo                          │
│  - Ritualístico                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Cliente seleciona produtos         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Finaliza pedido                    │
└─────────────────────────────────────┘
```

## 🆘 Solução de Problemas

### Produtos não aparecem nas sugestões

**Possíveis causas:**
1. ❌ Produtos não estão publicados
   - **Solução:** Marque "Publicado no Website" e "Pode ser Vendido"

2. ❌ Produtos não têm descrição
   - **Solução:** Adicione descrição de venda

3. ⚠️ Sistema de sugestões ainda em desenvolvimento
   - **Nota:** Atualmente, o cliente pode selecionar produtos manualmente durante a criação do ritual

### Quiz não funciona

**Possíveis causas:**
1. ❌ Erro no frontend
   - **Solução:** Verifique o console do navegador (F12) para erros

2. ❌ Odoo não está respondendo
   - **Solução:** Verifique se o Odoo está rodando e acessível

### Produtos selecionados não aparecem no checkout

**Possível causa:**
- ❌ Produtos não estão publicados ou não podem ser vendidos

**Solução:**
- Verifique se todos os produtos selecionados têm:
  - ✅ "Pode ser Vendido" marcado
  - ✅ "Publicado no Website" marcado

## 📚 Próximos Passos

Agora que você entende como rituais funcionam, aprenda a:
- [Criar Produtos](./MANUAL-PRODUTOS.md) - Criar produtos para usar em rituais
- [Criar Kits](./MANUAL-KITS.md) - Criar kits prontos
- [Configurações Avançadas](./MANUAL-CONFIGURACOES-AVANCADAS.md) - Aprofundar em configurações
- [Voltar para Índice](./MANUAL-INDICE.md) - Ver todos os manuais

---

**Voltar para:** [Índice Principal](./MANUAL-INDICE.md)

