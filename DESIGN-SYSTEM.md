# Design System - Xodozin

## Paleta de Cores

### Cores Principais
- **Primária**: `#da2c38` (Vermelho)
- **Secundária**: `#F2cc8f` (Bege/Amarelo Claro)
- **Texto**: `#463f3a` (Marrom Escuro)
- **Fundo**: `#F2cc8f` (Bege)

### Variantes
- **Primária Escura**: `#c02530`
- **Primária Clara**: `rgba(218, 44, 56, 0.1)`
- **Texto Secundário**: `#463f3a/60` (60% opacidade)

## Tipografia

### Fontes
- **Títulos**: Playfair Display (serif)
  - Pesos: 400, 500, 600, 700
- **Corpo**: Poppins (sans-serif)
  - Pesos: 300, 400, 500, 600

### Escala de Tamanhos
- **H1**: 3xl (1.875rem) - 4xl (2.25rem) - 5xl (3rem) - 6xl (3.75rem)
- **H2**: 2xl (1.5rem) - 3xl (1.875rem) - 4xl (2.25rem)
- **H3**: xl (1.25rem) - 2xl (1.5rem)
- **Corpo**: base (1rem) - lg (1.125rem)
- **Pequeno**: sm (0.875rem) - xs (0.75rem)

## Espaçamento

### Escala de Espaçamento
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Padding de Containers
- **Container padrão**: `2rem 1.5rem` (32px 24px)
- **Mobile**: `1.5rem 1rem` (24px 16px)
- **Max-width**: `1200px`

## Componentes

### Botões

#### Botão Primário
```css
background: #da2c38
color: #FFFFFF
padding: 1rem 2.5rem
border-radius: 50px
box-shadow: 0 4px 15px rgba(218, 44, 56, 0.3)
```

#### Botão Secundário
```css
background: rgba(255, 255, 255, 0.9)
color: #Da2c38
padding: 0.875rem 2rem
border-radius: 50px
border: 2px solid #da2c38
```

### Cards

```css
background: rgba(255, 255, 255, 0.85)
backdrop-filter: blur(12px)
border-radius: 24px
padding: 2rem
box-shadow: 0 8px 32px rgba(139, 90, 60, 0.08)
border: 1px solid rgba(193, 154, 107, 0.1)
```

### Sombras

- **Card**: `0 8px 32px rgba(139, 90, 60, 0.08)`
- **Card Hover**: `0 12px 40px rgba(139, 90, 60, 0.12)`
- **Botão**: `0 4px 15px rgba(218, 44, 56, 0.3)`
- **Botão Hover**: `0 6px 20px rgba(218, 44, 56, 0.4)`

## Animações

### Transições
- **Duração padrão**: `0.3s`
- **Easing**: `ease` ou `ease-out`

### Animações de Entrada
- **Fade In**: `fadeIn 0.6s ease-out`
- **Slide Up**: `slideUp 0.6s ease-out`
- **Slide Left**: `slideLeft 0.6s ease-out`
- **Slide Right**: `slideRight 0.6s ease-out`

### Hover Effects
- **Transform**: `translateY(-2px)` ou `scale(1.02)`
- **Shadow**: Aumento de 20-30% na opacidade

## Breakpoints

- **Mobile**: até `768px`
- **Tablet**: `768px` - `1024px`
- **Desktop**: acima de `1024px`

## Acessibilidade

### Contraste
- Todos os textos devem ter contraste mínimo de 4.5:1 (WCAG AA)
- Textos grandes (18px+) devem ter contraste mínimo de 3:1

### Foco
- Outline: `2px solid #da2c38`
- Offset: `4px`

### ARIA
- Todos os componentes interativos devem ter `aria-label`
- Imagens devem ter `alt` text descritivo
- Formulários devem ter labels associados

## Padrões de Layout

### Grid
- **Desktop**: 3 colunas
- **Tablet**: 2 colunas
- **Mobile**: 1 coluna

### Gap
- **Grid gap**: `1.5rem` - `2rem` (24px - 32px)
