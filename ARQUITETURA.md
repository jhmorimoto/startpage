# Arquitetura do Sistema - Startpage

Esta aplicação é uma **Startpage** (página inicial) personalizada, projetada para ser extremamente leve, rápida e funcional. Ela permite que o usuário visualize seus favoritos organizados por categorias, com suporte a busca instantânea e customização visual completa.

## 1. Visão Geral da Arquitetura

A aplicação segue uma **Arquitetura Baseada no Cliente (Client-side Architecture)**. Isso significa que toda a lógica de processamento, renderização e gerenciamento de estado ocorre diretamente no navegador do usuário. Não há um servidor de aplicação complexo; o servidor (se presente) serve apenas arquivos estáticos.

### Principais Características:
- **Zero-Backend**: A lógica é puramente client-side, facilitando a portabilidade e o uso via protocolo `file://`.
- **Single Page Application (SPA) Minimalista**: Toda a interação ocorre em uma única página, sem recarregamentos desnecessários.
- **Configuração via Arquivo**: Os dados (favoritos) são extraídos de um arquivo YAML simples, tornando a edição manual fácil e legível para humanos.

---

## 2. Componentes e Responsabilidades

A aplicação é dividida em três camadas principais:

### A. Camada de Apresentação (HTML & CSS)
Responsável pela estrutura visual e pelo layout da página.
- **`index.html`**: Define a estrutura semântica da página, incluindo o campo de busca, o contêiner do grid de favoritos e o diálogo de configurações.
- **`style.css`**: Gerencia todo o estilo visual. Utiliza técnicas modernas como:
    - **CSS Grid**: Para um layout responsivo e organizado dos favoritos.
    - **CSS Variables (Custom Properties)**: Essencial para a customização em tempo real (temas, tamanhos de fonte, colunas, sombras). Isso permite que mudanças de configuração sejam aplicadas instantaneamente sem re-renderizar o DOM via JS.

### B. Camada de Lógica (JavaScript)
O arquivo `app.js` atua como o "cérebro" da aplicação, gerenciando:
- **Carregamento de Dados**: Utiliza a API `fetch` para buscar o arquivo `bookmarks.yaml`.
- **Parsing de Dados**: Converte o conteúdo YAML em objetos JavaScript utilizando a biblioteca `js-yaml`.
- **Renderização Dinâmica**: Cria e injeta os elementos do DOM baseados nos dados carregados.
- **Sistema de Busca (Filtragem)**: Implementa um filtro de busca instantâneo que oculta/exibe elementos do grid conforme o usuário digita.
- **Gerenciamento de Configurações**: Captura as interações do usuário no menu de configurações e aplica as mudanças via CSS Variables e `localStorage`.
- **Navegação por Teclado**: Implementa suporte para uso sem mouse (setas, Enter, Esc, `/` para busca).

### C. Camada de Dados (YAML)
- **`bookmarks.yaml`**: Atua como a fonte única de verdade para os favoritos. É um formato leve e fácil de manter manualmente pelo usuário.

---

## 3. Fluxo de Execução e Dados

O ciclo de vida da aplicação segue este fluxo:

1.  **Inicialização (Pre-paint)**: Um script inline no `index.html` lê o `localStorage` para configurar o tema e os tamanhos de fonte *antes* que a página seja pintada, evitando o efeito de "flash" (mudança brusca de estilo).
2.  **Carregamento de Recursos**: O navegador carrega o CSS e o JavaScript (`app.js`).
3.  **Fetch de Dados**: O `app.js` inicia uma requisição assíncrona para buscar o arquivo `bookmarks.yaml`.
4.  **Processamento e Renderização**: 
    - O texto YAML é convertido em um objeto JSON/JS.
    - A função `render()` percorre os dados e constrói a árvore de elementos do DOM dentro do elemento `#grid`.
5.  **Interação do Usuário**:
    - **Busca**: O usuário digita $\rightarrow$ Evento `input` dispara $\rightarrow$ Elementos são filtrados via CSS/DOM.
    - **Configurações**: Usuário altera um valor $\rightarrow$ JS atualiza o `localStorage` e modifica a variável CSS correspondente no `:root`.

---

## 4. Persistência de Estado

Para garantir que as preferências do usuário (como modo escuro ou tamanho da fonte) não sejam perdidas ao fechar o navegador, a aplicação utiliza a **Web Storage API (`localStorage`)**.

| Configuração | Chave no `localStorage` | Método de Aplicação |
| :--- | :--- | :--- |
| Tema (System/Light/Dark) | `startpage-theme` | Atributo `data-theme` no `<html>`; System acompanha `prefers-color-scheme` |
| Tamanho da Fonte (Categoria) | `startpage-category-font-size` | CSS Variable `--category-font-size` |
| Tamanho da Fonte (Bookmark) | `startpage-bookmark-font-size` | CSS Variable `--bookmark-font-size` |
| Colunas do Grid | `startpage-grid-columns` | CSS Variable `--grid-columns` |
| Ângulo da Sombra | `startpage-shadow-angle` | CSS Variable `--shadow-angle` |
| Tamanho da Sombra | `startpage-shadow-size` | CSS Variable `--shadow-distance` |
| Tooltip de URL | `startpage-tooltip-enabled` | Lógica de exibição no JS |

---

## 5. Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e elementos de formulário/diálogo.
- **CSS3**: Layout (Grid), animações, variáveis e temas.
- **Vanilla JavaScript (ES6+)**: Lógica principal, manipulação do DOM e Fetch API.
- **YAML**: Formato de serialização de dados para os favoritos.
- **js-yaml**: Biblioteca para parsing de YAML no navegador.

---
