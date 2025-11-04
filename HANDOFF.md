# Handoff - Xodózin E-commerce

## Contexto do Projeto

### Sobre o Xodózin
- **Conceito:** E-commerce de "Rituais de Presente" - produtos de alto valor agregado e carregados de significado
- **Diferencial:** Não são apenas caixas, mas mecanismos de "Transferência de Significado" (McCracken)
- **Tom da Marca:** Encantador, afetuoso, com 'chamego', mas profissional e mágico
- **Logística:** Entrega apenas em São Paulo (capital e região metropolitana), prazo máximo de 5 dias úteis

### Estrutura do Projeto
```
xodozin/
├── backend/
│   ├── server.py          # API FastAPI com MongoDB
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/         # Home, Quiz, CustomRitual, Checkout, Confirmation
│   │   ├── components/    # Componentes Radix UI
│   │   └── ...
│   └── package.json
├── ARQUITETURA-INFORMACAO-UX.md  # Documentação completa de UX
└── HANDOFF.md             # Este arquivo
```

## Estado Atual

### Backend (FastAPI)
- **Status:** Funcional
- **Arquivo:** `backend/server.py`
- **Endpoints:**
  - `GET /api/products` - Lista produtos
  - `GET /api/products/category/{category}` - Produtos por categoria
  - `GET /api/kits` - Lista kits prontos
  - `POST /api/quiz/suggest` - Sugestão de ritual baseado em quiz
  - `POST /api/orders` - Criar pedido
  - `GET /api/orders/{order_id}` - Buscar pedido
- **MongoDB:** Configurado (requer `MONGO_URL` e `DB_NAME` no `.env`)
- **Dados:** Populados automaticamente no startup (12 produtos, 3 kits)

### Frontend (React)
- **Status:** Parcialmente implementado
- **Páginas existentes:**
  1. `Home.js` - Página inicial (básica, precisa melhorias)
  2. `Quiz.js` - Questionário de personalização (funcional)
  3. `CustomRitual.js` - Seleção de produtos personalizados (funcional)
  4. `Checkout.js` - Checkout (básico, falta validação CEP, formulário completo, pagamento)
  5. `Confirmation.js` - Confirmação de pedido (básico, falta destaque prazo/área)

## Plano de Melhorias (Aprovado)

### 1. Home Page (`frontend/src/pages/Home.js`)
**O que fazer:**
- Atualizar headline para: "Presenteie com Ritual: Cada Caixa, Uma Experiência de Chamego"
- Melhorar seção "O que é um Ritual de Presente?" com explicação conceitual
- Adicionar preview dos 3 kits com CTAs claros: "Escolher Kit Pronto" e "Personalizar Meu Ritual"
- Adicionar depoimentos/testemunhos (opcional)

**Referência:** `ARQUITETURA-INFORMACAO-UX.md` seção 1.1 (página 1)

### 2. Checkout (`frontend/src/pages/Checkout.js`)
**O que fazer:**
- Adicionar validação de CEP (aceita apenas SP - capital e região metropolitana)
- Implementar formulário completo de endereço:
  - CEP com busca automática (API ViaCEP: https://viacep.com.br/)
  - Rua/Logradouro (autocompletado após CEP)
  - Número, Complemento, Bairro
  - Cidade (SP - fixo), Estado (SP - fixo)
- Adicionar campos de destinatário:
  - Nome completo, Telefone (com máscara), E-mail
- Adicionar seção de pagamento (estrutura básica - mock):
  - Cartão de Crédito (formulário)
  - PIX (opção)
  - Boleto (opção)
- Adicionar área de confirmação destacando:
  - Prazo de entrega: 5 dias úteis
  - Área de entrega: São Paulo (capital e região metropolitana)
  - Embalagem especial
  - Confirmação por e-mail

**Referência:** `ARQUITETURA-INFORMACAO-UX.md` seção 3 (Jornada do Cliente - E-commerce e Checkout)

**Componentes a criar:**
- `frontend/src/components/CEPInput.js` - Componente para validação de CEP
- `frontend/src/components/AddressForm.js` - Componente para formulário de endereço
- `frontend/src/utils/cepValidator.js` - Validação de CEP SP
- `frontend/src/utils/viaCep.js` - Integração com API ViaCEP

### 3. Confirmation (`frontend/src/pages/Confirmation.js`)
**O que fazer:**
- Adicionar box destacado com:
  - Prazo de entrega: 5 dias úteis
  - Área de entrega: São Paulo (capital e região metropolitana)
  - Envio: Embalagem especial
  - Confirmação: E-mail com código de rastreamento
- Melhorar mensagem de agradecimento
- Adicionar número do pedido (já vem do backend)

**Referência:** `ARQUITETURA-INFORMACAO-UX.md` seção 3.1 (Etapa 4 e 5)

### 4. Fluxo de Personalização
**Melhorar Quiz.js:**
- Adicionar indicador de progresso mais claro
- Melhorar feedback visual

**Melhorar CustomRitual.js:**
- Adicionar painel lateral fixo com resumo do kit
- Adicionar filtros por categoria (Sensorial, Afetivo, Ritualístico)
- Melhorar consolidação de lista em tempo real
- Adicionar visualização de categorias balanceadas

**Componentes a criar:**
- `frontend/src/components/SummaryPanel.js` - Painel lateral com resumo do kit

**Referência:** `ARQUITETURA-INFORMACAO-UX.md` seção 2 (Jornada do Cliente - Caminho da Personalização)

### 5. Nova Página: Kits Prontos (Opcional)
**Criar:** `frontend/src/pages/Kits.js`
- Filtros por faixa de preço (R$88, R$160-250, R$300-340)
- Cards dos kits com todos os detalhes
- Comparação lado a lado (opcional)

**Referência:** `ARQUITETURA-INFORMACAO-UX.md` seção 1.1 (página 2)

## Deploy Gratuito

### Opção Recomendada: Vercel + Render + MongoDB Atlas

**Frontend (Vercel):**
- URL: https://vercel.com/
- Free tier: Ilimitado para projetos pessoais
- Deploy automático via GitHub
- Configurar variável de ambiente: `REACT_APP_BACKEND_URL`

**Backend (Render):**
- URL: https://render.com/
- Free tier: 750 horas/mês (pode hibernar após inatividade)
- Deploy automático via GitHub
- Configurar variáveis de ambiente:
  - `MONGO_URL`
  - `DB_NAME`
  - `CORS_ORIGINS` (URL do frontend no Vercel)

**MongoDB (MongoDB Atlas):**
- URL: https://www.mongodb.com/cloud/atlas
- Free tier: 512MB de storage (suficiente para começar)
- Criar cluster e obter connection string

### Configuração de Deploy

**Backend:**
1. Criar `backend/Procfile`:
   ```
   web: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

2. Criar `backend/.env.example`:
   ```
   MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/
   DB_NAME=xodozin
   CORS_ORIGINS=https://xodozin.vercel.app
   ```

**Frontend:**
1. Criar `frontend/.env.example`:
   ```
   REACT_APP_BACKEND_URL=https://xodozin-backend.onrender.com
   ```

2. Criar `frontend/vercel.json` (se usar Vercel):
   ```json
   {
     "buildCommand": "cd frontend && yarn install && yarn build",
     "outputDirectory": "frontend/build",
     "installCommand": "cd frontend && yarn install"
   }
   ```

## Arquivos Importantes

### Documentação
- `ARQUITETURA-INFORMACAO-UX.md` - Documentação completa de UX (401 linhas)
- `HANDOFF.md` - Este arquivo

### Código Backend
- `backend/server.py` - API FastAPI (236 linhas)
- `backend/requirements.txt` - Dependências Python

### Código Frontend
- `frontend/src/pages/Home.js` - Home page (184 linhas)
- `frontend/src/pages/Quiz.js` - Questionário (142 linhas)
- `frontend/src/pages/CustomRitual.js` - Personalização (184 linhas)
- `frontend/src/pages/Checkout.js` - Checkout (181 linhas)
- `frontend/src/pages/Confirmation.js` - Confirmação (99 linhas)
- `frontend/src/App.js` - Roteamento principal (27 linhas)

## Próximos Passos

1. **Melhorar Home Page** conforme documentação UX
2. **Implementar validação de CEP SP** no Checkout
3. **Criar formulário completo de endereço** no Checkout
4. **Adicionar seção de pagamento** (mock) no Checkout
5. **Melhorar Confirmation** com destaque de prazo e área
6. **Melhorar fluxo de personalização** (painel lateral, filtros)
7. **Configurar deploy gratuito** (Vercel + Render + MongoDB Atlas)

## Referências

- **Documentação UX:** `ARQUITETURA-INFORMACAO-UX.md`
- **API ViaCEP:** https://viacep.com.br/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Vercel:** https://vercel.com/
- **Render:** https://render.com/

## Notas Importantes

- **Validação de CEP SP:** Usar API ViaCEP para buscar CEP e validar se pertence a SP (capital e região metropolitana)
- **Pagamento:** Criar estrutura básica sem integração real (mock para desenvolvimento)
- **MongoDB Atlas:** Free tier tem 512MB, suficiente para começar
- **Render:** Free tier pode hibernar após inatividade, mas acorda automaticamente quando há requisição
- **Vercel:** Free tier é ilimitado para projetos pessoais

## Estado do Código

- **Backend:** Funcional e pronto para deploy
- **Frontend:** Funcional mas precisa melhorias de UX conforme documentação
- **Deploy:** Não configurado ainda

## Tom da Copy

**Headline recomendado:**
> "Presenteie com Ritual: Cada Caixa, Uma Experiência de Chamego"

**Características:**
- Afetuoso mas profissional
- Mágico mas sutil
- Pessoal mas respeitoso
- Usar imperativos suaves ("Descubra", "Crie", "Presenteie")

