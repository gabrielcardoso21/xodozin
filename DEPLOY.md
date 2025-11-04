# Guia de Deploy - Xodózin E-commerce

Este guia explica como fazer o deploy gratuito do Xodózin usando Vercel (frontend), Render (backend) e MongoDB Atlas (banco de dados).

## Pré-requisitos

1. Conta no GitHub (para conectar os serviços)
2. Conta no MongoDB Atlas (gratuita)
3. Conta no Vercel (gratuita)
4. Conta no Render (gratuita)

## Passo 1: Configurar MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita (se não tiver)
3. Crie um novo cluster (escolha a região mais próxima)
4. Configure um usuário do banco de dados:
   - Vá em "Database Access" > "Add New Database User"
   - Escolha "Password" e defina um usuário e senha fortes
   - Anote as credenciais (você precisará delas)
5. Configure o Network Access:
   - Vá em "Network Access" > "Add IP Address"
   - Para Render, adicione `0.0.0.0/0` (permite de qualquer IP)
   - Clique em "Add"
6. Obtenha a connection string:
   - Vá em "Database" > "Connect" > "Connect your application"
   - Copie a string de conexão (será algo como: `mongodb+srv://user:password@cluster.mongodb.net/`)
   - Substitua `<password>` pela senha do usuário que você criou
   - **Anote essa string completa** - você precisará dela no Render

## Passo 2: Deploy do Backend no Render

1. Acesse [Render](https://render.com/)
2. Faça login com sua conta do GitHub
3. No dashboard, clique em "New" > "Web Service"
4. Conecte seu repositório GitHub e selecione o repositório do Xodózin
5. Configure o serviço:
   - **Name:** `xodozin-backend` (ou o nome que preferir)
   - **Environment:** `Python 3`
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** deixe vazio (Render vai usar a raiz do repositório)

6. Configure as variáveis de ambiente em "Environment Variables":
   ```
   MONGO_URL=mongodb+srv://seu-usuario:suas-senha@cluster.mongodb.net/
   DB_NAME=xodozin
   CORS_ORIGINS=https://seu-app.vercel.app
   ```
   **Importante:** Cole a connection string completa do MongoDB aqui (com a senha substituída)

7. Clique em "Create Web Service"
8. Aguarde o deploy terminar e anote a URL (será algo como: `https://xodozin-backend.onrender.com`)

## Passo 3: Deploy do Frontend no Vercel

1. Acesse [Vercel](https://vercel.com/)
2. Faça login com sua conta do GitHub
3. Clique em "Add New..." > "Project"
4. Importe seu repositório GitHub e selecione o repositório do Xodózin
5. Configure o projeto:
   - **Framework Preset:** Other
   - **Root Directory:** `frontend`
   - **Build Command:** `yarn build` (ou `npm run build`)
   - **Output Directory:** `build`
   - **Install Command:** `yarn install` (ou `npm install`)

6. Configure as variáveis de ambiente em "Environment Variables":
   ```
   REACT_APP_BACKEND_URL=https://xodozin-backend.onrender.com
   ```
   **Importante:** Use a URL completa do backend que você obteve no passo anterior (com `https://`)

7. Clique em "Deploy"
8. Aguarde o deploy terminar e anote a URL (será algo como: `https://xodozin.vercel.app`)

## Passo 4: Atualizar CORS no Backend

1. Volte ao Render e vá para o dashboard do seu backend
2. Vá em "Environment" > "Environment Variables"
3. Atualize a variável `CORS_ORIGINS` com a URL do frontend no Vercel:
   ```
   CORS_ORIGINS=https://seu-app.vercel.app
   ```
4. Salve as mudanças (Render vai reiniciar o serviço automaticamente)

## Passo 5: Testar o Deploy

1. Acesse a URL do frontend no Vercel
2. Teste a aplicação:
   - Navegue pela Home
   - Faça o Quiz
   - Selecione produtos
   - Teste o Checkout (CEP deve aceitar apenas São Paulo)

## Arquivos de Configuração

Os seguintes arquivos já foram criados no projeto:

- `backend/Procfile` - Configuração para Render
- `vercel.json` - Configuração para Vercel (na raiz do projeto)
- `frontend/.env.example` - Exemplo de variáveis de ambiente (não commitado)
- `backend/.env.example` - Exemplo de variáveis de ambiente (não commitado)

## Variáveis de Ambiente Resumidas

### Backend (Render):
```
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/
DB_NAME=xodozin
CORS_ORIGINS=https://seu-app.vercel.app
```

### Frontend (Vercel):
```
REACT_APP_BACKEND_URL=https://xodozin-backend.onrender.com
```

## Troubleshooting

### Backend não está conectando ao MongoDB
- Verifique se o IP `0.0.0.0/0` está na lista de Network Access no MongoDB Atlas
- Verifique se a connection string está correta (com senha substituída)
- Verifique os logs no Render para ver mensagens de erro

### CORS Error no Frontend
- Verifique se `CORS_ORIGINS` no Render contém a URL exata do Vercel (com `https://`)
- Certifique-se de que não há espaços extras ou barras finais desnecessárias
- O CORS aceita múltiplos origens separados por vírgula: `https://app1.vercel.app,https://app2.vercel.app`

### Frontend não encontra o Backend
- Verifique se `REACT_APP_BACKEND_URL` está configurado corretamente no Vercel
- Certifique-se de que a URL do backend está completa (com `https://`)
- Verifique se o backend está rodando no Render (pode estar hibernado na primeira requisição)

### Render hiberna após inatividade
- No free tier do Render, o serviço hiberna após 15 minutos de inatividade
- A primeira requisição após hibernar pode demorar ~30 segundos para acordar
- Isso é normal no plano gratuito

## Próximos Passos

1. Configure um domínio customizado no Vercel (opcional)
2. Configure monitoramento e alertas
3. Configure CI/CD para deploys automáticos
4. Considere usar um serviço de e-mail para confirmações de pedido

## Referências

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)

