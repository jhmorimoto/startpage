# Apresentação e preferências

## Descrição geral

A apresentação é definida por CSS, com tema claro, escuro ou do sistema. O diálogo de configurações permite ajustar tema, tipografia, colunas, sombra e exibição de URLs ao passar o cursor.

## Componentes principais

- [index.html](../../index.html): estrutura da página, diálogo de configurações e inicialização antecipada de preferências visuais.
- [app.js](../../app.js): aplica configurações, atualiza controles e persiste valores no `localStorage`.
- [style.css](../../style.css): tokens visuais, temas, layout responsivo, estados dos controles e tooltip.

## Fluxos de dados

1. Um script no início de `index.html` lê preferências salvas antes da pintura e aplica tema e custom properties para reduzir mudanças visuais durante o carregamento.
2. `app.js` lê novamente as preferências, normaliza valores e sincroniza controles, estado do documento e variáveis CSS.
3. Alterações no diálogo aplicam-se imediatamente e são persistidas no `localStorage`; erros de acesso ao armazenamento não impedem o uso da página.
4. Com o tema `system`, mudanças em `prefers-color-scheme` atualizam o tema aplicado. Temas explícitos não seguem essas mudanças.
5. A preferência de tooltip controla se a URL do link sob o cursor é exibida. O posicionamento tenta manter o tooltip dentro da área visível.

## Padrões de design

- Tokens CSS e custom properties para manter a apresentação configurável sem duplicar regras de estilo.
- Persistência local por navegador, sem sincronização remota ou alteração dos dados do catálogo.
- Inicialização visual antes do CSS e reaplicação no controlador para reduzir flash de tema e manter os controles coerentes.
- Layout responsivo: o grid passa a uma coluna em telas estreitas.

## Dependências

- Internas: IDs e atributos `data-*` compartilhados entre [index.html](../../index.html) e [app.js](../../app.js); custom properties e atributos de tema consumidos por [style.css](../../style.css).
- Externas: `localStorage`, `matchMedia`, `<dialog>` e eventos nativos do navegador.