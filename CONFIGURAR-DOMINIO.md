# 🌐 Configurar Domínio Personalizado no Vercel

## 📋 Resumo Rápido

- **Domínio raiz** (ex: `xodozin.com`): Use registro **A** ou **ANAME/ALIAS**
- **Subdomínio** (ex: `www.xodozin.com`): Use registro **CNAME**

---

## 🎯 Passo 1: Adicionar Domínio no Vercel

1. Acesse o [dashboard do Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto **xodozin**
3. Vá em **"Settings"** > **"Domains"**
4. Clique em **"Add Domain"**
5. Digite seu domínio (ex: `xodozin.com` ou `www.xodozin.com`)
6. O Vercel vai mostrar as instruções de DNS

---

## 🔧 Passo 2: Configurar DNS no Provedor de Domínio

### **Opção A: Domínio Raiz (apex domain) - `xodozin.com`**

#### **Método 1: Registro A (Recomendado)**

No painel do seu provedor de DNS (Registro.br, GoDaddy, Namecheap, etc):

1. Vá em **"DNS"** ou **"Zona DNS"**
2. Adicione um registro **A**:
   - **Tipo:** `A`
   - **Nome/Host:** `@` (ou deixe vazio, ou `xodozin.com`)
   - **Valor/IP:** `76.76.21.21`
   - **TTL:** `3600` (ou padrão)

**Exemplo:**
```
Tipo: A
Nome: @
Valor: 76.76.21.21
TTL: 3600
```

#### **Método 2: ANAME/ALIAS (Se disponível)**

Alguns provedores (Cloudflare, Route 53) suportam ANAME/ALIAS:

1. Adicione um registro **ANAME** ou **ALIAS**:
   - **Tipo:** `ANAME` ou `ALIAS`
   - **Nome/Host:** `@`
   - **Valor:** `cname.vercel-dns.com` (ou o valor fornecido pelo Vercel)
   - **TTL:** `3600`

**⚠️ Nota:** Nem todos os provedores suportam ANAME/ALIAS. Se não tiver, use o registro A.

---

### **Opção B: Subdomínio - `www.xodozin.com`**

1. Vá em **"DNS"** ou **"Zona DNS"**
2. Adicione um registro **CNAME**:
   - **Tipo:** `CNAME`
   - **Nome/Host:** `www`
   - **Valor:** `cname.vercel-dns.com` (ou o valor específico fornecido pelo Vercel)
   - **TTL:** `3600`

**Exemplo:**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

---

## 📝 Configuração Completa (Recomendado)

Para ter **ambos** o domínio raiz e o `www` funcionando:

### **No seu provedor de DNS:**

1. **Registro A** para o domínio raiz:
   ```
   Tipo: A
   Nome: @
   Valor: 76.76.21.21
   ```

2. **Registro CNAME** para o `www`:
   ```
   Tipo: CNAME
   Nome: www
   Valor: cname.vercel-dns.com
   ```

### **No Vercel:**

1. Adicione **ambos** os domínios:
   - `xodozin.com`
   - `www.xodozin.com`

2. O Vercel vai redirecionar automaticamente um para o outro (você pode escolher qual é o principal)

---

## ⏱️ Propagação DNS

Após configurar os registros DNS:

- **Tempo de propagação:** 5 minutos a 48 horas (geralmente 1-2 horas)
- **Verificação:** O Vercel verifica automaticamente quando o DNS está configurado
- **Status:** Você pode acompanhar em **Settings** > **Domains** no Vercel

---

## 🔍 Como Verificar se Está Funcionando

### **1. Verificar no Vercel:**
- Vá em **Settings** > **Domains**
- O status deve mudar de "Pending" para "Configured" (verde)

### **2. Verificar com comando:**
```bash
# Verificar registro A
dig xodozin.com A

# Verificar registro CNAME
dig www.xodozin.com CNAME

# Verificar no servidor DNS específico
nslookup xodozin.com
```

### **3. Testar no navegador:**
- Acesse `https://xodozin.com`
- Deve carregar o site normalmente

---

## 🆘 Problemas Comuns

### **DNS não está propagando**
- Aguarde mais tempo (pode levar até 48 horas)
- Verifique se os registros estão corretos no provedor
- Limpe o cache do DNS: `ipconfig /flushdns` (Windows) ou `sudo dscacheutil -flushcache` (Mac)

### **Erro "Domain not configured"**
- Verifique se adicionou o domínio no Vercel primeiro
- Verifique se os registros DNS estão corretos
- Aguarde a propagação DNS

### **HTTPS não funciona**
- O Vercel configura SSL automaticamente (pode levar alguns minutos após o DNS estar configurado)
- Certificados SSL são fornecidos pela Let's Encrypt automaticamente

### **www não redireciona para domínio raiz (ou vice-versa)**
- No Vercel, vá em **Settings** > **Domains**
- Configure o redirecionamento entre `www` e domínio raiz

---

## 📚 Referências

- [Documentação oficial do Vercel sobre domínios](https://vercel.com/docs/domains)
- [Troubleshooting DNS no Vercel](https://vercel.com/docs/domains/troubleshooting)

---

## ✅ Checklist

- [ ] Domínio adicionado no Vercel
- [ ] Registro A configurado para domínio raiz (ou ANAME se disponível)
- [ ] Registro CNAME configurado para `www` (opcional, mas recomendado)
- [ ] Aguardou propagação DNS (1-2 horas)
- [ ] Status no Vercel mostra "Configured"
- [ ] Site acessível via domínio personalizado
- [ ] HTTPS funcionando (certificado SSL automático)

