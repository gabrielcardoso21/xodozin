# 🤖 Deploy Automático - O que é necessário

Para automatizar completamente o deploy sem intervenção manual, eu precisaria de:

## 🔑 1. Credenciais e Tokens

### Railway
- **Token de API do Railway** (ou autenticação via Railway CLI)
  - Como obter: Railway Dashboard → Account → Tokens → Create Token
  - Permissões necessárias: criar projetos, gerenciar serviços, configurar variáveis

### Vercel
- **Token de API do Vercel** (ou autenticação via Vercel CLI)
  - Como obter: Vercel Dashboard → Settings → Tokens → Create Token
  - Permissões necessárias: criar projetos, gerenciar deployments, configurar variáveis

### GitHub (opcional, mas recomendado)
- **Token de acesso do GitHub** (se precisar criar webhooks ou verificar repositório)
  - Permissões: `repo` (acesso ao repositório)

## 📋 2. Informações do Projeto

### Informações Básicas
- **Nome do repositório GitHub**: `xodozin` (já sabemos)
- **Branch principal**: `main` (assumindo)
- **Organização/Usuário GitHub**: (precisaria saber)

### Configurações Específicas
- **Nome do projeto no Railway**: (pode ser gerado automaticamente)
- **Nome do projeto no Vercel**: (pode ser gerado automaticamente)
- **Domínios customizados** (opcional): se quiser usar domínios próprios

## 🛠️ 3. Ferramentas CLI

### Railway CLI
```bash
npm i -g @railway/cli
railway login  # Autenticação interativa (precisa do usuário)
```

### Vercel CLI
```bash
npm i -g vercel
vercel login  # Autenticação interativa (precisa do usuário)
```

## ⚙️ 4. O que Posso Automatizar

### ✅ Posso Automatizar (com credenciais):
1. **Instalar CLIs** (Railway e Vercel)
2. **Criar projeto no Railway** via CLI
3. **Adicionar PostgreSQL** no Railway via CLI
4. **Configurar variáveis de ambiente** no Railway via CLI
5. **Configurar Root Directory** no Railway via CLI
6. **Criar projeto no Vercel** via CLI
7. **Configurar variáveis de ambiente** no Vercel via CLI
8. **Executar setup pós-deploy** (migrations, scripts)
9. **Verificar deploy** (health checks, testes)
10. **Atualizar CORS** automaticamente após obter URL do frontend

### ❌ Não Posso Automatizar (sem credenciais):
1. **Autenticação interativa** (login via browser)
2. **Criar contas** nas plataformas
3. **Aprovar permissões** de acesso ao GitHub
4. **Obter Publishable Key** do Admin Panel (precisa acessar interface)

## 🚀 Alternativa: Script Semi-Automático

Posso criar um script que automatiza TUDO exceto a autenticação inicial. Você faria:

1. **Uma vez**: `railway login` e `vercel login` (autenticação interativa)
2. **Depois**: Executar script que faz todo o resto automaticamente

## 📝 O que Preciso de Você

Para criar o script de deploy automático, me informe:

1. **Você já tem Railway CLI e Vercel CLI instalados?**
   - Se não, posso instalar automaticamente

2. **Você está disposto a fazer login uma vez?**
   - `railway login` (abre browser)
   - `vercel login` (abre browser)
   - Depois disso, posso automatizar tudo

3. **Prefere usar tokens de API ou CLI?**
   - **CLI**: Mais fácil, mas precisa login interativo uma vez
   - **Tokens**: Totalmente automático, mas precisa criar tokens manualmente

4. **Nome do usuário/organização no GitHub?**
   - Para configurar repositório corretamente

## 🎯 Recomendação

**Opção 1: Script Semi-Automático (Mais Fácil)**
- Você faz login uma vez: `railway login` e `vercel login`
- Eu crio script que automatiza todo o resto
- Você executa: `bash scripts/deploy-automatico.sh`

**Opção 2: Totalmente Automático (Mais Complexo)**
- Você cria tokens de API manualmente
- Eu crio script que usa tokens
- Você executa: `bash scripts/deploy-automatico.sh --token-railway=xxx --token-vercel=yyy`

Qual opção você prefere?

