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


## v81 — Educação revista editorial em português
- Visão Geral transformada em revista/blog: destaque rotativo, radar interativo e pesquisa & descobertas.
- Conteúdo ao vivo limitado a fontes originalmente publicadas em português.
- Crossref removido da home para impedir títulos acadêmicos em inglês.
- Seleção de temas movida para painel de personalização; sem chips no topo.
- Cards pessoais removidos da Visão Geral.
- Navegação Currículo/Formações/Publicações corrigida com fallback inline independente dos scripts externos.


## Educação v82 — conteúdo ao vivo
A pasta `api/` agora faz parte do projeto e deve ser publicada junto com os HTMLs. Em Vercel, `api/educacao-feed.js` funciona como endpoint serverless de mesma origem para evitar bloqueios de CORS e alimentar a Revista Educação com Agência FAPESP, Agência Brasil, GDELT e SciELO Brasil. A página mantém conteúdo brasileiro de fallback caso as fontes estejam temporariamente indisponíveis.


## v83 — Educação
Destaque editorial compacto e novo layout responsivo de Formações em formato de histórico acadêmico universitário, com seletor de cursos, filtros por período e busca no histórico.


## v86 — responsividade de Formações
Correção estrutural de largura: remove o `width:100%` conflitante com a margem do menu, neutraliza `min-width` legado da tabela e impede truncamento de ações.

## Educação v87 — repertório estudado
Na Visão Geral de Educação, notícias e leituras podem ser marcadas como "assunto estudado". O registro é salvo por perfil e pode ser exibido no Currículo, com anotação opcional e vínculos sugeridos com disciplinas das formações de ensino superior cadastradas.
