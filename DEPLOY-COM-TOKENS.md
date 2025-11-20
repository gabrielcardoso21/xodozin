# 🔐 Deploy com Tokens - Guia Rápido

Agora que você tem os tokens configurados no arquivo `.secrets`, o deploy pode ser totalmente automático!

## ✅ Arquivo .secrets Criado

O arquivo `.secrets` foi criado com seus tokens e está no `.gitignore` (não será commitado).

## 🚀 Como Usar

### Opção 1: Script Automático (Mais Fácil)

```bash
bash scripts/deploy-com-tokens.sh
```

Este script:
1. Carrega automaticamente os tokens do `.secrets`
2. Detecta o repositório GitHub automaticamente
3. Executa o deploy completo

### Opção 2: Manual (Mais Controle)

```bash
# Carregar tokens
source .secrets

# Executar deploy
bash scripts/deploy-completo.sh \
    --railway-token "$RAILWAY_TOKEN" \
    --vercel-token "$VERCEL_TOKEN" \
    --github-repo usuario/xodozin
```

## 📋 O que o Script Faz

1. ✅ Verifica se `.secrets` existe
2. ✅ Carrega os tokens automaticamente
3. ✅ Detecta repositório GitHub (ou pede)
4. ✅ Instala CLIs se necessário
5. ✅ Cria projeto no Railway
6. ✅ Adiciona PostgreSQL
7. ✅ Configura variáveis de ambiente
8. ✅ Faz deploy do backend
9. ✅ Executa setup pós-deploy
10. ✅ Cria projeto no Vercel
11. ✅ Configura variáveis do frontend
12. ✅ Faz deploy do frontend
13. ✅ Atualiza CORS
14. ✅ Verifica tudo funcionando

## 🔒 Segurança

- ✅ `.secrets` está no `.gitignore`
- ✅ Tokens não serão commitados
- ✅ Arquivo local apenas

## ⚠️ Importante

Se você precisar atualizar os tokens:
1. Edite o arquivo `.secrets`
2. Não commite o arquivo (já está no `.gitignore`)
3. Execute o deploy novamente

## 🎯 Próximo Passo

Execute o deploy agora:

```bash
bash scripts/deploy-com-tokens.sh
```

O script vai fazer tudo automaticamente! 🚀

