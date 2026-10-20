# Execução e dependências

## Descrição geral

A aplicação consiste em arquivos estáticos. Pode ser aberta diretamente quando o navegador permite ler o YAML local, ou servida por HTTP em loopback para contornar restrições de `file://`.

## Componentes principais

- [index.html](../../index.html): ponto de entrada; carrega CSS, parser YAML e aplicação nessa ordem.
- [Makefile](../../Makefile): alvo `serve` inicia `python3 -m http.server`, ligado a `127.0.0.1`; a porta padrão é 8989 e pode ser alterada com `PORT`.
- [README.md](../../README.md): requisitos, formato dos favoritos e instruções de abertura.
- [vendor/js-yaml.min.js](../../vendor/js-yaml.min.js): dependência JavaScript mantida no repositório, sem CDN.

## Fluxos de dados

1. O navegador solicita os arquivos estáticos e executa os scripts ao final do corpo do documento.
2. O script da aplicação solicita `bookmarks.yaml` na mesma origem da página.
3. O parser, a interface e os dados são entregues pelo mesmo diretório; não existe API ou serviço remoto obrigatório.

## Padrões de design

- Hospedagem estática e mesma origem para os recursos da aplicação.
- Servidor HTTP de desenvolvimento mínimo e opcional, sem configuração de build ou empacotamento.
- Dependência de parsing local para manter o carregamento independente de CDN.

## Dependências

- Runtime: navegador moderno com suporte às APIs utilizadas no HTML e JavaScript.
- Parser: arquivo local `vendor/js-yaml.min.js`.
- Servidor opcional: Python 3 e GNU Make (comando `make serve`).
- Abertura direta via `file://` pode exigir ajustes de segurança do navegador; veja as instruções do [README](../../README.md).