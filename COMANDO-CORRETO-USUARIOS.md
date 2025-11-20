# ✅ Comando Correto para Criar Usuários no Medusa v2

## 🎯 Solução Descoberta

**Use `npx medusa user` e NÃO `yarn medusa user`!**

## 📝 Sintaxe

```bash
npx medusa user -e <email> -p <senha>
```

Onde:
- `-e` ou `--email`: Email do usuário
- `-p` ou `--password`: Senha do usuário

## 👥 Criar Usuários

### Gabriel (Admin)
```bash
cd /home/gabriel/xodozin/xodozin
npx medusa user -e gabriel@xodozin.com.br -p Gabriel123!
```

### Anne (Permissões Limitadas)
```bash
npx medusa user -e anne@xodozin.com.br -p Anne123!
```

## ⚠️ Por que `npx` e não `yarn`?

- `yarn medusa user` tem bugs na versão 2.11.3
- `npx medusa user` funciona corretamente com parâmetros `-e` e `-p`
- O `npx` executa o CLI diretamente sem problemas de interatividade

## ✅ Verificar se Funcionou

Após criar, teste o login:
```bash
curl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email": "gabriel@xodozin.com.br", "password": "Gabriel123!"}'
```

Se retornar um token JWT, está funcionando! 🎉

## 🔄 Se Precisar Deletar Usuários

```bash
cd /home/gabriel/xodozin/xodozin
yarn delete:users
```

Depois recrie com `npx medusa user`.

## 📋 Credenciais Configuradas

- **Gabriel**: gabriel@xodozin.com.br / Gabriel123!
- **Anne**: anne@xodozin.com.br / Anne123!

## 🌐 Acessar Admin Panel

http://localhost:9000/app

Após fazer login, configure o idioma em:
**Settings** → **Profile** → **Language** → **Português (Brasil)**

