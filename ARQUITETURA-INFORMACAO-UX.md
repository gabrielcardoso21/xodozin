# Arquitetura da Informação e Jornada do Cliente - Xodózin

**Documento elaborado por:** Especialista Sênior em Branding e UX Design  
**Data:** Novembro 2024  
**Foco:** E-commerce de Rituais de Presente

---

## 1. ARQUITETURA DA INFORMAÇÃO (AI)

### 1.1. Estrutura de Navegação Principal

#### **5 Páginas/Seções Essenciais:**

1. **HOME (Página Inicial)**
   - **Objetivo:** Comunicar o diferencial "Ritual de Presente" e gerar conexão emocional
   - **Elementos Principais:**
     - Hero Section com headline principal (tagline)
     - Vídeo/Imagem de rituais sendo realizados
     - Seção explicativa: "O que é um Ritual de Presente?"
     - Preview dos 3 tipos de kits (Cards com CTAs)
     - Depoimentos/Testemunhos de quem recebeu
     - Call-to-action duplo: "Escolher Kit Pronto" e "Personalizar Meu Ritual"

2. **KITS PRONTOS (Catálogo)**
   - **Objetivo:** Apresentar as 3 faixas de preço de forma clara e desejável
   - **Estrutura:**
     - Filtros por faixa de preço (R$88, R$160-250, R$300-340)
     - Cards dos kits com:
       - Imagem principal
       - Nome do kit
       - Tier (Xodó, Encanto, Completo)
       - Faixa de preço
       - Descrição breve do ritual
       - Lista de itens inclusos (expandível)
       - CTA "Adicionar ao Ritual"
     - Seção de comparação lado a lado (opcional)

3. **KITS PERSONALIZADOS (Jornada de Personalização)**
   - **Objetivo:** Guiar o usuário através do questionário e seleção de itens
   - **Estrutura:**
     - Página de entrada explicando o processo
     - Questionário interativo (3-4 etapas)
     - Seleção de produtos por categoria
     - Preview do kit personalizado
     - Finalização e checkout

4. **PRODUTOS (Catálogo Completo)**
   - **Objetivo:** Mostrar todos os produtos disponíveis para personalização
   - **Estrutura:**
     - Filtros por categoria (Sensorial, Afetivo, Ritualístico)
     - Grid de produtos com:
       - Imagem
       - Nome
       - Preço
       - Categoria
       - CTA "Adicionar ao Kit"
     - Modo de visualização: Grid ou Lista

5. **SOBRE / RITUAIS (Conteúdo Educacional)**
   - **Objetivo:** Educar sobre o conceito de rituais e fortalecer a marca
   - **Estrutura:**
     - História da marca
     - O que são Rituais de Presente (explicação conceitual)
     - Como funciona a Transferência de Significado
     - Guia de uso dos kits
     - FAQ

### 1.2. Seções Secundárias (Footer e Menus)

- **Perguntas Frequentes (FAQ)**
- **Política de Entrega** (SP, 5 dias úteis)
- **Política de Troca e Devolução**
- **Contato**
- **Blog/Conteúdo** (opcional, para SEO)

---

## 2. JORNADA DO CLIENTE (UX) - CAMINHO DA PERSONALIZAÇÃO

### 2.1. Fluxo Completo (Passo a Passo)

#### **Etapa 1: Entrada e Introdução**
- **Página:** `/personalizar`
- **Elementos:**
  - Título: "Crie Seu Ritual Personalizado"
  - Texto explicativo breve sobre o processo
  - Indicador de progresso (Step 1 de 4)
  - CTA: "Começar Questionário"

#### **Etapa 2: Questionário Interativo**

**Pergunta 1: "Para quem é este ritual?"**
- **Função:** Identificar o destinatário e contexto emocional
- **Objetivo:** Direcionar sugestões de produtos e nome do ritual
- **Interface:**
  - Cards visuais com ícones:
    - 👤 Para Mim (Próprio)
    - 💑 Parceiro(a)
    - 👨‍👩‍👧‍👦 Família
    - 👫 Amigo(a)
  - Cada card expande ao hover mostrando exemplos
- **Validação:** Seleção obrigatória

**Pergunta 2: "Que momento você quer criar?"**
- **Função:** Contextualizar o uso do ritual
- **Interface:**
  - Cards com momentos:
    - 🌙 Relaxamento / Autocuidado
    - 💕 Romance / Conexão
    - 🎉 Celebração / Gratidão
    - 🧘 Meditação / Reflexão
  - Permite seleção múltipla
- **Validação:** Mínimo 1 seleção

**Pergunta 3: "Que sentimento você quer transmitir?"**
- **Função:** Refinar a sugestão de produtos
- **Interface:**
  - Cards com sentimentos:
    - 💝 Carinho / Afeto
    - 🌟 Inspiração / Motivação
    - 🕯️ Calma / Tranquilidade
    - ✨ Surpresa / Encantamento
  - Permite seleção múltipla
- **Validação:** Mínimo 1 seleção

**Etapa 3: Sugestão do Ritual**
- **Página:** `/personalizar/sugestao`
- **Elementos:**
  - Nome do ritual sugerido (ex: "Ritual do Amor")
  - Produtos sugeridos automaticamente (3-6 itens)
  - Cards de produtos com:
    - Checkbox para seleção
    - Preço individual
    - Descrição breve
    - Categoria (badge)
  - Total parcial exibido em tempo real
  - CTA: "Continuar Personalizando" ou "Finalizar Ritual"

#### **Etapa 4: Seleção Final de Itens**

**Página:** `/personalizar/selecao`

**Interface de Seleção:**
- **Layout:** Grid de produtos com 3 colunas
- **Cada produto contém:**
  - Imagem grande (hover: zoom)
  - Nome do produto
  - Categoria (badge: Sensorial/Afetivo/Ritualístico)
  - Preço
  - Descrição expandível
  - Checkbox "Adicionar ao Kit"
  - Contador de quantidade (se aplicável)

**Filtros Laterais:**
- Por categoria (Sensorial, Afetivo, Ritualístico)
- Por faixa de preço
- Busca por nome

**Painel Lateral (Resumo do Kit):**
- Fixo no lado direito
- Mostra:
  - Nome do ritual
  - Itens selecionados (lista removível)
  - Total calculado em tempo real
  - Indicação visual de categorias balanceadas
  - CTA "Finalizar Ritual" (sempre visível)

**Consolidação da Lista:**
- Quando o usuário clica em "Adicionar ao Kit":
  1. Produto aparece no painel lateral
  2. Card do produto muda de cor (selecionado)
  3. Total é atualizado
  4. Toast/Notificação: "Produto adicionado ao seu ritual"
- Usuário pode remover itens do painel lateral
- Mínimo de 2 produtos para finalizar

#### **Etapa 5: Preview e Finalização**
- **Página:** `/personalizar/preview`
- **Elementos:**
  - Visualização do kit completo
  - Lista final de itens
  - Total final
  - Campo opcional: "Dedicação/Para quem" (texto)
  - CTA: "Confirmar e Ir para Checkout"

---

## 3. JORNADA DO CLIENTE (UX) - E-COMMERCE E CHECKOUT

### 3.1. Fluxo de Checkout (Após Kit Pronto ou Personalizado)

#### **Etapa 1: Revisão do Pedido**
- **Página:** `/checkout`
- **Seção:** "Seu Ritual"
- **Elementos:**
  - Resumo visual do kit (imagem + nome)
  - Lista de itens incluídos
  - Subtotal
  - Frete (calculado ou fixo)
  - **Total destacado**
  - Opção de editar kit (voltar)
  - CTA: "Continuar para Entrega"

#### **Etapa 2: Dados de Entrega**
- **Seção:** "Onde entregar seu ritual?"
- **Elementos:**
  - **Validação de CEP:**
    - Campo de CEP com busca automática
    - Validação: Aceita apenas SP (capital e região metropolitana)
    - Mensagem de erro se CEP fora da área: "Por enquanto, entregamos apenas em São Paulo (capital e região metropolitana)"
  
  - **Formulário de Endereço:**
    - Rua/Logradouro (autocompletado após CEP)
    - Número
    - Complemento (opcional)
    - Bairro (autocompletado)
    - Cidade (SP - fixo)
    - Estado (SP - fixo)
    - Referência (opcional)
  
  - **Dados do Destinatário:**
    - Nome completo
    - Telefone (com máscara)
    - E-mail
    - Opção: "Desejo receber atualizações sobre meu pedido via WhatsApp"
  
  - **Campo de Dedicação:**
    - Textarea: "Escreva uma mensagem para acompanhar seu ritual" (opcional)
    - Contador de caracteres (máx. 200)

#### **Etapa 3: Pagamento**
- **Seção:** "Como deseja pagar?"
- **Elementos:**
  - **Opções de Pagamento:**
    - 💳 Cartão de Crédito
      - Número do cartão (com máscara)
      - Nome no cartão
      - Validade (MM/AA)
      - CVV
      - Parcelamento (até 12x)
      - Bandeiras aceitas (visuais)
    
    - 🔒 PIX
      - QR Code para pagamento
      - Código PIX copiável
      - Validade: 30 minutos
      - Instruções de pagamento
    
    - 🏦 Boleto Bancário
      - Geração do boleto
      - Data de vencimento (3 dias)
      - Instruções de pagamento
  
  - **Dados de Cobrança:**
    - Mesmos dados do endereço ou
    - Checkbox: "Dados de cobrança diferentes do endereço de entrega"
    - Se marcado, formulário expande

#### **Etapa 4: Confirmação**
- **Página:** `/checkout/confirmacao`
- **Seção:** "Confirme seu pedido"
- **Elementos:**
  - **Resumo Visual:**
    - Imagem do kit
    - Nome do ritual
    - Lista de itens
  
  - **Dados de Entrega:**
    - Endereço completo formatado
    - Destinatário e contato
  
  - **Dados de Pagamento:**
    - Método escolhido (mascarado)
    - Valor total
  
  - **⚠️ ÁREA DE DESTAQUE - Informações Importantes:**
    - **Box destacado em cor especial:**
      - 📍 **Prazo de Entrega:** 5 dias úteis
      - 🌆 **Área de Entrega:** São Paulo (capital e região metropolitana)
      - 📦 **Envio:** Embalagem especial para preservar o ritual
      - 📧 **Confirmação:** Você receberá um e-mail com o código de rastreamento
  
  - **Checkbox obrigatório:**
    - ☑️ "Li e aceito os Termos e Condições e Política de Privacidade"
  
  - **CTA Principal:**
    - Botão grande: "Confirmar Pedido e Finalizar Compra"
  
  - **CTA Secundário:**
    - Link: "Voltar e revisar"

#### **Etapa 5: Página de Sucesso**
- **Página:** `/pedido-confirmado`
- **Elementos:**
  - ✅ Animação de confirmação
  - Número do pedido
  - Mensagem de agradecimento
  - Resumo do pedido (downloadável)
  - Próximos passos:
    - Confirmação por e-mail
    - Rastreamento (quando disponível)
    - Prazo de entrega destacado
  - CTA: "Acompanhar Pedido" e "Voltar para Home"

---

## 4. TOM DA COPY

### 4.1. Headline Principal (Home Page / Tagline)

**Opções de Headlines:**

1. **"Rituais de Presente que Transformam Momentos em Memórias"**
   - Incorpora: Ritual + Presente + Emoção

2. **"Presenteie com Ritual: Cada Caixa, Uma Experiência de Chamego"**
   - Incorpora: Presente + Ritual + Chamego

3. **"Mais que um Presente, um Ritual de Afeto para Quem Você Ama"**
   - Incorpora: Presente + Ritual + Afeto + Conexão

4. **"Crie Rituais de Presente que Encantam: Cada Kit é uma História de Carinho"**
   - Incorpora: Ritual + Presente + Encantamento + Carinho

**Recomendação Principal:**
> **"Presenteie com Ritual: Cada Caixa, Uma Experiência de Chamego"**

**Justificativa:**
- Direto e claro sobre o diferencial (ritual)
- Usa "chamego" de forma natural
- "Cada caixa" reforça o produto físico
- "Experiência" enfatiza o valor intangível

### 4.2. Subheadline (Apoio)

**Opções:**

- "Kits personalizados que transformam presentes em momentos especiais"
- "Selecione ou crie seu ritual: produtos escolhidos com carinho para quem você ama"
- "Mais que produtos, rituais de autocuidado, conexão e afeto"

### 4.3. Tom de Voz Geral

**Características:**
- **Afetuoso mas profissional:** "Querido cliente" vs. "Caro cliente"
- **Mágico mas sutil:** "Encantar" ao invés de "Transformar radicalmente"
- **Pessoal mas respeitoso:** "Você" ao invés de "O cliente"
- **Convite:** Usar imperativos suaves ("Descubra", "Crie", "Presenteie")

**Exemplos de Copy:**
- Buttons: "Criar Meu Ritual", "Adicionar ao Ritual", "Presentear Agora"
- Mensagens de erro: "Ops! Parece que algo deu errado. Vamos tentar novamente?"
- Sucesso: "Seu ritual está sendo preparado com muito carinho!"

---

## 5. CONSIDERAÇÕES TÉCNICAS DE UX

### 5.1. Indicadores de Progresso
- Usar em todas as etapas multi-step
- Mostrar etapas concluídas, atual e futuras
- Permitir retorno a etapas anteriores

### 5.2. Microinterações
- Hover nos cards de produtos
- Animação ao adicionar item ao kit
- Feedback visual imediato em todas as ações
- Loading states durante processamento

### 5.3. Validação em Tempo Real
- Campos de formulário validam enquanto o usuário digita
- Mensagens de erro claras e acionáveis
- Validação de CEP antes de permitir continuar

### 5.4. Responsividade
- Mobile-first approach
- Painel lateral de resumo vira drawer no mobile
- Formulários adaptados para telas pequenas

### 5.5. Acessibilidade
- Contraste adequado
- Navegação por teclado
- Screen readers
- Textos alternativos em imagens

---

## 6. PRÓXIMOS PASSOS

1. **Wireframes** das páginas principais
2. **Prototipação** do fluxo de personalização
3. **Testes de usabilidade** com usuários reais
4. **Refinamento** baseado em feedback
5. **Implementação** frontend

---

**Documento criado como base para desenvolvimento da experiência do usuário no e-commerce Xodózin.**

