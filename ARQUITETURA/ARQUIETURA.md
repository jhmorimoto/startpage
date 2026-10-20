# Arquitetura

## Visão geral

Startpage é uma aplicação estática executada no navegador. HTML, CSS e JavaScript são servidos como arquivos; não há backend, etapa de compilação ou framework de aplicação. A lista de favoritos vem de `bookmarks.yaml`, carregado em tempo de execução.

## Módulos e componentes

| Módulo | Responsabilidade | Arquivos principais |
| --- | --- | --- |
| Interface | Estrutura semântica, controles, ponto de entrada e preferências visuais. | [index.html](../index.html), [style.css](../style.css) |
| Catálogo de favoritos | Carregar o YAML, validar destinos e montar categorias e links. | [app.js](../app.js), [bookmarks.yaml](../bookmarks.yaml), [vendor/js-yaml.min.js](../vendor/js-yaml.min.js) |
| Busca e navegação | Filtrar favoritos, selecionar resultados e responder a atalhos de teclado. | [app.js](../app.js), [index.html](../index.html) |
| Preferências | Aplicar tema e ajustes de apresentação; persistir valores no navegador. | [app.js](../app.js), [index.html](../index.html), [style.css](../style.css) |
| Execução | Servir os arquivos localmente quando necessário. | [Makefile](../Makefile), [README.md](../README.md) |

Os módulos de comportamento são responsabilidades lógicas dentro de `app.js`, não pacotes JavaScript separados.

## Fluxo de dados

1. `index.html` carrega o CSS, aplica preferências salvas antes da primeira pintura e inclui `vendor/js-yaml.min.js` antes de `app.js`.
2. `app.js` solicita `bookmarks.yaml` com `fetch` e cache desativado, converte o texto YAML em dados usando `jsyaml.load` e monta os elementos de categoria e favorito.
3. A renderização aceita categorias e listas de favoritos válidas; só cria links para endereços `http://` ou `https://`. Categorias sem favoritos válidos são omitidas.
4. A busca percorre os elementos já renderizados e esconde os que não correspondem. A seleção por teclado e a abertura de um favorito operam sobre os resultados visíveis.
5. Os controles de preferências atualizam variáveis CSS e guardam valores no `localStorage`. O CSS usa essas variáveis para desenhar a interface.

Se a leitura do YAML falhar, a interface exibe uma mensagem de erro. O acesso via `file://` depende de permissões específicas do navegador; servir a pasta por HTTP local é a alternativa indicada.

## Padrões e decisões

- Aplicação de página única estática, sem roteador, servidor de aplicação ou processo de build.
- JavaScript encapsulado em uma IIFE, com acesso direto ao DOM e responsabilidades separadas por seções no arquivo.
- Renderização orientada pelos dados do YAML; conteúdo textual é inserido com `textContent` e URLs são limitadas a HTTP(S).
- Delegação de eventos nos controles e no grid para tratar interações dos elementos da interface.
- Custom properties CSS como contrato entre preferências em JavaScript e apresentação.
- Preferências persistidas localmente com tolerância a `localStorage` bloqueado; `system` acompanha a preferência de cor do navegador.

## Dependências

| Tipo | Dependência | Uso |
| --- | --- | --- |
| Externa, incorporada ao repositório | [js-yaml](../vendor/js-yaml.min.js) | Interpretar YAML no navegador, sem CDN ou instalação. |
| Plataforma | APIs do navegador | DOM, `fetch`, `localStorage`, `matchMedia`, `<dialog>` e eventos de teclado. |
| Desenvolvimento/execução local | Python 3 | Servidor estático opcional via `make serve`; porta padrão 8989, configurável com `PORT`. |

Não há dependências de runtime carregadas de serviços externos.

## Manutenção desta documentação

Atualize este documento e o `FUNCIONALIDADE.md` da área afetada quando mudanças significativas alterarem componentes, fluxos de dados, padrões, dependências, formato do YAML ou modo de execução. Ao adicionar uma nova responsabilidade de arquitetura, crie uma subpasta correspondente em `ARQUITETURA/` e documente-a em `FUNCIONALIDADE.md`.