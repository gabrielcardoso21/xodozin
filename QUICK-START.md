# Quick Start - Teste Local

## 🚀 Início Rápido

### 1. Instalar Módulo Odoo

1. Acesse `http://localhost:8069`
2. Login como admin
3. **Apps** → Ativar modo desenvolvedor
4. **Atualizar Lista de Aplicativos**
5. Buscar "Xodozin Core"
6. **Instalar**

### 2. Criar Página de Teste

1. Após instalar o módulo, procure por **Website Pages** no menu (pode estar em **Website > Configuration** ou diretamente no menu principal)
2. **Criar** nova página:
   - Nome: "Teste"
   - URL: `/teste` (importante: deve começar com `/`)
3. Na aba **Content Items**, clicar em **Adicionar uma linha** e criar:
   - Item tipo "Section" com:
     - Nome: "Seção de Teste"
     - Título: "Teste de Seção"
     - Conteúdo: "Este é um teste"
   - Item tipo "Text" com conteúdo
   - Item tipo "Button" com:
     - Button Text: "Clique aqui"
     - Button URL: `/kits`
     - Button Action: "Navigate"

### 3. Testar API

```bash
curl http://localhost:8069/api/website/page/teste
```

### 4. Configurar Frontend

Criar `.env` em `frontend/`:

```env
REACT_APP_ODOO_URL=http://localhost:8069
```

### 5. Iniciar Frontend

```bash
cd frontend
npm install
npm start
```

### 6. Usar ContentRenderer

Exemplo em qualquer página:

```javascript
import { useEffect, useState } from 'react';
import ContentRenderer from '../components/ContentRenderer';
import { getPageContent } from '../utils/api-content';

export default function MinhaPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    getPageContent('/teste').then(setContent);
  }, []);

  return (
    <div>
      {content && <ContentRenderer items={content.items} />}
    </div>
  );
}
```

## ✅ Checklist de Teste

- [ ] Módulo Odoo instalado
- [ ] Página criada no Odoo
- [ ] API retorna JSON
- [ ] Frontend inicia sem erros
- [ ] ContentRenderer renderiza itens
- [ ] Imagens aparecem
- [ ] Botões funcionam
- [ ] Animações funcionam

## 🐛 Problemas Comuns

**404 na API**: Verifique se a URL da página no Odoo começa com `/`

**CORS Error**: O controller já tem headers CORS configurados

**Imagens não aparecem**: Verifique se `REACT_APP_ODOO_URL` está correto

**Componentes não renderizam**: Verifique console do navegador
