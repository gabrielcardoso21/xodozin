# Guia de Teste Local

## Pré-requisitos

1. Docker e Docker Compose instalados
2. Node.js e npm/yarn instalados
3. Acesso ao banco de dados Odoo

## Passo 1: Configurar o Módulo Odoo

### 1.1 Instalar o módulo no Odoo

1. Acesse o Odoo (geralmente em `http://localhost:8069`)
2. Faça login como administrador
3. Vá em **Apps** (ou **Aplicativos**)
4. Ative o modo desenvolvedor (Settings > Activate Developer Mode)
5. Clique em **Atualizar Lista de Aplicativos**
6. Procure por "Xodozin Core - Website Content Management"
7. Clique em **Instalar**

### 1.2 Criar uma página de teste

1. Vá em **Website > Configuration > Website Pages**
2. Clique em **Criar**
3. Preencha:
   - **Nome**: "Página de Teste"
   - **URL**: "/teste"
   - **SEO Title**: "Página de Teste - Xodózin"
   - **SEO Description**: "Esta é uma página de teste"
4. Na aba **Content Items**, clique em **Adicionar uma linha**
5. Crie alguns itens de conteúdo:
   - Um item do tipo "Section" com título e conteúdo
   - Um item do tipo "Text" 
   - Um item do tipo "Image"
   - Um item do tipo "Button" com URL

### 1.3 Testar a API

Teste o endpoint da API:

```bash
curl http://localhost:8069/api/website/page/teste
```

Deve retornar um JSON com os dados da página.

## Passo 2: Configurar o Frontend React

### 2.1 Instalar dependências

```bash
cd frontend
npm install
# ou
yarn install
```

### 2.2 Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `frontend`:

```env
REACT_APP_ODOO_URL=http://localhost:8069
```

### 2.3 Iniciar o servidor de desenvolvimento

```bash
npm start
# ou
yarn start
```

O frontend estará disponível em `http://localhost:3000`

## Passo 3: Integrar ContentRenderer em uma página

### 3.1 Exemplo de uso na página Home

Edite `frontend/src/pages/Home.js`:

```javascript
import { useEffect, useState } from 'react';
import ContentRenderer from '../components/ContentRenderer';
import { getPageContent } from '../utils/api-content';

export default function Home() {
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    // Buscar conteúdo da página "/" do Odoo
    getPageContent('/').then(data => {
      if (data) {
        setPageContent(data);
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - não alterar */}
      <section className="hero-section">
        {/* ... hero content ... */}
      </section>

      {/* Conteúdo do Odoo */}
      {pageContent && (
        <ContentRenderer items={pageContent.items} />
      )}
    </div>
  );
}
```

### 3.2 Exemplo de uso em outras páginas

Para usar em outras páginas, basta:

```javascript
import ContentRenderer from '../components/ContentRenderer';
import { getPageContent } from '../utils/api-content';
import useSEO from '../hooks/useSEO';

export default function Kits() {
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    getPageContent('/kits').then(data => {
      if (data) {
        setPageContent(data);
        // Atualizar SEO
        useSEO({
          title: data.seo_title,
          description: data.seo_description,
        });
      }
    });
  }, []);

  return (
    <div>
      {/* Seu conteúdo existente */}
      
      {/* Conteúdo do Odoo */}
      {pageContent && (
        <ContentRenderer items={pageContent.items} />
      )}
    </div>
  );
}
```

## Passo 4: Testar os Componentes

### 4.1 Testar Gallery

1. No Odoo, crie um item do tipo "Gallery"
2. Adicione algumas imagens na galeria
3. A página deve mostrar a galeria com modal ao clicar

### 4.2 Testar Testimonials

1. Crie um item do tipo "Testimonials"
2. Adicione alguns depoimentos
3. Verifique se os cards aparecem corretamente

### 4.3 Testar Pricing

1. Crie um item do tipo "Pricing Table"
2. Adicione alguns planos
3. Verifique se a tabela de preços aparece

### 4.4 Testar FAQ

1. Crie um item do tipo "FAQ"
2. Adicione algumas perguntas e respostas
3. Verifique se o accordion funciona

### 4.5 Testar CTA Banner

1. Crie um item do tipo "CTA Banner"
2. Configure título, subtítulo e botão
3. Verifique se o banner aparece destacado

## Passo 5: Verificar Funcionalidades

### 5.1 Animações

- Verifique se as animações (fade, slide) funcionam
- Teste diferentes tipos de animação nos itens

### 5.2 Responsividade

- Teste em diferentes tamanhos de tela
- Verifique se os componentes se adaptam corretamente

### 5.3 Acessibilidade

- Teste navegação por teclado (Tab, Enter, Escape)
- Verifique se os screen readers conseguem ler o conteúdo
- Teste contraste de cores

### 5.4 Performance

- Verifique lazy loading de imagens
- Teste code splitting (verifique Network tab)
- Verifique se os skeleton loaders aparecem durante carregamento

## Troubleshooting

### Problema: API retorna 404

**Solução**: 
- Verifique se o módulo Odoo está instalado
- Verifique se a URL da página está correta no Odoo
- Verifique se a página está ativa

### Problema: Imagens não aparecem

**Solução**:
- Verifique se as imagens foram enviadas no Odoo
- Verifique se a URL base do Odoo está correta no `.env`
- Verifique o console do navegador para erros CORS

### Problema: Componentes não renderizam

**Solução**:
- Verifique o console do navegador para erros
- Verifique se os dados estão chegando corretamente da API
- Verifique se o tipo do item está correto

### Problema: CORS errors

**Solução**:
- O controller já tem `cors='*'` configurado
- Se ainda houver problemas, adicione headers CORS no Odoo

## Próximos Passos

1. Criar mais páginas no Odoo
2. Adicionar mais conteúdo usando os diferentes tipos de item
3. Personalizar cores, espaçamentos e animações
4. Testar em diferentes navegadores
5. Otimizar imagens e performance
