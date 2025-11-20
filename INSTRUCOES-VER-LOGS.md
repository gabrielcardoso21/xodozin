# 🔍 Como Ver os Logs do Railway

## Opção 1: Via Railway CLI (Recomendado)

Execute no terminal:

```bash
# 1. Linkar ao projeto (selecione "kind-harmony")
railway link

# 2. Ver logs
railway logs --tail 200
```

Depois cole os logs aqui para eu analisar.

## Opção 2: Via Dashboard (Mais Fácil)

1. Acesse: https://railway.app
2. Vá no projeto **kind-harmony**
3. Clique no serviço com erro
4. Vá em **Deployments**
5. Clique no deployment mais recente (com erro)
6. Clique em **View Logs**
7. **Copie e cole os logs aqui**

## Opção 3: Script Automático

Após fazer `railway link` manualmente:

```bash
bash scripts/ver-logs-com-link.sh
```

---

**Preciso ver os logs para identificar o erro exato e corrigir!**

