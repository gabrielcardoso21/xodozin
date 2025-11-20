# 👥 Usuários Configurados

## ✅ Usuários Criados

### 👤 Gabriel (Admin Completo)
- **Email**: gabriel@xodozin.com.br
- **Senha**: Gabriel123!
- **ID**: user_01K9TGX61AZXKVMZ25277YDTS8
- **Permissões**: Admin completo
- **Status**: ✅ Criado e pronto para uso

### 👤 Anne (Permissões Limitadas)
- **Email**: anne@xodozin.com.br
- **Senha**: Anne123!
- **ID**: user_01K9TGX67821CYD16SQCFG6DMQ
- **Permissões**: Admin (limitar manualmente)
- **Status**: ✅ Criada e pronta para uso

## 🔐 Acesso ao Admin Panel

1. Acesse: http://localhost:9000/app
2. Faça login com as credenciais acima
3. **IMPORTANTE**: Altere as senhas após o primeiro login!

## ⚙️ Limitar Permissões da Anne

No Medusa v2, todos os usuários são admins por padrão. Para limitar as permissões da Anne, você tem algumas opções:

### Opção 1: Configuração Manual no Admin Panel
1. Faça login como Gabriel (admin)
2. Vá em **Settings** → **Users**
3. Encontre a Anne
4. Clique em **Edit** ou **Editar**
5. Ajuste as configurações conforme necessário

### Opção 2: Criar Extensão Customizada
Crie uma extensão do Admin Panel que limita o acesso da Anne a funcionalidades específicas.

### Opção 3: Usar Grupos de Usuários (se disponível)
Configure grupos de usuários com permissões diferentes.

## 🔄 Recriar Usuários

Se precisar recriar os usuários:

```bash
cd /home/gabriel/xodozin/xodozin
yarn setup:users
```

## 📝 Notas Importantes

- ⚠️ **Altere as senhas** após o primeiro login!
- ⚠️ No Medusa v2, o sistema de permissões é limitado - todos os usuários são admins por padrão
- ⚠️ Para limitar permissões da Anne, você precisará criar extensões customizadas ou configurar manualmente

## 🎯 Próximos Passos

1. ✅ Fazer login com as credenciais
2. ✅ Alterar senhas
3. ⏳ Configurar permissões da Anne (se necessário)
4. ⏳ Começar a usar o sistema!

