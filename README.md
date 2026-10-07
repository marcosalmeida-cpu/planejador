# Hub Pessoal — versão multipágina

Arquivos principais:
- `index.html` — Finanças (página inicial)
- `educacao.html` — Educação
- `saude.html` — Saúde
- `entretenimento.html` — Entretenimento
- `assets/` — CSS e JavaScript compartilhados/específicos

## Publicação no GitHub Pages
Envie **todos os arquivos e a pasta `assets` para a mesma pasta do repositório**. O GitHub Pages abrirá `index.html` por padrão.

## Dados existentes
A versão mantém as chaves de `localStorage` usadas nas versões anteriores para Finanças, Saúde e Entretenimento. Educação usa uma chave por perfil e, para Marcos, lê a chave antiga como fallback para recuperar os registros existentes, sem apagá-la.

Para que os dados locais já existentes apareçam, publique no **mesmo domínio/origem do GitHub Pages** que você já utilizava.
