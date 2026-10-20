# Busca e navegação

## Descrição geral

A busca filtra os favoritos carregados sem nova requisição. O teclado permite focar a busca, percorrer resultados visíveis e abrir o favorito selecionado.

## Componentes principais

- [index.html](../../index.html): campo de busca, botão para limpar e região `grid` que contém os resultados.
- [app.js](../../app.js): indexa cada item em um texto pesquisável, filtra categorias e favoritos, mantém a seleção e trata teclado.
- [style.css](../../style.css): estados visuais de foco, seleção e elementos ocultos.

## Fluxos de dados

1. A renderização cria para cada favorito um texto de busca com categoria, título e URL em minúsculas.
2. A entrada do usuário é separada em termos; todos os termos devem aparecer no texto do favorito para que ele corresponda.
3. Itens e categorias sem correspondências são ocultados. A interface atualiza o estado vazio, o botão de limpar e a seleção inicial.
4. Setas movem a seleção entre favoritos visíveis, priorizando a posição espacial e usando a ordem dos resultados como alternativa.
5. `Enter` ativa o link selecionado. `Escape` limpa o filtro. `/` foca e seleciona a busca; uma tecla de letra foca a busca e inicia o texto digitado.

## Padrões de design

- Filtragem local sobre dados já carregados, sem dependência de serviço de busca.
- Event listeners centralizados com delegação quando apropriado e atualização do estado por classes, atributos e propriedade `hidden`.
- Navegação por teclado sensível ao foco, sem interceptar teclas enquanto outro campo editável está ativo.

## Dependências

- Internas: grid produzido pelo módulo [Catálogo de favoritos](../catalogo-de-favoritos/FUNCIONALIDADE.md) e elementos declarados em `index.html`.
- Externas: APIs nativas de eventos e DOM; não há biblioteca de busca ou navegação.