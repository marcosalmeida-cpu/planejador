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

## Ajustes v72 — estabilidade e interface
- Novo lançamento com salvamento estabilizado para lançamento único, recorrente, parcelado e compra no cartão.
- Cadastro rápido de credor retorna imediatamente ao lançamento e já seleciona o novo credor.
- Modais não são mais restaurados automaticamente entre recargas, evitando bloqueio de rolagem ao abrir o Hub.
- Rotinas repetitivas de sincronização e atualização visual tiveram a frequência reduzida para melhorar a resposta de listas e formulários.
- Tela de troca de perfil recebeu acabamento premium; ação Sair ganhou destaque vermelho.
- Perfil/Sair e comportamento de rolagem padronizados também nas páginas Educação, Saúde e Entretenimento.

## Ajustes v80 — Educação editorial
- Visão Geral de Educação redesenhada como home editorial independente das subpáginas pessoais.
- Curadoria por temas escolhidos pelo usuário, salva no navegador.
- Notícias recentes via GDELT DOC 2.0, com filtro para imprensa brasileira em português e atualização em intervalos moderados.
- Artigos acadêmicos recentes via Crossref REST API.
- Cache local para reduzir chamadas externas e preservar desempenho.
- Currículo, Formações e Publicações receberam nova identidade visual e regras responsivas.
- O conteúdo ao vivo depende de conexão com a internet; se a API estiver indisponível, o Hub mantém o conteúdo já armazenado no navegador e os estados locais da página.
