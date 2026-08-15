# Startpage

Página inicial estática que lista bookmarks a partir de `bookmarks.yaml`.

## Requisitos

- Apenas HTML/CSS/JavaScript simples, sem frameworks externos
  (`js-yaml` é vendorizado localmente em `vendor/js-yaml.min.js`, sem CDN nem build)
- Bookmarks carregados de um arquivo YAML no filesystem
- Bookmark composto por nome, URL e categoria
- Bookmarks exibidos em quadros, um por categoria
- Estilo simples com temática flexível entre light e dark modes
- Botão no canto inferior direito para trocar o tema
- Somente leitura: sem funcionalidades de edição na interface
- CSS em arquivo dedicado `style.css`
- Input de busca/filtro no topo da página
- Atalho de teclado `/` para acessar o input de busca; qualquer tecla de letra
  também ativa a busca e já digita o caractere
- Ao filtrar, esconder o que não bate e mostrar apenas os matches

## Como abrir

Abra `index.html` direto no navegador. Como a página lê um arquivo local via `fetch`,
é preciso liberar o acesso a arquivos locais:

- **Chrome/Chromium:** inicie com a flag
  `chromium --allow-file-access-from-files`
- **Firefox:** em `about:config`, defina `privacy.file_unique_origin` como `false`

Alternativa sem flags: servir o diretório por HTTP com `make serve`
(equivale a `python3 -m http.server 8000`) e acessar `http://localhost:8000`.
Use `make serve PORT=9000` para trocar a porta.

## Bookmarks

Edite `bookmarks.yaml`:

```yaml
categories:
  - name: Programming
    bookmarks:
      - title: GitHub
        url: https://github.com
```

Apenas URLs `http://` e `https://` são renderizadas como links.

## Uso

- `/` foca o campo de busca
- Qualquer tecla de letra também foca a busca e começa a filtrar
- `Esc` limpa o filtro
- Com a busca focada, `Up`, `Down`, `Left` e `Right` navegam pelos resultados
- `Enter` abre o bookmark selecionado
- Botão no canto inferior direito alterna entre tema claro e escuro
