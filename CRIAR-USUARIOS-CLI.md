# 👥 Criar Usuários via CLI do Medusa

## ✅ Solução: Criar via CLI com npx

**IMPORTANTE**: Use `npx medusa user` e não `yarn medusa user`!

### Passo 1: Criar Usuário Gabriel

```bash
cd /home/gabriel/xodozin/xodozin
npx medusa user -e gabriel@xodozin.com.br -p Gabriel123!
```

### Passo 2: Criar Usuário Anne

```bash
npx medusa user -e anne@xodozin.com.br -p Anne123!
```

## 📝 Sintaxe do Comando

```bash
npx medusa user -e <email> -p <senha>
```

Onde:
- `-e` ou `--email`: Email do usuário
- `-p` ou `--password`: Senha do usuário

## 🔍 Verificar se Funcionou

Após criar os usuários, verifique se as auth identities foram criadas:

```bash
docker exec xodozin-postgres psql -U postgres -d xodozin -c "SELECT COUNT(*) FROM auth_identity;"
docker exec xodozin-postgres psql -U postgres -d xodozin -c "SELECT COUNT(*) FROM provider_identity WHERE provider = 'emailpass';"
```

Deve retornar 2 em ambos os casos.

## 🌐 Testar Login

Acesse: http://localhost:9000/app

Tente fazer login com:
- **Gabriel**: gabriel@xodozin.com.br / Gabriel123!
- **Anne**: anne@xodozin.com.br / Anne123!

## 📝 Notas

- O CLI do Medusa garante que todas as estruturas de autenticação sejam criadas corretamente
- Os scripts programáticos podem não criar todas as dependências necessárias
- Após criar via CLI, os usuários funcionarão corretamente

## 🔄 Se Precisar Deletar Usuários Antigos

Se você quiser limpar os usuários criados pelos scripts antes de criar via CLI:

```bash
cd /home/gabriel/xodozin/xodozin
yarn delete:users
```

Depois crie novamente via CLI com `npx medusa user`.

## ⚠️ Nota Importante

- Use `npx medusa user` e **NÃO** `yarn medusa user`
- O `yarn medusa user` tem bugs na versão 2.11.3
- O `npx medusa user` funciona corretamente com os parâmetros `-e` e `-p`

