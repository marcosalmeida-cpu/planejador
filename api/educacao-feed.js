// Hub Pessoal — Educação v82. Endpoint serverless para Vercel (sem dependências externas).
const FEEDS={
  education:'https://agenciabrasil.ebc.com.br/rss/educacao/feed.xml',
  health:'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml',
  economy:'https://agenciabrasil.ebc.com.br/rss/economia/feed.xml',
  politics:'https://agenciabrasil.ebc.com.br/rss/politica/feed.xml',
  innovation:'https://agenciabrasil.ebc.com.br/radioagencia-nacional/rss/pesquisa-e-inovacao/feed.xml',
  fapesp:'https://agencia.fapesp.br/rss/'
};
const TOPIC_KEYS={
  education:['educa','escola','ensino','professor','aprendiz','universidade','estudante','pedagog'],
  health:['saúde','saude','médic','medic','doença','doenca','câncer','cancer','vacina','hospital','cérebro','cerebro','cognitiv'],
  social:['social','sociedade','desigual','pobreza','favela','trabalho','juventude','gênero','genero','raça','raca','direitos sociais'],
  politics:['política','politica','democr','eleição','eleicao','governo','constitui','congresso','públic'],
  economy:['econom','renda','emprego','mercado','inflação','inflacao','produtiv','investimento'],
  philosophy:['filosof','ética','etica','pensamento','moral','humanismo'],
  technology:['tecnolog','inteligência artificial','inteligencia artificial','algorit','digital','internet'],
  rights:['direitos humanos','cidadania','violência','violencia','proteção','protecao','inclusão','inclusao']
};
const FALLBACK=[
  {title:'Sistema com realidade virtual e IA aprimora detecção de declínio cognitivo',summary:'Projeto da USP combina realidade virtual, rastreamento do olhar, atividade cerebral e inteligência artificial.',url:'https://agencia.fapesp.br/index.php/sistema-com-realidade-virtual-e-ia-aprimora-deteccao-de-declinio-cognitivo/59460',source:'Agência FAPESP',date:'2026-10-23',topic:'health'},
  {title:'Exame de sangue poderá antecipar o risco de hipertensão pulmonar',summary:'Estudo identificou proteínas associadas ao desenvolvimento da doença e possíveis alvos terapêuticos.',url:'https://agencia.fapesp.br/index.php/exame-de-sangue-podera-antecipar-o-risco-de-hipertensao-pulmonar/59458',source:'Agência FAPESP',date:'2026-10-23',topic:'health'},
  {title:'Direitos sociais se difundem em ondas pelas constituições do mundo',summary:'Pesquisa de dois séculos acompanha a expansão internacional de garantias sociais.',url:'https://agencia.fapesp.br/index.php/direitos-sociais-se-difundem-em-ondas-pelas-constituicoes-do-mundo/59387',source:'Agência FAPESP',date:'2026-10-14',topic:'social'}
];
function clean(v=''){return String(v).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim()}
function tag(block,name){const m=block.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','i'));return m?clean(m[1]):''}
function allTags(block,name){return [...block.matchAll(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','ig'))].map(m=>clean(m[1])).filter(Boolean)}
function dateISO(v){const d=new Date(v);return isNaN(d)?clean(v):d.toISOString()}
function inferTopic(item,preferred=''){const t=(item.title+' '+(item.summary||'')).toLowerCase();let best=preferred||'',score=0;for(const [k,keys] of Object.entries(TOPIC_KEYS)){const n=keys.reduce((a,w)=>a+(t.includes(w)?1:0),0);if(n>score){score=n;best=k}}return best||'education'}
async function fetchText(url,ms=9000){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal,headers:{'user-agent':'HubPessoal/1.0 (+education feed)','accept':'application/xml,text/xml,text/html;q=0.9,*/*;q=0.7'}});if(!r.ok)throw new Error('HTTP '+r.status);return await r.text()}finally{clearTimeout(t)}}
function parseRSS(xml,source,preferred=''){const blocks=[...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(m=>m[1]);return blocks.slice(0,30).map(b=>{const title=tag(b,'title'),url=tag(b,'link')||tag(b,'guid'),summary=tag(b,'description')||tag(b,'content:encoded'),date=tag(b,'pubDate')||tag(b,'dc:date');const item={title,url,summary,source,date:dateISO(date)};item.topic=inferTopic(item,preferred);return item}).filter(x=>x.title&&/^https?:/i.test(x.url))}
function dedupe(items){const seen=new Set(),out=[];for(const x of items){const k=(x.url||x.title).replace(/[?#].*$/,'');if(!x.title||seen.has(k))continue;seen.add(k);out.push(x)}return out}
function ptLikely(t=''){t=t.toLowerCase();const markers=[' de ',' da ',' do ',' das ',' dos ',' em ',' para ',' com ',' sobre ',' uma ',' um ',' que ','ção','ções','saúde','educa'];return markers.some(x=>t.includes(x))}
async function gdeltSearch(q,limit=24){if(!q)return[];const query=`(${q}) sourcelang:portuguese`;const u='https://api.gdeltproject.org/api/v2/doc/doc?'+new URLSearchParams({query,mode:'artlist',maxrecords:String(limit),timespan:'14d',sort:'datedesc',format:'json'});try{const t=await fetchText(u,10000),j=JSON.parse(t);return (j.articles||[]).map(a=>{const item={title:clean(a.title),summary:'',url:a.url,source:clean(a.domain||'Notícia em português'),date:a.seendate||'',image:a.socialimage||''};item.topic=inferTopic(item);return item}).filter(x=>ptLikely(x.title))}catch(_){return[]}}
async function scielo(){const from=new Date(Date.now()-45*864e5).toISOString().slice(0,10);const u='https://oaipmh.scielo.org/br/?'+new URLSearchParams({verb:'ListRecords',metadataPrefix:'oai_dc',from});try{const xml=await fetchText(u,12000);const blocks=[...xml.matchAll(/<record(?:\s[^>]*)?>([\s\S]*?)<\/record>/gi)].map(m=>m[1]);const out=[];for(const b of blocks.slice(0,100)){const titles=allTags(b,'dc:title'),title=titles.find(ptLikely)||titles[0]||'';const langs=allTags(b,'dc:language').join(' ').toLowerCase();if(!title||((langs.includes('en')||langs.includes('english'))&&!langs.includes('pt')&&!langs.includes('por')&&!ptLikely(title)))continue;const ids=allTags(b,'dc:identifier');let url=ids.find(x=>/^https?:/i.test(x)&&/scielo|doi/i.test(x))||ids.find(x=>/^https?:/i.test(x))||'';if(/^10\./.test(url))url='https://doi.org/'+url;const creators=allTags(b,'dc:creator').slice(0,3).join(', ');const source=allTags(b,'dc:source')[0]||'SciELO Brasil';const summary=allTags(b,'dc:description')[0]||allTags(b,'dc:subject').slice(0,4).join(' · ');const date=allTags(b,'dc:date')[0]||tag(b,'datestamp');const item={title,summary,url,source:'SciELO Brasil · '+source,date:dateISO(date),authors:creators,type:'Artigo SciELO'};item.topic=inferTopic(item);if(/^https?:/i.test(url))out.push(item)}return dedupe(out).slice(0,18)}catch(_){return[]}}
async function feed(url,source,preferred){try{return parseRSS(await fetchText(url),source,preferred)}catch(_){return[]}}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','s-maxage=900, stale-while-revalidate=3600');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  const topics=String(req.query?.topics||'education,health,social,politics,economy').split(',').filter(k=>TOPIC_KEYS[k]);
  const q=clean(req.query?.q||'').slice(0,120);
  try{
    const jobs=[feed(FEEDS.fapesp,'Agência FAPESP',''),feed(FEEDS.education,'Agência Brasil','education'),feed(FEEDS.health,'Agência Brasil','health'),feed(FEEDS.economy,'Agência Brasil','economy'),feed(FEEDS.politics,'Agência Brasil','politics'),feed(FEEDS.innovation,'Radioagência Nacional','technology'),scielo()];
    if(q)jobs.push(gdeltSearch(q,30));else jobs.push(gdeltSearch(topics.map(k=>TOPIC_KEYS[k][0]).join(' OR '),24));
    const r=await Promise.allSettled(jobs);const vals=r.map(x=>x.status==='fulfilled'?x.value:[]);
    let news=dedupe(vals.slice(0,6).flat().concat(vals[7]||[]));
    if(topics.length)news=news.filter(x=>topics.includes(x.topic)||x.source==='Agência FAPESP');
    if(q){const qq=q.toLowerCase();const local=news.filter(x=>(x.title+' '+(x.summary||'')).toLowerCase().includes(qq));news=dedupe(local.concat(vals[7]||news))}
    if(!news.length)news=FALLBACK;
    const science=dedupe([...(vals[6]||[]),...news.filter(x=>x.source==='Agência FAPESP').slice(0,7).map(x=>({...x,type:'Divulgação científica'}))]);
    res.status(200).json({updatedAt:new Date().toISOString(),sources:['Agência FAPESP','Agência Brasil','SciELO Brasil'],news:news.slice(0,40),science:science.slice(0,18)});
  }catch(e){res.status(200).json({updatedAt:new Date().toISOString(),sources:['conteúdo de segurança'],news:FALLBACK,science:[],warning:String(e&&e.message||e)})}
};
