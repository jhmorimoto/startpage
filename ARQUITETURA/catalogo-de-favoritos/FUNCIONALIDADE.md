# Catálogo de favoritos

## Descrição geral

O catálogo é mantido em `bookmarks.yaml` e carregado quando a página inicia. O cliente converte as categorias em seções e os favoritos em links, sem editar ou gravar o arquivo de origem.

## Componentes principais

- [bookmarks.yaml](../../bookmarks.yaml): dados ativos organizados em `categories`, cada uma com `name` e `bookmarks`; cada favorito fornece `title` e `url`.
- [bookmarks-example.yaml](../../bookmarks-example.yaml): exemplo inicial do formato.
- [app.js](../../app.js): busca os dados, verifica o formato de categorias/listas, constrói o DOM e apresenta erros.
- [vendor/js-yaml.min.js](../../vendor/js-yaml.min.js): parser YAML local, exposto como `jsyaml`.
- [index.html](../../index.html): carrega o parser antes do código da aplicação.

## Fluxos de dados

1. `fetch` solicita `bookmarks.yaml` com um parâmetro temporal e `cache: 'no-store'`.
2. A resposta HTTP é verificada e convertida em texto; `jsyaml.load` converte o YAML em objeto JavaScript.
3. `render` percorre `data.categories`, normaliza nomes e listas ausentes e cria somente categorias com favoritos renderizáveis.
4. Cada favorito recebe texto e URL normalizados. Endereços HTTP(S) viram links; outros esquemas aparecem como texto inválido e não são navegáveis.
5. Falhas de rede, status HTTP ou parsing são mostradas na região de erro da página.

## Padrões de design

- Fonte de dados declarativa externa ao código de apresentação.
- Renderização no cliente a partir dos dados carregados, sem camada de persistência de favoritos.
- Construção segura do DOM com `createElement` e `textContent`, acompanhada de allowlist de esquemas de URL.
- Tratamento defensivo de estruturas ausentes ou inválidas para evitar interromper a renderização completa.

## Dependências

- Internas: contrato de dados em `bookmarks.yaml`, marcação da página em `index.html` e estilos em `style.css`.
- Externas: `js-yaml` vendorizado e APIs nativas `fetch` e DOM.
- O navegador precisa permitir que a página leia o YAML. Em `file://`, isso pode exigir configuração; HTTP local evita essa limitação conforme descrito no [README](../../README.md).