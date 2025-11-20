# ⚡ Migração Rápida para Render.com

## 🎯 Método Mais Rápido (Blueprint - 5 minutos)

1. **Acesse**: https://render.com → "Get Started for Free" → Login com GitHub

2. **Crie Blueprint**:
   - Clique em "New +" → "Blueprint"
   - Conecte GitHub → Selecione repositório `gabrielcardoso21/xodozin`
   - Clique em "Apply"
   - ✅ Render criará tudo automaticamente!

3. **Ajuste CORS** (após primeiro deploy):
   - Vá no serviço "medusa-backend" → "Environment"
   - Ajuste `STORE_CORS` e `ADMIN_CORS` para o domínio do Render
   - Salve

4. **Pronto!** 🎉

## 📝 Valores para Variáveis de Ambiente

Execute `bash scripts/setup-render.sh` para gerar novos valores, ou use:

```
JWT_SECRET=BjDkFtmmnvHg0K27gMnhSA+X+4doi0M7GlOY9G+haqo=
COOKIE_SECRET=/x8ADNgnuElv3GzN3djgLSnVlt9GKGFLaOT9t4Xx57o=
```

## 📚 Documentação Completa

- **Guia Completo**: `GUIA-RENDER-COMPLETO.md`
- **Script de Setup**: `bash scripts/setup-render.sh`

