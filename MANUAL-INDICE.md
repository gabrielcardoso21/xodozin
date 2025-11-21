# 📚 Manual Odoo Xodózin - Índice Principal

Bem-vinda ao manual completo do sistema Xodózin! Este guia vai te ajudar a gerenciar produtos, kits e rituais no Odoo de forma simples e intuitiva.

## 🎯 Visão Geral do Sistema

O Xodózin é um sistema de e-commerce que vende **rituais de presente personalizados**. O sistema funciona com três conceitos principais:

### 1. **Produtos** 📦
Produtos individuais que podem ser vendidos separadamente ou compor kits e rituais.

**Exemplos:** Vela aromática, Caderno de journaling, Baralho de cartas, Óleo essencial

### 2. **Kits** 🎁
Produtos prontos que agrupam vários produtos. São do tipo "Combo" no Odoo.

**Exemplos:** 
- Kit Xodózin (tier: xodo)
- Kit Encanto (tier: encanto)  
- Kit Completo (tier: completo)

### 3. **Rituais** ✨
Kits personalizados criados através de um quiz. O cliente responde perguntas e o sistema sugere produtos baseado nas respostas.

**Exemplos:** Ritual da Pausa Intencional, Ritual do Amor Próprio, Ritual de Conexão a Dois

## 📖 Guias Disponíveis

### [📦 Manual de Produtos](./MANUAL-PRODUTOS.md)
Aprenda a criar, editar e gerenciar produtos individuais no Odoo.

**Conteúdo:**
- Como criar um produto
- Como editar um produto existente
- Como excluir um produto
- Campos importantes explicados
- Upload de imagens
- Configuração de preços

### [🎁 Manual de Kits](./MANUAL-KITS.md)
Aprenda a criar e gerenciar kits (produtos tipo combo).

**Conteúdo:**
- Como criar um kit
- Como adicionar componentes ao kit
- Como configurar o tier (xodo, encanto, completo)
- Como editar um kit
- Como excluir um kit
- Relação entre kits e produtos

### [✨ Manual de Rituais](./MANUAL-RITUAIS.md)
Entenda como os rituais funcionam e como configurá-los.

**Conteúdo:**
- O que são rituais
- Como o quiz funciona
- Como configurar produtos para aparecerem em rituais
- Categorias de produtos (sensorial, afetivo, ritualístico)
- Como testar um ritual

### [⚙️ Configurações Avançadas](./MANUAL-CONFIGURACOES-AVANCADAS.md)
Aprenda configurações mais complexas do sistema.

**Conteúdo:**
- Categorias de produtos
- Preços e variações
- Upload e otimização de imagens
- Publicação no website
- Configurações de estoque
- Personalização de campos

## 🚀 Guia Rápido de Início

### Primeiros Passos

1. **Acesse o Odoo**
   - URL: `http://localhost:8069` (ou a URL do seu servidor)
   - Login: `admin`
   - Senha: (sua senha configurada)

2. **Navegue até Produtos**
   - Menu: **Vendas** > **Produtos** > **Produtos**

3. **Crie seu primeiro produto**
   - Clique em **Criar**
   - Preencha: Nome, Preço, Descrição
   - Marque: ✅ **Pode ser Vendido** e ✅ **Publicado no Website**
   - Salve

4. **Crie seu primeiro kit**
   - Clique em **Criar**
   - Tipo: **Combo**
   - Nome: "Kit Xodózin" (ou outro nome com "xodó" para tier xodo)
   - Preço: Defina o preço do kit
   - Adicione componentes na aba "Componentes do Combo"
   - Marque: ✅ **Pode ser Vendido** e ✅ **Publicado no Website**
   - Salve

### Fluxo de Trabalho Recomendado

```
1. Criar Produtos Individuais
   ↓
2. Criar Kits (usando os produtos criados)
   ↓
3. Testar no Site
   ↓
4. Ajustar conforme necessário
```

## 🎨 Conceitos Importantes

### Tiers dos Kits

Os kits são categorizados automaticamente pelo nome:

- **xodo**: Nome contém "xodó" ou "xodo"
- **encanto**: Nome contém "encanto"
- **completo**: Nome contém "completo"
- **outros**: Qualquer outro nome

**Dica:** Use os nomes corretos para que os ícones apareçam corretamente no site!

### Publicação no Website

Para que produtos e kits apareçam no site, é **ESSENCIAL** marcar:
- ✅ **Pode ser Vendido** (`sale_ok`)
- ✅ **Publicado no Website** (`website_published`)

Sem essas marcações, os itens não aparecerão no site, mesmo que estejam criados.

### Categorias de Produtos para Rituais

Quando configurar produtos para rituais, você pode categorizá-los:

- **sensorial**: Elementos que envolvem os sentidos (velas, incensos, óleos)
- **afetivo**: Símbolos afetivos (cartas, objetos com significado)
- **ritualístico**: Guias e materiais para rituais (cadernos, baralhos, perguntas)

## 📞 Precisa de Ajuda?

Se tiver dúvidas ou encontrar problemas:

1. Consulte o manual específico para o que você está tentando fazer
2. Verifique se todos os campos obrigatórios estão preenchidos
3. Confirme que os itens estão marcados como "Publicado no Website"
4. Teste no site para ver se aparece corretamente

## 🔗 Links Rápidos

- [Manual de Produtos](./MANUAL-PRODUTOS.md)
- [Manual de Kits](./MANUAL-KITS.md)
- [Manual de Rituais](./MANUAL-RITUAIS.md)
- [Configurações Avançadas](./MANUAL-CONFIGURACOES-AVANCADAS.md)
- [Conceitos Nativos do Odoo](./ODOO-CONCEITOS-NATIVOS.md)

---

**Última atualização:** Novembro 2025

